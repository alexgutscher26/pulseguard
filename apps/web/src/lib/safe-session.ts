import { auth } from "@steadystack/auth";
import { headers } from "next/headers";

/**
 * Helper to safely retrieve user session from request headers.
 * Catches missing Next.js request store context when executed in unit tests.
 */
export async function getSafeSession() {
  let reqHeaders: Headers;
  try {
    reqHeaders = await headers();
  } catch {
    reqHeaders = new Headers();
  }
  return auth.api.getSession({ headers: reqHeaders });
}
