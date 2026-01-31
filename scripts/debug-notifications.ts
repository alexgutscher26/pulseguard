import { getPrisma } from "../packages/db/src/index";
import * as dotenv from "dotenv";

// Load environment variables manually since we are running a standalone script
dotenv.config({ path: "./apps/web/.env" });

async function debugNotifications() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("❌ DATABASE_URL missing in process.env");
    process.exit(1);
  }

  console.log("🔌 Connecting to DB...");
  const prisma = getPrisma(dbUrl);

  try {
    // 1. Fetch Monitor
    console.log("🔍 Searching for monitor 'VOICEFORGE'...");
    const monitor = await prisma.monitor.findFirst({
      where: { name: { contains: "VOICEFORGE", mode: "insensitive" } },
      include: {
        alertRules: {
          include: {
            channels: true,
          },
        },
        user: true,
      },
    });

    if (!monitor) {
      console.log("❌ Monitor 'VOICEFORGE' not found. Listing top 5 monitors:");
      const monitors = await prisma.monitor.findMany({ take: 5, select: { name: true, id: true } });
      monitors.forEach((m) => console.log(` - [${m.name}] (${m.id})`));
      return;
    }

    console.log(`✅ Found Monitor: ${monitor.name} (${monitor.id})`);
    console.log(`   User Email: ${monitor.user.email}`);

    // 2. Check Alert Rules
    console.log(`\n📋 Alert Rules (${monitor.alertRules.length} found):`);

    if (monitor.alertRules.length === 0) {
      console.log("   ❌ No alert rules active!");
    }

    monitor.alertRules.forEach((rule, idx) => {
      console.log(`   [Rule ${idx + 1}] Trigger: ${rule.trigger}, Enabled: ${rule.enabled}`);
      console.log(`      TargetStatus: ${rule.targetStatus}`);
      console.log(`      Channels (${rule.channels.length}):`);

      rule.channels.forEach((ch) => {
        console.log(`        - [${ch.type}] ${ch.name}`);
        console.log(`          Config: ${JSON.stringify(ch.config)}`);
      });
    });

    // 3. User Channels
    console.log(`\n📡 User Notification Channels:`);
    const channels = await prisma.notificationChannel.findMany({
      where: { userId: monitor.userId },
    });

    if (channels.length === 0) {
      console.log("   ❌ No notification channels configured for this user.");
    } else {
      channels.forEach((ch) => {
        console.log(`   - [${ch.type}] ${ch.name} (ID: ${ch.id})`);
        console.log(`     Config: ${JSON.stringify(ch.config)}`);
      });
    }
  } catch (error) {
    console.error("💥 Error:", error);
  } finally {
    process.exit(0);
  }
}

debugNotifications();
