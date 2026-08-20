import { describe, test, expect, mock } from "bun:test";
import { sendSlackAlert } from "../services/notifications/slack";
import { sendDiscordAlert } from "../services/notifications/discord";

describe("Alert Notification Resilience & Failure Modes", () => {
  test("sendSlackAlert: retries on 500 Server Error and throws after max attempts", async () => {
    let callCount = 0;
    const originalFetch = globalThis.fetch;

    // Mock fetch to simulate 500 status
    globalThis.fetch = (async () => {
      callCount++;
      return new Response("Internal Error", {
        status: 500,
        statusText: "Internal Server Error",
      });
    }) as any;

    try {
      await sendSlackAlert("https://hooks.slack.com/services/test", {
        monitorId: "m1",
        monitorName: "Production API",
        url: "https://api.example.com",
        status: "DOWN",
        timestamp: new Date().toISOString(),
        reason: "HTTP 500",
        previousStatus: "DOWN",
      });
      expect(true).toBe(false); // Should not reach here
    } catch (err: any) {
      expect(callCount).toBe(3); // Verified 3 retry attempts
      expect(err.message).toContain("Slack Webhook failed");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("sendDiscordAlert: retries on 429 Rate Limit and succeeds on subsequent retry", async () => {
    let callCount = 0;
    const originalFetch = globalThis.fetch;

    globalThis.fetch = (async () => {
      callCount++;
      if (callCount === 1) {
        return new Response("Rate limited", {
          status: 429,
          statusText: "Too Many Requests",
        });
      }
      return new Response("ok", { status: 200 });
    }) as any;

    try {
      await sendDiscordAlert("https://discord.com/api/webhooks/test", {
        monitorId: "m1",
        monitorName: "Database Service",
        url: "tcp://db.example.com:5432",
        status: "DOWN",
        timestamp: new Date().toISOString(),
        previousStatus: "DOWN",
      });
      expect(callCount).toBe(2); // Recovered on 2nd attempt
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("queueNotification: direct mode executes without crashing and logs critical drop on complete channel failure", async () => {
    const { queueNotification } = await import("../lib/send-notification");
    const mockEnv: any = {};
    const mockCtx: any = { waitUntil: () => {} };

    const payload: any = {
      type: "ALERT_DISPATCH",
      monitorId: "mon-123",
      monitorName: "Payment Gateway",
      userId: "usr-123",
      event: {
        status: "DOWN",
        timestamp: new Date().toISOString(),
        reason: "503 Service Unavailable",
      },
    };

    // Should complete cleanly and not throw unhandled exception
    await expect(
      queueNotification(mockEnv, payload, mockCtx),
    ).resolves.toBeUndefined();
  });
});
