import { mock } from "bun:test";
import { bench, describe } from "vitest";

let statusPageFindManyCount = 0;

mock.module("@pulseguard/db", () => {
  return {
    getPrisma: () => ({
      monitor: {
        findMany: async (args: any) => {
          return args.where.id.in.map((id: string) => ({
            id,
            alertRules: [],
            user: { email: "test@test.com" },
          }));
        },
      },
      statusPage: {
        findMany: async () => {
          statusPageFindManyCount++;
          return [
            {
              id: "page_1",
              title: "Test Page",
              slug: "test-page",
              subscribers: [],
              monitors: [{ monitorId: "mon_0" }, { monitorId: "mon_1" }],
            },
          ];
        },
      },
      monitorEvent: {
        findFirst: async () => null,
      },
    }),
  };
});

mock.module("@pulseguard/email", () => ({
  sendMonitorAlert: async () => {},
  sendStatusUpdate: async () => {},
}));

import handler from "./notification-handler";

const benchmark = async () => {
  console.log("Setting up bench");

  // We want to test the execution time of a large batch
  // with different monitorIds for INCIDENT_CREATED notifications

  const messages = Array.from({ length: 50 }).map((_, i) => {
    return {
      body: {
        monitorId: `mon_${i}`,
        monitorName: `Monitor ${i}`,
        type: "INCIDENT_CREATED",
        status: "DOWN",
        timestamp: new Date().toISOString(),
        url: "https://example.com",
      },
      ack: () => {},
      retry: () => {},
    };
  });

  const env = { DATABASE_URL: "test", RESEND_API_KEY: "test" } as any;
  const ctx = {} as any;

  // Test current implementation
  const start = performance.now();
  statusPageFindManyCount = 0;
  await handler.queue({ messages } as any, env, ctx);
  const end = performance.now();

  console.log(`Execution time: ${end - start}ms`);
  console.log(`statusPage.findMany calls: ${statusPageFindManyCount}`);
};

benchmark();
