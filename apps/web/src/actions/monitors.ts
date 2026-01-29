"use server";

import prisma from "@pulseguard/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { sendMonitorAlert, type MonitorAlertData } from "@pulseguard/email";

// Helper Types for Incident Management
enum IncidentEventType {
  STATE_CHANGE = "STATE_CHANGE",
  ALERT_SENT = "ALERT_SENT",
  COMMENT = "COMMENT",
  AUTO_RESOLVE = "AUTO_RESOLVE"
}

enum IncidentStatus {
  INVESTIGATING = "INVESTIGATING",
  IDENTIFIED = "IDENTIFIED",
  MONITORING = "MONITORING",
  RESOLVED = "RESOLVED"
}

enum Severity {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW"
}

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
  // Multi-region support
  checkRegions: z.string().optional(), // JSON stringified array of region codes
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

/**
 * Create a monitor based on the provided form data and previous state.
 *
 * This function retrieves the current user session, validates the input data against a schema, and creates a monitor in the database.
 * If the monitor type is PING or PORT, it formats the URL accordingly. Additionally, it attempts to create a default alert rule
 * if the user has notification channels. The function handles errors gracefully, ensuring that monitor creation is not affected
 * by alert rule creation failures.
 *
 * @param prevState - The previous state of the application, used for context.
 * @param formData - The form data containing monitor details such as name, URL, type, interval, timeout, port, and check regions.
 * @returns An object indicating the success of the operation and any associated error message.
 * @throws Error If there is a critical error during the monitor creation process.
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
      type: (formData.get("type") as "HTTP" | "PING" | "PORT") || "HTTP",
      interval: Number(formData.get("interval") || 60),
      timeout: Number(formData.get("timeout") || 10),
      port: formData.get("port") ? Number(formData.get("port")) : undefined,
      checkRegions: (formData.get("checkRegions") as string) || undefined,
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
    type: (formData.get("type") as "HTTP" | "PING" | "PORT") || "HTTP",
    interval: Number(formData.get("interval") || 60),
    timeout: Number(formData.get("timeout") || 10),
    port: formData.get("port") ? Number(formData.get("port")) : undefined,
    checkRegions: (formData.get("checkRegions") as string) || undefined,
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
        checkRegions: data.checkRegions,
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
    console.error("Failed to fetch monitor", error);
    return null;
  }
}

/**
 * Check the status of a monitor and handle incidents accordingly.
 *
 * This function retrieves the session and monitor details, checks for active maintenance windows,
 * and performs a status check on the monitor's URL. It logs the status and latency, updates the monitor's
 * status in the database, and manages incident creation or resolution based on the monitor's state.
 * Notifications are dispatched for incidents as necessary.
 *
 * @param id - The unique identifier of the monitor to check.
 * @returns An object indicating the success of the operation and any error messages.
 * @throws Error If there is a failure in saving the check result or processing incidents/notifications.
 */
export async function checkMonitor(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return { success: false, error: "Unauthorized" };

  /* Updated to include maintenance check */
  const monitor = await prisma.monitor.findUnique({
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

  try {
    const response = await fetch(monitor.url, {
      method: "GET",
      headers: {
        "User-Agent": "PulseGuard-Monitor/1.0",
        Accept: "*/*",
      },
      signal: AbortSignal.timeout((monitor.timeout || 10) * 1000),
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
             orderBy: { resolvedAt: "desc" }
           });
           
           if (recent) {
              return prisma.incident.update({
                where: { id: recent.id },
                data: {
                  status: IncidentStatus.INVESTIGATING,
                  resolvedAt: null,
                  events: { create: { type: IncidentEventType.STATE_CHANGE, message: `Monitor unstable. Incident re-opened. (Flapping detected)` } }
                }
              });
           }

           return prisma.incident.create({
             data: {
               monitorId,
               title,
               description,
               status: IncidentStatus.INVESTIGATING,
               severity: Severity.HIGH,
               events: { create: { type: IncidentEventType.STATE_CHANGE, message: `Incident started: ${title}` } },
             },
           });
         },
         resolveIncident: async (incidentId: string) => {
           return prisma.incident.update({
             where: { id: incidentId },
             data: {
               status: IncidentStatus.RESOLVED,
               resolvedAt: new Date(),
               events: { create: { type: IncidentEventType.AUTO_RESOLVE, message: "Monitor recovered. Auto-resolving incident." } },
             },
           });
         },
         logStillDown: async (incidentId: string) => {
           await prisma.incident.update({ where: { id: incidentId }, data: { updatedAt: new Date() } });
         }
       };

       if (currentStatus === "DOWN") {
         const activeIncident = await incidentService.findActiveIncident(monitor.id);
         // For manual check, we bypass flapping check for alerts usually, but let's keep it safe
         // Actually, if user clicks "Run Check", they expect an alert if it's down.
         
         if (!activeIncident) {
            const errorReason = "Manual Check Failed"; // Simplify for manual check
            const incident = await incidentService.createIncident(monitor.id, `Monitor is DOWN: ${monitor.name}`, `Reason: ${errorReason}`);
            
            // Notify
            await dispatchNotifications(monitor, "DOWN", incident.id, errorReason);
         } else {
            await incidentService.logStillDown(activeIncident.id);
             // FORCE NOTIFICATION for Manual Check
             // User explicitly clicked "Run Check", so they expect to verify alerts work.
             console.log("[ManualCheck] Forcing alert dispatch for existing incident");
             await dispatchNotifications(monitor, "DOWN", activeIncident.id, "Manual Verification: Still Down");
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

async function dispatchNotifications(monitor: any, status: "UP" | "DOWN", incidentId?: string, reason?: string) {
    const matchingRules = monitor.alertRules || [];
    console.log(`[Notification] Dispatching for ${monitor.name} (${status}). Found ${matchingRules.length} rules.`);
    
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
            else if (channel.type === "SLACK" && config?.webhookUrl) slackChannels.add({ url: config.webhookUrl, token: config.accessToken });
            else if (channel.type === "DISCORD" && config?.webhookUrl) discordChannels.add({ url: config.webhookUrl });
        });
    });

    console.log(`[Notification] Channels extracted: Email=${emailChannels.size}, Slack=${slackChannels.size}, Discord=${discordChannels.size}`);

    const emailData: MonitorAlertData = {
        monitorId: monitor.id,
        monitorName: monitor.name,
        url: monitor.url,
        status: status,
        previousStatus: status === "UP" ? "DOWN" : "UP",
        timestamp: new Date().toISOString(),
        reason: reason,
        // downtimeDuration: ... calculation omitted for brevity in manual check
    };
    
    const notificationType = status === "DOWN" ? "INCIDENT_CREATED" : "INCIDENT_RESOLVED";
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) console.warn("[Notification] RESEND_API_KEY is missing!");

    const promises = [
        ...Array.from(emailChannels).map(email => sendMonitorAlert(email, emailData, apiKey)),
        ...Array.from(slackChannels).map(target => sendSlackAlert(target.url, emailData, notificationType, incidentId)),
        ...Array.from(discordChannels).map(target => sendDiscordAlert(target.url, emailData, notificationType))
    ];

    const results = await Promise.allSettled(promises);
    const rejected = results.filter(r => r.status === "rejected");
    if (rejected.length > 0) {
        console.error(`[Notification] ${rejected.length} alerts failed to send.`);
        rejected.forEach(r => console.error((r as PromiseRejectedResult).reason));
    } else {
        console.log(`[Notification] All ${results.length} alerts sent successfully.`);
    }
}

// --- Adapters (Mirrored from Worker) ---

/**
 * Sends an alert to a Discord channel based on the status of a monitored system.
 *
 * The function constructs a payload containing the alert details, including the system's status, reason for the alert, and relevant timestamps. It then sends this payload to the specified Discord webhook URL using a POST request. If the request fails, an error is thrown for further handling.
 *
 * @param url - The Discord webhook URL to send the alert to.
 * @param data - The data containing the monitor alert information.
 * @param type - An optional string indicating the type of incident (e.g., "INCIDENT_CREATED" or "INCIDENT_RESOLVED").
 * @throws Error If the fetch request fails or the response is not ok.
 */
async function sendDiscordAlert(url: string, data: MonitorAlertData, type?: string) {
  try {
      const isDown = data.status === 'DOWN';
      let color = isDown ? 15548997 : 5763719; 
      let title = isDown ? '🚨 System Critical: ' + data.monitorName + ' is DOWN' : '✅ System Recovered: ' + data.monitorName + ' is ONLINE';

       if (type === "INCIDENT_CREATED") title = `🔥 Incident Opened: ${data.monitorName}`;
       if (type === "INCIDENT_RESOLVED") title = `✅ Incident Resolved: ${data.monitorName}`;

      const payload = {
        username: 'PulseGuard',
        embeds: [{
            title: title,
            description: data.reason || (isDown ? 'Connection timeout or error' : 'Service is reachable'),
            url: data.url,
            color: color,
            fields: [
              { name: 'Target', value: data.url, inline: true },
              { name: 'Timestamp', value: new Date(data.timestamp).toLocaleString(), inline: true },
            ],
            footer: { text: 'PulseGuard Sentinel • Monitoring Infrastructure' },
            timestamp: data.timestamp
          }]
      };

      console.log(`[Discord] Sending to ${url}...`);
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(`Status ${res.status}: ${res.statusText}`);
      console.log(`[Discord] Sent successfully.`);
  } catch (e) {
      console.error(`[Discord] Failed to send alert:`, e);
      throw e;
  }
}

/**
 * Sends an alert to a Slack channel based on the monitor's status.
 *
 * The function constructs a message payload depending on the status of the monitor and the type of alert.
 * It handles different alert types such as incident creation and resolution, and sends the payload to the specified Slack URL.
 * If the fetch request fails, it logs the error and rethrows the exception.
 *
 * @param url - The Slack webhook URL to send the alert to.
 * @param data - The data containing monitor alert information.
 * @param type - Optional type of the alert (e.g., "INCIDENT_CREATED", "INCIDENT_RESOLVED").
 * @param incidentId - Optional identifier for the incident.
 * @throws Error If the fetch request fails or the response is not ok.
 */
async function sendSlackAlert(url: string, data: MonitorAlertData, type?: string, incidentId?: string) {
  try {
      const isDown = data.status === 'DOWN';
      let headerText = isDown ? '🚨 Alert: ' + data.monitorName + ' Unreachable' : '✅ Recovery: ' + data.monitorName + ' Restored';

       if (type === "INCIDENT_CREATED") headerText = `🔥 Incident: ${data.monitorName} is DOWN`;
       if (type === "INCIDENT_RESOLVED") headerText = `✅ Resolved: ${data.monitorName} Recovered`;

      const payload = {
        text: headerText,
        blocks: [
          { type: 'header', text: { type: 'plain_text', text: headerText, emoji: true } },
          { type: 'section', fields: [
              { type: 'mrkdwn', text: '*Target:*\n<' + data.url + '|' + data.url + '>' },
              { type: 'mrkdwn', text: '*Status:*\n' + data.status }
            ]},
          { type: 'section', text: { type: 'mrkdwn', text: '*Details:* ' + (data.reason || 'No detail provided') } },
          { type: 'context', elements: [{ type: 'mrkdwn', text: '⏱ Detected at ' + new Date(data.timestamp).toLocaleTimeString() }] },
          { type: 'actions', elements: [
              { type: 'button', text: { type: 'plain_text', text: 'View Dashboard' }, url: 'https://pulseguard.com/dashboard/monitors/' + data.monitorId, style: isDown ? 'danger' : 'primary' }
          ]}
        ]
      };

      console.log(`[Slack] Sending to ${url}...`);
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(`Status ${res.status}: ${res.statusText}`);
      console.log(`[Slack] Sent successfully.`);
  } catch (e) {
      console.error(`[Slack] Failed to send alert:`, e);
      throw e;
  }
}

/**
 * Toggle the status of a monitor based on the provided ID and enabled state.
 *
 * This function retrieves the current user session and checks for authorization. If authorized, it updates the monitor's status to either "UP" or "PAUSED" based on the enabled parameter. It also triggers revalidation of relevant paths to ensure the dashboard reflects the latest state. In case of an error during the update, it logs the error and returns a failure response.
 *
 * @param id - The unique identifier of the monitor to be toggled.
 * @param enabled - A boolean indicating whether to set the monitor status to "UP" (true) or "PAUSED" (false).
 * @returns An object indicating the success of the operation and any error message if applicable.
 */
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
