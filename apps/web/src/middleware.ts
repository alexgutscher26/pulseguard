import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@pulseguard/auth";


// Revert to default runtime (Edge compatible) to strictly avoid Node.js/OpenNext conflicts
// export const runtime = "nodejs";

/**
 * Middleware function to handle session validation for incoming requests.
 *
 * It logs the request details and attempts to retrieve the session using Better Auth's API.
 * If the session is not valid and the request is for dashboard routes, it checks for a session cookie
 * to allow optimistic access. If no valid session or cookie is found, it redirects to the login page.
 *
 * @param request - The incoming NextRequest object containing request details and headers.
 * @returns A NextResponse object indicating whether to proceed with the request or redirect to login.
 */
export async function middleware(request: NextRequest) {
  console.log("🔍 Middleware checking:", request.nextUrl.pathname);
  console.log("🔍 Request URL:", request.url);
  
  // Debug: Log all cookies to see what's being received
  const cookieHeader = request.headers.get("cookie");
  console.log("🍪 Cookies received:", cookieHeader);

  let session = null;
  try {
    // Full session validation using Better Auth's server-side API
    // Wrapped in try/catch because it might fail in Edge runtime if it uses Node APIs
    session = await auth.api.getSession({
      headers: request.headers,
    });
  } catch (error) {
    console.error("⚠️ Detailed auth.api.getSession failed:", error);
  }

  console.log("🔍 Session result:", {
    hasSession: !!session,
    hasUser: !!session?.user,
    userId: session?.user?.id,
    path: request.nextUrl.pathname,
  });

  // If accessing dashboard routes without a valid session
  if (!session?.user && request.nextUrl.pathname.startsWith("/dashboard")) {
    
    // Fallback: Check for session cookie manually (Optimistic Check)
    // Sometimes auth.api.getSession might fail in middleware due to headers/context
    // but the cookie is present. We let the page/layout handle the specific validation.
    const cookieHeader = request.headers.get("cookie") || "";
    const hasSessionCookie = cookieHeader.includes("better-auth.session_token") || 
                             cookieHeader.includes("session_token");
    
    if (hasSessionCookie) {
      console.log("⚠️ No session found via API, but session cookie exists. Allowing optimistic access.");
      return NextResponse.next();
    }

    console.log("❌ No session and no session cookie, redirecting to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log("✅ Session valid, allowing access");
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
