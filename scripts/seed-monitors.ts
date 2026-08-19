import { seedDatabase } from "../packages/db/src/seed";

async function main() {
  const args = process.argv.slice(2);
  const emailArgIdx = args.findIndex((a) => a === "--user" || a === "--email");
  const userEmail = emailArgIdx !== -1 ? args[emailArgIdx + 1] : undefined;
  const cleanExisting = args.includes("--clean") || args.includes("--reset");
  const resetDb = args.includes("--reset");

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
SteadyStack Continuous Global Verification Seed Tool

Usage:
  bun scripts/seed-monitors.ts [options]
  bun run seed [options]
  bun run db:seed [options]

Options:
  --user, --email <email>   Target specific user email (creates user if not found)
  --reset, --clean          Wipe and reset previous monitors, telemetry, channels, and status pages
  --help, -h                Show help text
`);
    process.exit(0);
  }

  try {
    await seedDatabase({ userEmail, cleanExisting, resetDb });
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed execution failed:", error);
    process.exit(1);
  }
}

main();
