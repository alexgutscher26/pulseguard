import { getPrisma } from "@pulseguard/db";
import { sendMonitorAlert, type MonitorAlertData } from "@pulseguard/email";

export interface Env {
  CHECK_QUEUE: Queue<any>;
  NOTIFICATION_QUEUE: Queue<any>;
  DATABASE_URL: string;
  RESEND_API_KEY: string;
}

interface NotificationMessage {
  type?: "INCIDENT_CREATED" | "INCIDENT_RESOLVED" | "HIGH_LATENCY";
  incidentId?: string;
  monitorId: string;
  monitorName: string;
  url: string;
  status: "UP" | "DOWN";
  latency?: number;
  previousStatus?: "UP" | "DOWN";
  timestamp: string;
  reason?: string;
}

export default {
  // Notification Queue Consumer
  async queue(batch: MessageBatch<NotificationMessage>, env: Env, _ctx: ExecutionContext) {
    const prisma = getPrisma(env.DATABASE_URL);

    console.log(`[Notification] Processing ${batch.messages.length} notification(s)...`);

    await Promise.all(
      batch.messages.map(async (msg) => {
        const notification = msg.body;

        try {
          // Fetch alert rules for this monitor
          const monitor = await prisma.monitor.findUnique({
            where: { id: notification.monitorId },
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
              // If High Latency, only alert if rule is "Any Status Change" (no specific target)
              if (notification.type === "HIGH_LATENCY") {
                  return !rule.targetStatus;
              }

              // Normal UP/DOWN logic
              if (rule.targetStatus) {
                return notification.status === rule.targetStatus;
              }
              return true; // Any status change matches (UP->DOWN, DOWN->UP)
            }

            return false;
          });

          if (matchingRules.length === 0) {
            console.log(`[Notification] No matching alert rules for ${notification.monitorName}`);
            msg.ack();
            return;
          }

          // Calculate downtime duration if status is UP
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
              const downtime = new Date(notification.timestamp).getTime() - lastDownEvent.timestamp.getTime();
              const minutes = Math.floor(downtime / 60000);
              const seconds = Math.floor((downtime % 60000) / 1000);
              downtimeDuration = `${minutes}m ${seconds}s`;
            }
          }

          // Group channels by type
          const emailChannels = new Set<string>();
          const slackChannels = new Set<{ url: string; token?: string }>();
          const discordChannels = new Set<{ url: string; token?: string }>();

          // Add user's email as fallback
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

          const deliveryPromises: Promise<any>[] = [];

          const emailData: MonitorAlertData = {
            monitorId: notification.monitorId,
            monitorName: notification.monitorName,
            url: notification.url,
            status: notification.status,
            previousStatus: notification.previousStatus || (notification.status === "UP" ? "DOWN" : "UP"),
            timestamp: notification.timestamp,
            reason: notification.reason,
            downtimeDuration,
          };

          // 1. Send Emails
          Array.from(emailChannels).forEach((email) => {
            deliveryPromises.push(sendMonitorAlert(email, emailData, env.RESEND_API_KEY));
          });

          // 2. Send Slack Alerts
          Array.from(slackChannels).forEach((target) => {
            deliveryPromises.push(sendSlackAlert(target.url, emailData, notification.type, notification.incidentId));
          });
          
          // 3. Send Discord Alerts
          Array.from(discordChannels).forEach((target) => {
            deliveryPromises.push(sendDiscordAlert(target.url, emailData, notification.type));
          });

          const results = await Promise.allSettled(deliveryPromises);

          const successful = results.filter((r) => r.status === "fulfilled").length;
          const failed = results.filter((r) => r.status === "rejected").length;

          console.log(
            `[Notification] Sent ${successful} alerts for ${notification.monitorName} (${failed} failed)`
          );

          msg.ack();
        } catch (error) {
          console.error(`[Notification] Error processing notification:`, error);
          msg.retry();
        }
      })
    );
  },
};

// --- Discord Adapter ---
async function sendDiscordAlert(url: string, data: MonitorAlertData, type?: string) {
  const isDown = data.status === 'DOWN';
  let color = isDown ? 15548997 : 5763719; // #ED4245 (Red) or #57F287 (Green)

  let title = isDown
    ? '🚨 System Critical: ' + data.monitorName + ' is DOWN'
    : '✅ System Recovered: ' + data.monitorName + ' is ONLINE';

   if (type === "INCIDENT_CREATED") title = `🔥 Incident Opened: ${data.monitorName}`;
   if (type === "INCIDENT_RESOLVED") title = `✅ Incident Resolved: ${data.monitorName}`;
   if (type === "HIGH_LATENCY") {
       title = `⚠️ High Latency: ${data.monitorName}`;
       color = 16753920; // #FFA500 (Orange)
   }

  const payload = {
    username: 'PulseGuard',
    embeds: [
      {
        title: title,
        description: data.reason || (isDown ? 'Connection timeout or error' : 'Service is reachable'),
        url: data.url,
        color: color,
        fields: [
          {
            name: 'Target',
            value: data.url,
            inline: true
          },
          {
            name: 'Timestamp',
            value: new Date(data.timestamp).toLocaleString(),
            inline: true
          },
          ...(data.downtimeDuration ? [
            {
              name: 'Downtime Duration',
              value: data.downtimeDuration,
              inline: true
            }
          ] : [])
        ],
        footer: {
          text: 'PulseGuard Sentinel • Monitoring Infrastructure'
        },
        timestamp: data.timestamp
      }
    ]
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error('Discord Webhook failed: ' + res.status + ' ' + res.statusText);
  }
}

// --- Slack Adapter ---
async function sendSlackAlert(url: string, data: MonitorAlertData, type?: string, incidentId?: string) {
  const isDown = data.status === 'DOWN';
  
  let headerText = isDown 
            ? '🚨 Alert: ' + data.monitorName + ' Unreachable' 
            : '✅ Recovery: ' + data.monitorName + ' Restored';

   if (type === "INCIDENT_CREATED") headerText = `🔥 Incident: ${data.monitorName} is DOWN`;
   if (type === "INCIDENT_RESOLVED") headerText = `✅ Resolved: ${data.monitorName} Recovered`;
   if (type === "HIGH_LATENCY") headerText = `⚠️ High Latency: ${data.monitorName}`;

  const payload = {
    text: headerText,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: headerText,
          emoji: true
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: '*Target:*\n<' + data.url + '|' + data.url + '>'
          },
          {
            type: 'mrkdwn',
            text: '*Status:*\n' + data.status
          }
        ]
      },
      {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: '*Details:* ' + (data.reason || 'No detail provided')
        }
      },
      ...(data.downtimeDuration ? [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: '*Downtime:* ' + data.downtimeDuration
            }
        }
      ] : []),
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: '⏱ Detected at ' + new Date(data.timestamp).toLocaleTimeString()
          }
        ]
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View Dashboard'
            },
            url: 'https://rich-truck.outray.app/dashboard/monitors/' + data.monitorId,
            style: isDown ? 'danger' : 'primary'
          },
          ...(incidentId && type === "INCIDENT_CREATED" ? [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Acknowledge'
                },
                action_id: 'acknowledge_incident',
                value: incidentId,
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Resolve'
                },
                action_id: 'resolve_incident',
                value: incidentId,
                style: 'danger'
              }
          ] : [])
        ]
      }
    ]
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error('Slack Webhook failed: ' + res.status + ' ' + res.statusText);
  }
}
