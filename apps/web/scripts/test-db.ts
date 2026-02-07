
import { getPrisma } from "@pulseguard/db";
import { env } from "@pulseguard/env/server";

async function main() {
  console.log("🛠️ Testing DB Connection...");
  console.log("URL Config:", env.DATABASE_URL.replace(/:[^:]+@/, ":***@")); // Hide password

  try {
    const prisma = getPrisma(env.DATABASE_URL);

    // Simple query
    const start = Date.now();
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    const duration = Date.now() - start;

    console.log("✅ Connection Successful!");
    console.log("Query Result:", result);
    console.log(`Latency: ${duration}ms`);
  } catch (error) {
    console.error("❌ Connection Failed:", error);
    if (error instanceof Error) {
        console.error("Details:", error.message);
        console.error("Stack:", error.stack);
    }
  }
}

main().catch(console.error);
