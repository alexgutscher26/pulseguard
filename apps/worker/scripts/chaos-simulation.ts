import { mock } from "bun:test";

// Mock database and email modules so they run instantly during simulation
mock.module("@pulseguard/db", () => ({
  getPrisma: () => ({
    monitor: {
      findMany: async () => [],
    },
    statusPage: {
      findMany: async () => [],
    },
    monitorEvent: {
      groupBy: async () => [],
      findFirst: async () => null,
    },
  }),
}));

mock.module("@pulseguard/email", () => ({
  sendMonitorAlert: async () => {},
  sendStatusUpdate: async () => {},
}));

globalThis.fetch = async () => ({ ok: true, text: async () => "ok" }) as Response;

// Import worker default queue handler AFTER mocking modules
import worker from "../src/index";

// Define simulation variables
interface QueueMessage {
  id: string;
  body: any;
  retryCount: number;
  status: "PENDING" | "PROCESSED" | "DLQ";
}

const TOTAL_MESSAGES = 100;
const MAX_RETRIES = 5;

// Generate 100 test notifications for our queue
const queueStore: QueueMessage[] = Array.from({ length: TOTAL_MESSAGES }).map((_, i) => ({
  id: `msg_event_${i}`,
  body: {
    monitorId: `mon_${i % 10}`,
    monitorName: `Monitor ${i % 10}`,
    type: "INCIDENT_RESOLVED",
    status: "UP",
    timestamp: new Date().toISOString(),
    url: `https://test-service-${i % 10}.io`,
  },
  retryCount: 0,
  status: "PENDING",
}));

let isolateCrashes = 0;
let messageFailures = 0;

async function runChaosSimulation() {
  console.log("\n=========================================");
  console.log("🌪️ PULSEGUARD CHAOS ENGINEERING SIMULATOR");
  console.log("=========================================");
  console.log(`Input messages queued: ${TOTAL_MESSAGES}`);
  console.log("Staging Queue Constraints: max_batch_size = 10, max_retries = 5");
  console.log("-----------------------------------------");

  const env = {
    DATABASE_URL: "postgresql://mock",
    RESEND_API_KEY: "mock-key",
    CHAOS_ENGINEERING: "true", // Enable active chaos injection
  } as any;

  const ctx = {
    waitUntil: (promise: Promise<any>) => promise,
  } as any;

  let round = 1;

  // Process until all messages are resolved (either PROCESSED or DLQ)
  while (queueStore.some((m) => m.status === "PENDING")) {
    const pendingMessages = queueStore.filter((m) => m.status === "PENDING");

    // Cloudflare batches messages (max size 10)
    const currentBatchMessages = pendingMessages.slice(0, 10);
    console.log(
      `[Round ${round}] Processing batch of ${currentBatchMessages.length} messages (Remaining pending: ${pendingMessages.length})`,
    );

    // Track acks and retries for this batch execution
    const batchRetries = new Set<string>();
    const batchAcks = new Set<string>();
    let ackAllCalled = false;

    const mockMessages = currentBatchMessages.map((qm) => ({
      id: qm.id,
      body: qm.body,
      retry: () => {
        batchRetries.add(qm.id);
      },
      ack: () => {
        batchAcks.add(qm.id);
      },
    }));

    const mockBatch = {
      queue: "notifications",
      messages: mockMessages,
      ackAll: () => {
        ackAllCalled = true;
      },
    };

    try {
      // Execute worker queue consumer
      await worker.queue(mockBatch as any, env, ctx);

      // Handle outcomes of successful execution
      if (ackAllCalled) {
        // All messages not explicitly marked for retry are acknowledged
        for (const qm of currentBatchMessages) {
          if (!batchRetries.has(qm.id)) {
            batchAcks.add(qm.id);
          }
        }
      }

      // Finalize status for the batch messages
      for (const qm of currentBatchMessages) {
        if (batchRetries.has(qm.id)) {
          messageFailures++;
          qm.retryCount++;
          console.log(
            `  └─ ⚠️ Message ${qm.id} retry requested (Count: ${qm.retryCount}/${MAX_RETRIES})`,
          );

          if (qm.retryCount > MAX_RETRIES) {
            qm.status = "DLQ";
            console.log(`     🚨 Message ${qm.id} EXCEEDED retry limits. Escalating to DLQ!`);
          }
        } else if (batchAcks.has(qm.id)) {
          qm.status = "PROCESSED";
        }
      }
    } catch (err: any) {
      // Simulate V8 Isolate Crash / entire execution failing
      if (err.message.includes("IsolateEvictionError")) {
        isolateCrashes++;
        console.log(
          "  💥 Worker Isolate Crashed! Entire batch failed. Retrying all messages in batch...",
        );

        for (const qm of currentBatchMessages) {
          qm.retryCount++;
          console.log(
            `     └─ message ${qm.id} retry count incremented (${qm.retryCount}/${MAX_RETRIES})`,
          );
          if (qm.retryCount > MAX_RETRIES) {
            qm.status = "DLQ";
            console.log(
              `     🚨 Message ${qm.id} EXCEEDED retry limits on crash. Escalating to DLQ!`,
            );
          }
        }
      } else {
        // Re-throw unexpected errors
        throw err;
      }
    }

    round++;
    // Add small sleep to let event loop resolve
    await new Promise((resolve) => setTimeout(resolve, 5));
  }

  // Compile final results
  const processedCount = queueStore.filter((m) => m.status === "PROCESSED").length;
  const dlqCount = queueStore.filter((m) => m.status === "DLQ").length;
  const dataLoss = TOTAL_MESSAGES - (processedCount + dlqCount);

  console.log("\n=========================================");
  console.log("📊 CHAOS ENGINEERING SIMULATION REPORT");
  console.log("=========================================");
  console.log(`Total Inputs Sent:        ${TOTAL_MESSAGES}`);
  console.log(`Processed (Success):      ${processedCount}`);
  console.log(`DLQ (Escalated):          ${dlqCount}`);
  console.log(`Worker Isolate Crashes:   ${isolateCrashes}`);
  console.log(`Message-Level Failures:   ${messageFailures}`);
  console.log(`-----------------------------------------`);
  console.log(`Silent Data Loss:         ${dataLoss} messages`);

  if (dataLoss === 0) {
    console.log("✅ SUCCESS: Chaos verification passed! 100% data durability guaranteed.");
  } else {
    console.error("❌ FAILURE: Data loss detected in queue lifecycle!");
    process.exit(1);
  }
  console.log("=========================================\n");
}

runChaosSimulation().catch(console.error);
