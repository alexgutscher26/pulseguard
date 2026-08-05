export interface Env {
  CHECK_QUEUE: Queue<any>;
  NOTIFICATION_QUEUE: Queue<any>;
  DATABASE_URL: string;
  RESEND_API_KEY: string;
  LATENCY_AGGREGATOR: DurableObjectNamespace;
  MONITOR_CHANNEL: DurableObjectNamespace;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
  SHARD_ID?: number;
  TOTAL_SHARDS?: number;
  DNS_CACHE?: KVNamespace;
  BROWSER?: any;
  CHAOS_ENGINEERING?: string;
  /** Allowed CORS origin — set via wrangler secret or .dev.vars. Must not be a wildcard in production. */
  CORS_ORIGIN?: string;
}
