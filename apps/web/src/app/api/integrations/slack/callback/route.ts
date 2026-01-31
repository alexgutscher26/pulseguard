import { NextRequest, NextResponse } from "next/server";
import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { getPrisma } from "@pulseguard/db";

// Slack OAuth Code Exchange
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/dashboard/alerts?error=slack_auth_failed", req.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/dashboard/alerts?error=no_code", req.url));
  }

  // 1. Exchange code for access token
  const clientId = process.env.SLACK_CLIENT_ID;
  const clientSecret = process.env.SLACK_CLIENT_SECRET;
  const redirectUri = process.env.SLACK_REDIRECT_URI;

  try {
    const tokenResponse = await fetch("https://slack.com/api/oauth.v2.access", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        code,
        redirect_uri: redirectUri!,
      }),
    });

    const data = (await tokenResponse.json()) as any;

    if (!data.ok) {
      console.error("Slack OAuth Error:", data);
      return NextResponse.redirect(
        new URL("/dashboard/alerts?error=slack_exchange_failed", req.url),
      );
    }

    // 2. Identify User
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // 3. Save as NotificationChannel
    const prisma = getPrisma(process.env.DATABASE_URL!);

    // Check if channel already exists for this Team/Channel combo?
    // Ideally we store: team_id, channel_id, channel_name, access_token, incoming_webhook.url

    const webhookUrl = data.incoming_webhook?.url;
    const channelName = data.incoming_webhook?.channel;
    const channelId = data.incoming_webhook?.channel_id; // OR incoming_webhook config

    if (!webhookUrl) {
      return NextResponse.redirect(new URL("/dashboard/alerts?error=slack_no_webhook", req.url));
    }

    await prisma.notificationChannel.create({
      data: {
        name: `Slack (${channelName})`,
        type: "SLACK",
        userId: session.user.id,
        config: {
          provider: "SLACK",
          teamId: data.team?.id,
          teamName: data.team?.name,
          channelId: channelId,
          channelName: channelName,
          accessToken: data.access_token, // Encrypt this in real prod
          webhookUrl: webhookUrl,
        },
      },
    });

    return NextResponse.redirect(new URL("/dashboard/alerts?success=slack_connected", req.url));
  } catch (err) {
    console.error("Slack OAuth Exception:", err);
    return NextResponse.redirect(new URL("/dashboard/alerts?error=internal_error", req.url));
  }
}
