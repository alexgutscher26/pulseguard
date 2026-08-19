import type { NextRequest } from "next/server";

import { TRPCError } from "@trpc/server";
import { auth } from "@steadystack/auth";

/** HTTP methods that mutate state and require CSRF protection. */
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * Validate CSRF for state-mutating tRPC calls.
 *
 * Strategy (defence-in-depth, two layers):
 *
 * 1. **Custom header check** — `@trpc/client` always sends `X-TRPC-Source: client`.
 *    Plain HTML forms and cross-origin CSRF attackers cannot set custom headers
 *    without a successful CORS preflight, making this header a reliable signal.
 *
 * 2. **Origin header fallback** — when the custom header is absent, reject
 *    requests whose `Origin` header doesn't match the app's host. Same-origin
 *    browser requests either send no Origin (same-origin navigations) or send
 *    one that matches.
 */
function assertNotCsrf(req: NextRequest): void {
  if (!MUTATING_METHODS.has(req.method)) return;

  // Layer 1: tRPC client always sends this header — CSRF attackers cannot.
  const source = req.headers.get("x-trpc-source");
  if (source === "client") return;

  // Layer 2: Origin check fallback for non-tRPC callers.
  const origin = req.headers.get("origin");
  if (!origin) return; // same-origin navigations omit Origin — allow them

  const host = req.headers.get("host") ?? "";
  try {
    const originHost = new URL(origin).host;
    if (originHost !== host) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "CSRF check failed: Origin mismatch.",
      });
    }
  } catch (err) {
    if (err instanceof TRPCError) throw err;
    // Malformed Origin header — reject to be safe
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "CSRF check failed: Invalid Origin header.",
    });
  }
}

export async function createContext(req: NextRequest) {
  // Guard against CSRF on all state-mutating tRPC calls
  assertNotCsrf(req);

  const session = await auth.api.getSession({
    headers: req.headers,
  });
  return {
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
