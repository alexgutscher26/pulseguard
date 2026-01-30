import { type NextRequest, NextResponse } from "next/server";

import { authClient } from "@/lib/auth-client";

export async function middleware(request: NextRequest) {
  const cookie = request.headers.get("cookie") || "";
  let session = null;

  // Optimization: Try multiple paths to resolve the session
  const fetchSession = async (url: string) => {
    try {
      const res = await fetch(url, {
        headers: { cookie },
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
      console.error(`Middleware auth check failed for ${url}: Status ${res.status}`);
    } catch (e) {
      console.error(`Middleware auth check failed for ${url}:`, e);
    }
    return null;
  };

  // 1. Try localhost directly (fastest for local dev/tunnels)
  session = await fetchSession("http://127.0.0.1:3000/api/auth/get-session");

  // 2. Fallback to current origin (reliable for deployed envs)
  if (!session) {
    console.log("Fallback to origin fetch for session");
    session = await fetchSession(`${request.nextUrl.origin}/api/auth/get-session`);
  }

  // 3. Final fallback to authClient (uses configured baseURL)
  if (!session) {
    console.log("Fallback to authClient for session");
    try {
      const { data } = await authClient.getSession({
        fetchOptions: {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        },
      });
      session = data;
    } catch (e) {
      console.error("Middleware authClient fallback failed:", e);
    }
  }

  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
