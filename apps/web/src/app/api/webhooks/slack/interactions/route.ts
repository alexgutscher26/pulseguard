import { NextRequest, NextResponse } from "next/server";

// Slack Interactive Components Handler
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const payloadStr = formData.get("payload");

    if (!payloadStr || typeof payloadStr !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const payload = JSON.parse(payloadStr);

    // 1. Verify Signature (TODO: Implement logic using SLACK_SIGNING_SECRET)
    // For now, assume validity or check specific token if needed.

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
         // Replace the "Danger"/"Red" blocks with an "Acknowledged" state
         // or just append a context block.
         
         const newBlocks = [
            ...originalMessage.blocks,
            {
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text: `✅ *Acknowledged by @${user}*`
                    }
                ]
            }
         ];

         // Send replacement payload back to response_url
         await fetch(payload.response_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                replace_original: "true",
                text: originalMessage.text, // Keep fallback text
                blocks: newBlocks
            })
         });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Slack Interaction Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
