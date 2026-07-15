"use server";

import { env } from "@pulseguard/env/server";
import net from "net";

import prisma from "@pulseguard/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@pulseguard/auth";
import { headers, cookies } from "next/headers";
import { sendMonitorAlert, type MonitorAlertData } from "@pulseguard/email";

// Helper Types for Incident Management
enum IncidentEventType {
  STATE_CHANGE = "STATE_CHANGE",
  ALERT_SENT = "ALERT_SENT",
  COMMENT = "COMMENT",
  AUTO_RESOLVE = "AUTO_RESOLVE",
}

enum IncidentStatus {
  INVESTIGATING = "INVESTIGATING",
  IDENTIFIED = "IDENTIFIED",
  MONITORING = "MONITORING",
  RESOLVED = "RESOLVED",
}

enum Severity {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

// Conditional validation schema
const baseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["HTTP", "PING", "PORT", "BROWSER", "SEQUENCE", "SSL", "DNS", "MCP", "DATABASE"]),
  interval: z.coerce.number().min(10),
  timeout: z.coerce.number().min(1),
  url: z.string().optional(), // For HTTP/Ping
  // For Port:
  hostname: z.string().optional(),
  port: z.coerce.number().min(1).max(65535).optional(),
  // Multi-region support
  checkRegions: z.string().optional(), // JSON stringified array of region codes
  alertThreshold: z.coerce.number().min(1).default(1),
  dynamicThresholding: z.boolean().optional(),
  runbookUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  method: z.string().optional().default("GET"),
  headers: z.string().optional(),
  body: z.string().optional(),
  script: z.string().optional(),
  expectation: z.string().optional(),
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
    } else if (data.type === "BROWSER") {
      if (!data.url) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "URL is required for browser monitors",
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
      if (!data.script) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Script steps are required for browser monitoring",
          path: ["script"],
        });
      }
    } else if (data.type === "SEQUENCE") {
      if (!data.url) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Base URL is required for sequence monitors",
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
      if (!data.script) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sequence steps are required for sequence monitoring",
          path: ["script"],
        });
      }
    } else if (data.type === "SSL") {
      if (!data.url) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Hostname / URL is required for SSL monitors",
          path: ["url"],
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

/**
 * Create a new monitor based on the provided form data.
 *
 * This function retrieves the current user session, validates the input data against a schema, and constructs a standard URL format based on the monitor type. It then attempts to create a new monitor entry in the database and revalidates the dashboard path. If any step fails, it returns an appropriate error message.
 *
 * @param prevState - The previous state of the monitor, used for context.
 * @param formData - The form data containing monitor details such as name, URL, type, interval, timeout, and port.
 * @returns An object indicating the success of the operation and any error messages if applicable.
 */
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
      type:
        (formData.get("type") as "HTTP" | "PING" | "PORT" | "BROWSER" | "SEQUENCE" | "SSL" | "DNS" | "MCP" | "DATABASE") ||
        "HTTP",
      interval: Number(formData.get("interval") || 60),
      timeout: Number(formData.get("timeout") || 10),
      port: formData.get("port") ? Number(formData.get("port")) : undefined,
      checkRegions: (formData.get("checkRegions") as string) || undefined,
      alertThreshold: formData.get("alertThreshold") ? Number(formData.get("alertThreshold")) : 1,
      dynamicThresholding: formData.get("dynamicThresholding") === "on",
      runbookUrl: (formData.get("runbookUrl") as string) || undefined,
      method: (formData.get("method") as string) || "GET",
      headers: (formData.get("headers") as string) || undefined,
      body: (formData.get("body") as string) || undefined,
      script: (formData.get("script") as string) || undefined,
      expectation: (formData.get("expectation") as string) || undefined,
    };

    console.log("Creating monitor with data:", rawData);

    const validation = monitorSchema.safeParse(rawData);

    if (!validation.success) {
      console.error("Validation failed:", validation.error);
      const firstError = validation.error.issues[0]?.message || "Invalid input";
      return { success: false, error: firstError };
    }

    const data = validation.data;

    // Enforce pricing tier limits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tier: true },
    });
    const userTier = user?.tier || "INITIATE";

    if (userTier === "INITIATE") {
      const allowedTypes = ["HTTP", "SSL", "DNS"];
      if (!allowedTypes.includes(data.type)) {
        return {
          success: false,
          error: "Only HTTP/HTTPS, SSL/TLS, and DNS monitors are allowed on the Free tier. Upgrade to Netrunner for TCP, Ping, Browser, and Sequence monitors.",
        };
      }

      if (data.interval < 180) {
        return {
          success: false,
          error: "Minimum check interval for the Free tier is 3 minutes (180 seconds).",
        };
      }

      if (data.checkRegions) {
        try {
          const regions = JSON.parse(data.checkRegions);
          if (Array.isArray(regions) && regions.length > 1) {
            return {
              success: false,
              error: "Free tier monitors are limited to a single check region.",
            };
          }
        } catch (e) {
          // JSON parsing issue
        }
      }

      const monitorCount = await prisma.monitor.count({
        where: { userId: session.user.id },
      });
      if (monitorCount >= 50) {
        return {
          success: false,
          error: "You have reached the maximum limit of 50 monitors for the Free tier.",
        };
      }
    } else if (userTier === "NETRUNNER") {
      const allowedTypes = ["HTTP", "SSL", "DNS", "MCP", "SEQUENCE", "PORT", "DATABASE", "PING"];
      if (!allowedTypes.includes(data.type)) {
        return {
          success: false,
          error: "Synthetic Browser Testing is only allowed on the Construct (Business) tier. Please upgrade to Construct to use Browser monitors.",
        };
      }

      if (data.interval < 30) {
        return {
          success: false,
          error: "Minimum check interval for the Netrunner tier is 30 seconds.",
        };
      }

      if (data.checkRegions) {
        try {
          const regions = JSON.parse(data.checkRegions);
          if (Array.isArray(regions) && regions.length > 3) {
            return {
              success: false,
              error: "Netrunner tier is limited to at most 3 check regions.",
            };
          }
        } catch (e) {
          // JSON parsing issue
        }
      }

      const monitorCount = await prisma.monitor.count({
        where: { userId: session.user.id },
      });
      if (monitorCount >= 200) {
        return {
          success: false,
          error: "You have reached the maximum limit of 200 monitors for the Netrunner tier.",
        };
      }
    } else if (userTier === "CONSTRUCT") {
      if (data.interval < 10) {
        return {
          success: false,
          error: "Minimum check interval for the Construct tier is 10 seconds.",
        };
      }
    }

    let finalUrl = data.url || "";

    if (data.type === "PING") {
      finalUrl = `ping://${data.url}`;
    } else if (data.type === "PORT") {
      finalUrl = `tcp://${data.url}:${data.port}`;
    }

    // Create monitor
    const monitor = await prisma.monitor.create({
      data: {
        name: data.name,
        url: finalUrl,
        type: data.type as any,
        interval: data.interval,
        timeout: data.timeout,
        userId: session.user.id,
        checkRegions: data.checkRegions,
        alertThreshold: data.alertThreshold,
        dynamicThresholding: data.dynamicThresholding,
        runbookUrl: data.runbookUrl,
        method: data.method,
        headers: data.headers,
        body: data.body,
        script: data.script,
        expectation: data.expectation,
      },
    });

    // Auto-create default alert rule if user has notification channels
    try {
      const userChannels = await prisma.notificationChannel.findMany({
        where: { userId: session.user.id },
        take: 5, // Use up to 5 channels for default rule
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
        console.log(`[AutoConfig] Created default alert rule for monitor ${monitor.name}`);
      } else {
        console.log(`[AutoConfig] No notification channels found. Skipping default alert rule.`);
      }
    } catch (alertError) {
      // Don't fail monitor creation if alert rule creation fails
      console.error("Failed to create default alert rule:", alertError);
    }

    revalidatePath("/dashboard/monitors");
    revalidatePath("/dashboard/alerts");
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
    type:
      (formData.get("type") as "HTTP" | "PING" | "PORT" | "BROWSER" | "SEQUENCE" | "SSL" | "DNS" | "MCP" | "DATABASE") || "HTTP",
    interval: Number(formData.get("interval") || 60),
    timeout: Number(formData.get("timeout") || 10),
    port: formData.get("port") ? Number(formData.get("port")) : undefined,
    checkRegions: (formData.get("checkRegions") as string) || undefined,
    alertThreshold: formData.get("alertThreshold") ? Number(formData.get("alertThreshold")) : 1,
    dynamicThresholding: formData.get("dynamicThresholding") === "on",
    runbookUrl: (formData.get("runbookUrl") as string) || undefined,
    method: (formData.get("method") as string) || "GET",
    headers: (formData.get("headers") as string) || undefined,
    body: (formData.get("body") as string) || undefined,
    script: (formData.get("script") as string) || undefined,
    expectation: (formData.get("expectation") as string) || undefined,
  };

  console.log("Updating monitor with data:", rawData);

  const validation = monitorSchema.safeParse(rawData);

  if (!validation.success) {
    const firstError = validation.error.issues[0]?.message || "Invalid input";
    return { success: false, error: firstError };
  }

  const data = validation.data;

  // Enforce pricing tier limits
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tier: true },
  });
  const userTier = user?.tier || "INITIATE";

  if (userTier === "INITIATE") {
    const allowedTypes = ["HTTP", "SSL", "DNS"];
    if (!allowedTypes.includes(data.type)) {
      return {
        success: false,
        error: "Only HTTP/HTTPS, SSL/TLS, and DNS monitors are allowed on the Free tier. Upgrade to Netrunner for TCP, Ping, Browser, and Sequence monitors.",
      };
    }

    if (data.interval < 180) {
      return {
        success: false,
        error: "Minimum check interval for the Free tier is 3 minutes (180 seconds).",
      };
    }

    if (data.checkRegions) {
      try {
        const regions = JSON.parse(data.checkRegions);
        if (Array.isArray(regions) && regions.length > 1) {
          return {
            success: false,
            error: "Free tier monitors are limited to a single check region.",
          };
        }
      } catch (e) {
        // JSON parsing issue
      }
    }
  } else if (userTier === "NETRUNNER") {
    const allowedTypes = ["HTTP", "SSL", "DNS", "MCP", "SEQUENCE", "PORT", "DATABASE", "PING"];
    if (!allowedTypes.includes(data.type)) {
      return {
        success: false,
        error: "Synthetic Browser Testing is only allowed on the Construct (Business) tier. Please upgrade to Construct to use Browser monitors.",
      };
    }

    if (data.interval < 30) {
      return {
        success: false,
        error: "Minimum check interval for the Netrunner tier is 30 seconds.",
      };
    }

    if (data.checkRegions) {
      try {
        const regions = JSON.parse(data.checkRegions);
        if (Array.isArray(regions) && regions.length > 3) {
          return {
            success: false,
            error: "Netrunner tier is limited to at most 3 check regions.",
          };
        }
      } catch (e) {
        // JSON parsing issue
      }
    }
  } else if (userTier === "CONSTRUCT") {
    if (data.interval < 10) {
      return {
        success: false,
        error: "Minimum check interval for the Construct tier is 10 seconds.",
      };
    }
  }

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
        checkRegions: data.checkRegions,
        alertThreshold: data.alertThreshold,
        dynamicThresholding: data.dynamicThresholding,
        runbookUrl: data.runbookUrl,
        method: data.method,
        headers: data.headers,
        body: data.body,
        script: data.script,
        expectation: data.expectation,
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
          take: 20,
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

/**
 * Retrieve a monitor by its ID.
 *
 * This function first obtains the current user session using the auth.api.getSession method. If the session is valid and the user is authenticated, it attempts to fetch the monitor from the database using prisma.monitor.findFirst. The monitor is retrieved along with its associated events and maintenance windows, ordered appropriately. If any error occurs during the fetch, it logs the error and returns null.
 *
 * @param id - The unique identifier of the monitor to retrieve.
 * @returns The monitor object if found, or null if the user is not authenticated or an error occurs.
 */
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
        // @ts-ignore
        maintenanceWindows: {
          orderBy: {
            startAt: "asc",
          },
        },
      },
    });
    return monitor;
  } catch (error) {
    console.error("Failed to fetch monitor from DB:", error);
    // Throwing here triggers the error.tsx instead of notFound.tsx
    throw error;
  }
}

export async function checkMonitor(
  id: string,
  context?: { checkRegions?: string[]; reason?: string },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return { success: false, error: "Unauthorized" };

  /* Updated to include maintenance check */
  const monitor = await prisma.monitor.findFirst({
    where: { id, userId: session.user.id },
    include: {
      // @ts-ignore
      maintenanceWindows: {
        where: {
          startAt: { lte: new Date() },
          endAt: { gte: new Date() },
        },
        take: 1,
      },
      alertRules: {
        where: { enabled: true },
        include: {
          channels: true, // Fetch all channels
        },
      },
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  if (!monitor) return { success: false, error: "Monitor not found" };

  // Check for active maintenance
  if ((monitor as any).maintenanceWindows && (monitor as any).maintenanceWindows.length > 0) {
    console.log(`[Maintenance] Manual check skipped for ${monitor.name}`);
    await prisma.$transaction([
      prisma.monitor.update({
        where: { id: monitor.id },
        data: {
          status: "MAINTENANCE" as any,
          lastCheck: new Date(),
        },
      }),
      prisma.monitorEvent.create({
        data: {
          monitorId: monitor.id,
          status: "MAINTENANCE" as any,
          latency: 0,
          timestamp: new Date(),
        },
      }),
    ]);
    revalidatePath(`/dashboard/monitors/${id}`);
    revalidatePath("/dashboard/monitors");
    revalidatePath("/dashboard");
    return { success: true };
  }

  const start = Date.now();
  let currentStatus: "UP" | "DOWN" = "DOWN";
  let latency = 0;
  let errorReason: string | undefined = undefined;

  try {
    if (monitor.type === "BROWSER" || monitor.type === "SEQUENCE" || monitor.type === "SSL") {
      const workerUrl = process.env.PULSEGUARD_WORKER_URL || "http://localhost:8787";
      const cookieHeader = (await headers()).get("Cookie");

      const response = await fetch(`${workerUrl}/api/check-now`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
        body: JSON.stringify({ monitor }),
        signal: AbortSignal.timeout((monitor.timeout || 15) * 1000),
      });

      latency = Date.now() - start;

      if (response.ok) {
        const result = (await response.json()) as any;
        currentStatus = result.status;
        latency = result.latency;
        errorReason = result.errorReason;
      } else {
        currentStatus = "DOWN";
        const text = await response.text();
        errorReason = `Worker HTTP ${response.status}: ${text.substring(0, 50)}`;
      }
    } else {
      if (monitor.url.startsWith("ping://") || monitor.url.startsWith("tcp://")) {
        const isPing = monitor.url.startsWith("ping://");
        const part = monitor.url.replace(isPing ? "ping://" : "tcp://", "");
        const [hostname, portStr] = part.split(":");
        const port = isPing ? 80 : parseInt(portStr);

        if (!hostname || (isNaN(port) && !isPing)) {
          throw new Error("Invalid host or port in URL");
        }

        await new Promise<void>((resolve, reject) => {
          const socket = net.connect({
            host: hostname,
            port: port,
          });

          socket.setTimeout((monitor.timeout || 10) * 1000);

          socket.on("connect", () => {
            currentStatus = "UP";
            socket.end();
            resolve();
          });

          socket.on("timeout", () => {
            socket.destroy();
            reject(new Error("TIMEOUT"));
          });

          socket.on("error", (err) => {
            socket.destroy();
            reject(err);
          });
        });

        latency = Math.round(Date.now() - start);
      } else if (monitor.url.startsWith("http://") || monitor.url.startsWith("https://")) {
        const method = monitor.method || "GET";
        const userHeaders: Record<string, string> = {};

        if (monitor.headers) {
          try {
            const parsed = JSON.parse(monitor.headers);
            if (Array.isArray(parsed)) {
              parsed.forEach((h: { key: string; value: string }) => {
                if (h.key) userHeaders[h.key] = h.value;
              });
            }
          } catch (e) {
            console.error("Failed to parse monitor headers:", e);
          }
        }

        const response = await fetch(monitor.url, {
          method,
          redirect: "follow",
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; PulseGuard/1.0; +https://pulseguard.io/bot)",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            ...userHeaders,
          },
          body: ["POST", "PUT", "PATCH"].includes(method) ? monitor.body : undefined,
          signal: AbortSignal.timeout((monitor.timeout || 10) * 1000),
        });

        const body = await response.text();
        latency = Math.round(Date.now() - start);
        // Treat 2xx, 3xx as UP. Treat 429 as UP — rate-limited means server is alive.
        const statusNum = Number(response.status);
        const isRateLimited = statusNum === 429;
        const isHealthyStatus =
          response.ok || (statusNum >= 300 && statusNum < 400) || isRateLimited;
        currentStatus = isHealthyStatus ? "UP" : "DOWN";

        if (currentStatus === "UP" && monitor.expectation) {
          const { validatePayload } = await import("@/lib/payload-parser");
          const validation = validatePayload(body, response.status, monitor.expectation);
          if (!validation.success) {
            currentStatus = "DOWN";
            errorReason = validation.errorMessage || `HTTP_${response.status}`;
          }
        } else if (!isHealthyStatus) {
          errorReason = `HTTP_${response.status}`;
        }
      } else {
        throw new Error(`Unsupported protocol in URL: ${monitor.url}`);
      }
    }
  } catch (err: any) {
    console.error(`Error checking ${monitor.url}:`, err);
    latency = 0;
    currentStatus = "DOWN";
    errorReason = err.message ? err.message.substring(0, 100) : "UNKNOWN_ERROR";
  }

  try {
    await prisma.$transaction([
      prisma.monitorEvent.create({
        data: {
          monitorId: monitor.id,
          status: currentStatus,
          latency: latency,
          errorReason: errorReason,
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

    // --- INCIDENT & NOTIFICATION LOGIC (Mirrors Worker) ---
    // We do this AFTER the status update so the DB is consistent
    try {
      const incidentService = {
        findActiveIncident: async (monitorId: string) => {
          return prisma.incident.findFirst({
            where: { monitorId, resolvedAt: null },
            orderBy: { createdAt: "desc" },
          });
        },
        createIncident: async (monitorId: string, title: string, description: string) => {
          // Check for flapping (recently resolved)
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
          const recent = await prisma.incident.findFirst({
            where: { monitorId, resolvedAt: { gt: fiveMinutesAgo } },
            orderBy: { resolvedAt: "desc" },
          });

          if (recent) {
            return prisma.incident.update({
              where: { id: recent.id },
              data: {
                status: IncidentStatus.INVESTIGATING,
                resolvedAt: null,
                events: {
                  create: {
                    type: IncidentEventType.STATE_CHANGE,
                    message: `Monitor unstable. Incident re-opened. (Flapping detected)`,
                  },
                },
              },
            });
          }

          return prisma.incident.create({
            data: {
              monitorId,
              title,
              description,
              status: IncidentStatus.INVESTIGATING,
              severity: Severity.HIGH,
              events: {
                create: {
                  type: IncidentEventType.STATE_CHANGE,
                  message: `Incident started: ${title}`,
                },
              },
            },
          });
        },
        resolveIncident: async (incidentId: string) => {
          return prisma.incident.update({
            where: { id: incidentId },
            data: {
              status: IncidentStatus.RESOLVED,
              resolvedAt: new Date(),
              events: {
                create: {
                  type: IncidentEventType.AUTO_RESOLVE,
                  message: "Monitor recovered. Auto-resolving incident.",
                },
              },
            },
          });
        },
        logStillDown: async (incidentId: string) => {
          await prisma.incident.update({
            where: { id: incidentId },
            data: { updatedAt: new Date() },
          });
        },
      };

      if (currentStatus === "DOWN") {
        const activeIncident = await incidentService.findActiveIncident(monitor.id);
        const checkSource = context?.checkRegions || ["Manual Check (Server)"];
        const baseReason = context?.reason || "Manual Check Failed";

        // For manual check, we bypass flapping check for alerts usually, but let's keep it safe
        // Actually, if user clicks "Run Check", they expect an alert if it's down.

        if (!activeIncident) {
          const incident = await incidentService.createIncident(
            monitor.id,
            `Monitor is DOWN: ${monitor.name}`,
            `Reason: ${baseReason}`,
          );

          // Notify
          await dispatchNotifications(monitor, "DOWN", incident.id, baseReason, checkSource);
        } else {
          await incidentService.logStillDown(activeIncident.id);
          // FORCE NOTIFICATION for Manual Check
          // User explicitly clicked "Run Check", so they expect to verify alerts work.
          console.log("[ManualCheck] Forcing alert dispatch for existing incident");
          await dispatchNotifications(
            monitor,
            "DOWN",
            activeIncident.id,
            `Verification: Still Down (${baseReason})`,
            checkSource,
          );
        }
      } else if (currentStatus === "UP") {
        const activeIncident = await incidentService.findActiveIncident(monitor.id);
        if (activeIncident) {
          await incidentService.resolveIncident(activeIncident.id);
          // Notify Resolved
          await dispatchNotifications(monitor, "UP", activeIncident.id);
        }
      }
    } catch (notifError) {
      console.error("Failed to process incidents/notifications in manual check:", notifError);
    }
    // -----------------------------------------------------

    // Broadcast live event to worker
    try {
      const workerUrl = process.env.PULSEGUARD_WORKER_URL || "http://localhost:8787";
      await fetch(`${workerUrl}/api/broadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monitorId: monitor.id,
          event: {
            type: "check_result",
            monitorId: monitor.id,
            status: currentStatus,
            latency: latency,
            region: "global",
            timestamp: Date.now(),
          },
        }),
      }).catch((e) => console.warn("Failed to send broadcast to worker:", e));
    } catch (e) {
      console.warn("Failed to broadcast check event:", e);
    }

    revalidatePath(`/dashboard/monitors/${id}`);
    revalidatePath("/dashboard/monitors");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to save check result", error);
    return { success: false, error: "Failed to save result" };
  }
}

// --- Notification Helpers ---

async function dispatchNotifications(
  monitor: any,
  status: "UP" | "DOWN",
  incidentId?: string,
  reason?: string,
  failedRegions?: string[],
) {
  const matchingRules = monitor.alertRules || [];
  console.log(
    `[Notification] Dispatching for ${monitor.name} (${status}). Found ${matchingRules.length} rules.`,
  );

  if (matchingRules.length === 0) {
    console.log("[Notification] No alert rules found.");
    return;
  }

  // Filter rules
  const activeRules = matchingRules.filter((rule: any) => {
    if (rule.trigger === "STATUS_CHANGE") {
      if (rule.targetStatus) return status === rule.targetStatus;
      return true;
    }
    if (rule.trigger === "LATENCY" && reason?.includes("High Latency")) {
      return true;
    }
    // Default to false for other triggers (LATENCY, SSL) unless handled
    return false;
  });

  console.log(`[Notification] Active rules matching trigger: ${activeRules.length}`);

  if (activeRules.length === 0) return;

  // Channels
  const emailChannels = new Set<string>();
  const slackChannels = new Set<{ url: string; token?: string }>();
  const discordChannels = new Set<{ url: string; token?: string }>();

  if (monitor.user?.email) emailChannels.add(monitor.user.email);

  activeRules.forEach((rule: any) => {
    rule.channels.forEach((channel: any) => {
      const config = channel.config as any;
      if (channel.type === "EMAIL" && config?.email) emailChannels.add(config.email);
      else if (channel.type === "SLACK" && config?.webhookUrl)
        slackChannels.add({ url: config.webhookUrl, token: config.accessToken });
      else if (channel.type === "DISCORD" && config?.webhookUrl)
        discordChannels.add({ url: config.webhookUrl });
    });
  });

  console.log(
    `[Notification] Channels extracted: Email=${emailChannels.size}, Slack=${slackChannels.size}, Discord=${discordChannels.size}`,
  );

  const emailData: MonitorAlertData = {
    monitorId: monitor.id,
    monitorName: monitor.name,
    url: monitor.url,
    status: status,
    previousStatus: status === "UP" ? "DOWN" : "UP",
    timestamp: new Date().toISOString(),
    reason: reason,
    failedRegions: failedRegions,
    runbookUrl: monitor.runbookUrl,
    // downtimeDuration: ... calculation omitted for brevity in manual check
  };

  const notificationType = status === "DOWN" ? "INCIDENT_CREATED" : "INCIDENT_RESOLVED";
  const apiKey = env.RESEND_API_KEY;

  if (!apiKey) console.warn("[Notification] RESEND_API_KEY is missing!");

  const promises = [
    ...Array.from(emailChannels).map((email) => sendMonitorAlert(email, emailData, apiKey)),
    ...Array.from(slackChannels).map((target) =>
      sendSlackAlert(target.url, emailData, notificationType, incidentId),
    ),
    ...Array.from(discordChannels).map((target) =>
      sendDiscordAlert(target.url, emailData, notificationType),
    ),
  ];

  const results = await Promise.allSettled(promises);
  const rejected = results.filter((r) => r.status === "rejected");
  if (rejected.length > 0) {
    console.error(`[Notification] ${rejected.length} alerts failed to send.`);
    rejected.forEach((r) => console.error((r as PromiseRejectedResult).reason));
  } else {
    console.log(`[Notification] All ${results.length} alerts sent successfully.`);
  }
}

// --- Adapters (Mirrored from Worker) ---

async function sendDiscordAlert(url: string, data: MonitorAlertData, type?: string) {
  try {
    const isDown = data.status === "DOWN";
    let color = isDown ? 15548997 : 5763719;
    let title = isDown
      ? "🚨 System Critical: " + data.monitorName + " is DOWN"
      : "✅ System Recovered: " + data.monitorName + " is ONLINE";

    if (type === "INCIDENT_CREATED") title = `🔥 Incident Opened: ${data.monitorName}`;
    if (type === "INCIDENT_RESOLVED") title = `✅ Incident Resolved: ${data.monitorName}`;

    const payload = {
      username: "PulseGuard",
      embeds: [
        {
          title: title,
          description:
            data.reason || (isDown ? "Connection timeout or error" : "Service is reachable"),
          url: data.url,
          color: color,
          fields: [
            { name: "Target", value: data.url, inline: true },
            { name: "Timestamp", value: new Date(data.timestamp).toLocaleString(), inline: true },
            ...(data.failedRegions && data.failedRegions.length > 0
              ? [
                  {
                    name: "Failed Regions",
                    value: data.failedRegions.join(", "),
                    inline: false,
                  },
                ]
              : []),
          ],
          footer: { text: "PulseGuard Sentinel • Monitoring Infrastructure" },
          timestamp: data.timestamp,
        },
      ],
    };

    console.log(`[Discord] Sending to ${url}...`);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Status ${res.status}: ${res.statusText}`);
    console.log(`[Discord] Sent successfully.`);
  } catch (e) {
    console.error(`[Discord] Failed to send alert:`, e);
    throw e;
  }
}

async function sendSlackAlert(
  url: string,
  data: MonitorAlertData,
  type?: string,
  incidentId?: string,
) {
  try {
    const isDown = data.status === "DOWN";
    let headerText = isDown
      ? "🚨 Alert: " + data.monitorName + " Unreachable"
      : "✅ Recovery: " + data.monitorName + " Restored";

    if (type === "INCIDENT_CREATED") headerText = `🔥 Incident: ${data.monitorName} is DOWN`;
    if (type === "INCIDENT_RESOLVED") headerText = `✅ Resolved: ${data.monitorName} Recovered`;

    const payload = {
      text: headerText,
      blocks: [
        { type: "header", text: { type: "plain_text", text: headerText, emoji: true } },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: "*Target:*\n<" + data.url + "|" + data.url + ">" },
            { type: "mrkdwn", text: "*Status:*\n" + data.status },
          ],
        },
        {
          type: "section",
          text: { type: "mrkdwn", text: "*Details:* " + (data.reason || "No detail provided") },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "⏱ Detected at " + new Date(data.timestamp).toLocaleTimeString(),
            },
          ],
        },
        ...(data.failedRegions && data.failedRegions.length > 0
          ? [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: "*Failed Regions:* " + data.failedRegions.join(", "),
                },
              },
            ]
          : []),
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: { type: "plain_text", text: "View Dashboard" },
              url: `${env.NEXT_PUBLIC_APP_URL}/dashboard/monitors/${data.monitorId}`,
              style: isDown ? "danger" : "primary",
            },
          ],
        },
      ],
    };

    console.log(`[Slack] Sending to ${url}...`);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Status ${res.status}: ${res.statusText}`);
    console.log(`[Slack] Sent successfully.`);
  } catch (e) {
    console.error(`[Slack] Failed to send alert:`, e);
    throw e;
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
    revalidatePath("/dashboard/monitors");
    revalidatePath("/dashboard");
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
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [activeMonitorsCount, activeAlertsCount, totalEventsCount, upEventsCount, latencyAgg] =
      await Promise.all([
        // 1. Active Monitors
        prisma.monitor.count({
          where: {
            userId,
            status: { not: "PAUSED" },
          },
        }),
        // 2. Active Alerts (Monitors currently DOWN)
        prisma.monitor.count({
          where: {
            userId,
            status: "DOWN",
          },
        }),
        // 3. Total Events (Last 24h)
        prisma.monitorEvent.count({
          where: {
            monitor: { userId },
            timestamp: { gte: oneDayAgo },
          },
        }),
        // 4. UP Events (Last 24h)
        prisma.monitorEvent.count({
          where: {
            monitor: { userId },
            timestamp: { gte: oneDayAgo },
            status: "UP",
          },
        }),
        // 5. Avg Latency for UP events (Last 24h)
        prisma.monitorEvent.aggregate({
          where: {
            monitor: { userId },
            timestamp: { gte: oneDayAgo },
            status: "UP",
            latency: { gt: 0 },
          },
          _avg: {
            latency: true,
          },
        }),
      ]);

    let globalUptime = 0;
    if (totalEventsCount > 0) {
      globalUptime = (upEventsCount / totalEventsCount) * 100;
    }

    const avgLatency = Math.round(latencyAgg._avg.latency || 0);

    return {
      activeMonitors: activeMonitorsCount,
      globalUptime: Number(globalUptime.toFixed(2)),
      avgLatency,
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

/**
 * Retrieve active (non-dismissed) AI insights for the current user's monitors.
 */
export async function getMonitorInsights(monitorId?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return [];

  try {
    const insights = await prisma.monitorInsight.findMany({
      where: {
        monitor: {
          id: monitorId,
          userId: session.user.id,
        },
        dismissed: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        monitor: {
          select: {
            name: true,
          },
        },
      },
    });
    return insights;
  } catch (error) {
    console.error("Failed to fetch insights", error);
    return [];
  }
}

/**
 * Marks an AI insight as dismissed so it no longer appears on the dashboard.
 */
export async function dismissInsight(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    await prisma.monitorInsight.update({
      where: {
        id,
        monitor: {
          userId: session.user.id,
        },
      },
      data: {
        dismissed: true,
      },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to dismiss insight", error);
    return { success: false, error: "Failed to dismiss insight" };
  }
}

/**
 * Retrieve the current session token to authenticate WebSockets
 */
export async function getSessionToken() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("better-auth.session_token")?.value ||
    cookieStore.get("__Secure-better-auth.session_token")?.value ||
    null;
  return token;
}
