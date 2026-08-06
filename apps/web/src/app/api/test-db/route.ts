import { getPrisma } from "@pulseguard/db";
import { NextResponse } from "next/server";
import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";

export const runtime = "nodejs";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const prisma = getPrisma();

    // Try to query the database
    const userCount = await prisma.user.count();

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      userCount,
    });
  } catch (error) {
    console.error("❌ Database test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Database check failed",
      },
      { status: 500 },
    );
  }
}
