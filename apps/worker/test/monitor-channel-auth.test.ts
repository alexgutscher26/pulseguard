import { describe, it, expect, mock, beforeEach } from "bun:test";

// Mock cloudflare:workers
mock.module("cloudflare:workers", () => {
  return {
    DurableObject: class DurableObject {
      ctx: any;
      env: any;
      constructor(ctx: any, env: any) {
        this.ctx = ctx;
        this.env = env;
      }
    },
  };
});

// Mock WebSocketPair
const mockWebSocketPair = class WebSocketPair {
  client: any;
  server: any;
  constructor() {
    this.client = {};
    this.server = { addEventListener: () => {} };
  }
};
globalThis.WebSocketPair = mockWebSocketPair as any;

// Mock Response
const MockResponse = class Response {
  body: any;
  status: number;
  headers: any;
  constructor(body: any, init: any = {}) {
    this.body = body;
    this.status = init.status || 200;
    this.headers = new Map(Object.entries(init.headers || {}));
  }
};
globalThis.Response = MockResponse as any;


// Mock @pulseguard/db
const mockSessionFindUnique = mock(() => Promise.resolve(null));
const mockMonitorFindUnique = mock(() => Promise.resolve(null));

mock.module("@pulseguard/db", () => {
  return {
    getPrisma: () => ({
      session: { findUnique: mockSessionFindUnique },
      monitor: { findUnique: mockMonitorFindUnique },
    }),
  };
});

// Import the class under test - using dynamic import to ensure mocks apply
const { MonitorChannel } = await import("../src/durable-objects/MonitorChannel");

describe("MonitorChannel Auth", () => {
  const env = { DATABASE_URL: "postgres://mock" };
  const state = {
    id: { toString: () => "mock-id" },
    waitUntil: () => {},
    getWebSockets: () => [],
    acceptWebSocket: () => {},
  } as any;

  beforeEach(() => {
    mockSessionFindUnique.mockClear();
    mockMonitorFindUnique.mockClear();
  });

  it("should return 400 if monitorId is missing", async () => {
    const channel = new MonitorChannel(state, env);
    const request = new Request("https://monitor-channel/websocket", {
      headers: { Upgrade: "websocket" }
    });

    const response = await channel.fetch(request);
    expect(response.status).toBe(400);
    expect(response.body).toBe("Missing Monitor ID");
  });

  it("should return 401 if no cookies", async () => {
    const channel = new MonitorChannel(state, env);
    const request = new Request("https://monitor-channel/websocket?monitorId=123", {
      headers: { Upgrade: "websocket" }
    });

    const response = await channel.fetch(request);
    expect(response.status).toBe(401);
  });

  it("should return 401 if invalid session token", async () => {
    mockSessionFindUnique.mockResolvedValue(null);

    const channel = new MonitorChannel(state, env);
    const request = new Request("https://monitor-channel/websocket?monitorId=123", {
      headers: {
        Upgrade: "websocket",
        Cookie: "better-auth.session_token=invalid"
      }
    });

    const response = await channel.fetch(request);
    expect(response.status).toBe(401);
  });

  it("should return 401 if session expired", async () => {
    mockSessionFindUnique.mockResolvedValue({
      userId: "user1",
      expiresAt: new Date(Date.now() - 10000) // Expired
    });

    const channel = new MonitorChannel(state, env);
    const request = new Request("https://monitor-channel/websocket?monitorId=123", {
      headers: {
        Upgrade: "websocket",
        Cookie: "better-auth.session_token=expired"
      }
    });

    const response = await channel.fetch(request);
    expect(response.status).toBe(401); // My implementation returns null if expired, so 401
  });

  it("should return 403 if user does not own monitor", async () => {
    mockSessionFindUnique.mockResolvedValue({
      userId: "user1",
      expiresAt: new Date(Date.now() + 10000) // Valid
    });
    mockMonitorFindUnique.mockResolvedValue({
      userId: "user2" // Different user
    });

    const channel = new MonitorChannel(state, env);
    const request = new Request("https://monitor-channel/websocket?monitorId=123", {
      headers: {
        Upgrade: "websocket",
        Cookie: "better-auth.session_token=valid"
      }
    });

    const response = await channel.fetch(request);
    expect(response.status).toBe(403);
  });

  it("should return 101 if authorized", async () => {
    mockSessionFindUnique.mockResolvedValue({
      userId: "user1",
      expiresAt: new Date(Date.now() + 10000) // Valid
    });
    mockMonitorFindUnique.mockResolvedValue({
      userId: "user1" // Same user
    });

    const channel = new MonitorChannel(state, env);
    const request = new Request("https://monitor-channel/websocket?monitorId=123", {
      headers: {
        Upgrade: "websocket",
        Cookie: "better-auth.session_token=valid"
      }
    });

    const response = await channel.fetch(request);
    expect(response.status).toBe(101);
  });
});
