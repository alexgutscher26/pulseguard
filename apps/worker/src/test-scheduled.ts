import worker from "./index";
import { getPrisma } from "@pulseguard/db";

const env = {
  DATABASE_URL: "postgresql://postgres.ysoiyyfpkarveocytgeb:Yj3zX0k5MA8WqA1V@aws-1-us-east-1.pooler.supabase.com:5432/postgres",
  UPSTASH_REDIS_REST_URL: "https://steady-humpback-140053.upstash.io",
  UPSTASH_REDIS_REST_TOKEN: "gQAAAAAAAiMVAAIgcDI3OTNjYjE3YmQyNjM0ZGY3ODM5NDk2YjYzY2VjNWIzZQ",
  TOTAL_SHARDS: 1,
  SHARD_ID: 0,
} as any;

const event = {
  cron: "* * * * *",
  scheduledTime: Date.now(),
} as any;

const ctx = {
  waitUntil: (promise: Promise<any>) => {
    promise.catch(err => console.error("waitUntil promise failed:", err));
  }
} as any;

console.log("Triggering scheduled handler manually via script...");
try {
  await worker.scheduled(event, env, ctx);
  console.log("scheduled handler completed successfully.");
} catch (err: any) {
  console.error("CRITICAL ERROR running scheduled handler:", err);
}
