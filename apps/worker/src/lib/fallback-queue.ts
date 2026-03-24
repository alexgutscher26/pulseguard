import { Redis } from "@upstash/redis/cloudflare";

export interface FallbackEvent {
  monitorId: string;
  status: string;
  latency: number;
  errorReason?: string;
  timestamp: string;
}

export class FallbackQueue {
  private redis: Redis;
  private QUEUE_KEY = "pulseguard:fallback:events";

  constructor(url: string, token: string) {
    this.redis = new Redis({
      url,
      token,
    });
  }

  /**
   * Pushes a monitor event to the fallback Redis queue.
   */
  async push(event: FallbackEvent) {
    try {
      // We use LPUSH to add to the head
      await this.redis.lpush(this.QUEUE_KEY, JSON.stringify(event));
      console.log(`[Fallback] Pushed event for monitor ${event.monitorId} to Redis.`);
    } catch (err) {
      // If even Redis fails, we log it. This is our last resort of visibility.
      console.error(`[Fallback] CRITICAL ERROR: Failed to push to Redis fallback:`, err);
    }
  }

  /**
   * Retrieves and removes a batch of events from the fallback queue.
   * Uses RPOP to get the oldest items first.
   */
  async popBatch(count: number = 50): Promise<FallbackEvent[]> {
    try {
      // RPOP with count is supported by Upstash Redis
      const results = await this.redis.rpop<string | string[]>(this.QUEUE_KEY, count);
      
      if (!results) return [];
      
      const items = Array.isArray(results) ? results : [results];
      return items.map((r) => JSON.parse(r));
    } catch (err) {
      console.error(`[Fallback] Failed to pop from Redis fallback:`, err);
      return [];
    }
  }

  /**
   * Returns the current number of items waiting in the fallback queue.
   */
  async getQueueLength(): Promise<number> {
    try {
      return await this.redis.llen(this.QUEUE_KEY);
    } catch (err) {
      return 0;
    }
  }
}
