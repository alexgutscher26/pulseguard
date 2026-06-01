import { getPrisma } from "@pulseguard/db";
import worker from "./index";

const prisma = getPrisma("postgresql://postgres.ysoiyyfpkarveocytgeb:Yj3zX0k5MA8WqA1V@aws-1-us-east-1.pooler.supabase.com:5432/postgres");

// 1. Reset nextCheck for Google to force it to be checked
console.log("Forcing nextCheck of Google to past...");
await prisma.monitor.updateMany({
  where: { name: "Google" },
  data: {
    nextCheck: new Date("2020-01-01T00:00:00Z"),
  },
});

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

console.log("Triggering scheduled handler manually...");
try {
  await worker.scheduled(event, env, ctx);
  console.log("scheduled handler completed successfully.");
} catch (err: any) {
  console.error("CRITICAL ERROR running scheduled handler:", err);
}

// 2. Query recent events to see if any new event was written and its status
const recentEvents = await prisma.monitorEvent.findMany({
  where: { monitor: { name: "Google" } },
  orderBy: { timestamp: "desc" },
  take: 15,
});

console.log("\n=== RECENT EVENTS FOR GOOGLE ===");
for (const e of recentEvents) {
  console.log(`  [${e.status}] region=${e.region} lat=${e.latency}ms err=${e.errorReason ?? "none"} @${e.timestamp}`);
}
