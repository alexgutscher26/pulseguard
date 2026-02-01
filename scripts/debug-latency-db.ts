
import { getPrisma } from "../packages/db/src/index";
import dotenv from "dotenv";

dotenv.config({ path: "apps/web/.env" });

async function main() {
  console.log("Connecting to DB...");
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL not found");
    return;
  }
  
  const prisma = getPrisma(dbUrl);

  try {
    console.log("Fetching a monitor...");
    const monitor = await prisma.monitor.findFirst();
    if (!monitor) {
      console.log("No monitors found. Cannot test latency queries.");
      return;
    }
    console.log(`Found monitor: ${monitor.id} (${monitor.name})`);

    console.log("Testing LatencyAggregate query...");
    const aggregates = await prisma.latencyAggregate.findMany({
      where: {
        monitorId: monitor.id,
      },
      take: 5
    });
    console.log(`Fetched ${aggregates.length} latency aggregates.`);

    console.log("Testing RegionalBaseline query...");
    const baselines = await prisma.regionalBaseline.findMany({
      where: {
        monitorId: monitor.id,
      },
      take: 5
    });
    console.log(`Fetched ${baselines.length} baselines.`);

    console.log("Inspecting LatencyAggregate table...");
    const columns = await prisma.$queryRaw`
      SELECT column_name::text, data_type::text 
      FROM information_schema.columns 
      WHERE table_name = 'LatencyAggregate';
    `;
    console.log("LatencyAggregate Columns:", columns);
    fs.writeFileSync('db-debug.log', "LatencyAggregate Columns: " + JSON.stringify(columns, null, 2) + "\n");

    const incidents = await prisma.regionalIncident.findMany({
      where: {
        monitorId: monitor.id,
      },
      take: 5
    });
    console.log(`Fetched ${incidents.length} regional incidents.`);

    console.log("ALL QUERIES SUCCESSFUL");

  } catch (e: any) {
    console.error("ERROR EXECUTING QUERIES:");
    console.error(e);
    const fs = await import('fs');
    fs.writeFileSync('db-error.log', JSON.stringify(e, Object.getOwnPropertyNames(e), 2));
    fs.appendFileSync('db-error.log', '\n\n' + String(e));
  }
}

main();
