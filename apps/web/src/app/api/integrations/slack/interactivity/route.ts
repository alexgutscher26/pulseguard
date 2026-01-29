import { NextRequest, NextResponse } from "next/server";
import prisma, { IncidentStatus, IncidentEventType } from "@pulseguard/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const payloadStr = formData.get("payload");

    if (!payloadStr || typeof payloadStr !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const payload = JSON.parse(payloadStr);

    // Verify type is block_actions
    if (payload.type === "block_actions") {
      const action = payload.actions[0];
      const incidentId = action.value;
      const userName = payload.user.username;

      if (action.action_id === "acknowledge_incident") {
        await prisma.incident.update({
          where: { id: incidentId },
          data: {
            status: IncidentStatus.INVESTIGATING,
            events: {
              create: {
                type: IncidentEventType.STATE_CHANGE,
                message: `Incident acknowledged via Slack by @${userName}`,
              }
            }
          }
        });

        return NextResponse.json({ text: "✅ Incident Acknowledged" });
      }

      if (action.action_id === "resolve_incident") {
         await prisma.incident.update({
          where: { id: incidentId },
          data: {
            status: IncidentStatus.RESOLVED,
            resolvedAt: new Date(),
            events: {
              create: {
                type: IncidentEventType.STATE_CHANGE,
                message: `Incident resolved via Slack by @${userName}`,
              }
            }
          }
        });
        return NextResponse.json({ text: "✅ Incident Resolved" });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Slack Interactivity Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
