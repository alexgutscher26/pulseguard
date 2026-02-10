import { expect, test, mock, describe, beforeEach } from "bun:test";
import { verifySession, verifyMonitorAccess } from "./auth";

// Mock DB client
const mockPrismaClient = {
  session: {
    findUnique: mock(),
  },
  monitor: {
    findUnique: mock(),
  },
};

// Mock getPrisma
mock.module("@pulseguard/db", () => {
  return {
    getPrisma: () => mockPrismaClient,
  };
});

describe("Auth Lib", () => {
  const env = { DATABASE_URL: "postgres://mock" };

  beforeEach(() => {
    mockPrismaClient.session.findUnique.mockReset();
    mockPrismaClient.monitor.findUnique.mockReset();
  });

  describe("verifySession", () => {
    test("should return null if no cookie header", async () => {
      const req = new Request("http://localhost");
      const result = await verifySession(req, env);
      expect(result).toBeNull();
    });

    test("should return null if no valid token in cookie", async () => {
      const req = new Request("http://localhost", {
        headers: { Cookie: "foo=bar" },
      });
      const result = await verifySession(req, env);
      expect(result).toBeNull();
    });

    test("should return null if session not found", async () => {
      const req = new Request("http://localhost", {
        headers: { Cookie: "better-auth.session_token=valid-token" },
      });

      mockPrismaClient.session.findUnique.mockResolvedValue(null);

      const result = await verifySession(req, env);
      expect(result).toBeNull();
      expect(mockPrismaClient.session.findUnique).toHaveBeenCalledWith({
        where: { token: "valid-token" },
        select: { userId: true, expiresAt: true },
      });
    });

    test("should return null if session expired", async () => {
      const req = new Request("http://localhost", {
        headers: { Cookie: "better-auth.session_token=expired-token" },
      });

      mockPrismaClient.session.findUnique.mockResolvedValue({
        userId: "user-1",
        expiresAt: new Date(Date.now() - 10000), // Expired
      });

      const result = await verifySession(req, env);
      expect(result).toBeNull();
    });

    test("should return user id if session valid", async () => {
      const req = new Request("http://localhost", {
        headers: { Cookie: "better-auth.session_token=valid-token" },
      });

      mockPrismaClient.session.findUnique.mockResolvedValue({
        userId: "user-1",
        expiresAt: new Date(Date.now() + 10000), // Valid
      });

      const result = await verifySession(req, env);
      expect(result).toEqual({ userId: "user-1" });
    });

    test("should check secure cookie too", async () => {
       const req = new Request("http://localhost", {
        headers: { Cookie: "__Secure-better-auth.session_token=secure-token" },
      });

      mockPrismaClient.session.findUnique.mockResolvedValue({
        userId: "user-secure",
        expiresAt: new Date(Date.now() + 10000),
      });

      const result = await verifySession(req, env);
      expect(result).toEqual({ userId: "user-secure" });
      expect(mockPrismaClient.session.findUnique).toHaveBeenCalledWith({
        where: { token: "secure-token" },
        select: { userId: true, expiresAt: true },
      });
    });
  });

  describe("verifyMonitorAccess", () => {
    test("should return false if monitor not found", async () => {
      mockPrismaClient.monitor.findUnique.mockResolvedValue(null);
      const result = await verifyMonitorAccess("user-1", "mon-1", env);
      expect(result).toBe(false);
    });

    test("should return false if user does not own monitor", async () => {
      mockPrismaClient.monitor.findUnique.mockResolvedValue({ userId: "user-2" });
      const result = await verifyMonitorAccess("user-1", "mon-1", env);
      expect(result).toBe(false);
    });

    test("should return true if user owns monitor", async () => {
      mockPrismaClient.monitor.findUnique.mockResolvedValue({ userId: "user-1" });
      const result = await verifyMonitorAccess("user-1", "mon-1", env);
      expect(result).toBe(true);
    });
  });
});
