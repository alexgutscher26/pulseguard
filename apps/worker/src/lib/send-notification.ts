import type { ExecutionContext, MessageBatch } from "@cloudflare/workers-types";
import { MonitorStatus, NotificationType } from "../constants";
import type { Env } from "../env";
import type { NotificationMessage } from "../notification-handler";

/** Payload for a notification queued for delivery (email, Slack, Discord, subscribers). */
export type NotificationPayload = NotificationMessage;

/**
 * Queue a notification payload for delivery.
 *
 * Prefers the NOTIFICATION_QUEUE binding. When the queue is unavailable (e.g.
 * local development), falls back to invoking the notification handler directly
 * with a synthetic message batch so alerts are still delivered.
 */
export async function queueNotification(
  env: Env,
  payload: NotificationPayload,
  ctx: ExecutionContext,
): Promise<void> {
  if (env.NOTIFICATION_QUEUE) {
    await env.NOTIFICATION_QUEUE.send(payload);
    return;
  }

  // FALLBACK: Direct notification for local dev (queues don't work in dev)
  console.warn(
    `[Notification] Queue not available - sending notification directly for ${payload.monitorName}`,
  );
  try {
    const { default: notificationHandler } = await import("../notification-handler");
    const batch = {
      queue: "notifications",
      messages: [
        {
          id: `local-${Date.now()}`,
          timestamp: new Date(),
          body: payload,
          ack: () => {},
          retry: () => {},
        },
      ],
      ackAll: () => {},
      retryAll: () => {},
    } as unknown as MessageBatch<NotificationPayload>;
    await notificationHandler.queue(batch, env, ctx);
  } catch (notifError) {
    console.error(`[Notification] Failed to send direct notification:`, notifError);
  }
}
