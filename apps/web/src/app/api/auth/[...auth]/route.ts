import { auth } from "@pulseguard/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const handlers = toNextJsHandler(auth);

// Wrap handlers with error logging
export async function GET(req: NextRequest) {
  try {
    const res = await handlers.GET(req);
    // Log unexpected errors even if better-auth catches them internally
    if (res.status === 500) {
       console.error("❌ Auth GET returned 500. Request URL:", req.url);
       try {
         const clone = res.clone();
         console.error("❌ Auth GET 500 Body:", await clone.text());
       } catch (e) {
         console.error("❌ Auth GET 500 Body Unreadable");
       }
    }
    return res;
  } catch (error) {
    console.error("❌ Auth GET Critical Error:", error);
    return NextResponse.json(
      {
        error: "Authentication error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const res = await handlers.POST(req);
    if (res.status === 500) {
       console.error("❌ Auth POST returned 500. Request URL:", req.url);
       try {
         const clone = res.clone();
         console.error("❌ Auth POST 500 Body:", await clone.text());
       } catch (e) {
         console.error("❌ Auth POST 500 Body Unreadable");
       }
    }
    return res;
  } catch (error) {
    console.error("❌ Auth POST Critical Error:", error);
    return NextResponse.json(
      {
        error: "Authentication error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
