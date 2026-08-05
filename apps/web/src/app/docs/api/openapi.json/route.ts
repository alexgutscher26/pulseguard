import { NextResponse } from "next/server";
import { openApiSpec } from "@/lib/api/openapi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(openApiSpec, {
    headers: {
      "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
