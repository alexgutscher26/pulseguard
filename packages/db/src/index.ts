import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client/index.js";

export const createPrisma = (databaseUrl: string) => {
  // Ensure SSL is used for Supabase connections if not explicitly disabled
  const isSupabase = databaseUrl.includes("supabase.co") || databaseUrl.includes("supabase.com");
  const hasSslParam = databaseUrl.includes("sslmode=");

  let connectionString = databaseUrl;

  // Supabase Workaround:
  // The standard 'pg' driver uses prepared statements by default.
  // Supabase's Transaction Pooler (port 6543) does not support named prepared statements, leading to "prepared statement 's0' already exists" errors.
  // We automatically switch to the Session Pooler (port 5432) if detected, which supports prepared statements.
  if (isSupabase) {
    if (connectionString.includes(":6543")) {
      console.warn("⚠️ Detected Supabase Transaction Pooler (port 6543). Switching to Session Pooler (port 5432) to support prepared statements.");
      connectionString = connectionString.replace(":6543", ":5432");
    }

    if (!hasSslParam) {
      const separator = connectionString.includes("?") ? "&" : "?";
      connectionString += `${separator}sslmode=require`;
    }
  }

  const pool = new Pool({
    connectionString,
    max: 10, // Default to 10 connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000, // Fail fast if unreachable
  });

  pool.on("error", (err) => {
    console.error("❌ PostgreSQL Pool Error:", err);
  });

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
