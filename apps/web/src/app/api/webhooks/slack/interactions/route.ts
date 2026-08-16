import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { env } from "@pulseguard/env/server";

const MAX_REQUEST_BODY_SIZE = 1_048_576;

function validateSlackResponseUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const isHttps = parsed.protocol === "https:";
    const hostname = parsed.hostname.toLowerCase();
    const isSlackHost = hostname === "hooks.slack.com" || hostname.endsWith(".slack.com");

    if (!isHttps || !isSlackHost) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

function checkBodySize(request: NextRequest) {
  const contentLength = request.headers.get("content-length");
  if (contentLength) {
    const size = Number.parseInt(contentLength, 10);
    if (!Number.isNaN(size) && size > MAX_REQUEST_BODY_SIZE) {
      return NextResponse.json(
        {
          error: `Request body too large. Maximum allowed size is ${MAX_REQUEST_BODY_SIZE} bytes.`,
        },
        { status: 413 },
      );
    }
  }
  return null;
}

// Slack Interactive Components Handler
export async function POST(req: NextRequest) {
  try {
    const sizeCheck = checkBodySize(req);
    if (sizeCheck) return sizeCheck;

    // 1. Verify Signature
    const text = await req.text();
    const headers = req.headers;
    const timestamp = headers.get("x-slack-request-timestamp");
    const signature = headers.get("x-slack-signature");

    if (!timestamp || !signature) {
      return NextResponse.json({ error: "Missing Slack verification headers" }, { status: 400 });
    }

    // Prevent replay attacks (5 minute window)
    const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;
    if (parseInt(timestamp) < fiveMinutesAgo) {
      return NextResponse.json({ error: "Request too old" }, { status: 400 });
    }

    const signingSecret = env.SLACK_SIGNING_SECRET;
    if (!signingSecret) {
      console.error("SLACK_SIGNING_SECRET is not configured");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const baseString = `v0:${timestamp}:${text}`;
    const hmac = crypto.createHmac("sha256", signingSecret).update(baseString).digest("hex");
    const calculatedSignature = `v0=${hmac}`;

    // Secure comparison to prevent timing attacks
    const target = Buffer.from(signature);
    const calculated = Buffer.from(calculatedSignature);

    if (target.length !== calculated.length || !crypto.timingSafeEqual(target, calculated)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse Payload (Slack sends application/x-www-form-urlencoded)
    const params = new URLSearchParams(text);
    const payloadStr = params.get("payload");

    if (!payloadStr) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const payload = JSON.parse(payloadStr);

    // 2. Handle Action
    if (payload.type === "block_actions") {
      const action = payload.actions[0];

      // Check if it's our "View Dashboard" or future "Acknowledge" button
      // Note: "View Dashboard" is a URL button and doesn't trigger this webhook usually,
      // unless configured to do both. We need an "Acknowledge" button for this to matter.

      if (action.action_id === "acknowledge_alert") {
        const user = payload.user.username;
        const originalMessage = payload.message;

        // 3. Update Message
        // Clone existing blocks but modify them to reflect "Acknowledged" state
        let newBlocks = [...originalMessage.blocks];

        // 3a. Update Header if it exists
        const headerIdx = newBlocks.findIndex((b: any) => b.type === "header");
        if (headerIdx !== -1) {
          newBlocks[headerIdx] = {
            type: "header",
            text: {
              type: "plain_text",
              text: "✅ ALert Acknowledged", // Changed from "Monitor DOWN" or similar
              emoji: true,
            },
          };
        }

        // 3b. Remove the Action Block (the buttons) so it can't be clicked again
        newBlocks = newBlocks.filter((b: any) => b.type !== "actions");

        // 3c. Add Context showing who ack'd it
        newBlocks.push({
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `👀 *Acknowledged by @${user}* at ${new Date().toLocaleTimeString()}`,
            },
          ],
        });

        // Send replacement payload back to response_url
        const safeResponseUrl = validateSlackResponseUrl(payload.response_url);
        if (!safeResponseUrl) {
          return NextResponse.json({ error: "Invalid response_url" }, { status: 400 });
        }

        await fetch(safeResponseUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            replace_original: "true",
            text: originalMessage.text, // Keep fallback text
            blocks: newBlocks,
          }),
        });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Slack Interaction Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
