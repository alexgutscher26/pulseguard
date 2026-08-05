/**
 * Application-level error with an associated HTTP status code.
 *
 * Thrown by route handlers and services to signal a known failure (bad
 * request, unauthorized access, etc.). Uncaught `AppError` instances are
 * converted into JSON responses by the route dispatcher.
 */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    options?: { cause?: unknown; code?: string },
  ) {
    super(message, options);
    this.name = "AppError";
  }
}
