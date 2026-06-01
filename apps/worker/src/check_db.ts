import { getPrisma } from "@pulseguard/db";

const prisma = getPrisma(
  "postgresql://postgres.ysoiyyfpkarveocytgeb:Yj3zX0k5MA8WqA1V@aws-1-us-east-1.pooler.supabase.com:5432/postgres",
);

const googleEvents = await prisma.monitorEvent.findMany({
  where: { monitor: { name: "Google" } },
  orderBy: { timestamp: "desc" },
  take: 20,
});

console.log("=== GOOGLE EVENTS ===");
for (const e of googleEvents) {
  console.log(
    `  [${e.status}] region=${e.region} lat=${e.latency}ms err=${e.errorReason ?? "none"} @${e.timestamp.toISOString()}`,
  );
}
