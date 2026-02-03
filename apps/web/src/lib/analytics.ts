import { createHash } from "crypto";

// Ideally this should be in .env
const SALT = process.env.ANALYTICS_SALT || "pulseguard-analytics-salt";

/**
 * Generates a privacy-preserving hash for a visitor.
 * Uses SHA-256 to anonymize the IP address.
 * 
 * @param ip - Raw IP address
 * @param userAgent - User Agent string (optional, for entropy)
 * @returns SHA-256 hex string
 */
export function hashVisitor(ip: string, userAgent: string = ""): string {
  // We prioritize IP-based uniqueness with a salt.
  // Including UserAgent can increase entropy but also fragmentation.
  // For 'Status Page' simple analytics, IP + Salt is standard standard.
  const input = `${ip}-${SALT}`;
  // return createHash("sha256").update(input).digest("hex");
  
  // SHA-256 might be overkill for simple ID, but its standard.
  return createHash("sha256").update(input).digest("hex");
}
