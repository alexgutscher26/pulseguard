import { mock } from "bun:test";

// Metrics tracking variables
let dbQueryCount = 0;
let dbFindFirstCount = 0;
let emailAlertCount = 0;
let emailStatusUpdateCount = 0;
let webhookSlackCount = 0;
let webhookDiscordCount = 0;
let concurrentQueries = 0;
let maxConcurrentQueries = 0;

// Setup a simulated database of 50,000 monitors
console.log("Pre-generating 50,000 monitors in memory...");
const monitorsList = Array.from({ length: 50000 }).map((_, i) => {
  // 30% of monitors have alert rules enabled
  const hasAlertRules = i % 10 < 3;
  const alertRules = hasAlertRules
    ? [
        {
          id: `rule_${i}_1`,
          trigger: "STATUS_CHANGE",
          enabled: true,
          targetStatus: null, // Any status change
          channels: [
            {
              id: `chan_${i}_email`,
              type: "EMAIL",
              config: { email: `owner_${i % 1000}@example.com` },
            },
            {
              id: `chan_${i}_slack`,
              type: "SLACK",
              config: { webhookUrl: `https://hooks.slack.com/services/mock_${i}` },
            },
          ],
        },
      ]
    : [];

  return {
    id: `mon_${i}`,
    name: `Monitor ${i}`,
    url: `https://service-${i}.io/health`,
    status: i % 20 === 0 ? "DOWN" : "UP",
    alertRules,
    user: { email: `owner_${i % 1000}@example.com` },
  };
});

const monitorMap = new Map(monitorsList.map((m) => [m.id, m]));

// Setup 1,000 status pages, each associated with 5 monitors
console.log("Pre-generating 1,000 status pages...");
const statusPagesList = Array.from({ length: 1000 }).map((_, i) => {
  // Associate with monitors mon_X, mon_X+1, etc.
  const monitorOffset = (i * 5) % 49900;
  const pageMonitors = Array.from({ length: 5 }).map((_, idx) => ({
    monitorId: `mon_${monitorOffset + idx}`,
  }));

  // Setup 5 verified subscribers per page
  const subscribers = Array.from({ length: 5 }).map((_, sIdx) => ({
    id: `sub_${i}_${sIdx}`,
    email: `subscriber_${i}_${sIdx}@pulseguard.com`,
    verified: true,
    notifyIncidents: true,
    manageToken: `token_${i}_${sIdx}`,
    monitorSubscriptions: pageMonitors.map((pm) => ({ monitorId: pm.monitorId })),
  }));

  return {
    id: `page_${i}`,
    title: `Status Page ${i}`,
    slug: `status-page-${i}`,
    monitors: pageMonitors,
    subscribers,
  };
});

// Mock database query delays
const simulateDbDelay = async () => {
  concurrentQueries++;
  if (concurrentQueries > maxConcurrentQueries) {
    maxConcurrentQueries = concurrentQueries;
  }
  dbQueryCount++;
  // Simulate 5ms database query time
  await new Promise((resolve) => setTimeout(resolve, 5));
  concurrentQueries--;
};

// Mock @pulseguard/db
mock.module("@pulseguard/db", () => {
  return {
    getPrisma: () => ({
      monitor: {
        findMany: async (args: any) => {
          await simulateDbDelay();
          const ids = args?.where?.id?.in || [];
          return ids.map((id: string) => monitorMap.get(id)).filter(Boolean);
        },
      },
      statusPage: {
        findMany: async (args: any) => {
          await simulateDbDelay();
          const targetIds = args?.where?.monitors?.some?.monitorId?.in || [];
          const targetSet = new Set(targetIds);
          // Return status pages containing the target monitors
          return statusPagesList.filter((sp) =>
            sp.monitors.some((m) => targetSet.has(m.monitorId)),
          );
        },
      },
      monitorEvent: {
        groupBy: async (args: any) => {
          await simulateDbDelay();
          const ids = args?.where?.monitorId?.in || [];
          return ids.map((id: string) => ({
            monitorId: id,
            _max: {
              timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
            },
          }));
        },
        findFirst: async (args: any) => {
          dbFindFirstCount++;
          await simulateDbDelay();
          const monitorId = args?.where?.monitorId;
          // Return a mock DOWN event
          return {
            id: `evt_${monitorId}`,
            monitorId,
            status: "DOWN",
            timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
          };
        },
      },
    }),
  };
});

// Mock @pulseguard/email
mock.module("@pulseguard/email", () => ({
  sendMonitorAlert: async () => {
    emailAlertCount++;
    // Simulate SMTP API delay (10ms)
    await new Promise((resolve) => setTimeout(resolve, 10));
  },
  sendStatusUpdate: async () => {
    emailStatusUpdateCount++;
    // Simulate SMTP API delay (10ms)
    await new Promise((resolve) => setTimeout(resolve, 10));
  },
}));

// Mock global fetch for webhooks
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url: string, init?: any): Promise<Response> => {
  const urlStr = typeof url === "string" ? url : (url as any).url || "";
  if (urlStr.includes("slack.com")) {
    webhookSlackCount++;
    await new Promise((resolve) => setTimeout(resolve, 15)); // 15ms webhook delay
    return { ok: true, text: async () => "ok" } as Response;
  }
  if (urlStr.includes("discord.com") || urlStr.includes("discordapp.com")) {
    webhookDiscordCount++;
    await new Promise((resolve) => setTimeout(resolve, 15));
    return { ok: true, text: async () => "ok" } as Response;
  }
  return originalFetch(url, init);
};

// Import the notification handler AFTER mocking modules
import handler from "../src/notification-handler";

async function runStressTest() {
  console.log("\n=========================================");
  console.log("⚡ PULSEGUARD STRESS TEST SIMULATION STARTED");
  console.log("=========================================");

  // Generate 2,000 concurrent state-change events
  // We'll alternate between UP and DOWN events across a subset of our 50,000 monitors
  console.log("Generating 2,000 concurrent notification events...");
  const messages = Array.from({ length: 2000 }).map((_, i) => {
    // Pick unique monitors from mon_0 to mon_1999
    const monitorId = `mon_${i}`;
    const status = i % 2 === 0 ? "UP" : "DOWN";
    const type = status === "UP" ? "INCIDENT_RESOLVED" : "INCIDENT_CREATED";

    return {
      body: {
        monitorId,
        monitorName: `Monitor ${i}`,
        type,
        status,
        timestamp: new Date().toISOString(),
        url: `https://service-${i}.io/health`,
        reason: status === "DOWN" ? "HTTP 500 Internal Server Error" : undefined,
      },
      ack: () => {},
      retry: () => {},
    };
  });

  const env = {
    DATABASE_URL: "postgresql://mock",
    RESEND_API_KEY: "mock-resend-key",
  } as any;
  const ctx = {
    waitUntil: (promise: Promise<any>) => promise,
  } as any;

  const startMemory = process.memoryUsage().heapUsed;
  const startTime = performance.now();

  console.log("Executing notification handler queue processing...");
  await handler.queue({ messages } as any, env, ctx);

  const endTime = performance.now();
  const endMemory = process.memoryUsage().heapUsed;

  const totalTime = endTime - startTime;
  const memoryDifference = (endMemory - startMemory) / 1024 / 1024;

  console.log("\n=========================================");
  console.log("📈 PERFORMANCE STRESS TEST REPORT");
  console.log("=========================================");
  console.log(`Total Time Taken:          ${totalTime.toFixed(2)} ms`);
  console.log(`Initial Heap Used:        ${(startMemory / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Final Heap Used:          ${(endMemory / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Delta Memory Consumption:  ${memoryDifference.toFixed(2)} MB`);
  console.log(`Total DB Queries:         ${dbQueryCount}`);
  console.log(`- monitorEvent.findFirst: ${dbFindFirstCount}`);
  console.log(`Peak Concurrent DB:       ${maxConcurrentQueries}`);
  console.log(`Emails Dispatched (Alert): ${emailAlertCount}`);
  console.log(`Emails Dispatched (Status):${emailStatusUpdateCount}`);
  console.log(`Slack Webhooks:           ${webhookSlackCount}`);
  console.log(`Discord Webhooks:         ${webhookDiscordCount}`);
  console.log("=========================================\n");
}

runStressTest().catch(console.error);
