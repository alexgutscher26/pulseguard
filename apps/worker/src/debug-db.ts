import { getPrisma } from "@pulseguard/db";
const prisma = getPrisma(
  "postgresql://postgres.ysoiyyfpkarveocytgeb:Yj3zX0k5MA8WqA1V@aws-1-us-east-1.pooler.supabase.com:5432/postgres",
);

const totalShards = 1;
const shardId = 0;
const BATCH_SIZE = 5;

try {
  const targetIds: { id: string }[] = await prisma.$queryRaw`
    SELECT id FROM "Monitor"
    WHERE ("status" IN ('UP', 'DOWN', 'MAINTENANCE'))
    AND ("nextCheck" IS NULL OR "nextCheck" <= NOW())
    AND (abs(hashtext(id)) % ${totalShards}) = ${shardId}
    ORDER BY "nextCheck" ASC
    LIMIT ${BATCH_SIZE}
  `;
  console.log("SUCCESS:", targetIds);
} catch (err: any) {
  console.error("ERROR running query:", err);
}
