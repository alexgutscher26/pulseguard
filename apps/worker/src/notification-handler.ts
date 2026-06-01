import { getPrisma } from "@pulseguard/db";
import type { ExecutionContext, MessageBatch } from "@cloudflare/workers-types";
import {
  sendMonitorAlert,
  sendStatusUpdate,
  type MonitorAlertData,
  type StatusUpdateData,
} from "@pulseguard/email";

export interface Env {
  CHECK_QUEUE: Queue<any>;
  NOTIFICATION_QUEUE: Queue<any>;
  DATABASE_URL: string;
  RESEND_API_KEY: string;
}

interface NotificationMessage {
  type?: "INCIDENT_CREATED" | "INCIDENT_RESOLVED" | "HIGH_LATENCY" | "SSL_EXPIRY";
  incidentId?: string;
  monitorId: string;
  monitorName: string;
  url: string;
  status: "UP" | "DOWN";
  latency?: number;
  previousStatus?: "UP" | "DOWN";
  timestamp: string;
  reason?: string;
  failedRegions?: string[];
  runbookUrl?: string;
  daysRemaining?: number;
}

export default {
  // Notification Queue Consumer
  async queue(batch: MessageBatch<NotificationMessage>, env: Env, _ctx: ExecutionContext) {
    const prisma = getPrisma(env.DATABASE_URL);

    console.log(`[Notification] Processing ${batch.messages.length} notification(s)...`);

    const monitorIds = Array.from(new Set(batch.messages.map((msg) => msg.body.monitorId)));

    // Fetch all monitors in one query
    const monitors = await prisma.monitor.findMany({
      where: { id: { in: monitorIds } },
      include: {
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

    const monitorMap = new Map(monitors.map((m) => [m.id, m]));

    // --- Pre-fetch STATUS PAGE SUBSCRIBER ALERTS ---
    const incidentMonitorIds = Array.from(
      new Set(
        batch.messages
          .filter(
            (msg) => msg.body.type === "INCIDENT_CREATED" || msg.body.type === "INCIDENT_RESOLVED",
          )
          .map((msg) => msg.body.monitorId),
      ),
    );

    let allStatusPages: any[] = [];
    if (incidentMonitorIds.length > 0) {
      allStatusPages = await prisma.statusPage.findMany({
        where: { monitors: { some: { monitorId: { in: incidentMonitorIds } } } },
        include: {
          monitors: true,
          subscribers: {
            where: { verified: true },
            include: { monitorSubscriptions: true },
          },
        },
      });
    }

    const statusPageMap = new Map<string, any[]>();
    for (const page of allStatusPages) {
      for (const sm of page.monitors) {
        if (!statusPageMap.has(sm.monitorId)) {
          statusPageMap.set(sm.monitorId, []);
        }
        statusPageMap.get(sm.monitorId)!.push(page);
      }
    }

    await Promise.all(
      batch.messages.map(async (msg) => {
        const notification = msg.body;

        try {
          // Fetch alert rules for this monitor
          const monitor = monitorMap.get(notification.monitorId);

          if (!monitor) {
            console.error(`[Notification] Monitor ${notification.monitorId} not found`);
            msg.ack();
            return;
          }

          // Check if any alert rules match this notification
          const matchingRules = monitor.alertRules.filter((rule: any) => {
            // 1. Explicit LATENCY trigger
            if (rule.trigger === "LATENCY" && notification.type === "HIGH_LATENCY") {
              if (rule.threshold && notification.latency) {
                if (rule.comparison === "GT") return notification.latency > rule.threshold;
                if (rule.comparison === "LT") return notification.latency < rule.threshold;
              }
              return true; // Match if no specific threshold set in rule
            }

            // 2. STATUS_CHANGE trigger
            if (rule.trigger === "STATUS_CHANGE") {
              // If High Latency or SSL Expiry, only alert if rule is "Any Status Change" (no specific target)
              if (notification.type === "HIGH_LATENCY" || notification.type === "SSL_EXPIRY") {
                return !rule.targetStatus;
              }

              // Normal UP/DOWN logic
              if (rule.targetStatus) {
                return notification.status === rule.targetStatus;
              }
              return true; // Any status change matches (UP->DOWN, DOWN->UP)
            }

            // 3. SSL_EXPIRY trigger
            if (rule.trigger === "SSL_EXPIRY" && notification.type === "SSL_EXPIRY") {
              if (rule.threshold && notification.daysRemaining !== undefined) {
                if (rule.comparison === "LT" || !rule.comparison) {
                  return notification.daysRemaining <= rule.threshold;
                }
                if (rule.comparison === "GT") {
                  return notification.daysRemaining > rule.threshold;
                }
              }
              return true;
            }

            return false;
          });

          const deliveryPromises: Promise<any>[] = [];

          // Monitor Alert Data (Owner/Team)
          let downtimeDuration: string | undefined;
          if (notification.status === "UP") {
            const lastDownEvent = await prisma.monitorEvent.findFirst({
              where: {
                monitorId: notification.monitorId,
                status: "DOWN",
                timestamp: { lt: new Date(notification.timestamp) },
              },
              orderBy: { timestamp: "desc" },
            });

            if (lastDownEvent) {
              const downtime =
                new Date(notification.timestamp).getTime() - lastDownEvent.timestamp.getTime();
              const minutes = Math.floor(downtime / 60000);
              const seconds = Math.floor((downtime % 60000) / 1000);
              downtimeDuration = `${minutes}m ${seconds}s`;
            }
          }

          const emailData: MonitorAlertData = {
            monitorId: notification.monitorId,
            monitorName: notification.monitorName,
            url: notification.url,
            status: notification.status,
            previousStatus:
              notification.previousStatus || (notification.status === "UP" ? "DOWN" : "UP"),
            timestamp: notification.timestamp,
            reason: notification.reason,
            downtimeDuration,
            failedRegions: notification.failedRegions,
            runbookUrl: notification.runbookUrl || monitor?.runbookUrl || undefined,
          };

          // --- 1. OWNER ALERTS (Email, Slack, Discord) ---
          if (matchingRules.length > 0) {
            const emailChannels = new Set<string>();
            const slackChannels = new Set<{ url: string; token?: string }>();
            const discordChannels = new Set<{ url: string; token?: string }>();

            if (monitor.user.email) {
              emailChannels.add(monitor.user.email);
            }

            matchingRules.forEach((rule: any) => {
              rule.channels.forEach((channel: any) => {
                const config = channel.config as any;

                if (channel.type === "EMAIL" && config?.email) {
                  emailChannels.add(config.email);
                } else if (channel.type === "SLACK" && config?.webhookUrl) {
                  slackChannels.add({ url: config.webhookUrl, token: config.accessToken });
                } else if (channel.type === "DISCORD" && config?.webhookUrl) {
                  discordChannels.add({ url: config.webhookUrl });
                }
              });
            });

            Array.from(emailChannels).forEach((email) => {
              deliveryPromises.push(sendMonitorAlert(email, emailData, env.RESEND_API_KEY));
            });
            Array.from(slackChannels).forEach((target) => {
              deliveryPromises.push(
                sendSlackAlert(target.url, emailData, notification.type, notification.incidentId),
              );
            });
            Array.from(discordChannels).forEach((target) => {
              deliveryPromises.push(sendDiscordAlert(target.url, emailData, notification.type));
            });
          } else {
            console.log(`[Notification] No matching alert rules for ${notification.monitorName}`);
          }

          // --- 2. STATUS PAGE SUBSCRIBER ALERTS ---
          // Only send if it's an incident-related event (not just high latency, unless we want to)
          if (
            notification.type === "INCIDENT_CREATED" ||
            notification.type === "INCIDENT_RESOLVED"
          ) {
            const statusPages = statusPageMap.get(notification.monitorId) || [];

            for (const page of statusPages) {
              const mappedStatus =
                notification.type === "INCIDENT_CREATED" ? "INVESTIGATING" : "RESOLVED";

              const incidentTitle =
                notification.reason ||
                (notification.type === "INCIDENT_CREATED"
                  ? `${notification.monitorName} is experiencing issues`
                  : `${notification.monitorName} has recovered`);

              // Filter subscribers
              const subscribersToNotify = page.subscribers.filter((sub: any) => {
                // Check preferences
                if (notification.type === "INCIDENT_CREATED" && !sub.notifyIncidents) return false;
                if (notification.type === "INCIDENT_RESOLVED" && !sub.notifyIncidents) return false;

                // Check monitor subscription
                const isSubscribedToMonitor = sub.monitorSubscriptions.some(
                  (ms: any) => ms.monitorId === notification.monitorId,
                );
                return isSubscribedToMonitor;
              });

              // Send emails
              subscribersToNotify.forEach((sub: any) => {
                const updateData: StatusUpdateData = {
                  pageTitle: page.title,
                  incidentTitle: incidentTitle,
                  incidentStatus: mappedStatus,
                  description:
                    notification.type === "INCIDENT_CREATED"
                      ? `We are investigating reports of issues with ${notification.monitorName}.`
                      : `The issue with ${notification.monitorName} has been resolved.`,
                  affectedMonitors: [notification.monitorName],
                  manageUrl: `https://pulseguard.com/subscribe/manage/${sub.manageToken}`,
                  pageUrl: `https://pulseguard.com/status-page/${page.slug}`,
                };

                deliveryPromises.push(sendStatusUpdate(sub.email, updateData, env.RESEND_API_KEY));
              });

              if (subscribersToNotify.length > 0) {
                console.log(
                  `[Notification] Queueing updates for ${subscribersToNotify.length} subscribers of ${page.title}`,
                );
              }
            }
          }

          const results = await Promise.allSettled(deliveryPromises);

          const successful = results.filter((r) => r.status === "fulfilled").length;
          const failed = results.filter((r) => r.status === "rejected").length;

          console.log(
            `[Notification] Processed ${successful} deliveries for ${notification.monitorName} (${failed} failed)`,
          );

          msg.ack();
        } catch (error) {
          console.error(`[Notification] Error processing notification:`, error);
          msg.retry();
        }
      }),
    );
  },
};

// --- Discord Adapter ---
async function sendDiscordAlert(url: string, data: MonitorAlertData, type?: string) {
  const isDown = data.status === "DOWN";
  let color = isDown ? 15548997 : 5763719; // #ED4245 (Red) or #57F287 (Green)

  let title = isDown
    ? "🚨 System Critical: " + data.monitorName + " is DOWN"
    : "✅ System Recovered: " + data.monitorName + " is ONLINE";

  if (type === "INCIDENT_CREATED") title = `🔥 Incident Opened: ${data.monitorName}`;
  if (type === "INCIDENT_RESOLVED") title = `✅ Incident Resolved: ${data.monitorName}`;
  if (type === "HIGH_LATENCY") {
    title = `⚠️ High Latency: ${data.monitorName}`;
    color = 16753920; // #FFA500 (Orange)
  }
  if (type === "SSL_EXPIRY") {
    title = `⚠️ SSL Expiry Warning: ${data.monitorName}`;
    color = 16753920; // #FFA500 (Orange)
  }

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
          {
            name: "Target",
            value: data.url,
            inline: true,
          },
          {
            name: "Timestamp",
            value: new Date(data.timestamp).toLocaleString(),
            inline: true,
          },
          ...(data.downtimeDuration
            ? [
                {
                  name: "Downtime Duration",
                  value: data.downtimeDuration,
                  inline: true,
                },
              ]
            : []),
          ...(data.failedRegions && data.failedRegions.length > 0
            ? [
                {
                  name: "Failed Regions",
                  value: data.failedRegions.join(", "),
                  inline: false,
                },
              ]
            : []),
          ...(data.runbookUrl
            ? [
                {
                  name: "Remediation Runbook",
                  value: `[View Runbook](${data.runbookUrl})`,
                  inline: false,
                },
              ]
            : []),
        ],
        footer: {
          text: "PulseGuard Sentinel • Monitoring Infrastructure",
        },
        timestamp: data.timestamp,
      },
    ],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // Consume body
  // Consume body
  await res.text();

  if (!res.ok) {
    throw new Error("Discord Webhook failed: " + res.status + " " + res.statusText);
  }
}

// --- Slack Adapter ---
/**
 * Sends an alert to a Slack channel based on the monitor's status.
 *
 * The function constructs a message payload that varies depending on the monitor's status and the type of alert.
 * It handles different alert types such as incident creation, resolution, and high latency, and includes relevant details
 * such as target URL, status, downtime duration, and failed regions. Finally, it sends the payload to the specified Slack
 * webhook URL and checks for a successful response.
 *
 * @param url - The Slack webhook URL to send the alert to.
 * @param data - The data containing monitor alert information.
 * @param type - Optional type of alert (e.g., "INCIDENT_CREATED", "INCIDENT_RESOLVED", "HIGH_LATENCY").
 * @param incidentId - Optional identifier for the incident, used for acknowledgment and resolution buttons.
 * @throws Error If the Slack webhook request fails.
 */
async function sendSlackAlert(
  url: string,
  data: MonitorAlertData,
  type?: string,
  incidentId?: string,
) {
  const isDown = data.status === "DOWN";

  let headerText = isDown
    ? "🚨 Alert: " + data.monitorName + " Unreachable"
    : "✅ Recovery: " + data.monitorName + " Restored";

  if (type === "INCIDENT_CREATED") headerText = `🔥 Incident: ${data.monitorName} is DOWN`;
  if (type === "INCIDENT_RESOLVED") headerText = `✅ Resolved: ${data.monitorName} Recovered`;
  if (type === "HIGH_LATENCY") headerText = `⚠️ High Latency: ${data.monitorName}`;
  if (type === "SSL_EXPIRY") headerText = `⚠️ SSL Expiry Warning: ${data.monitorName}`;

  const payload = {
    text: headerText,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: headerText,
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*Target:*\n<" + data.url + "|" + data.url + ">",
          },
          {
            type: "mrkdwn",
            text: "*Status:*\n" + data.status,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Details:* " + (data.reason || "No detail provided"),
        },
      },
      ...(data.downtimeDuration
        ? [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "*Downtime:* " + data.downtimeDuration,
              },
            },
          ]
        : []),
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
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "⏱ Detected at " + new Date(data.timestamp).toLocaleTimeString(),
          },
        ],
      },
      ...(data.runbookUrl
        ? [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "*Remediation Runbook:* <" + data.runbookUrl + "|View Runbook>",
              },
            },
          ]
        : []),
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "View Dashboard",
            },
            url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/monitors/` + data.monitorId,
            style: isDown ? "danger" : "primary",
          },
          ...(incidentId && type === "INCIDENT_CREATED"
            ? [
                {
                  type: "button",
                  text: {
                    type: "plain_text",
                    text: "Acknowledge",
                  },
                  action_id: "acknowledge_incident",
                  value: incidentId,
                },
                {
                  type: "button",
                  text: {
                    type: "plain_text",
                    text: "Resolve",
                  },
                  action_id: "resolve_incident",
                  value: incidentId,
                  style: "danger",
                },
              ]
            : []),
        ],
      },
    ],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // Consume body
  await res.text();

  if (!res.ok) {
    throw new Error("Slack Webhook failed: " + res.status + " " + res.statusText);
  }
}
