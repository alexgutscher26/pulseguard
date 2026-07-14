import { getPrisma } from "@pulseguard/db";

const prisma = getPrisma(
  "postgresql://postgres.ysoiyyfpkarveocytgeb:Yj3zX0k5MA8WqA1V@aws-1-us-east-1.pooler.supabase.com:5432/postgres",
);

async function run() {
  console.log("Querying columns of Monitor table...");
  const columns: any = await prisma.$queryRawUnsafe(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'Monitor'
  `);
  console.log("Monitor Columns:", columns);
}

run().catch(console.error);
