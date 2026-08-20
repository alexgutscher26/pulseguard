import { PrismaClient } from "./generated/client/index.js";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool as NeonPool } from "@neondatabase/serverless";

export function createPrisma(databaseUrl?: string, poolUrlOverride?: string) {
  const url =
    databaseUrl ||
    (typeof process !== "undefined" ? process.env.DATABASE_URL : (globalThis as any).DATABASE_URL);

  if (!url) {
    throw new Error("DATABASE_URL is not set. Ensure it's provided in your environment variables.");
  }

  // Prefer DATABASE_POOL_URL when available so the pool targets a connection pooler
  // (e.g. Neon's pooled endpoint or a PgBouncer URL) rather than hitting Postgres directly.
  // DATABASE_URL should still point to the direct connection for Prisma CLI migrations.
  // Set DATABASE_POOL_URL in production to prevent connection exhaustion under load.
  const poolUrl =
    poolUrlOverride ||
    (typeof process !== "undefined" ? process.env?.DATABASE_POOL_URL : undefined) ||
    (typeof globalThis !== "undefined" ? (globalThis as any).DATABASE_POOL_URL : undefined) ||
    url;

  // Determine if SSL is needed but remove sslmode from URL to avoid conflict with explicit ssl config.
  const isSsl = poolUrl.includes("sslmode=require") || poolUrl.includes("sslmode=verify");
  // Strip both sslmode= and channel_binding= — the pg driver and @neondatabase/serverless
  // do not understand channel_binding, causing libpq to treat "neondb&channel_binding=require"
  // as the literal database name (P1003).
  const cleanUrl = poolUrl
    .replace(/[?&]sslmode=[^&]+/g, "")
    .replace(/[?&]channel_binding=[^&]+/g, "")
    // Tidy up any dangling ? or & left after stripping params
    .replace(/\?&/, "?")
    .replace(/[?&]$/, "");

  const isNeon =
    poolUrl.includes("neon.tech") ||
    (typeof process !== "undefined" && process.env.DATABASE_URL?.includes("neon.tech"));

  let pool: any;
  let adapter: any;

  if (isNeon) {
    // Use @neondatabase/serverless for Neon — it handles SSL natively via WebSockets
    // and correctly parses Neon pooler connection strings.
    pool = new NeonPool({ connectionString: cleanUrl });
    adapter = new PrismaNeon(pool);
  } else {
    const poolConfig: any = {
      connectionString: cleanUrl,
      // Bounded pool size to avoid connection exhaustion in serverless / edge isolates
      max: 5,
      // Keep idle connections long enough to be reused across periodic ticks
      idleTimeoutMillis: 30_000,
      // Extended timeout for high-latency or cross-region connections
      connectionTimeoutMillis: 10_000,
      // TCP keep-alive prevents intermediate proxies and NATs from silently dropping connections
      keepAlive: true,
      keepAliveInitialDelayMillis: 5_000,
    };

    // Enable SSL for cloud PostgreSQL providers and production
    const isCloudProvider =
      poolUrl.includes("supabase.com") ||
      poolUrl.includes("supabase.co") ||
      poolUrl.includes("pooler") ||
      poolUrl.includes("amazonaws.com");

    if (isSsl || isCloudProvider || process.env.NODE_ENV === "production") {
      poolConfig.ssl = { rejectUnauthorized: false };
    }

    pool = new Pool(poolConfig);
    pool.on("error", (err: any) => {
      // pg.Pool handles dead idle connections automatically by removing them from the pool.
      // NEVER call resetPrisma or pool.end() here as it closes the entire pool and destroys active queries.
      console.warn("[PG Pool] Idle client connection event (handled by pool):", err.message);
    });
    adapter = new PrismaPg(pool);
  }

  const isDev = typeof process !== "undefined" && process.env?.NODE_ENV === "development";

  const client = new PrismaClient({
    adapter,
    log: isDev ? ["query", "error", "warn"] : ["error"],
  });
  (client as any).$pool = pool;
  return client;
}

// Global type for singleton storage
type PrismaSingleton = {
  prisma?: PrismaClient | undefined;
  instances?: Map<string, PrismaClient> | undefined;
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
  if (databaseUrl && g.instances?.has(databaseUrl)) {
    const client = g.instances.get(databaseUrl);
    g.instances.delete(databaseUrl);
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
  }

  if (g.prisma) {
    const oldClient = g.prisma;
    g.prisma = undefined;
    try {
      await oldClient.$disconnect();
    } catch {}
    if ((oldClient as any).$pool) {
      try {
        await (oldClient as any).$pool.end();
      } catch {}
    }
  }
}

export function getPrisma(databaseUrl?: string, poolUrlOverride?: string) {
  const cacheKey =
    poolUrlOverride && databaseUrl ? `${databaseUrl}:${poolUrlOverride}` : databaseUrl;
  if (cacheKey) {
    const existing = g.instances?.get(cacheKey);
    if (existing) {
      const pool = (existing as any).$pool;
      if (pool && (pool.ended || pool.ending)) {
        g.instances?.delete(cacheKey);
      } else {
        return existing;
      }
    }
    const created = createPrisma(databaseUrl, poolUrlOverride);
    g.instances?.set(cacheKey, created);
    return created;
  }

  if (g.prisma) {
    const pool = (g.prisma as any).$pool;
    if (pool && (pool.ended || pool.ending)) {
      g.prisma = undefined;
    }
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
export * from "./generated/client/index.js";
