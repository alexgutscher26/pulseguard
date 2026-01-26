"use server";

import prisma from "@pulseguard/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";

// Conditional validation schema
const baseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["HTTP", "PING", "PORT"]),
  interval: z.coerce.number().min(30),
  timeout: z.coerce.number().min(1),
  url: z.string().optional(), // For HTTP/Ping
  // For Port:
  hostname: z.string().optional(),
  port: z.coerce.number().min(1).max(65535).optional(),
});

const monitorSchema = baseSchema.superRefine((data, ctx) => {
  try {
    if (data.type === "HTTP") {
      if (!data.url) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "URL is required for HTTP monitors",
          path: ["url"],
        });
        return;
      }
      const urlCheck = z.string().url("Must be a valid URL").safeParse(data.url);
      if (!urlCheck.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Must be a valid URL",
          path: ["url"],
        });
        return;
      }
      // Shared localhost check
      try {
        const urlObj = new URL(data.url);
        const hostname = urlObj.hostname.toLowerCase();
        const isLocalhost =
          hostname === "localhost" ||
          hostname === "127.0.0.1" ||
          hostname === "::1" ||
          hostname === "0.0.0.0";
        if (isLocalhost) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Localhost URLs are not allowed. Please use a public URL.",
            path: ["url"],
          });
        }
      } catch {
        // Invalid URL caught above
      }
    } else if (data.type === "PING") {
      if (!data.url) {
        // We reuse the 'url' input field for Hostname in the form
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Hostname is required",
          path: ["url"],
        });
        return;
      }
      // Basic hostname check
      if (data.url && data.url.includes("://")) {
        // Should just be hostname
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter hostname only (no http://)",
          path: ["url"],
        });
      }
    } else if (data.type === "PORT") {
      if (!data.url) {
        // Reusing 'url' input as hostname
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Hostname is required",
          path: ["url"],
        });
      }
      if (!data.port) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Port is required",
          path: ["port"],
        });
      }
    }
  } catch (e) {
    console.error("Schema validation crashed:", e);
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Validation failed unexpectedly",
      path: ["url"],
    });
  }
});

export async function createMonitor(prevState: any, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const rawData = {
      name: (formData.get("name") as string) || "",
      url: (formData.get("url") as string) || undefined,
      type: (formData.get("type") as "HTTP" | "PING" | "PORT") || "HTTP",
      interval: Number(formData.get("interval") || 60),
      timeout: Number(formData.get("timeout") || 10),
      port: formData.get("port") ? Number(formData.get("port")) : undefined,
    };

    console.log("Creating monitor with data:", rawData);

    const validation = monitorSchema.safeParse(rawData);

    if (!validation.success) {
      console.error("Validation failed:", validation.error);
      const firstError = validation.error.issues[0]?.message || "Invalid input";
      return { success: false, error: firstError };
    }

    const data = validation.data;
    let finalUrl = data.url || "";

    if (data.type === "PING") {
      finalUrl = `ping://${data.url}`;
    } else if (data.type === "PORT") {
      finalUrl = `tcp://${data.url}:${data.port}`;
    }

    await prisma.monitor.create({
      data: {
        name: data.name,
        url: finalUrl,
        type: data.type as any,
        interval: data.interval,
        timeout: data.timeout,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/monitors");
    return { success: true };
  } catch (error) {
    console.error("CRITICAL ERROR in createMonitor:", error);
    // @ts-ignore
    return { success: false, error: error.message || "Internal server error" };
  }
}

/**
 * Update a monitor's configuration in the database.
 *
 * This function first retrieves the current user session and checks for authorization. It then validates the input data against a schema. Depending on the monitor type, it constructs the appropriate URL format. Finally, it attempts to update the monitor in the database and revalidates the relevant paths. If any step fails, it returns an error message.
 *
 * @param id - The unique identifier of the monitor to be updated.
 * @param prevState - The previous state of the monitor (not used in the current implementation).
 * @param formData - The form data containing the updated monitor information.
 * @returns An object indicating the success of the operation and any error messages.
 */
export async function updateMonitor(id: string, prevState: any, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const rawData = {
    name: (formData.get("name") as string) || "",
    url: (formData.get("url") as string) || undefined,
    type: (formData.get("type") as "HTTP" | "PING" | "PORT") || "HTTP",
    interval: Number(formData.get("interval") || 60),
    timeout: Number(formData.get("timeout") || 10),
    port: formData.get("port") ? Number(formData.get("port")) : undefined,
  };

  console.log("Updating monitor with data:", rawData);

  const validation = monitorSchema.safeParse(rawData);

  if (!validation.success) {
    const firstError = validation.error.issues[0]?.message || "Invalid input";
    return { success: false, error: firstError };
  }

  const data = validation.data;
  let finalUrl = data.url || "";

  if (data.type === "PING") {
    finalUrl = `ping://${data.url}`;
  } else if (data.type === "PORT") {
    finalUrl = `tcp://${data.url}:${data.port}`;
  }

  try {
    await prisma.monitor.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        name: data.name,
        url: finalUrl,
        type: data.type as any,
        interval: data.interval,
        timeout: data.timeout,
      },
    });

    revalidatePath("/dashboard/monitors");
    revalidatePath(`/dashboard/monitors/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update monitor", error);
    return { success: false, error: "Failed to update monitor" };
  }
}

/**
 * Retrieve a list of monitors associated with the authenticated user.
 *
 * The function first obtains the user session using the auth.api.getSession method. If the session does not contain a user, it returns an empty array.
 * If the session is valid, it attempts to fetch the monitors from the database, ordered by creation date, and includes the latest events for each monitor.
 * In case of an error during the database query, it logs the error and returns an empty array.
 *
 * @returns An array of monitors associated with the authenticated user or an empty array if no user is found or an error occurs.
 */
export async function getMonitors() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return [];

  // Use try/catch in case DB not ready
  try {
    const monitors = await prisma.monitor.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        events: {
          take: 10,
          orderBy: { timestamp: "desc" },
        },
      },
    });
    return monitors;
  } catch (error) {
    console.error("Failed to fetch monitors", error);
    return [];
  }
}

export async function getMonitor(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  try {
    const monitor = await prisma.monitor.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        events: {
          take: 50,
          orderBy: {
            timestamp: "desc",
          },
        },
        maintenanceWindows: {
          orderBy: {
            startAt: "asc",
          },
        },
      },
    });
    return monitor;
  } catch (error) {
    console.error("Failed to fetch monitor", error);
    return null;
  }
}

export async function checkMonitor(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return { success: false, error: "Unauthorized" };

  const monitor = await prisma.monitor.findUnique({
    where: { id, userId: session.user.id },
  });

  if (!monitor) return { success: false, error: "Monitor not found" };

  const start = Date.now();
  let currentStatus: "UP" | "DOWN" = "DOWN";
  let latency = 0;

  try {
    const response = await fetch(monitor.url, {
      method: "GET",
      headers: {
        "User-Agent": "PulseGuard-Monitor/1.0",
        Accept: "*/*",
      },
      signal: AbortSignal.timeout(10000),
    });

    latency = Date.now() - start;
    currentStatus = response.ok ? "UP" : "DOWN";
  } catch (err) {
    console.error(`Error checking ${monitor.url}:`, err);
    // latency = Date.now() - start; // Latency is effectively timeout or partial
    latency = 0;
    currentStatus = "DOWN";
  }

  try {
    await prisma.$transaction([
      prisma.monitorEvent.create({
        data: {
          monitorId: monitor.id,
          status: currentStatus,
          latency: latency,
          timestamp: new Date(),
        },
      }),
      prisma.monitor.update({
        where: { id: monitor.id },
        data: {
          status: currentStatus,
          lastCheck: new Date(),
        },
      }),
    ]);

    revalidatePath(`/dashboard/monitors/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to save check result", error);
    return { success: false, error: "Failed to save result" };
  }
}

export async function toggleMonitor(id: string, enabled: boolean) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    await prisma.monitor.update({
      where: { id, userId: session.user.id },
      data: {
        status: enabled ? "UP" : "PAUSED", // Reset to UP (pending next check) or PAUSED
      },
    });

    revalidatePath(`/dashboard/monitors/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle monitor", error);
    return { success: false, error: "Failed to toggle monitor" };
  }
}

export async function getDashboardStats() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return {
      activeMonitors: 0,
      globalUptime: 0,
      avgLatency: 0,
      activeAlerts: 0,
    };
  }

  try {
    const userId = session.user.id;

    // 1. Active Monitors
    const activeMonitorsCount = await prisma.monitor.count({
      where: {
        userId,
        status: { not: "PAUSED" },
      },
    });

    // 2. Active Alerts (Monitors currently DOWN)
    const activeAlertsCount = await prisma.monitor.count({
      where: {
        userId,
        status: "DOWN",
      },
    });

    // 3. Global Stats (Uptime & Latency) - Last 24h
    // We fetch events for all user's monitors
    const userMonitors = await prisma.monitor.findMany({
      where: { userId },
      select: { id: true },
    });
    const monitorIds = userMonitors.map((m: { id: string }) => m.id);

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const events = await prisma.monitorEvent.findMany({
      where: {
        monitorId: { in: monitorIds },
        timestamp: { gte: oneDayAgo },
      },
      select: {
        status: true,
        latency: true,
      },
    });

    let globalUptime = 0;
    let avgLatency = 0;

    if (events.length > 0) {
      const upEvents = events.filter((e: { status: string }) => e.status === "UP").length;
      globalUptime = (upEvents / events.length) * 100;

      const latencies = events
        .filter((e: { status: string; latency: number }) => e.status === "UP" && e.latency > 0)
        .map((e: { latency: number }) => e.latency);

      const totalLatency = latencies.reduce((a: number, b: number) => a + b, 0);
      avgLatency = latencies.length > 0 ? totalLatency / latencies.length : 0;
    }

    return {
      activeMonitors: activeMonitorsCount,
      globalUptime: Number(globalUptime.toFixed(2)),
      avgLatency: Math.round(avgLatency),
      activeAlerts: activeAlertsCount,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats", error);
    return {
      activeMonitors: 0,
      globalUptime: 0,
      avgLatency: 0,
      activeAlerts: 0,
    };
  }
}
