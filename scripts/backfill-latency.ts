
import { getPrisma } from "../packages/db/src/index";
import dotenv from "dotenv";

dotenv.config({ path: "apps/web/.env" });

async function main() {
  console.log("Connecting to DB...");
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL not found");
    return;
  }
  
  const prisma = getPrisma(dbUrl);

  try {
    console.log("Fetching monitors...");
    const monitors = await prisma.monitor.findMany({
      include: {
        events: {
          orderBy: { timestamp: 'desc' },
          take: 100
        }
      }
    });

    console.log(`Found ${monitors.length} monitors.`);

    for (const monitor of monitors) {
      console.log(`Processing monitor: ${monitor.name} (${monitor.events.length} events)`);
      
      if (monitor.events.length === 0) continue;

      // Group events by 1-minute buckets AND region
      const buckets = new Map<string, typeof monitor.events>();
      
      for (const event of monitor.events) {
        // Round down to nearest 1 minute
        const date = new Date(event.timestamp);
        date.setSeconds(0);
        date.setMilliseconds(0);
        // No need to modulo 5 minutes
        
        const region = event.region || "global";
        const key = `${date.toISOString()}::${region}`;
        
        if (!buckets.has(key)) {
          buckets.set(key, []);
        }
        buckets.get(key)!.push(event);
      }

      console.log(`Generated ${buckets.size} time-region buckets.`);

      for (const [key, events] of buckets) {
        const [timestampIso, region] = key.split("::");
        const timestamp = new Date(timestampIso);
        
        const avgLatency = events.reduce((sum, e) => sum + (e.latency || 0), 0) / events.length;
        const minLatency = Math.min(...events.map(e => e.latency || 0));
        const maxLatency = Math.max(...events.map(e => e.latency || 0));
        
        // Simple P-value calc
        const sorted = events.map(e => e.latency || 0).sort((a, b) => a - b);
        const p50 = sorted[Math.floor(sorted.length * 0.5)];
        const p95 = sorted[Math.floor(sorted.length * 0.95)];
        const p99 = sorted[Math.floor(sorted.length * 0.99)];
        
        const successCount = events.filter(e => e.status === 'UP').length;
        const successRate = successCount / events.length;

        await prisma.latencyAggregate.create({
          data: {
            monitorId: monitor.id,
            region: region,
            timestamp: new Date(timestamp),
            granularity: "ONE_MINUTE", // Matching default view
            avgLatency,
            minLatency,
            maxLatency,
            p50Latency: p50,
            p95Latency: p95,
            p99Latency: p99,
            sampleCount: events.length,
            successRate,
          }
        });
      }
      console.log(`Created ${buckets.size} aggregate records for ${monitor.name}`);
    }

    console.log("Backfill complete.");

  } catch (e) {
    console.error("Error during backfill:", e);
  }
}

main();
