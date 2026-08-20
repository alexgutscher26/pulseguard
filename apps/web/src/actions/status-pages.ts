"use server";

import prisma, { Prisma } from "@steadystack/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@steadystack/auth";
import { headers, cookies } from "next/headers";
import { env } from "@steadystack/env/server";
import {
  assertStatusPageLimits,
  checkAndNotifyUsageLimits,
} from "@/lib/billing-server";
import { hashPassword, verifyPassword, signAuthToken } from "@steadystack/core";

/**
 * Adds a custom domain to a Vercel project via their API.
 *
 * The function checks for the presence of required environment variables (VERCEL_API_TOKEN and VERCEL_PROJECT_ID)
 * and attempts to add the specified domain to the Vercel project. If the domain already exists, it handles the
 * error gracefully. In case of a successful addition, it returns the verification status of the domain.
 *
 * @param domain - The custom domain to be added to the Vercel project.
 * @returns An object indicating the success status and verification of the domain.
 */
async function addDomainToVercel(domain: string) {
  if (!env.VERCEL_API_TOKEN || !env.VERCEL_PROJECT_ID) {
    console.warn("Vercel API keys missing. Skipping domain addition.");
    return { success: true, verified: false, needsConfig: true }; // Soft fail for now
  }

  try {
    const url = `https://api.vercel.com/v10/projects/${env.VERCEL_PROJECT_ID}/domains?teamId=${env.VERCEL_TEAM_ID}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.VERCEL_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: domain }),
    });

    if (!res.ok) {
      const error = (await res.json()) as { code?: string; message?: string };
      if (error.code === "domain_already_in_use") {
        console.log("Domain already exists in Vercel project");
        return { success: true, verified: true };
      }
      console.error("Vercel API Error:", error);
      return { success: false, error: error.message || "Unknown Vercel Error" };
    }

    const data = (await res.json()) as { verified: boolean };
    return { success: true, verified: data.verified };
  } catch (error) {
    console.error("Vercel Domain Add Failed:", error);
    return { success: false, error: "Failed to connect to Domain Provider" };
  }
}

/**
 * Removes a domain from Vercel project.
 */
async function removeDomainFromVercel(domain: string) {
  if (!env.VERCEL_API_TOKEN || !env.VERCEL_PROJECT_ID) return;

  try {
    await fetch(
      `https://api.vercel.com/v9/projects/${env.VERCEL_PROJECT_ID}/domains/${domain}?teamId=${env.VERCEL_TEAM_ID}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${env.VERCEL_API_TOKEN}` },
      },
    );
  } catch (e) {
    console.error("Vercel Domain Remove Failed:", e);
  }
}

const statusPageSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase, alphanumeric, and hyphens only",
    ),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  customDomain: z
    .string()
    .optional()
    .refine(
      (val) => !val || !val.includes("http"),
      "Enter domain only (e.g. status.example.com)",
    ),
  password: z.string().optional(),
  theme: z.string().optional(),

  // New fields validation
  isPrivate: z.boolean().optional(),
  ipWhitelist: z.string().optional(),
  seoIndex: z.boolean().optional(),
  showUptime: z.boolean().optional(),
  showResponseTime: z.boolean().optional(),
  showPaused: z.boolean().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  customCss: z.string().optional(),
  customJs: z.string().optional(),
  barType: z.string().optional(),
  cardType: z.string().optional(),
  homepageUrl: z.string().optional(),
  contactUrl: z.string().optional(),
  footerLinks: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImageUrl: z.string().optional(),
});

export async function createStatusPage(prevState: any, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const rawData = {
    slug: formData.get("slug") as string,
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || undefined,
    customDomain: (formData.get("customDomain") as string) || undefined,
    password: (formData.get("password") as string) || undefined,
    theme: (formData.get("theme") as string) || undefined,

    // Checkboxes send "on" if checked, null otherwise
    isPrivate: formData.get("isPrivate") === "on",
    ipWhitelist: (formData.get("ipWhitelist") as string) || undefined,
    // SEO Index: default true. Checkbox logic: unchecked = null.
    // We want default checked. UI should send "on". If not present, it's false? No, HTML checkboxes.
    // Let's assume UI handles this. For now:
    seoIndex: formData.get("seoIndex") === "on",
    showUptime: formData.get("showUptime") === "on",
    showResponseTime: formData.get("showResponseTime") === "on",
    showPaused: formData.get("showPaused") === "on",

    logo: (formData.get("logo") as string) || undefined,
    favicon: (formData.get("favicon") as string) || undefined,
    customCss: (formData.get("customCss") as string) || undefined,
    customJs: (formData.get("customJs") as string) || undefined,
    barType: (formData.get("barType") as string) || undefined,
    cardType: (formData.get("cardType") as string) || undefined,
    homepageUrl: (formData.get("homepageUrl") as string) || undefined,
    contactUrl: (formData.get("contactUrl") as string) || undefined,
    footerLinks: (formData.get("footerLinks") as string) || undefined,
    metaTitle: (formData.get("metaTitle") as string) || undefined,
    metaDescription: (formData.get("metaDescription") as string) || undefined,
    ogImageUrl: (formData.get("ogImageUrl") as string) || undefined,
  };

  const validation = statusPageSchema.safeParse(rawData);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }
  const data = validation.data;

  const limitCheck = await assertStatusPageLimits(session.user.id, {
    customDomain: data.customDomain,
    isPasswordProtected: Boolean(data.password),
    isWhiteLabeled: false,
    isNew: true,
  });

  if (!limitCheck.allowed) {
    return { success: false, error: limitCheck.error || "Plan limit exceeded" };
  }

  // Check slug uniqueness
  const existing = await prisma.statusPage.findUnique({
    where: { slug: data.slug },
  });
  if (existing) return { success: false, error: "Slug already exists" };

  try {
    const hashedPassword = data.password
      ? await hashPassword(data.password)
      : undefined;
    const page = await prisma.statusPage.create({
      data: {
        slug: data.slug,
        title: data.title,
        description: data.description,
        customDomain: data.customDomain,
        userId: session.user.id,
        password: hashedPassword,
        isPrivate: data.isPrivate ?? false,
        theme: data.theme ? JSON.parse(data.theme) : undefined,

        ipWhitelist: data.ipWhitelist,
        seoIndex: data.seoIndex ?? true,
        showUptime: data.showUptime ?? true,
        showResponseTime: data.showResponseTime ?? true,
        showPaused: data.showPaused ?? false,
        barType: data.barType ?? "absolute",
        cardType: data.cardType ?? "duration",

        logo: data.logo,
        favicon: data.favicon,
        customCss: data.customCss,
        customJs: data.customJs,
        homepageUrl: data.homepageUrl,
        contactUrl: data.contactUrl,
        footerLinks: data.footerLinks
          ? JSON.parse(data.footerLinks)
          : undefined,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        ogImageUrl: data.ogImageUrl,
      },
    });

    checkAndNotifyUsageLimits(session.user.id).catch(() => {});

    revalidatePath("/dashboard/pages");
    return { success: true, id: page.id };
  } catch (e: any) {
    console.error("Failed to create status page:", e);
    return {
      success: false,
      error: `Failed to create status page: ${e.message || String(e)}`,
    };
  }
}

/**
 * Retrieves status pages for the authenticated user.
 *
 * This function first obtains the user session using the auth.api.getSession method. If the session does not contain a user, it returns an empty array. Otherwise, it queries the database for status pages associated with the user's ID, ordering them by creation date in descending order and including a count of related monitors.
 */
import { getSafeSession } from "@/lib/safe-session";
import { getActiveWorkspace } from "@/actions/team";

/**
 * Returns a Prisma where-clause scope for status pages accessible by the current user and their active workspace.
 */
export async function getStatusPageAccessScope(userId: string) {
  try {
    const active = await getActiveWorkspace();
    if (active?.id) {
      const members = await prisma.member.findMany({
        where: { organizationId: active.id },
        select: { userId: true },
      });
      const userIds = members.map((m) => m.userId);
      return {
        userId: { in: Array.from(new Set([userId, ...userIds])) },
      };
    }
  } catch {}
  return { userId };
}

/**
 * Checks if a user has permission to manage (edit, configure, delete) a specific status page.
 * Returns true if the user is the status page creator OR an owner/admin of any organization the creator belongs to.
 */
export async function canManageStatusPage(
  statusPageId: string,
  userId: string,
): Promise<boolean> {
  try {
    const page = await prisma.statusPage.findUnique({
      where: { id: statusPageId },
      select: { userId: true },
    });
    if (!page) return false;
    if (page.userId === userId) return true;

    const userMemberships = await prisma.member.findMany({
      where: {
        userId,
        role: { in: ["owner", "admin"] },
      },
      select: { organizationId: true },
    });
    const orgIds = userMemberships.map((m) => m.organizationId);
    if (orgIds.length === 0) return false;

    const match = await prisma.member.findFirst({
      where: {
        userId: page.userId,
        organizationId: { in: orgIds },
      },
    });
    return Boolean(match);
  } catch (err) {
    console.error("Error checking status page management permissions:", err);
    return false;
  }
}

/**
 * Retrieves status pages for the authenticated user and their active workspace.
 */
export async function getStatusPages() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return [];

  const scope = await getStatusPageAccessScope(session.user.id);

  return prisma.statusPage.findMany({
    where: scope,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { monitors: true },
      },
    },
  });
}

/**
 * Retrieves the status page for a given ID if authorized.
 */
export async function getStatusPage(id: string) {
  const session = await getSafeSession();
  if (!session?.user) return null;

  const allowed = await canManageStatusPage(id, session.user.id);
  if (!allowed) return null;

  return prisma.statusPage.findUnique({
    where: { id },
    include: {
      monitors: {
        include: {
          monitor: true,
          group: true,
        },
        orderBy: { sortOrder: "asc" },
      },
      groups: {
        orderBy: { sortOrder: "asc" },
      },
      i18nSettings: true,
      user: {
        select: {
          privacy: {
            select: { showOnLeaderboard: true, leaderboardBio: true },
          },
        },
      },
    },
  });
}

/**
 * Update the status page with the provided data.
 */
export async function updateStatusPage(
  id: string,
  prevState: any,
  formData: FormData,
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const allowed = await canManageStatusPage(id, session.user.id);
  if (!allowed) {
    return {
      success: false,
      error: "Forbidden: You do not have permission to edit this status page.",
    };
  }

  const rawData = {
    slug: formData.get("slug") as string,
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || undefined,
    customDomain: (formData.get("customDomain") as string) || undefined,
    theme: (formData.get("theme") as string) || undefined,
    password: (formData.get("password") as string) || undefined,

    isPrivate: formData.get("isPrivate") === "on",
    ipWhitelist: (formData.get("ipWhitelist") as string) || undefined,

    // For booleans in update, unchecked means not sent (null).
    seoIndex: formData.get("seoIndex") === "on",
    showUptime: formData.get("showUptime") === "on",
    showResponseTime: formData.get("showResponseTime") === "on",
    showPaused: formData.get("showPaused") === "on",
    showInShowcase: formData.get("showInShowcase") === "on",

    barType: (formData.get("barType") as string) || undefined,
    cardType: (formData.get("cardType") as string) || undefined,

    logo: (formData.get("logo") as string) || undefined,
    favicon: (formData.get("favicon") as string) || undefined,
    customCss: (formData.get("customCss") as string) || undefined,
    customJs: (formData.get("customJs") as string) || undefined,
    homepageUrl: (formData.get("homepageUrl") as string) || undefined,
    contactUrl: (formData.get("contactUrl") as string) || undefined,
    footerLinks: (formData.get("footerLinks") as string) || undefined,
    metaTitle: (formData.get("metaTitle") as string) || undefined,
    metaDescription: (formData.get("metaDescription") as string) || undefined,
    ogImageUrl: (formData.get("ogImageUrl") as string) || undefined,
  };

  try {
    const limitCheck = await assertStatusPageLimits(session.user.id, {
      customDomain: rawData.customDomain,
      isPasswordProtected: Boolean(rawData.password),
      isWhiteLabeled: false,
      isNew: false,
    });

    if (!limitCheck.allowed) {
      return {
        success: false,
        error: limitCheck.error || "Plan limit exceeded",
      };
    }

    let updatePassword: string | null | undefined = undefined;
    if (rawData.password) {
      updatePassword = await hashPassword(rawData.password);
    } else if (rawData.password === "") {
      updatePassword = null;
    }

    await prisma.statusPage.update({
      where: { id },
      data: {
        slug: rawData.slug,
        title: rawData.title,
        description: rawData.description,
        customDomain: rawData.customDomain,
        theme: rawData.theme ? JSON.parse(rawData.theme) : undefined,

        password: updatePassword !== undefined ? updatePassword : undefined,
        isPrivate: rawData.isPrivate,
        ipWhitelist: rawData.ipWhitelist,
        seoIndex: rawData.seoIndex,
        showUptime: rawData.showUptime,
        showResponseTime: rawData.showResponseTime,
        showPaused: rawData.showPaused,
        showInShowcase: rawData.showInShowcase,
        barType: rawData.barType,
        cardType: rawData.cardType,
        logo: rawData.logo,
        favicon: rawData.favicon,
        customCss: rawData.customCss,
        customJs: rawData.customJs,
        homepageUrl: rawData.homepageUrl,
        contactUrl: rawData.contactUrl,
        footerLinks: rawData.footerLinks
          ? JSON.parse(rawData.footerLinks)
          : Prisma.JsonNull,
        metaTitle: rawData.metaTitle,
        metaDescription: rawData.metaDescription,
        ogImageUrl: rawData.ogImageUrl,
      },
    });

    revalidatePath("/dashboard/pages");
    revalidatePath(`/dashboard/pages/${id}`);
    revalidatePath(`/status-page/${rawData.slug}`);
    return { success: true };
  } catch (e: any) {
    console.error("Failed to update status page:", e);
    return {
      success: false,
      error: `Failed to update status page: ${e.message || String(e)}`,
    };
  }
}

/**
 * Checks if a user has permission to access a monitor.
 */
export async function canAccessMonitor(
  monitorId: string,
  userId: string,
): Promise<boolean> {
  try {
    const monitor = await prisma.monitor.findUnique({
      where: { id: monitorId },
      select: { userId: true, organizationId: true },
    });
    if (!monitor) return false;
    if (monitor.userId === userId) return true;

    const userMemberships = await prisma.member.findMany({
      where: {
        userId,
        role: { in: ["owner", "admin", "member"] },
      },
      select: { organizationId: true },
    });
    const orgIds = userMemberships.map((m) => m.organizationId);
    if (monitor.organizationId && orgIds.includes(monitor.organizationId))
      return true;

    const match = await prisma.member.findFirst({
      where: {
        userId: monitor.userId,
        organizationId: { in: orgIds },
      },
    });
    return Boolean(match);
  } catch (err) {
    console.error("Error checking monitor access permissions:", err);
    return false;
  }
}

/**
 * Validates the provided password against the status page's password.
 *
 * If the password matches, a cryptographically signed HMAC token cookie is set for 24 hours.
 *
 * @param {string} pageId - The ID of the status page.
 * @param {string} password - The password to validate against the status page.
 */
export async function verifyStatusPagePassword(
  pageId: string,
  password: string,
) {
  const page = await prisma.statusPage.findUnique({ where: { id: pageId } });
  if (!page || !page.password)
    return { success: false, error: "Page not found or no password" };

  const isValid = await verifyPassword(password, page.password);
  if (isValid) {
    const cookieStore = await cookies();
    const token = await signAuthToken(
      page.id,
      env.BETTER_AUTH_SECRET,
      60 * 60 * 24,
    );
    cookieStore.set(`status-page-token-${page.id}`, token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      path: "/",
    });
    return { success: true };
  }

  return { success: false, error: "Invalid password" };
}

/**
 * Adds a monitor to a specified status page.
 */
export async function addMonitorToPage(pageId: string, monitorId: string) {
  let reqHeaders: any;
  try {
    reqHeaders = await headers();
  } catch {
    reqHeaders = new Headers();
  }
  const session = await auth.api.getSession({ headers: reqHeaders });
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const isAllowedPage = await canManageStatusPage(pageId, session.user.id);
    if (!isAllowedPage)
      return { success: false, error: "Page not found or unauthorized" };

    const isAllowedMonitor = await canAccessMonitor(monitorId, session.user.id);
    if (!isAllowedMonitor)
      return { success: false, error: "Monitor not found or unauthorized" };

    const page = await prisma.statusPage.findUnique({ where: { id: pageId } });
    if (!page) return { success: false, error: "Page not found" };

    await prisma.statusPageMonitor.create({
      data: {
        statusPageId: pageId,
        monitorId: monitorId,
      },
    });

    revalidatePath(`/dashboard/pages/${pageId}`);
    revalidatePath(`/status-page/${page.slug}`);
    return { success: true };
  } catch (e) {
    // Ignore duplicate entries gracefully
    return { success: true };
  }
}

/**
 * Remove a monitor from a specified status page.
 */
export async function removeMonitorFromPage(pageId: string, monitorId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const isAllowed = await canManageStatusPage(pageId, session.user.id);
    if (!isAllowed)
      return { success: false, error: "Page not found or unauthorized" };

    const page = await prisma.statusPage.findUnique({ where: { id: pageId } });
    if (!page) return { success: false, error: "Page not found" };

    await prisma.statusPageMonitor.deleteMany({
      where: {
        statusPageId: pageId,
        monitorId: monitorId,
      },
    });

    revalidatePath(`/dashboard/pages/${pageId}`);
    revalidatePath(`/status-page/${page.slug}`);
    return { success: true };
  } catch (e) {
    console.error("Failed to remove monitor:", e);
    return { success: false, error: "Failed to remove monitor" };
  }
}

// Widget Configuration Schema
const widgetConfigSchema = z.object({
  widgetEnabled: z.boolean(),
  widgetAllowedDomains: z.string().optional().nullable(),
  widgetBadgeText: z
    .object({
      operational: z.string().min(1).max(100),
      partial: z.string().min(1).max(100),
      major: z.string().min(1).max(100),
    })
    .optional()
    .nullable(),
  widgetTheme: z
    .object({
      bgColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
      textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
      borderRadius: z.string().optional(),
    })
    .optional()
    .nullable(),
});

/**
 * Validate domain format (simple check)
 */
function validateDomainFormat(domains: string | null | undefined): boolean {
  if (!domains) return true;
  if (domains === "*") return true;

  const domainList = domains.split(",").map((d) => d.trim());
  const domainRegex =
    /^(\*\.)?[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;

  return domainList.every((domain) => domainRegex.test(domain));
}

/**
 * Update widget configuration for a status page
 */
export async function updateWidgetConfig(
  pageId: string,
  config: z.infer<typeof widgetConfigSchema>,
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const validation = widgetConfigSchema.safeParse(config);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  const data = validation.data;

  // Validate domain format
  if (!validateDomainFormat(data.widgetAllowedDomains)) {
    return {
      success: false,
      error:
        "Invalid domain format. Use comma-separated domains like: example.com, *.example.org",
    };
  }

  try {
    const isAllowed = await canManageStatusPage(pageId, session.user.id);
    if (!isAllowed) {
      return { success: false, error: "Status page not found or unauthorized" };
    }

    const page = await prisma.statusPage.findUnique({ where: { id: pageId } });
    if (!page) {
      return { success: false, error: "Status page not found" };
    }

    await prisma.statusPage.update({
      where: { id: pageId },
      data: {
        widgetEnabled: data.widgetEnabled,
        widgetAllowedDomains: data.widgetAllowedDomains,
        widgetBadgeText: data.widgetBadgeText ?? Prisma.JsonNull,
        widgetTheme: data.widgetTheme ?? Prisma.JsonNull,
      },
    });

    revalidatePath(`/dashboard/pages/${pageId}`);
    revalidatePath(`/status-page/${page.slug}`);
    return { success: true };
  } catch (e) {
    console.error("Failed to update widget config:", e);
    return { success: false, error: "Failed to update widget configuration" };
  }
}

/**
 * Update history days setting for a status page
 */
export async function updateHistoryDays(pageId: string, historyDays: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Unauthorized" };

  // Validate history days
  if (![30, 60, 90].includes(historyDays)) {
    return { success: false, error: "History days must be 30, 60, or 90" };
  }

  try {
    const isAllowed = await canManageStatusPage(pageId, session.user.id);
    if (!isAllowed) {
      return { success: false, error: "Status page not found or unauthorized" };
    }

    await prisma.statusPage.update({
      where: { id: pageId },
      data: { historyDays },
    });

    revalidatePath(`/dashboard/pages/${pageId}`);
    return { success: true };
  } catch (e) {
    console.error("Failed to update history days:", e);
    return { success: false, error: "Failed to update history setting" };
  }
}

/**
 * Get incidents for status page monitors within a time range
 */
export async function getStatusPageIncidents(
  pageId: string,
  days: number = 90,
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return [];

  const isAllowed = await canManageStatusPage(pageId, session.user.id);
  if (!isAllowed) return [];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const page = await prisma.statusPage.findUnique({
    where: { id: pageId },
    include: {
      monitors: {
        select: { monitorId: true },
      },
    },
  });

  if (!page) return [];

  const monitorIds = page.monitors.map((m) => m.monitorId);

  return prisma.incident.findMany({
    where: {
      monitorId: { in: monitorIds },
      startedAt: { gte: startDate },
    },
    orderBy: { startedAt: "desc" },
    include: {
      monitor: {
        select: { name: true },
      },
      events: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });
}

/**
 * Get maintenance windows for status page monitors
 */
export async function getStatusPageMaintenance(pageId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return [];

  const isAllowed = await canManageStatusPage(pageId, session.user.id);
  if (!isAllowed) return [];

  const page = await prisma.statusPage.findUnique({
    where: { id: pageId },
    include: {
      monitors: {
        select: { monitorId: true },
      },
    },
  });

  if (!page) return [];

  const monitorIds = page.monitors.map((m) => m.monitorId);
  const now = new Date();

  return prisma.maintenanceWindow.findMany({
    where: {
      monitorId: { in: monitorIds },
      OR: [
        // Upcoming or active maintenance
        { endAt: { gte: now } },
        // Recently completed (last 7 days)
        {
          endAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            lt: now,
          },
        },
      ],
    },
    orderBy: { startAt: "asc" },
    include: {
      monitor: {
        select: { name: true },
      },
    },
  });
}

/**
 * Get uptime data for status page monitors
 */
export async function getStatusPageUptimeData(
  pageId: string,
  days: number = 90,
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return {
      current: 100,
      previous: 100,
      trend: "stable" as const,
      difference: 0,
    };
  }

  const isAllowed = await canManageStatusPage(pageId, session.user.id);
  if (!isAllowed) {
    return {
      current: 100,
      previous: 100,
      trend: "stable" as const,
      difference: 0,
    };
  }

  const page = await prisma.statusPage.findUnique({
    where: { id: pageId },
    include: {
      monitors: {
        select: { monitorId: true },
      },
    },
  });

  if (!page || page.monitors.length === 0) {
    return {
      current: 100,
      previous: 100,
      trend: "stable" as const,
      difference: 0,
    };
  }

  const monitorId = page.monitors[0].monitorId;

  // Calculate current period uptime
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const events = await prisma.monitorEvent.findMany({
    where: {
      monitorId,
      timestamp: { gte: startDate },
    },
    orderBy: { timestamp: "asc" },
    select: {
      status: true,
      timestamp: true,
    },
  });

  // Calculate uptime percentage
  let current = 100;
  if (events.length > 0) {
    const totalDurationMs = Date.now() - startDate.getTime();
    let downtimeMs = 0;
    let lastDownTime: Date | null = null;

    for (const event of events) {
      if (event.status === "DOWN" && lastDownTime === null) {
        lastDownTime = event.timestamp;
      } else if (event.status === "UP" && lastDownTime !== null) {
        downtimeMs += event.timestamp.getTime() - lastDownTime.getTime();
        lastDownTime = null;
      }
    }

    if (lastDownTime !== null) {
      downtimeMs += Date.now() - lastDownTime.getTime();
    }

    const uptimeMs = totalDurationMs - downtimeMs;
    current =
      Math.round(
        Math.max(0, Math.min(100, (uptimeMs / totalDurationMs) * 100)) * 100,
      ) / 100;
  }

  // Calculate previous period
  const currentStart = new Date();
  currentStart.setDate(currentStart.getDate() - days);

  const previousStart = new Date(currentStart);
  previousStart.setDate(previousStart.getDate() - days);

  const previousEvents = await prisma.monitorEvent.findMany({
    where: {
      monitorId,
      timestamp: {
        gte: previousStart,
        lt: currentStart,
      },
    },
    orderBy: { timestamp: "asc" },
    select: {
      status: true,
      timestamp: true,
    },
  });

  let previous = 100;
  if (previousEvents.length > 0) {
    const periodMs = days * 24 * 60 * 60 * 1000;
    let downtimeMs = 0;
    let lastDownTime: Date | null = null;

    for (const event of previousEvents) {
      if (event.status === "DOWN" && lastDownTime === null) {
        lastDownTime = event.timestamp;
      } else if (event.status === "UP" && lastDownTime !== null) {
        downtimeMs += event.timestamp.getTime() - lastDownTime.getTime();
        lastDownTime = null;
      }
    }

    if (lastDownTime !== null) {
      downtimeMs += currentStart.getTime() - lastDownTime.getTime();
    }

    const uptimeMs = periodMs - downtimeMs;
    previous =
      Math.round(
        Math.max(0, Math.min(100, (uptimeMs / periodMs) * 100)) * 100,
      ) / 100;
  }

  const difference = Math.round((current - previous) * 100) / 100;

  let trend: "up" | "down" | "stable";
  if (difference > 0.01) {
    trend = "up";
  } else if (difference < -0.01) {
    trend = "down";
  } else {
    trend = "stable";
  }

  return { current, previous, trend, difference };
}

/**
 * Creates a manual override for a specific date and monitor on a status page.
 */
export async function createStatusPageOverride(
  statusPageId: string,
  monitorId: string,
  dateStr: string,
  status: string,
  message?: string,
) {
  let reqHeaders: any;
  try {
    reqHeaders = await headers();
  } catch {
    reqHeaders = new Headers();
  }
  const session = await auth.api.getSession({ headers: reqHeaders });
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const isAllowedPage = await canManageStatusPage(
    statusPageId,
    session.user.id,
  );
  if (!isAllowedPage)
    return { success: false, error: "Status page not found or unauthorized" };

  const isAllowedMonitor = await canAccessMonitor(monitorId, session.user.id);
  if (!isAllowedMonitor)
    return { success: false, error: "Monitor not found or unauthorized" };

  const page = await prisma.statusPage.findUnique({
    where: { id: statusPageId },
  });
  if (!page) return { success: false, error: "Status page not found" };

  const date = new Date(dateStr);
  date.setUTCHours(0, 0, 0, 0);

  try {
    const override = await prisma.statusPageOverride.upsert({
      where: {
        statusPageId_monitorId_date: {
          statusPageId,
          monitorId,
          date,
        },
      },
      create: {
        statusPageId,
        monitorId,
        date,
        status,
        message,
      },
      update: {
        status,
        message,
      },
    });

    revalidatePath(`/dashboard/pages/${statusPageId}`);
    revalidatePath(`/status-page/${page.slug}`);
    return { success: true, override };
  } catch (err: any) {
    console.error("Failed to create status page override:", err);
    return { success: false, error: "Failed to create manual override" };
  }
}

/**
 * Deletes a manual override.
 */
export async function deleteStatusPageOverride(
  statusPageId: string,
  overrideId: string,
) {
  let reqHeaders: any;
  try {
    reqHeaders = await headers();
  } catch {
    reqHeaders = new Headers();
  }
  const session = await auth.api.getSession({ headers: reqHeaders });
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const isAllowed = await canManageStatusPage(statusPageId, session.user.id);
  if (!isAllowed)
    return { success: false, error: "Status page not found or unauthorized" };

  const page = await prisma.statusPage.findUnique({
    where: { id: statusPageId },
  });
  if (!page) return { success: false, error: "Status page not found" };

  const override = await prisma.statusPageOverride.findFirst({
    where: {
      id: overrideId,
      statusPageId,
    },
  });
  if (!override) return { success: false, error: "Override not found" };

  try {
    await prisma.statusPageOverride.delete({
      where: { id: overrideId },
    });

    revalidatePath(`/dashboard/pages/${statusPageId}`);
    revalidatePath(`/status-page/${page.slug}`);
    return { success: true };
  } catch (err: any) {
    console.error("Failed to delete status page override:", err);
    return { success: false, error: "Failed to delete manual override" };
  }
}

/**
 * Retrieves manual overrides for a status page.
 */
export async function getStatusPageOverrides(statusPageId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return [];

  const isAllowed = await canManageStatusPage(statusPageId, session.user.id);
  if (!isAllowed) return [];

  return prisma.statusPageOverride.findMany({
    where: { statusPageId },
    include: {
      monitor: {
        select: { name: true },
      },
    },
    orderBy: { date: "desc" },
  });
}

/**
 * Updates settings for a specific monitor assigned to a status page.
 */
export async function updateStatusPageMonitorSettings(
  statusPageId: string,
  monitorId: string,
  data: {
    displayName: string | null;
    showLatency: boolean;
    showUptime: boolean;
    showCheckCounts: boolean;
  },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const isAllowed = await canManageStatusPage(statusPageId, session.user.id);
  if (!isAllowed)
    return { success: false, error: "Status page not found or unauthorized" };

  const page = await prisma.statusPage.findUnique({
    where: { id: statusPageId },
  });
  if (!page) return { success: false, error: "Status page not found" };

  try {
    await prisma.statusPageMonitor.update({
      where: {
        statusPageId_monitorId: {
          statusPageId,
          monitorId,
        },
      },
      data: {
        displayName: data.displayName || null,
        showLatency: data.showLatency,
        showUptime: data.showUptime,
        showCheckCounts: data.showCheckCounts,
      },
    });

    revalidatePath(`/dashboard/pages/${statusPageId}`);
    revalidatePath(`/status-page/${page.slug}`);
    return { success: true };
  } catch (err: any) {
    console.error("Failed to update status page monitor settings:", err);
    return {
      success: false,
      error: err.message || "Failed to update monitor settings",
    };
  }
}
