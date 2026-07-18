import { NextRequest, NextResponse } from "next/server";
import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import prisma from "@pulseguard/db";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // This represents user ID in our authorize URL
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/dashboard/integrations?error=vercel_auth_failed", req.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/dashboard/integrations?error=no_code", req.url));
  }

  // 1. Identify and verify User session matches the state parameter
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If state was provided, check it to mitigate CSRF
  if (state && state !== session.user.id) {
    return NextResponse.redirect(new URL("/dashboard/integrations?error=csrf_validation_failed", req.url));
  }

  const clientId = process.env.VERCEL_CLIENT_ID;
  const clientSecret = process.env.VERCEL_CLIENT_SECRET;
  const redirectUri = process.env.VERCEL_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    console.error("Vercel OAuth credentials missing in environment");
    return NextResponse.redirect(new URL("/dashboard/integrations?error=vercel_credentials_missing", req.url));
  }

  try {
    // 2. Exchange code for access token
    const tokenResponse = await fetch("https://api.vercel.com/v2/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Vercel token exchange failed:", errorText);
      return NextResponse.redirect(
        new URL(`/dashboard/integrations?error=vercel_exchange_failed&details=${encodeURIComponent(errorText)}`, req.url)
      );
    }

    const data = (await tokenResponse.json()) as any;
    const accessToken = data.access_token;
    const teamId = data.team_id || "personal";
    const configurationId = data.installation_id || data.configuration_id;

    if (!accessToken) {
      console.error("Vercel response did not return access_token:", data);
      return NextResponse.redirect(
        new URL("/dashboard/integrations?error=vercel_invalid_token", req.url)
      );
    }

    // 3. Fetch scope name and slug (Team or User)
    let teamName = "Personal Account";
    let teamSlug = "personal";

    if (teamId && teamId !== "personal") {
      try {
        const teamResponse = await fetch(`https://api.vercel.com/v2/teams/${teamId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (teamResponse.ok) {
          const teamData = (await teamResponse.json()) as any;
          teamName = teamData.name || teamData.slug;
          teamSlug = teamData.slug;
        }
      } catch (err) {
        console.error("Failed to fetch team details from Vercel:", err);
      }
    } else {
      try {
        const userResponse = await fetch("https://api.vercel.com/v2/user", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (userResponse.ok) {
          const userData = (await userResponse.json()) as any;
          const userObj = userData.user || userData;
          teamName = userObj.name || userObj.username || "Personal Account";
          teamSlug = userObj.username || "personal";
        }
      } catch (err) {
        console.error("Failed to fetch user details from Vercel:", err);
      }
    }

    // 4. Save/Upsert Vercel integration in database
    await prisma.userIntegration.upsert({
      where: {
        userId_provider_teamId: {
          userId: session.user.id,
          provider: "vercel",
          teamId,
        },
      },
      update: {
        accessToken,
        configurationId,
        teamName,
        teamSlug,
      },
      create: {
        userId: session.user.id,
        provider: "vercel",
        accessToken,
        configurationId,
        teamId,
        teamName,
        teamSlug,
      },
    });

    return NextResponse.redirect(new URL("/dashboard/integrations?success=vercel_connected", req.url));
  } catch (err) {
    console.error("Vercel OAuth Exception:", err);
    return NextResponse.redirect(new URL("/dashboard/integrations?error=internal_error", req.url));
  }
}
