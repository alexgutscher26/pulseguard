import { describe, it, expect, mock, spyOn, beforeAll } from "bun:test";

// Mocks must be declared before imports
const mockMonitorFindUnique = mock();
const mockMonitorEventFindFirst = mock();
const mockMonitorFindMany = mock();

const mockPrisma = {
  monitor: {
    findUnique: mockMonitorFindUnique,
    findMany: mockMonitorFindMany,
  },
  monitorEvent: {
    findFirst: mockMonitorEventFindFirst,
  },
};

mock.module("@pulseguard/db", () => {
  return {
    getPrisma: () => mockPrisma,
  };
});

mock.module("@pulseguard/email", () => {
  return {
    sendMonitorAlert: mock(() => Promise.resolve({ id: "mock-id" })),
  };
});

// Import the handler after mocking
import notificationHandler from "./notification-handler";

describe("Notification Handler Performance", () => {
  it("verifies N+1 query optimization", async () => {
    mockMonitorFindUnique.mockReset();
    mockMonitorEventFindFirst.mockReset();
    mockMonitorFindMany.mockReset();

    // Setup mock return value for findMany
    mockMonitorFindMany.mockImplementation(async ({ where }: any) => {
      // Assume where.id.in is passed
      const ids = where.id.in;
      return ids.map((id: string) => ({
        id: id,
        alertRules: [
          {
            trigger: "LATENCY",
            comparison: "GT",
            threshold: 100,
            channels: [{ type: "EMAIL", config: { email: "test@example.com" } }],
          },
        ],
        user: { email: "user@example.com" },
      }));
    });

    const messages = [];
    const count = 5;
    for (let i = 0; i < count; i++) {
      messages.push({
        body: {
          monitorId: `monitor-${i}`,
          monitorName: `Monitor ${i}`,
          url: `http://example.com/${i}`,
          status: "UP",
          type: "HIGH_LATENCY",
          latency: 200, // triggers the rule
          timestamp: new Date().toISOString(),
        },
        ack: () => {},
        retry: () => {},
      });
    }

    const batch = { messages };
    const env = { DATABASE_URL: "mock://url", RESEND_API_KEY: "mock" };
    const ctx = {};

    await notificationHandler.queue(batch as any, env as any, ctx as any);

    console.log(`findUnique called: ${mockMonitorFindUnique.mock.calls.length} times`);
    console.log(`findMany called: ${mockMonitorFindMany.mock.calls.length} times`);

    expect(mockMonitorFindUnique).toHaveBeenCalledTimes(0);
    expect(mockMonitorFindMany).toHaveBeenCalledTimes(1);

    // Optional: verify that findMany was called with correct arguments
    const callArgs = mockMonitorFindMany.mock.calls[0];
    const whereClause = callArgs[0].where;
    expect(whereClause.id.in).toHaveLength(count);
  });
});
