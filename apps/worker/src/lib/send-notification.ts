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

  // FALLBACK: Direct notification for local dev or missing queue binding
  console.warn(
    `[Notification] Queue not available - sending notification directly for ${payload.monitorName}`,
  );

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      const { default: notificationHandler } = await import("../notification-handler");
      let hasFailed = false;
      let failureReason = "";

      const batch = {
        queue: "notifications",
        messages: [
          {
            id: `local-${Date.now()}-${attempts}`,
            timestamp: new Date(),
            body: payload,
            ack: () => {},
            retry: () => {
              hasFailed = true;
              failureReason = "One or more notification channels failed to deliver";
            },
          },
        ],
        ackAll: () => {},
        retryAll: () => {
          hasFailed = true;
          failureReason = "Batch delivery retry requested";
        },
      } as unknown as MessageBatch<NotificationPayload>;

      await notificationHandler.queue(batch, env, ctx);

      if (hasFailed) {
        throw new Error(failureReason || "Notification channel delivery returned failure");
      }

      return; // Success
    } catch (notifError) {
      console.error(
        `[Notification] Attempt ${attempts}/${maxAttempts} failed for ${payload.monitorName}:`,
        notifError,
      );
      if (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempts) * 500));
      }
    }
  }

  // All direct attempts exhausted
  console.error(
    `[CRITICAL_NOTIFICATION_DROP] All ${maxAttempts} direct delivery attempts failed for monitor "${payload.monitorName}" (${payload.type}). Alert was not delivered.`,
  );

  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const { Redis } = await import("@upstash/redis/cloudflare");
      const redis = new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
      });
      await redis.lpush(
        "pulseguard:dlq:notifications",
        JSON.stringify({
          payload,
          droppedAt: new Date().toISOString(),
          attempts: maxAttempts,
        }),
      );
      console.log(
        `[Notification] Persisted dropped alert to Redis DLQ: pulseguard:dlq:notifications`,
      );
    } catch (redisErr) {
      console.error("[Notification] Failed to record dropped alert to Redis DLQ:", redisErr);
    }
  }
}
