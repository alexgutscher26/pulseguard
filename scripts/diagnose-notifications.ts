/**
 * Diagnostic Script: Check Notification Setup
 *
 * This script checks your notification configuration to diagnose why alerts aren't being sent.
 */

import prisma from "@pulseguard/db";

async function main() {
  console.log("🔍 PulseGuard Notification Diagnostic\n");
  console.log("=".repeat(60));

  // 1. Check Notification Channels
  console.log("\n📢 NOTIFICATION CHANNELS:");
  const channels = await prisma.notificationChannel.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      config: true,
      userId: true,
    },
  });

  if (channels.length === 0) {
    console.log("❌ NO NOTIFICATION CHANNELS FOUND!");
    console.log("   → You need to create at least one notification channel");
    console.log("   → Go to /dashboard/alerts and click 'Add Channel'");
  } else {
    channels.forEach((ch, i) => {
      console.log(`\n${i + 1}. ${ch.name} (${ch.type})`);
      console.log(`   ID: ${ch.id}`);
      const config = ch.config as any;
      if (config?.webhookUrl) {
        console.log(`   Webhook: ${config.webhookUrl.substring(0, 50)}...`);
      } else if (config?.email) {
        console.log(`   Email: ${config.email}`);
      }
    });
  }

  // 2. Check Alert Rules
  console.log("\n\n⚡ ALERT RULES:");
  const rules = await prisma.alertRule.findMany({
    include: {
      monitor: {
        select: {
          id: true,
          name: true,
          status: true,
        },
      },
      channels: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
  });

  if (rules.length === 0) {
    console.log("❌ NO ALERT RULES FOUND!");
    console.log("   → You need to create alert rules for your monitors");
    console.log("   → Go to /dashboard/alerts and click 'Add Rule'");
  } else {
    rules.forEach((rule, i) => {
      console.log(`\n${i + 1}. ${rule.monitor.name}`);
      console.log(`   Monitor Status: ${rule.monitor.status}`);
      console.log(`   Rule Enabled: ${rule.enabled ? "✅ YES" : "❌ NO"}`);
      console.log(`   Trigger: ${rule.trigger}`);
      if (rule.targetStatus) {
        console.log(`   Target Status: ${rule.targetStatus}`);
      }
      if (rule.threshold) {
        console.log(`   Threshold: ${rule.threshold}${rule.trigger === "LATENCY" ? "ms" : ""}`);
      }
      console.log(`   Channels (${rule.channels.length}):`);
      if (rule.channels.length === 0) {
        console.log(`      ❌ NO CHANNELS CONNECTED!`);
      } else {
        rule.channels.forEach((ch) => {
          console.log(`      - ${ch.name} (${ch.type})`);
        });
      }
    });
  }

  // 3. Check Recent Monitor Events
  console.log("\n\n📊 RECENT MONITOR EVENTS (Last 10):");
  const events = await prisma.monitorEvent.findMany({
    take: 10,
    orderBy: { timestamp: "desc" },
    include: {
      monitor: {
        select: {
          name: true,
        },
      },
    },
  });

  events.forEach((event, i) => {
    const time = new Date(event.timestamp).toLocaleTimeString();
    console.log(
      `${i + 1}. [${time}] ${event.monitor.name}: ${event.status} (${event.latency}ms)${
        event.errorReason ? ` - ${event.errorReason}` : ""
      }`,
    );
  });

  // 4. Check Active Incidents
  console.log("\n\n🔥 ACTIVE INCIDENTS:");
  const incidents = await prisma.incident.findMany({
    where: {
      status: {
        in: ["INVESTIGATING", "IDENTIFIED", "MONITORING"],
      },
    },
    include: {
      monitor: {
        select: {
          name: true,
        },
      },
    },
  });

  if (incidents.length === 0) {
    console.log("   No active incidents");
  } else {
    incidents.forEach((inc, i) => {
      console.log(`\n${i + 1}. ${inc.monitor.name}`);
      console.log(`   Status: ${inc.status}`);
      console.log(`   Started: ${inc.startedAt.toLocaleString()}`);
      console.log(`   Title: ${inc.title}`);
    });
  }

  // 5. Diagnosis Summary
  console.log("\n\n" + "=".repeat(60));
  console.log("🔬 DIAGNOSIS:");
  console.log("=".repeat(60));

  const hasChannels = channels.length > 0;
  const hasRules = rules.length > 0;
  const hasEnabledRules = rules.some((r) => r.enabled);
  const hasRulesWithChannels = rules.some((r) => r.channels.length > 0);

  if (!hasChannels) {
    console.log("\n❌ PROBLEM: No notification channels configured");
    console.log("   FIX: Create a Discord/Slack webhook channel");
  }

  if (!hasRules) {
    console.log("\n❌ PROBLEM: No alert rules configured");
    console.log("   FIX: Create an alert rule for your monitors");
  }

  if (hasRules && !hasEnabledRules) {
    console.log("\n❌ PROBLEM: All alert rules are disabled");
    console.log("   FIX: Enable at least one alert rule");
  }

  if (hasRules && !hasRulesWithChannels) {
    console.log("\n❌ PROBLEM: Alert rules have no notification channels");
    console.log("   FIX: Edit your alert rules to add notification channels");
  }

  if (hasChannels && hasRules && hasEnabledRules && hasRulesWithChannels) {
    console.log("\n✅ Configuration looks good!");
    console.log("\n🔍 If alerts still aren't working, check:");
    console.log("   1. Worker logs for notification queue messages");
    console.log("   2. Webhook URLs are correct and accessible");
    console.log("   3. Monitor status is actually changing (not stuck)");
    console.log("   4. Rate limiting (max 1 alert per 5 mins per monitor)");
  }

  console.log("\n" + "=".repeat(60));
}

main()
  .catch((error) => {
    console.error("❌ Diagnostic failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
