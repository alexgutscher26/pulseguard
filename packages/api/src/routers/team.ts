import { z } from "zod";
import { TRPCError } from "@trpc/server";
import prisma from "@steadystack/db";
import { protectedProcedure, rateLimitedProcedure, router } from "../index";

const roleEnum = z.enum(["owner", "admin", "member", "viewer", "billing"]);

export const teamRouter = router({
  /**
   * List all organizations the user belongs to.
   */
  listOrganizations: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const members = await prisma.member.findMany({
      where: { userId },
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

    return members.map((m: any) => ({
      id: m.organization.id,
      name: m.organization.name,
      slug: m.organization.slug,
      logo: m.organization.logo,
      role: m.role,
      memberCount: m.organization._count.members,
      pendingInviteCount: m.organization._count.invitations,
    }));
  }),

  /**
   * Get members of an organization.
   */
  listMembers: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Caller permission check
      const membership = await prisma.member.findUnique({
        where: {
          organizationId_userId: {
            organizationId: input.organizationId,
            userId,
          },
        },
      });

      if (!membership) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not a member of this workspace",
        });
      }

      const [members, invitations] = await Promise.all([
        prisma.member.findMany({
          where: { organizationId: input.organizationId },
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
            organizationId: input.organizationId,
            status: "pending",
          },
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
      ]);

      return {
        callerRole: membership.role,
        members: members.map((m: any) => ({
          id: m.id,
          userId: m.user.id,
          name: m.user.name,
          email: m.user.email,
          image: m.user.image,
          role: m.role,
          joinedAt: m.createdAt,
          isCurrentUser: m.userId === userId,
        })),
        invitations: invitations.map((inv: any) => ({
          id: inv.id,
          email: inv.email,
          role: inv.role || "member",
          inviterName: inv.user.name || inv.user.email,
          expiresAt: inv.expiresAt,
          createdAt: inv.createdAt,
        })),
      };
    }),

  /**
   * Update member role.
   */
  updateMemberRole: rateLimitedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        memberId: z.string(),
        role: roleEnum,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const caller = await prisma.member.findUnique({
        where: {
          organizationId_userId: {
            organizationId: input.organizationId,
            userId,
          },
        },
      });

      if (!caller || (caller.role !== "owner" && caller.role !== "admin")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only workspace owners and admins can update member roles",
        });
      }

      const targetMember = await prisma.member.findUnique({
        where: { id: input.memberId },
      });

      if (
        !targetMember ||
        targetMember.organizationId !== input.organizationId
      ) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Member not found in this workspace",
        });
      }

      // If demoting an owner, protect the last owner
      if (targetMember.role === "owner" && input.role !== "owner") {
        const ownerCount = await prisma.member.count({
          where: { organizationId: input.organizationId, role: "owner" },
        });
        if (ownerCount <= 1) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot demote the only workspace owner",
          });
        }
      }

      return prisma.member.update({
        where: { id: input.memberId },
        data: { role: input.role },
      });
    }),

  /**
   * Remove a member or leave a workspace.
   */
  removeMember: rateLimitedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        memberId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const caller = await prisma.member.findUnique({
        where: {
          organizationId_userId: {
            organizationId: input.organizationId,
            userId,
          },
        },
      });

      if (!caller) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not a member of this workspace",
        });
      }

      const target = await prisma.member.findUnique({
        where: { id: input.memberId },
      });

      if (!target || target.organizationId !== input.organizationId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Member not found",
        });
      }

      const isSelf = target.userId === userId;
      if (!isSelf && caller.role !== "owner" && caller.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Permission denied",
        });
      }

      if (target.role === "owner") {
        const ownerCount = await prisma.member.count({
          where: { organizationId: input.organizationId, role: "owner" },
        });
        if (ownerCount <= 1) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot remove the only workspace owner",
          });
        }
      }

      await prisma.member.delete({
        where: { id: input.memberId },
      });

      return { success: true };
    }),

  /**
   * Cancel an invitation.
   */
  cancelInvitation: rateLimitedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        invitationId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const caller = await prisma.member.findUnique({
        where: {
          organizationId_userId: {
            organizationId: input.organizationId,
            userId,
          },
        },
      });

      if (!caller || (caller.role !== "owner" && caller.role !== "admin")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only workspace owners and admins can cancel invitations",
        });
      }

      await prisma.invitation.delete({
        where: { id: input.invitationId },
      });

      return { success: true };
    }),

  /**
   * Fetch audit logs for the workspace.
   */
  listAuditLogs: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        limit: z.number().min(1).max(100).default(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const caller = await prisma.member.findUnique({
        where: {
          organizationId_userId: {
            organizationId: input.organizationId,
            userId,
          },
        },
      });

      if (!caller || (caller.role !== "owner" && caller.role !== "admin")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only workspace owners and admins can view audit logs",
        });
      }

      const logs = await prisma.auditLog.findMany({
        where: { organizationId: input.organizationId },
        include: {
          user: {
            select: { name: true, email: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: input.limit,
      });

      return logs.map((log: any) => ({
        id: log.id,
        action: log.action,
        resource: log.resource,
        metadata: log.metadata ? JSON.parse(log.metadata) : null,
        ipAddress: log.ipAddress,
        createdAt: log.createdAt,
        user: log.user,
      }));
    }),
});
