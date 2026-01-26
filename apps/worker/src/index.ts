import { getPrisma } from "@pulseguard/db";

export interface Env {
  CHECK_QUEUE: Queue<any>;
  DATABASE_URL: string;
}

// Reusable processing logic (shared between Cron and Queue consumer)
async function processBatch(monitors: any[], prisma: any) {
  console.log(`Processing batch of ${monitors.length} monitors...`);

  await Promise.all(monitors.map(async (monitor) => {
    const start = Date.now();
    let currentStatus: "UP" | "DOWN" = "DOWN";
    let latency = 0;
    
    try {
      const response = await fetch(monitor.url, {
        method: 'GET',
        headers: { 
          'User-Agent': 'PulseGuard-Monitor/1.0',
          'Accept': '*/*'
        },
        signal: AbortSignal.timeout(10000) // 10s timeout
      });
      
      latency = Date.now() - start;
      currentStatus = response.ok ? "UP" : "DOWN";
    } catch (err) {
      console.error(`Error checking ${monitor.url}:`, err);
      latency = Date.now() - start;
      currentStatus = "DOWN";
    }

    const previousStatus = monitor.status;

    // Save result and update monitor
    try {
        await prisma.$transaction([
          prisma.monitorEvent.create({
            data: {
              monitorId: monitor.id,
              status: currentStatus,
              latency: latency,
              timestamp: new Date(),
            }
          }),
          prisma.monitor.update({
            where: { id: monitor.id },
            data: {
              status: currentStatus,
              lastCheck: new Date(),
              nextCheck: new Date(Date.now() + (monitor.interval || 60) * 1000)
            }
          })
        ]);

        if (previousStatus !== currentStatus) {
            console.log(`Status change detected for ${monitor.name}: ${previousStatus} -> ${currentStatus}`);
        }
        
    } catch (dbErr) {
        console.error(`Failed to save result for ${monitor.url}`, dbErr);
    }
    
    console.log(`Checked ${monitor.url}: ${currentStatus} (${latency}ms)`);
  }));
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
          OR: [
            { nextCheck: null },
            { nextCheck: { lte: new Date() } }
          ]
        },
        orderBy: { nextCheck: 'asc' }, // Prioritize oldest due
        take: BATCH_SIZE,
        select: {
          id: true,
          url: true,
          interval: true,
          status: true,
          name: true,
        }
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
    const monitors = batch.messages.map(msg => msg.body);
    
    await processBatch(monitors, prisma);
    
    // Ack all messages after processing
    batch.ackAll();
  }
};
