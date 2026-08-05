import { AppError } from "../errors";

export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/** Build a JSON response with CORS headers applied by default. */
export function json(data: unknown, status = 200, extraHeaders?: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS, ...extraHeaders },
  });
}

/** Parse a JSON request body, throwing an AppError(400) for malformed input. */
export async function requireJsonBody(request: Request): Promise<any> {
  try {
    return await request.json();
  } catch {
    throw new AppError(400, "Invalid JSON body");
  }
}

/**
 * Convert a caught error into a standardized JSON error response.
 *
 * AppError instances map to their own status code; anything else becomes a
 * generic 500 response.
 */
export function errorResponse(err: unknown): Response {
  if (err instanceof AppError) {
    return json({ error: err.message }, err.statusCode);
  }
  const message = err instanceof Error ? err.message : "Internal server error";
  return json({ error: message }, 500);
}

/** Wrap a route handler so thrown errors become standardized JSON responses. */
export function withErrorHandling<T extends any[]>(
  handler: (...args: T) => Promise<Response | null>,
): (...args: T) => Promise<Response | null> {
  return async (...args: T) => {
    try {
      return await handler(...args);
    } catch (err) {
      console.error("[Route Error]", err);
      return errorResponse(err);
    }
  };
}
