import { type NextRequest, NextResponse } from "next/server";

import { authClient } from "@/lib/auth-client";

export async function middleware(request: NextRequest) {
  const cookie = request.headers.get("cookie") || "";
  let session = null;

  try {
    // Optimization: Avoid loopback latency through tunnel by fetching localhost directly
    const res = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
      headers: { cookie },
    });
    session = await res.json();
  } catch (e) {
    console.error("Middleware auth check failed, falling back to client:", e);
    // Fallback to standard client if local fetch fails
    const { data } = await authClient.getSession({
      fetchOptions: {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      },
    });
    session = data;
  }

  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
