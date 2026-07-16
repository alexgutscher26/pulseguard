import { PrismaClient } from "./generated/client/edge.js";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

export function createPrisma(databaseUrl?: string) {
  const url =
    databaseUrl ||
    (typeof process !== "undefined" ? process.env.DATABASE_URL : (globalThis as any).DATABASE_URL);

  if (!url) {
    throw new Error("DATABASE_URL is not set. Ensure it's provided in your environment variables.");
  }

  // Determine if SSL is needed but remove sslmode from URL to avoid conflict with explicit ssl config
  const isSsl = url.includes("sslmode=require") || url.includes("sslmode=verify");
  const cleanUrl = url.replace(/[?&]sslmode=[^&]+/, "");

  const poolConfig: any = {
    connectionString: cleanUrl,
    // Set max: 1 for edge workers to prevent stale connections from being reused in the pool.
    // Since worker isolates run single-threaded, they only need 1 connection.
    max: 1,
    // Release idle connections quickly in a serverless environment
    idleTimeoutMillis: 10_000,
    // Increase to 30s as default to handle cold-starts/latency spikes better
    connectionTimeoutMillis: 30_000,
  };

  if (isSsl || url.includes("supabase") || url.includes("neon.tech")) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }

  const pool = new Pool(poolConfig);
  pool.on("error", (err) => {
    console.error("[PG Pool Error] Unexpected error on idle client:", err.message);
    if (
      err.message?.includes("Connection terminated") ||
      err.message?.includes("closed") ||
      err.message?.includes("terminate")
    ) {
      console.warn(
        "[PG Pool Error] Stale connection detected. Proactively clearing client singleton cache.",
      );
      resetPrisma(url).catch(() => {});
    }
  });
  const adapter = new PrismaPg(pool);

  const isDev = typeof process !== "undefined" && process.env.NODE_ENV === "development";

  const client = new PrismaClient({
    adapter,
    log: isDev ? ["query", "error", "warn"] : ["error"],
  });
  (client as any).$pool = pool;
  return client;
}

// Global type for singleton storage
type PrismaSingleton = {
  prisma?: PrismaClient;
  instances?: Map<string, PrismaClient>;
};

const g = globalThis as unknown as PrismaSingleton;
if (!g.instances) {
  g.instances = new Map<string, PrismaClient>();
}

function getUrl() {
  if (typeof process !== "undefined" && process.env?.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  if (typeof globalThis !== "undefined" && (globalThis as any).DATABASE_URL) {
    return (globalThis as any).DATABASE_URL;
  }
  return undefined;
}

export async function resetPrisma(databaseUrl?: string) {
  if (databaseUrl) {
    if (g.instances!.has(databaseUrl)) {
      const client = g.instances!.get(databaseUrl);
      if (client) {
        try {
          await client.$disconnect();
        } catch {}
        if ((client as any).$pool) {
          try {
            await (client as any).$pool.end();
          } catch {}
        }
      }
      g.instances!.delete(databaseUrl);
    }
  } else {
    if (g.prisma) {
      try {
        await g.prisma.$disconnect();
      } catch {}
      if ((g.prisma as any).$pool) {
        try {
          await (g.prisma as any).$pool.end();
        } catch {}
      }
      g.prisma = undefined;
    }
  }
}

export function getPrisma(databaseUrl?: string) {
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
}

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
