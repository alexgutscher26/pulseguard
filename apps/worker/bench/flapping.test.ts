import { describe, test, expect, mock } from "bun:test";

// --- MOCKS ---

// Mock cloudflare:sockets
mock.module("cloudflare:sockets", () => ({
  connect: () => ({
    opened: Promise.resolve(),
    close: () => Promise.resolve(),
  }),
}));

// Mock cloudflare:workers (DurableObject)
mock.module("cloudflare:workers", () => ({
  DurableObject: class {
    constructor(state: any, env: any) {
      this.state = state;
      this.env = env;
    }
  },
}));

// Mock @pulseguard/db
const mockPrisma = {
  monitorEvent: {
    count: mock(async () => {
      // Simulate DB latency for count query
      await new Promise((resolve) => setTimeout(resolve, 5));
      return 0; // Return 0 events (not flapping)
    }),
    create: mock(async () => {}),
    groupBy: mock(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return [];
    }),
  },
  monitor: {
    update: mock(async () => {}),
  },
  incident: {
    findFirst: mock(async () => null), // No active incident
    create: mock(async () => ({ id: "inc-1" })),
    update: mock(async () => {}),
  },
  regionalIncident: {
    findFirst: mock(async () => null),
    create: mock(async () => {}),
    update: mock(async () => {}),
  },
  regionalBaseline: {
    findUnique: mock(async () => null),
    create: mock(async () => {}),
    update: mock(async () => {}),
  },
  latencyAggregate: {
    createMany: mock(async () => {}),
  },
  $transaction: mock(async (actions: any[]) => Promise.all(actions)),
};

mock.module("@pulseguard/db", () => ({
  getPrisma: () => mockPrisma,
  LatencyGranularity: { ONE_MINUTE: "ONE_MINUTE" },
}));

// Attempt to mock IncidentService via module mock (might fail due to path resolution)
// We rely on mockPrisma as a fallback
mock.module("./lib/incident-service", () => ({
  IncidentService: class {
    async findActiveIncident() { return null; }
    async createIncident() { return { id: "inc-1" }; }
    async logStillDown() {}
    async resolveIncident() {}
    async createRegionalIncident() {}
    async findActiveRegionalIncident() { return null; }
    async resolveRegionalIncident() {}
  }
}));

// Mock LatencyBuffer
mock.module("./lib/latency-calculator", () => ({
  LatencyBuffer: class {
    add() {}
    getAggregates() { return { sampleCount: 0 }; }
    reset() {}
  }
}));

// Mock global fetch
global.fetch = mock(async (url: any) => {
    // Return DOWN status (500 error)
    return {
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    } as any;
});

// Mock notification-handler
mock.module("./notification-handler", () => ({
  default: {
    queue: mock(async () => {}),
  }
}));

// Import the function to benchmark
const { processBatch } = await import("../src/index");

describe("Flapping Detection Benchmark", () => {
  test("Should optimize N+1 queries", async () => {
    // Setup 50 monitors
    // Status is DOWN to avoid retry logic (1st check fails, matches current status)
    const monitors = Array.from({ length: 50 }, (_, i) => ({
      id: `monitor-${i}`,
      url: `http://example.com/${i}`,
      name: `Monitor ${i}`,
      interval: 60,
      timeout: 10,
      status: "DOWN",
      checkRegions: null,
      alertThreshold: 1,
      maintenanceWindows: [],
    }));

    console.log("Starting benchmark with 50 monitors...");
    const start = performance.now();

    // Run the batch
    await processBatch(monitors, mockPrisma, {} as any);

    const end = performance.now();
    const duration = end - start;

    const countCalls = mockPrisma.monitorEvent.count.mock.calls.length;
    const groupByCalls = mockPrisma.monitorEvent.groupBy.mock.calls.length;

    console.log(`\n--- Results ---`);
    console.log(`Duration: ${duration.toFixed(2)}ms`);
    console.log(`monitorEvent.count calls: ${countCalls}`);
    console.log(`monitorEvent.groupBy calls: ${groupByCalls}`);
    console.log(`-----------------`);

    // Optimized expectation: 0 count calls, 1 groupBy call
    expect(countCalls).toBe(0);
    expect(groupByCalls).toBe(1);
  });
});
