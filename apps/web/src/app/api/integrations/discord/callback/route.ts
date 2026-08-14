import { NextRequest, NextResponse } from "next/server";
import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { getPrisma } from "@pulseguard/db";

// Discord OAuth Code Exchange
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/dashboard/alerts?error=discord_auth_failed", req.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/dashboard/alerts?error=no_code", req.url));
  }

  // 1. Exchange code for access token
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  try {
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri!,
      }),
    });

    const data = (await tokenResponse.json()) as any;

    if (data.error) {
      console.error("Discord OAuth Error:", data);
      return NextResponse.redirect(
        new URL("/dashboard/alerts?error=discord_exchange_failed", req.url),
      );
    }

    // data contains: access_token, webhook: { token, id, url, channel_id, guild_id }
    // Discord OAuth scope 'webhook.incoming' MUST be requested to get the webhook object

    if (!data.webhook) {
      return NextResponse.redirect(
        new URL("/dashboard/alerts?error=discord_no_webhook_permission", req.url),
      );
    }

    // 2. Identify User
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // 3. Save as NotificationChannel
    const prisma = getPrisma(process.env.DATABASE_URL!);

    const webhook = data.webhook;

    // Optional: Fetch Channel Name using Bot Token or assume ID is enough

    await prisma.notificationChannel.create({
      data: {
        name: `Discord (Channel ${webhook.channel_id})`,
        type: "DISCORD",
        userId: session.user.id,
        config: {
          provider: "DISCORD",
          guildId: webhook.guild_id,
          channelId: webhook.channel_id,
          accessToken: data.access_token,
          webhookUrl: webhook.url,
          webhookToken: webhook.token,
          webhookId: webhook.id,
        },
      },
    });

    return NextResponse.redirect(new URL("/dashboard/alerts?success=discord_connected", req.url));
  } catch (err) {
    console.error("Discord OAuth Exception:", err);
    return NextResponse.redirect(new URL("/dashboard/alerts?error=internal_error", req.url));
  }
}
