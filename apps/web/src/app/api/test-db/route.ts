import { getPrisma } from "@pulseguard/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
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
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
