import { auth } from "@pulseguard/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const handlers = toNextJsHandler(auth);

// Wrap handlers with error logging
export async function GET(req: NextRequest) {
  try {
    return await handlers.GET(req);
  } catch (error) {
    console.error("❌ Auth GET Error:", error);
    return NextResponse.json(
      { error: "Authentication error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * Handles POST requests for authentication.
 *
 * This function attempts to process the incoming request using the handlers.POST method.
 * If an error occurs during this process, it logs the error and returns a JSON response
 * indicating an authentication error along with the error details.
 *
 * @param req - The NextRequest object representing the incoming request.
 */
export async function POST(req: NextRequest) {
  try {
    return await handlers.POST(req);
  } catch (error) {
    console.error("❌ Auth POST Error:", error);
    return NextResponse.json(
      { error: "Authentication error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}