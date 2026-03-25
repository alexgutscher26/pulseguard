import prisma from "./index.ts";

async function main() {
  console.log("Searching for monitor cmn46mt9r000104jia4ga6ko1...");
  try {
    const monitor = await prisma.monitor.findUnique({
      where: { id: "cmn46mt9r000104jia4ga6ko1" },
      include: {
        events: { take: 1 },
        maintenanceWindows: true
      }
    });

    if (monitor) {
      console.log("✅ Success! Found monitor:", monitor.name);
      console.log("Status:", monitor.status);
      console.log("Maintenance Windows count:", monitor.maintenanceWindows.length);
    } else {
      console.log("❌ Monitor NOT FOUND in DB.");
    }
  } catch (error) {
    console.error("❌ CRITICAL DB ERROR:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
