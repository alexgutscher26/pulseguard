import { getPrisma } from "../packages/db/src/index";
import * as dotenv from "dotenv";

dotenv.config({ path: "./apps/web/.env" });

async function fixLinks() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) process.exit(1);

  const prisma = getPrisma(dbUrl);

  try {
    const monitor = await prisma.monitor.findFirst({
      where: { name: { contains: "VOICEFORGE", mode: "insensitive" } },
      include: { alertRules: true },
    });

    if (!monitor) return;

    // Get user channels
    const channels = await prisma.notificationChannel.findMany({
      where: { userId: monitor.userId },
    });

    if (channels.length === 0) return;

    console.log(`Found ${channels.length} channels.`);

    // Link to alert rules
    for (const rule of monitor.alertRules) {
      console.log(`Linking channels to Rule ${rule.id} (Trigger: ${rule.trigger})...`);
      await prisma.alertRule.update({
        where: { id: rule.id },
        data: {
          channels: {
            connect: channels.map((c) => ({ id: c.id })),
          },
        },
      });
    }

    console.log("✅ Fixed! Channels are now linked.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    process.exit(0);
  }
}

fixLinks();
