import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

neonConfig.poolQueryViaFetch = true;

export const createPrisma = (databaseUrl: string) => {
  const adapter = new PrismaNeon({
    connectionString: databaseUrl,
  });
  return new PrismaClient({ adapter });
};

// Default instance for environments where the database URL is available
let _prisma: PrismaClient | null = null;

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
    // If specific URL provided, create/return instance (don't cache globally if unique?)
    // Actually, for worker logic, we passed explicit URL.
    return createPrisma(databaseUrl);
  }
  
  if (!_prisma) {
    const url = getUrl();
    if (!url) {
      throw new Error("DATABASE_URL is not set. Ensure it's provided in your environment variables.");
    }
    _prisma = createPrisma(url);
  }
  return _prisma;
};

// Proxy to allow default import to work like a PrismaClient instance
const prismaProxy = new Proxy({} as PrismaClient, {
  get(_, prop, receiver) {
    const client = getPrisma();
    return Reflect.get(client, prop, receiver);
  },
});

export default prismaProxy;
