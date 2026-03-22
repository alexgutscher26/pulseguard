import { PrismaClient } from "./generated/client/index.js";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

export const createPrisma = (databaseUrl?: string) => {
  const url = databaseUrl || process.env.DATABASE_URL;

  // Determine if SSL is needed but remove sslmode from URL to avoid conflict with explicit ssl config
  const isSsl = url.includes("sslmode=require") || url.includes("sslmode=verify");
  const cleanUrl = url.replace(/[?&]sslmode=[^&]+/, "");

  const poolConfig: any = {
    connectionString: cleanUrl,
    // Keep pool size small — Neon's session-mode pooler caps total clients at `pool_size`.
    // Each serverless function instance must use a tiny slice to avoid MaxClientsInSessionMode.
    max: 5,
    // Release idle connections quickly in a serverless environment
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 5_000,
  };

  if (isSsl) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }

  const pool = new Pool(poolConfig);
  const adapter = new PrismaPg(pool);

  return new PrismaClient({ adapter });
};

// Default instance for environments where the database URL is available
let _prisma: PrismaClient | null = null;
const prismaInstances = new Map<string, PrismaClient>();

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
    if (!prismaInstances.has(databaseUrl)) {
      prismaInstances.set(databaseUrl, createPrisma(databaseUrl));
    }
    return prismaInstances.get(databaseUrl)!;
  }

  if (!_prisma) {
    const url = getUrl();
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set. Ensure it's provided in your environment variables.",
      );
    }
    _prisma = createPrisma(url);
  }
  return _prisma;
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
export * from "./generated/client/index.js";
