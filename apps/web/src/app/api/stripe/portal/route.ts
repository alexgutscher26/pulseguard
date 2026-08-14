import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createPortalSession } from "@/lib/stripe";

export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const host = (await headers()).get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const returnUrl = `${protocol}://${host}/dashboard/settings?tab=billing`;

    const portal = await createPortalSession({
      userId: session.user.id,
      email: session.user.email,
      returnUrl,
    });

    return NextResponse.json({ url: portal.url });
  } catch (error) {
    console.error("Error creating Stripe portal session:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 },
    );
  }
}
