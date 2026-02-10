import { describe, it, expect, mock, beforeEach } from "bun:test";

// Mock dependencies BEFORE importing the module under test
const mockFindMany = mock(() => Promise.resolve([]));
const mockFindUnique = mock((args: any) =>
  Promise.resolve({
    id: args.where.id,
    alertRules: [],
    user: { email: "test@example.com" },
  }),
);

mock.module("@pulseguard/db", () => ({
  getPrisma: () => ({
    monitor: {
      findUnique: mockFindUnique,
    },
    statusPage: {
      findMany: mockFindMany,
    },
    monitorEvent: {
      findFirst: mock(() => Promise.resolve(null)),
    },
  }),
}));

mock.module("@pulseguard/email", () => ({
  sendMonitorAlert: mock(() => Promise.resolve()),
  sendStatusUpdate: mock(() => Promise.resolve()),
}));

// Import the module under test
import notificationHandler from "./notification-handler";

describe("Notification Handler Performance", () => {
  beforeEach(() => {
    mockFindMany.mockClear();
    mockFindUnique.mockClear();
  });

  it("reproduces N+1 query issue for status pages", async () => {
    const messageCount = 10;
    const messages = Array.from({ length: messageCount }, (_, i) => ({
      id: `msg-${i}`,
      timestamp: new Date(),
      body: {
        type: "INCIDENT_CREATED", // Triggers status page check
        monitorId: `monitor-${i}`,
        monitorName: `Monitor ${i}`,
        url: `http://example.com/${i}`,
        status: "DOWN",
        timestamp: new Date().toISOString(),
      },
      ack: () => {},
      retry: () => {},
    }));

    const batch = {
      queue: "notifications",
      messages,
      ackAll: () => {},
      retryAll: () => {},
    };

    const env = {
      DATABASE_URL: "postgres://mock",
      RESEND_API_KEY: "mock",
    };

    // @ts-ignore
    await notificationHandler.queue(batch, env, {});

    console.log(`findMany called: ${mockFindMany.mock.calls.length} times`);

    // OPTIMIZED: Should call findMany once for the entire batch
    expect(mockFindMany.mock.calls.length).toBe(1);
  });
});
