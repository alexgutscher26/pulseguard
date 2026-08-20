import { NextRequest, NextResponse } from "next/server";
import { trackReferralClick } from "@/actions/referrals";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<Response> {
  const { code } = await params;
  const url = new URL(request.url);

  const utmSource = url.searchParams.get("utm_source") || "status_page";
  const utmMedium = url.searchParams.get("utm_medium") || "badge";
  const utmCampaign =
    url.searchParams.get("utm_campaign") || "status_page_loop";
  const utmContent =
    url.searchParams.get("utm_content") || url.searchParams.get("slug") || "";
  const redirectTo = url.searchParams.get("redirect") || "/signup";

  // Fire and forget click increment
  try {
    if (code) {
      await trackReferralClick(code);
    }
  } catch (err) {
    console.error("Failed to increment referral click in route handler:", err);
  }

  // Construct target redirect URL
  const targetUrl = new URL(redirectTo, url.origin);
  targetUrl.searchParams.set("ref", code);
  targetUrl.searchParams.set("utm_source", utmSource);
  targetUrl.searchParams.set("utm_medium", utmMedium);
  targetUrl.searchParams.set("utm_campaign", utmCampaign);
  if (utmContent) {
    targetUrl.searchParams.set("utm_content", utmContent);
  }

  const response = NextResponse.redirect(targetUrl.toString(), {
    status: 307,
  });

  // Store 30-day attribution cookie
  const cookiePayload = JSON.stringify({
    code,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    timestamp: Date.now(),
  });

  response.cookies.set("steadystack_ref", cookiePayload, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false, // Accessible by client signup form and server actions
  });

  return response;
}
