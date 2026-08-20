import type { ExecutionContext } from "@cloudflare/workers-types";
import type { Env } from "../env";

export interface RouteContext {
  request: Request;
  env: Env;
  ctx: ExecutionContext;
}

/**
 * A route handler. Returns a `Response` when the handler owns the request, or
 * `null` to fall through to the next registered route.
 */
export type RouteHandler = (
  ctx: RouteContext,
  url: URL,
) => Promise<Response | null>;
