import { getPrisma, PrismaClient } from "@pulseguard/db";

// Lazy proxy to defer initialization until access
// This prevents load-time crashes if environment variables are not yet set
let _db: PrismaClient | null = null;

export const db = new Proxy({} as PrismaClient, {
  get: (_target, prop) => {
    if (!_db) {
      // Ensure we don't crash hard if getPrisma throws, though it should throw if env missing
      _db = getPrisma(); 
    }
    // @ts-ignore
    const value = _db[prop];
    // Bind functions to the instance
    if (typeof value === 'function') {
      return value.bind(_db);
    }
    return value;
  }
});
