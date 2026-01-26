import { getPrisma } from "@pulseguard/db";

export interface Env {
  CHECK_QUEUE: Queue<any>;
  DATABASE_URL: string;
}

import { connect } from "cloudflare:sockets";

// Helper: Perform a single check without DB side effects
async function performCheck(
  monitor: any,
): Promise<{ status: "UP" | "DOWN"; latency: number; errorReason?: string }> {
  const start = Date.now();
  let currentStatus: "UP" | "DOWN" = "DOWN";
  let latency = 0;
  let errorReason: string | undefined = undefined;

  try {
    const urlStr = monitor.url;

    if (urlStr.startsWith("http://") || urlStr.startsWith("https://")) {
      const response = await fetch(urlStr, {
        method: "GET",
        headers: {
          "User-Agent": "PulseGuard-Monitor/1.0",
          Accept: "*/*",
        },
        signal: AbortSignal.timeout(10000),
      });
      currentStatus = response.ok ? "UP" : "DOWN";

      if (!response.ok) {
        errorReason = `HTTP_${response.status}`;
      }
    } else if (urlStr.startsWith("tcp://")) {
      // Parse tcp://hostname:port
      const part = urlStr.replace("tcp://", "");
      const [hostname, port] = part.split(":");

      if (!hostname || !port) throw new Error("Invalid TCP URL format");

      const socket = connect({
        hostname,
        port: parseInt(port),
      });

      // Wait for connection
      await socket.opened;
      await socket.close();
      currentStatus = "UP";
    } else if (urlStr.startsWith("ping://")) {
      const hostname = urlStr.replace("ping://", "");
      const socket = connect({
        hostname,
        port: 80,
      });
      await socket.opened;
      await socket.close();
      currentStatus = "UP";
    } else {
      // Fallback or unknown
      throw new Error("Unknown protocol");
    }

    latency = Date.now() - start;
  } catch (err: any) {
    console.error(`Error checking ${monitor.url}:`, err);
    latency = 0;
    currentStatus = "DOWN";

    // Classify Error
    if (err.name === "TimeoutError" || (err.message && err.message.includes("Stats"))) {
      errorReason = "TIMEOUT";
    } else if (
      err.code === "ECONNREFUSED" ||
      (err.message && err.message.includes("Connection refused"))
    ) {
      errorReason = "CONNECTION_REFUSED";
    } else if (err.code === "ENOTFOUND" || (err.message && err.message.includes("getaddrinfo"))) {
      errorReason = "DNS_ERROR";
    } else {
      errorReason = "UNKNOWN_ERROR";
    }
  }

  return { status: currentStatus, latency, errorReason };
}

// Reusable processing logic (shared between Cron and Queue consumer)
async function processBatch(monitors: any[], prisma: any) {
  console.log(`Processing batch of ${monitors.length} monitors...`);

  await Promise.all(
    monitors.map(async (monitor) => {
      // 1. Initial Check
      let result = await performCheck(monitor);

      // 2. Double Check Protocol (Retry on Failure)
      // If the first check fails, we wait 2 seconds and try ONE more time.
      // This prevents transient network blips from triggering alerts.
      if (result.status === "DOWN" && monitor.status !== "DOWN") {
        console.warn(
          `[DoubleCheck] First check failed for ${monitor.name} (${monitor.url}). Retrying in 2s...`,
        );

        // Wait 2000ms
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Retry
        result = await performCheck(monitor);
        console.log(`[DoubleCheck] Retry result for ${monitor.name}: ${result.status}`);
      }

      const { status: currentStatus, latency, errorReason } = result;

      const previousStatus = monitor.status;

      // Save result and update monitor
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
              nextCheck: new Date(Date.now() + (monitor.interval || 60) * 1000),
            },
          }),
        ]);

        if (previousStatus !== currentStatus) {
          console.log(
            `Status change detected for ${monitor.name}: ${previousStatus} -> ${currentStatus}`,
          );
        }
      } catch (dbErr) {
        console.error(`Failed to save result for ${monitor.url}`, dbErr);
      }

      console.log(`Checked ${monitor.url}: ${currentStatus} (${latency}ms)`);
    }),
  );
}

export default {
  // Required: Basic fetch handler
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return new Response("PulseGuard Worker is Running", { status: 200 });
  },

  // 1. Cron: Find pending checks and run them (Free Tier Batch Mode)
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    console.log("Cron triggered: checking for due monitors...");
    const prisma = getPrisma(env.DATABASE_URL);

    // FREE TIER CONFIG: Process 10 monitors per cron tick (1 min)
    // This avoids CPU limits and Queue costs.
    const BATCH_SIZE = 10;

    try {
      // Find active monitors that are due for a check
      const monitors = await prisma.monitor.findMany({
        where: {
          status: { in: ["UP", "DOWN"] },
          OR: [{ nextCheck: null }, { nextCheck: { lte: new Date() } }],
        },
        orderBy: { nextCheck: "asc" }, // Prioritize oldest due
        take: BATCH_SIZE,
        select: {
          id: true,
          url: true,
          interval: true,
          status: true,
          name: true,
        },
      });

      console.log(`Found ${monitors.length} monitors to check.`);

      if (monitors.length === 0) return;

      // --- FREE PLAN: DIRECT EXECUTION ---
      // We process them right here instead of queuing
      await processBatch(monitors, prisma);

      // --- PAID PLAN: QUEUE DISPATCH (Preserved) ---
      /*
      const queueBatchSize = 100;
      for (let i = 0; i < monitors.length; i += queueBatchSize) {
        const chunk = monitors.slice(i, i + queueBatchSize).map((m: any) => ({
          body: m,
        }));
        await env.CHECK_QUEUE.sendBatch(chunk);
      }
      */

      console.log("Monitors processed successfully.");
    } catch (error) {
      console.error("Error in scheduled handler:", error);
    }
  },

  // 2. Queue Consumer: (Preserved for Paid Plan Upgrade)
  async queue(batch: MessageBatch<any>, env: Env, ctx: ExecutionContext) {
    const prisma = getPrisma(env.DATABASE_URL);
    const monitors = batch.messages.map((msg) => msg.body);

    await processBatch(monitors, prisma);

    // Ack all messages after processing
    batch.ackAll();
  },
};
