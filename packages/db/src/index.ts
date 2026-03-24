import { PrismaClient } from "./generated/client/edge.js";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

export const createPrisma = (databaseUrl?: string) => {
  const url = databaseUrl || process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is not set. Ensure it's provided in your environment variables.");
  }

  // Determine if SSL is needed but remove sslmode from URL to avoid conflict with explicit ssl config
  const isSsl = url.includes("sslmode=require") || url.includes("sslmode=verify");
  const cleanUrl = url.replace(/[?&]sslmode=[^&]+/, "");

  const poolConfig: any = {
    connectionString: cleanUrl,
    // Slightly increase max to avoid checkout timeout when multiple actions happen at once (like Dashboard)
    max: 10,
    // Release idle connections quickly in a serverless environment
    idleTimeoutMillis: 10_000,
    // Increase to 30s as default to handle cold-starts/latency spikes better
    connectionTimeoutMillis: 30_000,
  };

  if (isSsl) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }

  const pool = new Pool(poolConfig);
  const adapter = new PrismaPg(pool);

  const isDev = process.env.NODE_ENV === "development";

  return new PrismaClient({
    adapter,
    log: isDev ? ["query", "error", "warn"] : ["error"],
  });
};

// Global type for singleton storage
type PrismaSingleton = {
  prisma?: PrismaClient;
  instances?: Map<string, PrismaClient>;
};

const g = globalThis as unknown as PrismaSingleton;
if (!g.instances) {
  g.instances = new Map<string, PrismaClient>();
}

const getUrl = () => {
  if (typeof process !== "undefined" && process.env?.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  if (typeof globalThis !== "undefined" && (globalThis as any).DATABASE_URL) {
    return (globalThis as any).DATABASE_URL;
  }
  try {
    // Fallback for Next.js/Node environments using standard env package if process.env is missing (rare)
    const { env } = require("@pulseguard/env/server");
    return env.DATABASE_URL;
  } catch (e) {
    return undefined;
  }
};

export const getPrisma = (databaseUrl?: string) => {
  if (databaseUrl) {
    if (!g.instances!.has(databaseUrl)) {
      g.instances!.set(databaseUrl, createPrisma(databaseUrl));
    }
    return g.instances!.get(databaseUrl)!;
  }

  if (!g.prisma) {
    const url = getUrl();
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set. Ensure it's provided in your environment variables.",
      );
    }
    g.prisma = createPrisma(url);
  }
  return g.prisma;
};

// Proxy to allow default import to work like a PrismaClient instance
const prismaProxy = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma();
    // @ts-ignore
    const value = client[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

export default prismaProxy;
export * from "./generated/client/edge.js";
