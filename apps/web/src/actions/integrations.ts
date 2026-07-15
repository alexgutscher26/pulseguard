"use server";

import prisma from "@pulseguard/db";
import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export interface IntegrationProject {
  name: string;
  url: string;
  type: "HTTP" | "PING";
}

export interface ExternalResource {
  id: string;
  name: string;
  url: string;
  type: "HTTP" | "PING";
}

/**
 * Bulk imports third-party projects/domains and registers them as active PulseGuard HTTP/PING monitors.
 */
export async function importThirdPartyMonitors(projects: IntegrationProject[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = session.user.id;

  try {
    // 1. Fetch user tier
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tier: true },
    });
    const userTier = user?.tier || "INITIATE";

    // 2. Count existing monitors
    const existingCount = await prisma.monitor.count({
      where: { userId },
    });

    const maxMonitors = userTier === "INITIATE" ? 50 : userTier === "NETRUNNER" ? 200 : 9999;
    const defaultInterval = userTier === "INITIATE" ? 180 : 60;
    const defaultRegions = JSON.stringify(["us-east"]);

    if (existingCount + projects.length > maxMonitors) {
      return {
        success: false,
        error: `Importing these monitors would exceed your plan limit of ${maxMonitors} monitors (current: ${existingCount}).`,
      };
    }

    // 3. Bulk create monitors
    const createdMonitors = [];
    for (const project of projects) {
      // Ensure the URL is valid HTTP/S if not ping
      let finalUrl = project.url;
      if (!finalUrl.includes("://")) {
        finalUrl = project.type === "PING" ? `ping://${finalUrl}` : `https://${finalUrl}`;
      }

      const monitor = await prisma.monitor.create({
        data: {
          name: project.name,
          url: finalUrl,
          type: project.type,
          interval: defaultInterval,
          timeout: 10,
          userId,
          checkRegions: defaultRegions,
          alertThreshold: 1,
          dynamicThresholding: false,
          method: "GET",
        },
      });

      // Auto-create default alert rule
      try {
        const userChannels = await prisma.notificationChannel.findMany({
          where: { userId },
          take: 5,
        });

        if (userChannels.length > 0) {
          await prisma.alertRule.create({
            data: {
              monitorId: monitor.id,
              trigger: "STATUS_CHANGE",
              targetStatus: "DOWN",
              enabled: true,
              channels: {
                connect: userChannels.map((ch) => ({ id: ch.id })),
              },
            },
          });
        }
      } catch (err) {
        console.error("Failed to auto-create alert rule during import:", err);
      }

      createdMonitors.push(monitor);
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/monitors");

    return { success: true, count: createdMonitors.length };
  } catch (error: any) {
    console.error("Failed to import monitors:", error);
    return { success: false, error: error.message || "Failed to import monitors" };
  }
}

/**
 * Fetches project deployments from Vercel.
 */
export async function fetchVercelProjects(
  token: string,
): Promise<{ success: boolean; data?: ExternalResource[]; error?: string }> {
  // Handle mock credentials
  if (!token || token.toLowerCase().trim() === "mock" || token.toLowerCase().trim() === "demo") {
    return {
      success: true,
      data: [
        { id: "v1", name: "pulseguard-landing", url: "pulseguard.io", type: "HTTP" },
        { id: "v2", name: "nextjs-dashboard-prod", url: "dashboard.pulseguard.io", type: "HTTP" },
        { id: "v3", name: "indie-maker-blog", url: "blog.maker.io", type: "HTTP" },
        { id: "v4", name: "saas-api-service", url: "api.my-saas.com", type: "HTTP" },
      ],
    };
  }

  try {
    const res = await fetch("https://api.vercel.com/v9/projects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { success: false, error: `Vercel API returned status ${res.status}: ${errorText}` };
    }

    const json = (await res.json()) as any;
    const projects = json.projects || [];
    const data = projects.map((p: any) => {
      // Find a production target domain or default to name.vercel.app
      const domain = p.targets?.production?.alias?.[0] || `${p.name}.vercel.app`;
      return {
        id: p.id,
        name: p.name,
        url: domain,
        type: "HTTP" as const,
      };
    });

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch from Vercel" };
  }
}

/**
 * Fetches sites deployed on Netlify.
 */
export async function fetchNetlifySites(
  token: string,
): Promise<{ success: boolean; data?: ExternalResource[]; error?: string }> {
  if (!token || token.toLowerCase().trim() === "mock" || token.toLowerCase().trim() === "demo") {
    return {
      success: true,
      data: [
        { id: "n1", name: "sveltekit-portfolio", url: "portfolio.netlify.app", type: "HTTP" },
        { id: "n2", name: "static-docs-site", url: "docs.maker.io", type: "HTTP" },
        { id: "n3", name: "landing-page-v2", url: "promo.netlify.app", type: "HTTP" },
      ],
    };
  }

  try {
    const res = await fetch("https://api.netlify.com/api/v1/sites", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { success: false, error: `Netlify API returned status ${res.status}: ${errorText}` };
    }

    const sites = (await res.json()) as any[];
    const data = sites.map((s: any) => {
      const domain = s.custom_domain || s.ssl_url || s.url || `${s.name}.netlify.app`;
      // Clean up protocol for display url
      const cleanUrl = domain.replace(/^https?:\/\//, "");
      return {
        id: s.id,
        name: s.name,
        url: cleanUrl,
        type: "HTTP" as const,
      };
    });

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch from Netlify" };
  }
}

/**
 * Fetches repositories from GitHub.
 */
export async function fetchGitHubRepos(
  token: string,
): Promise<{ success: boolean; data?: ExternalResource[]; error?: string }> {
  if (!token || token.toLowerCase().trim() === "mock" || token.toLowerCase().trim() === "demo") {
    return {
      success: true,
      data: [
        { id: "g1", name: "pulseguard-agent-kit", url: "github.com/alexgutscher26/pulseguard", type: "PING" },
        { id: "g2", name: "react-cyberpunk-ui", url: "github.com/alexgutscher26/react-cyberpunk-ui", type: "PING" },
        { id: "g3", name: "pain-point-miner", url: "github.com/alexgutscher26/pain-point-miner", type: "PING" },
      ],
    };
  }

  try {
    const res = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { success: false, error: `GitHub API returned status ${res.status}: ${errorText}` };
    }

    const repos = (await res.json()) as any[];
    const data = repos.map((r: any) => {
      // Use homepage URL if set, otherwise fallback to repo url format
      const domain = r.homepage || r.html_url || `github.com/${r.full_name}`;
      const cleanUrl = domain.replace(/^https?:\/\//, "");
      return {
        id: String(r.id),
        name: r.name,
        url: cleanUrl,
        type: r.homepage ? ("HTTP" as const) : ("PING" as const),
      };
    });

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch from GitHub" };
  }
}
