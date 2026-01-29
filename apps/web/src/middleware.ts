import { type NextRequest, NextResponse } from "next/server";

import { authClient } from "@/lib/auth-client";

export async function middleware(request: NextRequest) {
  const cookie = request.headers.get("cookie") || "";
  let session = null;

  try {
    // Optimization: Avoid loopback latency through tunnel by fetching localhost directly
    // This assumes the Next.js server is running on port 3000
    const res = await fetch("http://127.0.0.1:3000/api/auth/get-session", {
      headers: { cookie },
    });
    session = await res.json();
  } catch (e) {
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
