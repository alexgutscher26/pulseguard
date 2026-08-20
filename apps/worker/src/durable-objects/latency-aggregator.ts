import { DurableObject } from "cloudflare:workers";
import { getPrisma, LatencyGranularity } from "@steadystack/db";
import { LatencyBuffer } from "../lib/latency-calculator";

interface LatencyRecord {
  monitorId: string;
  region: string;
  latency: number;
  success: boolean;
  timestamp: number;
}

interface Env {
  DATABASE_URL: string;
  LATENCY_AGGREGATOR: DurableObjectNamespace;
}

/**
 * Latency Aggregator Durable Object
 * Collects latency data in-memory and flushes aggregates to D1 every minute
 */
export class LatencyAggregator extends DurableObject {
  private buffers: Map<string, LatencyBuffer> = new Map();
  private subscribers: Set<(data: any) => void> = new Set();

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);

    // Start flush interval (every 60 seconds)
    setInterval(() => {
      this.flushAggregates().catch(console.error);
    }, 60_000);
  }

  /**
   * Record a latency measurement
   */
  async recordLatency(data: LatencyRecord): Promise<void> {
    const key = `${data.monitorId}:${data.region}`;

    let buffer = this.buffers.get(key);
    if (!buffer) {
      buffer = new LatencyBuffer();
      this.buffers.set(key, buffer);
    }

    buffer.add(data.latency, data.success);

    // Notify subscribers in real-time
    this.notifySubscribers({
      type: "latency_update",
      monitorId: data.monitorId,
      region: data.region,
      latency: data.latency,
      timestamp: data.timestamp,
    });

    try {
      const currentAlarm = await this.ctx.storage.getAlarm();
      if (!currentAlarm) {
        await this.ctx.storage.setAlarm(Date.now() + 60_000);
      }
    } catch {}
  }

  /**
   * Flush aggregates to database
   */
  async flushAggregates(): Promise<void> {
    if (this.buffers.size === 0) return;

    const env = this.env as Env;
    const prisma = getPrisma(env.DATABASE_URL);
    const now = new Date();
    const timestamp = new Date(Math.floor(now.getTime() / 60000) * 60000); // Round to minute

    try {
      const aggregates = [];
      const baselineUpdates: {
        monitorId: string;
        region: string;
        currentAvg: number;
      }[] = [];
      const processedBuffers: LatencyBuffer[] = [];

      for (const [key, buffer] of this.buffers.entries()) {
        const [monitorId, region] = key.split(":");
        if (!monitorId || !region) continue;
        const data = buffer.getAggregates();

        if (data.sampleCount > 0) {
          aggregates.push({
            monitorId,
            region,
            timestamp,
            granularity: LatencyGranularity.ONE_MINUTE,
            avgLatency: data.avgLatency,
            minLatency: data.minLatency,
            maxLatency: data.maxLatency,
            p50Latency: data.p50Latency,
            p95Latency: data.p95Latency,
            p99Latency: data.p99Latency,
            sampleCount: data.sampleCount,
            successRate: data.successRate,
          });

          // Collect regional baseline update
          baselineUpdates.push({
            monitorId,
            region,
            currentAvg: data.avgLatency,
          });

          processedBuffers.push(buffer);
        }
      }

      // Batch insert aggregates with retry
      if (aggregates.length > 0) {
        let insertAttempts = 0;
        const maxInsertAttempts = 3;
        while (insertAttempts < maxInsertAttempts) {
          try {
            await prisma.latencyAggregate.createMany({
              data: aggregates,
            });

            // Update regional baselines in batch
            await this.updateBaselinesBatched(prisma, baselineUpdates);
            break;
          } catch (writeErr: any) {
            insertAttempts++;
            if (insertAttempts >= maxInsertAttempts) {
              throw writeErr;
            }
            const delayMs =
              250 * Math.pow(2, insertAttempts - 1) + Math.random() * 50;
            console.warn(
              `[LatencyAggregator] Flush DB retry ${insertAttempts}/${maxInsertAttempts} after ${Math.round(delayMs)}ms:`,
              writeErr?.message,
            );
            await new Promise((resolve) => setTimeout(resolve, delayMs));
          }
        }

        // Only reset buffers once persistence has succeeded
        for (const buf of processedBuffers) {
          buf.reset();
        }

        console.log(
          `[LatencyAggregator] Flushed ${aggregates.length} aggregates`,
        );

        // Notify subscribers
        this.notifySubscribers({
          type: "aggregates_flushed",
          count: aggregates.length,
          timestamp: timestamp.toISOString(),
        });
      }
    } catch (error) {
      console.error("[LatencyAggregator] Flush error:", error);
      // Retain buffer samples in memory for the next interval
    }
  }

  /**
   * Update regional baselines in batch (30-day rolling average)
   */
  private async updateBaselinesBatched(
    prisma: any,
    updates: { monitorId: string; region: string; currentAvg: number }[],
  ): Promise<void> {
    if (updates.length === 0) return;

    try {
      // Deduplicate updates by monitorId:region (take latest)
      const uniqueUpdatesMap = new Map<
        string,
        { monitorId: string; region: string; currentAvg: number }
      >();
      for (const u of updates) {
        uniqueUpdatesMap.set(`${u.monitorId}:${u.region}`, u);
      }
      const uniqueUpdates = Array.from(uniqueUpdatesMap.values());

      // Find existing baselines for the given monitorId and region pairs
      const existingBaselines = await prisma.regionalBaseline.findMany({
        where: {
          OR: uniqueUpdates.map((u) => ({
            monitorId: u.monitorId,
            region: u.region,
          })),
        },
      });

      const existingMap = new Map<string, any>(
        existingBaselines.map((b: any) => [`${b.monitorId}:${b.region}`, b]),
      );

      const creates: any[] = [];
      const updatePromises: any[] = [];

      for (const u of uniqueUpdates) {
        const key = `${u.monitorId}:${u.region}`;
        const existing = existingMap.get(key);

        if (existing) {
          // Exponential moving average (alpha = 0.1 for ~30-day equivalent)
          const newBaseline =
            existing.baselineLatency * 0.9 + u.currentAvg * 0.1;

          updatePromises.push(
            prisma.regionalBaseline.update({
              where: { id: existing.id },
              data: { baselineLatency: newBaseline },
            }),
          );
        } else {
          // Create new baseline
          creates.push({
            monitorId: u.monitorId,
            region: u.region,
            baselineLatency: u.currentAvg,
          });
        }
      }

      // Execute creations and updates in parallel
      const operations = [];

      if (creates.length > 0) {
        operations.push(
          prisma.regionalBaseline.createMany({
            data: creates,
          }),
        );
      }

      if (updatePromises.length > 0) {
        // Use a transaction for the updates to ensure atomicity and reduce round trips
        operations.push(prisma.$transaction(updatePromises));
      }

      await Promise.all(operations);
    } catch (error) {
      console.error("[LatencyAggregator] Batch baseline update error:", error);
    }
  }

  /**
   * Subscribe to real-time updates
   */
  subscribe(callback: (data: any) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Notify all subscribers
   */
  private notifySubscribers(data: any): void {
    for (const callback of this.subscribers) {
      try {
        callback(data);
      } catch (error) {
        console.error(
          "[LatencyAggregator] Subscriber notification error:",
          error,
        );
      }
    }
  }

  /**
   * Fetch handler for HTTP requests
   */
  override async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/record") {
      const data = (await request.json()) as LatencyRecord;
      await this.recordLatency(data);
      if (url.searchParams.get("flush") === "true") {
        await this.flushAggregates();
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (request.method === "POST" && url.pathname === "/record-batch") {
      const { records, flush } = (await request.json()) as {
        records: LatencyRecord[];
        flush?: boolean;
      };
      if (Array.isArray(records)) {
        for (const data of records) {
          await this.recordLatency(data);
        }
      }
      if (flush) {
        await this.flushAggregates();
      }
      return new Response(
        JSON.stringify({ success: true, count: records?.length || 0 }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (request.method === "POST" && url.pathname === "/flush") {
      await this.flushAggregates();
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (request.method === "GET" && url.pathname === "/subscribe") {
      // Server-Sent Events endpoint
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      const encoder = new TextEncoder();

      const unsubscribe = this.subscribe((data) => {
        writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      });

      // Cleanup on disconnect
      request.signal.addEventListener("abort", () => {
        unsubscribe();
        writer.close();
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    return new Response("Not Found", { status: 404 });
  }

  /**
   * Periodic alarm handler: ensures defensive recurring schedule and flushes memory aggregates to DB
   */
  override async alarm(): Promise<void> {
    try {
      // Defensive alarm rescheduling so memory eviction or flush failure does not orphan the aggregator
      await this.ctx.storage.setAlarm(Date.now() + 60_000);
    } catch {}
    await this.flushAggregates();
  }
}
