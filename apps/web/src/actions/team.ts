"use server";

import prisma from "@steadystack/db";
import { auth } from "@steadystack/auth";
import { headers, cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { assertTeamLimits, getUserPlan } from "@/lib/billing-server";
import { sendTeamInvitationEmail } from "@steadystack/email";
import { env } from "@steadystack/env/server";

export type Role = "owner" | "admin" | "member" | "viewer" | "billing";

/**
 * Record an action to the organization's audit log.
 */
export async function logAuditEvent({
  organizationId,
  userId,
  action,
  resource,
  metadata,
}: {
  organizationId?: string;
  userId: string;
  action: string;
  resource: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    const reqHeaders = await headers();
    const ip = reqHeaders.get("x-forwarded-for") || reqHeaders.get("cf-connecting-ip") || "unknown";

    await prisma.auditLog.create({
      data: {
        organizationId: organizationId || null,
        userId,
        action,
        resource,
        metadata: metadata ? JSON.stringify(metadata) : null,
        ipAddress: ip.split(",")[0]?.trim() || "unknown",
      },
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}

// In-memory mutex to prevent concurrent React Server Component calls from creating duplicate personal workspaces
const inFlightPersonalWorkspaceCreations = new Map<string, Promise<any>>();

/**
 * Ensures a user has exactly one personal workspace created if they have no organizations.
 * Uses mutex locks and atomic reconciliation to prevent duplicate workspaces on initial login.
 */
async function ensurePersonalWorkspace(userId: string, userName: string, userEmail: string) {
  if (inFlightPersonalWorkspaceCreations.has(userId)) {
    return inFlightPersonalWorkspaceCreations.get(userId);
  }

  const creationPromise = (async () => {
    try {
      const memberships = await prisma.member.findMany({
        where: { userId },
        include: {
          organization: {
            include: {
              _count: {
                select: { monitors: true, members: true },
              },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      });

      if (memberships.length > 0) {
        const primaryOrg = memberships[0].organization;

        // Auto-cleanup: If the user has duplicate personal workspaces with 0 monitors and 1 member, prune them
        if (memberships.length > 1) {
          const duplicateMemberships = memberships.slice(1).filter((m) => {
            const isPersonalPattern =
              m.organization.slug?.startsWith("personal-") ||
              m.organization.name === `${userName || "Personal"}'s Workspace` ||
              m.organization.name === "Alex Gutscher's Workspace";
            const isEmpty =
              m.organization._count.monitors === 0 && m.organization._count.members <= 1;
            return isPersonalPattern && isEmpty;
          });

          if (duplicateMemberships.length > 0) {
            const dupeOrgIds = duplicateMemberships.map((m) => m.organization.id);
            try {
              await prisma.member.deleteMany({
                where: { organizationId: { in: dupeOrgIds } },
              });
              await prisma.organization.deleteMany({
                where: { id: { in: dupeOrgIds } },
              });
              console.log(
                `[Team] Cleaned up ${dupeOrgIds.length} duplicate personal workspaces for user ${userId}`,
              );
            } catch (cleanupErr) {
              console.warn("[Team] Non-critical duplicate workspace cleanup error:", cleanupErr);
            }
          }
        }

        return primaryOrg;
      }

      // Create single personal workspace for the user
      const slug = `personal-${
        userEmail
          .split("@")[0]
          ?.toLowerCase()
          .replace(/[^a-z0-9]/g, "") || "user"
      }-${Math.random().toString(36).substring(2, 6)}`;

      const org = await prisma.organization.create({
        data: {
          name: `${userName || "Personal"}'s Workspace`,
          slug,
          plan: "INITIATE",
          members: {
            create: {
              userId,
              role: "owner",
            },
          },
        },
      });

      await logAuditEvent({
        organizationId: org.id,
        userId,
        action: "workspace.created",
        resource: "organization",
        metadata: { isPersonal: true },
      });

      // Link any unassigned legacy monitors to the personal workspace
      await prisma.monitor
        .updateMany({
          where: { userId, organizationId: null },
          data: { organizationId: org.id },
        })
        .catch(() => {});

      return org;
    } finally {
      inFlightPersonalWorkspaceCreations.delete(userId);
    }
  })();

  inFlightPersonalWorkspaceCreations.set(userId, creationPromise);
  return creationPromise;
}

/**
 * Switch active workspace for the current user across both database session and cookies.
 */
export async function switchActiveWorkspace(organizationId: string) {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const member = await prisma.member.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId: session.user.id,
      },
    },
    include: { organization: true },
  });

  if (!member) {
    return { success: false, error: "You are not a member of this workspace" };
  }

  try {
    await prisma.session.updateMany({
      where: { userId: session.user.id },
      data: { activeOrganizationId: organizationId },
    });
  } catch (err) {
    console.error("Failed to update session active organization:", err);
  }

  try {
    const cookieStore = await cookies();
    cookieStore.set("pg_active_org_id", organizationId, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  } catch (err) {
    console.error("Failed to set active org cookie:", err);
  }

  revalidatePath("/", "layout");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");

  return { success: true, workspace: member.organization };
}

/**
 * Get active workspace for the current session.
 */
export async function getActiveWorkspace() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session?.user) return null;

  const cookieHeader = reqHeaders.get("cookie") || "";
  const cookieMatch = cookieHeader.match(/pg_active_org_id=([^;]+)/);
  const cookieOrgId = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;

  const activeOrgId = cookieOrgId || (session.session as any)?.activeOrganizationId;

  if (activeOrgId) {
    const member = await prisma.member.findUnique({
      where: {
        organizationId_userId: {
          organizationId: activeOrgId,
          userId: session.user.id,
        },
      },
      include: {
        organization: {
          include: {
            _count: {
              select: { members: true, invitations: true },
            },
          },
        },
      },
    });

    if (member) {
      return {
        id: member.organization.id,
        name: member.organization.name,
        slug: member.organization.slug,
        logo: member.organization.logo,
        plan: member.organization.plan || "INITIATE",
        role: member.role as Role,
        memberCount: member.organization._count.members,
        pendingInviteCount: member.organization._count.invitations,
      };
    }
  }

  // Fallback to primary / personal workspace
  const personalOrg = await ensurePersonalWorkspace(
    session.user.id,
    session.user.name || "Operator",
    session.user.email,
  );

  const member = await prisma.member.findUnique({
    where: {
      organizationId_userId: {
        organizationId: personalOrg.id,
        userId: session.user.id,
      },
    },
    include: {
      organization: {
        include: {
          _count: {
            select: { members: true, invitations: true },
          },
        },
      },
    },
  });

  return {
    id: personalOrg.id,
    name: personalOrg.name,
    slug: personalOrg.slug,
    logo: personalOrg.logo,
    plan: personalOrg.plan || "INITIATE",
    role: (member?.role || "owner") as Role,
    memberCount: member?.organization._count.members || 1,
    pendingInviteCount: member?.organization._count.invitations || 0,
  };
}

/**
 * List all workspaces accessible by the current user.
 */
export async function listUserWorkspaces() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session?.user) return [];

  // Ensure user has at least their personal workspace
  await ensurePersonalWorkspace(
    session.user.id,
    session.user.name || "Operator",
    session.user.email,
  );

  const memberships = await prisma.member.findMany({
    where: { userId: session.user.id },
    include: {
      organization: {
        include: {
          _count: {
            select: { members: true, invitations: true },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const cookieHeader = reqHeaders.get("cookie") || "";
  const cookieMatch = cookieHeader.match(/pg_active_org_id=([^;]+)/);
  const cookieOrgId = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;

  const activeOrgId =
    cookieOrgId || (session.session as any)?.activeOrganizationId || memberships[0]?.organizationId;

  const seenOrgIds = new Set<string>();
  const uniqueMemberships = memberships.filter((m) => {
    if (!m.organization || seenOrgIds.has(m.organization.id)) return false;
    seenOrgIds.add(m.organization.id);
    return true;
  });

  return uniqueMemberships.map((m) => ({
    id: m.organization.id,
    name: m.organization.name,
    slug: m.organization.slug,
    logo: m.organization.logo,
    plan: m.organization.plan || "INITIATE",
    role: m.role as Role,
    memberCount: m.organization._count.members,
    pendingInviteCount: m.organization._count.invitations,
    isActive: m.organization.id === activeOrgId,
  }));
}

/**
 * Create a new team workspace (Enforces Paid Gate on The Construct).
 */
export async function createTeamWorkspace(params: { name: string; slug?: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  // Enforce Paid Gate
  const check = await assertTeamLimits(session.user.id);
  if (!check.allowed) {
    return { success: false, error: check.error, requiresUpgrade: true };
  }

  const cleanName = params.name.trim();
  if (!cleanName || cleanName.length < 2) {
    return {
      success: false,
      error: "Workspace name must be at least 2 characters",
    };
  }

  const baseSlug = (params.slug || cleanName)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

  try {
    const org = await prisma.organization.create({
      data: {
        name: cleanName,
        slug,
        plan: "CONSTRUCT",
        members: {
          create: {
            userId: session.user.id,
            role: "owner",
          },
        },
      },
    });

    await logAuditEvent({
      organizationId: org.id,
      userId: session.user.id,
      action: "workspace.created",
      resource: "organization",
      metadata: { name: cleanName, slug },
    });

    // Automatically set as active workspace
    try {
      await prisma.session.updateMany({
        where: { userId: session.user.id },
        data: { activeOrganizationId: org.id },
      });
    } catch {}

    try {
      const cookieStore = await cookies();
      cookieStore.set("pg_active_org_id", org.id, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      });
    } catch {}

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    return { success: true, organization: org };
  } catch (err) {
    console.error("Failed to create workspace:", err);
    return {
      success: false,
      error: "Failed to create workspace. Try another name.",
    };
  }
}

/**
 * Fetch team members, pending invitations, and workspace metrics.
 */
export async function getTeamDetails(organizationId?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  let targetOrgId = organizationId;
  if (!targetOrgId) {
    const active = await getActiveWorkspace();
    targetOrgId = active?.id;
  }

  if (!targetOrgId) return null;

  // Verify membership
  const membership = await prisma.member.findUnique({
    where: {
      organizationId_userId: {
        organizationId: targetOrgId,
        userId: session.user.id,
      },
    },
    include: {
      organization: true,
    },
  });

  if (!membership) return null;

  const [members, invitations, userPlanTier] = await Promise.all([
    prisma.member.findMany({
      where: { organizationId: targetOrgId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            tier: true,
          },
        },
      },
      orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    }),
    prisma.invitation.findMany({
      where: {
        organizationId: targetOrgId,
        status: "pending",
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    getUserPlan(session.user.id),
  ]);

  const maxSeats = userPlanTier === "CONSTRUCT" ? 25 : 1;
  const isMultiSeatAllowed = userPlanTier === "CONSTRUCT";

  return {
    organization: {
      id: membership.organization.id,
      name: membership.organization.name,
      slug: membership.organization.slug,
      logo: membership.organization.logo,
      plan: membership.organization.plan || userPlanTier,
    },
    currentUserRole: membership.role as Role,
    members: members.map((m) => ({
      id: m.id,
      userId: m.user.id,
      name: m.user.name,
      email: m.user.email,
      image: m.user.image,
      role: m.role as Role,
      joinedAt: m.createdAt.toISOString(),
      isCurrentUser: m.userId === session.user.id,
    })),
    invitations: invitations.map((inv) => ({
      id: inv.id,
      email: inv.email,
      role: (inv.role || "member") as Role,
      inviterName: inv.user.name || inv.user.email,
      expiresAt: inv.expiresAt.toISOString(),
      createdAt: inv.createdAt.toISOString(),
    })),
    seats: {
      used: members.length + invitations.length,
      max: maxSeats,
      isMultiSeatAllowed,
    },
  };
}

/**
 * Invite a member to the workspace.
 */
export async function inviteMember(params: { organizationId: string; email: string; role: Role }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  // Caller permission check (must be owner or admin)
  const caller = await prisma.member.findUnique({
    where: {
      organizationId_userId: {
        organizationId: params.organizationId,
        userId: session.user.id,
      },
    },
    include: { organization: true },
  });

  if (!caller || (caller.role !== "owner" && caller.role !== "admin")) {
    return {
      success: false,
      error: "Only workspace owners and admins can invite members",
    };
  }

  // Check paid gate and seat limits
  const seatCheck = await assertTeamLimits(session.user.id, params.organizationId);
  if (!seatCheck.allowed) {
    return { success: false, error: seatCheck.error, requiresUpgrade: true };
  }

  const targetEmail = params.email.trim().toLowerCase();
  if (!targetEmail || !targetEmail.includes("@")) {
    return { success: false, error: "Please provide a valid email address" };
  }

  // Check if target is already a member
  const existingUser = await prisma.user.findUnique({
    where: { email: targetEmail },
  });
  if (existingUser) {
    const existingMember = await prisma.member.findUnique({
      where: {
        organizationId_userId: {
          organizationId: params.organizationId,
          userId: existingUser.id,
        },
      },
    });

    if (existingMember) {
      return {
        success: false,
        error: "This user is already a member of this workspace",
      };
    }
  }

  // Check if active pending invite exists
  const existingInvite = await prisma.invitation.findFirst({
    where: {
      organizationId: params.organizationId,
      email: targetEmail,
      status: "pending",
    },
  });

  if (existingInvite) {
    return {
      success: false,
      error: "An active invitation has already been sent to this email",
    };
  }

  try {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await prisma.invitation.create({
      data: {
        organizationId: params.organizationId,
        email: targetEmail,
        role: params.role,
        status: "pending",
        expiresAt,
        inviterId: session.user.id,
      },
    });

    const appUrl = env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    await sendTeamInvitationEmail(targetEmail, {
      inviterName: session.user.name || session.user.email,
      organizationName: caller.organization.name,
      role: params.role,
      inviteUrl: `${appUrl}/invitations/${invitation.id}`,
    });

    await logAuditEvent({
      organizationId: params.organizationId,
      userId: session.user.id,
      action: "member.invited",
      resource: "invitation",
      metadata: {
        email: targetEmail,
        role: params.role,
        invitationId: invitation.id,
      },
    });

    revalidatePath("/dashboard/settings");
    return { success: true, invitation };
  } catch (err) {
    console.error("Failed to send invitation:", err);
    return {
      success: false,
      error: "Failed to create and send team invitation",
    };
  }
}

/**
 * Cancel a pending invitation.
 */
export async function cancelInvitation(params: { organizationId: string; invitationId: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return { success: false, error: "Unauthorized" };

  const caller = await prisma.member.findUnique({
    where: {
      organizationId_userId: {
        organizationId: params.organizationId,
        userId: session.user.id,
      },
    },
  });

  if (!caller || (caller.role !== "owner" && caller.role !== "admin")) {
    return { success: false, error: "Permission denied" };
  }

  try {
    const inv = await prisma.invitation.delete({
      where: { id: params.invitationId },
    });

    await logAuditEvent({
      organizationId: params.organizationId,
      userId: session.user.id,
      action: "invitation.canceled",
      resource: "invitation",
      metadata: { email: inv.email },
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (err) {
    console.error("Failed to cancel invitation:", err);
    return { success: false, error: "Failed to cancel invitation" };
  }
}

/**
 * Change a team member's role.
 */
export async function updateMemberRole(params: {
  organizationId: string;
  memberId: string;
  newRole: Role;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return { success: false, error: "Unauthorized" };

  const caller = await prisma.member.findUnique({
    where: {
      organizationId_userId: {
        organizationId: params.organizationId,
        userId: session.user.id,
      },
    },
  });

  if (!caller || (caller.role !== "owner" && caller.role !== "admin")) {
    return { success: false, error: "Permission denied" };
  }

  const targetMember = await prisma.member.findUnique({
    where: { id: params.memberId },
  });

  if (!targetMember || targetMember.organizationId !== params.organizationId) {
    return { success: false, error: "Member not found" };
  }

  // If demoting an owner, ensure there is at least one other owner
  if (targetMember.role === "owner" && params.newRole !== "owner") {
    const ownerCount = await prisma.member.count({
      where: { organizationId: params.organizationId, role: "owner" },
    });

    if (ownerCount <= 1) {
      return {
        success: false,
        error:
          "Workspaces must have at least one active Owner. Transfer ownership before demoting.",
      };
    }
  }

  try {
    const updated = await prisma.member.update({
      where: { id: params.memberId },
      data: { role: params.newRole },
    });

    await logAuditEvent({
      organizationId: params.organizationId,
      userId: session.user.id,
      action: "role.updated",
      resource: "member",
      metadata: {
        memberId: params.memberId,
        previousRole: targetMember.role,
        newRole: params.newRole,
      },
    });

    revalidatePath("/dashboard/settings");
    return { success: true, member: updated };
  } catch (err) {
    console.error("Failed to update role:", err);
    return { success: false, error: "Failed to update member role" };
  }
}

/**
 * Remove a member from the workspace (or leave the workspace).
 */
export async function removeMember(params: { organizationId: string; memberId: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return { success: false, error: "Unauthorized" };

  const caller = await prisma.member.findUnique({
    where: {
      organizationId_userId: {
        organizationId: params.organizationId,
        userId: session.user.id,
      },
    },
  });

  if (!caller) return { success: false, error: "Not a workspace member" };

  const targetMember = await prisma.member.findUnique({
    where: { id: params.memberId },
  });

  if (!targetMember || targetMember.organizationId !== params.organizationId) {
    return { success: false, error: "Member not found" };
  }

  const isSelf = targetMember.userId === session.user.id;

  if (!isSelf && caller.role !== "owner" && caller.role !== "admin") {
    return { success: false, error: "Permission denied" };
  }

  // Protect last owner
  if (targetMember.role === "owner") {
    const ownerCount = await prisma.member.count({
      where: { organizationId: params.organizationId, role: "owner" },
    });

    if (ownerCount <= 1) {
      return {
        success: false,
        error:
          "Cannot remove the only workspace Owner. Assign another owner first or delete the workspace.",
      };
    }
  }

  try {
    await prisma.member.delete({
      where: { id: params.memberId },
    });

    await logAuditEvent({
      organizationId: params.organizationId,
      userId: session.user.id,
      action: isSelf ? "member.left" : "member.removed",
      resource: "member",
      metadata: { removedUserId: targetMember.userId },
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (err) {
    console.error("Failed to remove member:", err);
    return { success: false, error: "Failed to remove member" };
  }
}

/**
 * Get public details for an invitation link.
 */
export async function getInvitationDetails(invitationId: string) {
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
      include: {
        organization: {
          select: { id: true, name: true, slug: true, logo: true },
        },
        user: {
          select: { name: true, email: true, image: true },
        },
      },
    });

    if (!invitation) return null;

    const isExpired = new Date() > new Date(invitation.expiresAt);

    return {
      id: invitation.id,
      email: invitation.email,
      role: (invitation.role || "member") as Role,
      status: isExpired ? "expired" : invitation.status,
      expiresAt: invitation.expiresAt.toISOString(),
      organization: invitation.organization,
      inviter: invitation.user,
    };
  } catch (err) {
    console.error("Failed to fetch invitation:", err);
    return null;
  }
}

/**
 * Accept a team workspace invitation.
 */
export async function acceptInvitation(invitationId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return {
      success: false,
      error: "Please log in or sign up to accept this invitation",
    };
  }

  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: { organization: true },
  });

  if (!invitation || invitation.status !== "pending") {
    return {
      success: false,
      error: "Invitation is no longer valid or has already been accepted",
    };
  }

  if (new Date() > new Date(invitation.expiresAt)) {
    return { success: false, error: "This invitation has expired" };
  }

  try {
    // Add user as member
    await prisma.member.upsert({
      where: {
        organizationId_userId: {
          organizationId: invitation.organizationId,
          userId: session.user.id,
        },
      },
      create: {
        organizationId: invitation.organizationId,
        userId: session.user.id,
        role: invitation.role || "member",
      },
      update: {
        role: invitation.role || "member",
      },
    });

    // Mark invitation accepted
    await prisma.invitation.update({
      where: { id: invitationId },
      data: { status: "accepted" },
    });

    await logAuditEvent({
      organizationId: invitation.organizationId,
      userId: session.user.id,
      action: "member.joined",
      resource: "member",
      metadata: { invitationId, role: invitation.role },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");

    return { success: true, organizationSlug: invitation.organization.slug };
  } catch (err) {
    console.error("Failed to accept invitation:", err);
    return {
      success: false,
      error: "Failed to accept invitation. Please try again.",
    };
  }
}

/**
 * Reject a team workspace invitation.
 */
export async function rejectInvitation(invitationId: string) {
  try {
    await prisma.invitation.update({
      where: { id: invitationId },
      data: { status: "rejected" },
    });

    return { success: true };
  } catch (err) {
    console.error("Failed to reject invitation:", err);
    return { success: false, error: "Failed to update invitation" };
  }
}

/**
 * Fetch workspace audit logs.
 */
export async function getWorkspaceAuditLogs(organizationId?: string, limit = 50) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return [];

  let targetOrgId = organizationId;
  if (!targetOrgId) {
    const active = await getActiveWorkspace();
    targetOrgId = active?.id;
  }

  if (!targetOrgId) return [];

  // Caller permission check
  const member = await prisma.member.findUnique({
    where: {
      organizationId_userId: {
        organizationId: targetOrgId,
        userId: session.user.id,
      },
    },
  });

  if (!member || (member.role !== "owner" && member.role !== "admin")) {
    return [];
  }

  const logs = await prisma.auditLog.findMany({
    where: { organizationId: targetOrgId },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return logs.map((log) => ({
    id: log.id,
    action: log.action,
    resource: log.resource,
    metadata: log.metadata ? JSON.parse(log.metadata) : null,
    ipAddress: log.ipAddress,
    createdAt: log.createdAt.toISOString(),
    user: {
      name: log.user.name,
      email: log.user.email,
      image: log.user.image,
    },
  }));
}
