/**
 * Migration Script: Add Default Alert Rules to Existing Monitors
 *
 * This script creates default alert rules for monitors that don't have any.
 * It will connect all available notification channels to each monitor.
 *
 * Usage: bun run scripts/add-default-alert-rules.ts
 */

import prisma from "@pulseguard/db";

async function main() {
  console.log("🔍 Scanning for monitors without alert rules...\n");

  // Get all monitors with their alert rules
  const monitors = await prisma.monitor.findMany({
    include: {
      alertRules: true,
      user: {
        include: {
          notificationChannels: true,
        },
      },
    },
  });

  let created = 0;
  let skipped = 0;

  for (const monitor of monitors) {
    // Skip if monitor already has alert rules
    if (monitor.alertRules.length > 0) {
      console.log(
        `⏭️  Skipping "${monitor.name}" - already has ${monitor.alertRules.length} rule(s)`,
      );
      skipped++;
      continue;
    }

    // Skip if user has no notification channels
    if (monitor.user.notificationChannels.length === 0) {
      console.log(`⚠️  Skipping "${monitor.name}" - user has no notification channels`);
      skipped++;
      continue;
    }

    // Create default alert rule
    try {
      await prisma.alertRule.create({
        data: {
          monitorId: monitor.id,
          trigger: "STATUS_CHANGE",
          targetStatus: "DOWN",
          enabled: true,
          channels: {
            connect: monitor.user.notificationChannels.map((ch) => ({ id: ch.id })),
          },
        },
      });

      console.log(
        `✅ Created default alert rule for "${monitor.name}" with ${monitor.user.notificationChannels.length} channel(s)`,
      );
      created++;
    } catch (error) {
      console.error(`❌ Failed to create alert rule for "${monitor.name}":`, error);
    }
  }

  console.log("\n📊 Summary:");
  console.log(`   ✅ Created: ${created} alert rules`);
  console.log(`   ⏭️  Skipped: ${skipped} monitors`);
  console.log(`   📈 Total monitors: ${monitors.length}`);
}

main()
  .catch((error) => {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
