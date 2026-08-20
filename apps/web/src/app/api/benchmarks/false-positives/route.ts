import { NextResponse } from "next/server";
import {
  BENCHMARK_METADATA,
  PROVIDER_SUMMARIES,
  BENCHMARK_ENDPOINTS,
  SAMPLE_INCIDENTS,
  WHERE_WE_LOST_ANALYSIS,
} from "@/content/benchmarks-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider");
  const failureType = searchParams.get("failure_type");
  const groundTruth = searchParams.get("ground_truth");

  let filteredIncidents = [...SAMPLE_INCIDENTS];

  if (provider === "steadystack") {
    filteredIncidents = filteredIncidents.filter((i) => i.steadystack.alertTriggered);
  } else if (provider === "uptimerobot") {
    filteredIncidents = filteredIncidents.filter((i) => i.uptimerobot.alertTriggered);
  } else if (provider === "pingdom") {
    filteredIncidents = filteredIncidents.filter((i) => i.pingdom.alertTriggered);
  }

  if (failureType) {
    filteredIncidents = filteredIncidents.filter((i) => i.failureType === failureType);
  }

  if (groundTruth === "down" || groundTruth === "true") {
    filteredIncidents = filteredIncidents.filter((i) => i.groundTruthDown);
  } else if (groundTruth === "up" || groundTruth === "false") {
    filteredIncidents = filteredIncidents.filter((i) => !i.groundTruthDown);
  }

  return NextResponse.json(
    {
      metadata: BENCHMARK_METADATA,
      summary: PROVIDER_SUMMARIES,
      endpoints: BENCHMARK_ENDPOINTS,
      tradeoffs_and_losses: WHERE_WE_LOST_ANALYSIS,
      total_incidents_returned: filteredIncidents.length,
      incidents: filteredIncidents,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    },
  );
}
