import { NextRequest, NextResponse } from "next/server";
import { auth } from "@pulseguard/auth";
import prisma from "@pulseguard/db";
import { headers } from "next/headers";

/**
 * Handles the GET request to export monitor event data based on specified parameters.
 *
 * This function performs several key operations: it checks user authentication, verifies monitor ownership,
 * parses query parameters for date range and format, fetches monitor event data from the database,
 * and generates a response in either JSON or CSV format. The function also includes error handling for
 * unauthorized access and missing monitors.
 *
 * @param req - The NextRequest object representing the incoming request.
 * @param context - An object containing parameters, specifically a Promise that resolves to an object with an id.
 * @returns A NextResponse object containing the exported data in the requested format.
 * @throws Error If an unexpected error occurs during processing.
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // 1. Auth Check
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Monitor Ownership Check
    const monitor = await prisma.monitor.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
      select: { name: true },
    });

    if (!monitor) {
      return new NextResponse("Monitor not found or access denied", {
        status: 404,
      });
    }

    // 3. Parse Query Params
    const searchParams = req.nextUrl.searchParams;
    const startParam = searchParams.get("start");
    const endParam = searchParams.get("end");
    const format = searchParams.get("format") || "csv";

    const startDate = startParam ? new Date(startParam) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Default 7 days
    const endDate = endParam ? new Date(endParam) : new Date();

    // 4. Fetch Data (In batches or standard fetch - for simplicity we fetch all for now, but limit to 50k)
    // Note: For true streaming of massive datasets, we'd use cursor pagination.
    // Given the constraints (compliance export), let's cap at 50k rows for MVP safety.
    const events = await prisma.monitorEvent.findMany({
      where: {
        monitorId: id,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 50000,
      select: {
        timestamp: true,
        status: true,
        latency: true,
        region: true,
        errorReason: true,
      },
    });

    // 5. Generate Response based on Format
    if (format === "json") {
      return new NextResponse(JSON.stringify(events, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="monitor-${id}-${startDate.toISOString().split("T")[0]}.json"`,
        },
      });
    }

    // CSV Format
    const csvHeader = "Timestamp,Status,Latency (ms),Region,Error Details\n";
    const csvRows = events.map((e) => {
      const ts = e.timestamp.toISOString();
      const status = e.status;
      const latency = e.latency;
      const region = e.region || "Global";
      const error = e.errorReason ? `"${e.errorReason.replace(/"/g, '""')}"` : "";
      return `${ts},${status},${latency},${region},${error}`;
    }).join("\n");

    const csvContent = csvHeader + csvRows;

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="monitor-${monitor.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${startDate.toISOString().split("T")[0]}.csv"`,
      },
    });

  } catch (error) {
    console.error("Export error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
