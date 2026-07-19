import prisma from "./index.js";

async function main() {
  console.log("Running DB connection diagnostics...");
  try {
    const connStats = await prisma.$queryRawUnsafe(
      "SELECT count(*), state FROM pg_stat_activity GROUP BY state;",
    );
    const maxConns = await prisma.$queryRawUnsafe("SHOW max_connections;");
    console.log("Current Connection Stats:", connStats);
    console.log("Max Connections Limit:", maxConns);
  } catch (error) {
    console.error("❌ CRITICAL DB ERROR:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
