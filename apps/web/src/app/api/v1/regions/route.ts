import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "../_lib/auth";

export const SOVEREIGN_REGIONS = [
  {
    code: "wnam",
    name: "North America West",
    location: "San Jose, CA, USA",
    flag: "🇺🇸",
  },
  {
    code: "enam",
    name: "North America East",
    location: "Ashburn, VA, USA",
    flag: "🇺🇸",
  },
  {
    code: "weur",
    name: "Western Europe",
    location: "Frankfurt, Germany",
    flag: "🇩🇪",
  },
  {
    code: "eeur",
    name: "Eastern Europe",
    location: "Warsaw, Poland",
    flag: "🇵🇱",
  },
  {
    code: "apac",
    name: "Asia Pacific South",
    location: "Singapore",
    flag: "🇸🇬",
  },
  {
    code: "apac-ne",
    name: "Asia Pacific Northeast",
    location: "Tokyo, Japan",
    flag: "🇯🇵",
  },
  {
    code: "apac-se",
    name: "Asia Pacific Southeast",
    location: "Sydney, Australia",
    flag: "🇦🇺",
  },
];

// GET /api/v1/regions - List sovereign probe regions
export async function GET(req: NextRequest) {
  const auth = await authenticateApiKey(req, "read");
  if (auth.errorResponse || !auth.user) return auth.errorResponse!;

  return NextResponse.json({
    data: SOVEREIGN_REGIONS,
    count: SOVEREIGN_REGIONS.length,
  });
}
