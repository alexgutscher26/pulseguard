import { Redis } from "@upstash/redis/cloudflare";

export type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

/**
 * Global Circuit Breaker for Database Connectivity.
 * Uses Upstash Redis to coordinate state between multiple Cloudflare Worker instances.
 */
export class DatabaseCircuitBreaker {
  private redis: Redis;
  private STATE_KEY = "pulseguard:cb:tripped_at";
  private FAIL_COUNT_KEY = "pulseguard:cb:fail_count";

  // Threshold of failures before tripping (e.g., 5 failures in a short window)
  private THRESHOLD = 5;
  // How long to stay in OPEN state before trying HALF_OPEN recovery (seconds)
  private RECOVERY_TIME = 60;

  constructor(url: string, token: string) {
    this.redis = new Redis({
      url,
      token,
    });
  }

  /**
   * Returns the current state of the circuit.
   */
  async getState(): Promise<CircuitState> {
    try {
      const trippedAt = await this.redis.get<number>(this.STATE_KEY);
      if (!trippedAt) return "CLOSED";

      const elapsed = (Date.now() - trippedAt) / 1000;
      if (elapsed > this.RECOVERY_TIME) {
        return "HALF_OPEN";
      }

      return "OPEN";
    } catch (err) {
      // If Redis is unreachable (incl. wrangler dev local proxy errors), still allow work.
      const errStr = String(err);
      const isLocalProxyError = errStr.includes("1016") || errStr.includes("error code");
      if (!isLocalProxyError) {
        console.error(`[CircuitBreaker] Failed to fetch state from Redis:`, err);
      }
      return "CLOSED";
    }
  }

  /**
   * Records a database failure and trips the circuit if threshold is reached.
   */
  async recordFailure(error: any) {
    // Only trip on connection-related errors
    const errorMsg = error?.message || "";
    const isConnError =
      errorMsg.includes("MaxClientsInSessionMode") || // Neon/Supabase pooler limit
      errorMsg.includes("connection pool exhausted") ||
      errorMsg.includes("ECONNREFUSED");

    if (!isConnError) return;

    try {
      const fails = await this.redis.incr(this.FAIL_COUNT_KEY);
      if (fails === 1) {
        await this.redis.expire(this.FAIL_COUNT_KEY, 300); // Reset count after 5 mins
      }

      if (fails >= this.THRESHOLD) {
        await this.trip();
      }
    } catch (err) {
      const errStr = String(err);
      if (!errStr.includes("1016") && !errStr.includes("error code")) {
        console.error(`[CircuitBreaker] Failed to record failure to Redis:`, err);
      }
    }
  }

  /**
   * Records a success and closes the circuit back to normal.
   */
  async recordSuccess() {
    try {
      // Only delete if we were actually avoiding normal state
      const existing = await this.redis.get(this.STATE_KEY);
      if (existing) {
        await this.redis.del(this.STATE_KEY);
        await this.redis.del(this.FAIL_COUNT_KEY);
        console.log(`[CircuitBreaker] Circuit CLOSED. Database connection recovered.`);
      }
    } catch (err) {
      // Ignore Redis failures here
    }
  }

  private async trip() {
    try {
      await this.redis.set(this.STATE_KEY, Date.now());
      console.warn(
        `[CircuitBreaker] CRITICAL: DB connection pool exhausted. Tripping circuit for ${this.RECOVERY_TIME}s.`,
      );
    } catch (err) {
      const errStr = String(err);
      if (!errStr.includes("1016") && !errStr.includes("error code")) {
        console.error(`[CircuitBreaker] Failed to trip circuit in Redis:`, err);
      }
    }
  }
}
