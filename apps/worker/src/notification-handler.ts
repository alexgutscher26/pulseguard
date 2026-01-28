import { getPrisma } from "@pulseguard/db";
import { sendMonitorAlert, type MonitorAlertData } from "@pulseguard/email";

export interface Env {
  CHECK_QUEUE: Queue<any>;
  NOTIFICATION_QUEUE: Queue<any>;
  DATABASE_URL: string;
  RESEND_API_KEY: string;
}

interface NotificationMessage {
  monitorId: string;
  monitorName: string;
  url: string;
  status: "UP" | "DOWN";
  previousStatus: "UP" | "DOWN";
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
                  channels: {
                    where: { type: "EMAIL" },
                  },
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
            // STATUS_CHANGE trigger
            if (rule.trigger === "STATUS_CHANGE") {
              if (rule.targetStatus) {
                return notification.status === rule.targetStatus;
              }
              return true; // Any status change
            }
            return false;
          });

          if (matchingRules.length === 0) {
            console.log(`[Notification] No matching alert rules for ${notification.monitorName}`);
            msg.ack();
            return;
          }

          // Collect all email channels from matching rules
          const emailChannels = new Set<string>();
          matchingRules.forEach((rule: any) => {
            rule.channels.forEach((channel: any) => {
              if (channel.config && typeof channel.config === "object") {
                const config = channel.config as { email?: string };
                if (config.email) {
                  emailChannels.add(config.email);
                }
              }
            });
          });

          // Add user's email as fallback
          if (monitor.user.email) {
            emailChannels.add(monitor.user.email);
          }

          if (emailChannels.size === 0) {
            console.warn(`[Notification] No email channels configured for ${notification.monitorName}`);
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

          // Send email to all channels
          const emailData: MonitorAlertData = {
            monitorId: notification.monitorId,
            monitorName: notification.monitorName,
            url: notification.url,
            status: notification.status,
            previousStatus: notification.previousStatus,
            timestamp: notification.timestamp,
            reason: notification.reason,
            downtimeDuration,
          };

          const results = await Promise.allSettled(
            Array.from(emailChannels).map((email) =>
              sendMonitorAlert(email, emailData, env.RESEND_API_KEY)
            )
          );

          const successful = results.filter((r) => r.status === "fulfilled").length;
          const failed = results.filter((r) => r.status === "rejected").length;

          console.log(
            `[Notification] Sent ${successful} email(s) for ${notification.monitorName} (${failed} failed)`
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
