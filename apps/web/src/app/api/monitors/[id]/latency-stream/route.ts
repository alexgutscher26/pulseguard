import { NextRequest } from "next/server";
import { auth } from "@pulseguard/auth";
import { getPrisma } from "@pulseguard/db";

interface LatencyStreamParams {
  params: {
    id: string;
  };
}

/**
 * Server-Sent Events endpoint for real-time latency updates.
 *
 * This function handles the GET request for the latency stream by first verifying the user's authentication and monitor ownership.
 * It then establishes a stream that sends connection messages, heartbeat signals, and updates on latency aggregates at specified intervals.
 * The stream is cleaned up when the request is aborted, ensuring proper resource management.
 *
 * @param request - The NextRequest object representing the incoming request.
 * @param params - An object containing the parameters for the latency stream, including the monitor ID.
 * @returns A Response object containing the latency stream.
 * @throws Error If an internal server error occurs during processing.
 */
export async function GET(
  request: NextRequest,
  { params }: LatencyStreamParams
) {
  try {
    // Auth check
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id: monitorId } = params;

    // Verify monitor ownership
    const prisma = getPrisma(process.env.DATABASE_URL!);
    const monitor = await prisma.monitor.findFirst({
      where: {
        id: monitorId,
        userId: session.user.id,
      },
    });

    if (!monitor) {
      return new Response("Monitor not found", { status: 404 });
    }

    // Create SSE stream
    const encoder = new TextEncoder();
    let intervalId: NodeJS.Timeout;

    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "connected", monitorId })}\n\n`
          )
        );

        // Heartbeat every 30 seconds to keep connection alive
        intervalId = setInterval(() => {
          try {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "heartbeat", timestamp: Date.now() })}\n\n`
              )
            );
          } catch (error) {
            console.error("[SSE] Heartbeat error:", error);
            clearInterval(intervalId);
          }
        }, 30000);

        // Poll for new aggregates every 60 seconds
        const pollInterval = setInterval(async () => {
          try {
            // Get latest aggregate (last minute)
            const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
            const latestAggregates = await prisma.latencyAggregate.findMany({
              where: {
                monitorId,
                granularity: "ONE_MINUTE",
                timestamp: {
                  gte: oneMinuteAgo,
                },
              },
              orderBy: {
                timestamp: "desc",
              },
              take: 10,
            });

            if (latestAggregates.length > 0) {
              for (const agg of latestAggregates) {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({
                      type: "latency_update",
                      monitorId,
                      region: agg.region,
                      timestamp: Math.floor(agg.timestamp.getTime() / 1000),
                      latency: {
                        avg: agg.avgLatency,
                        p50: agg.p50Latency,
                        p95: agg.p95Latency,
                        p99: agg.p99Latency,
                      },
                      sampleCount: agg.sampleCount,
                      successRate: agg.successRate,
                    })}\n\n`
                  )
                );
              }
            }
          } catch (error) {
            console.error("[SSE] Poll error:", error);
          }
        }, 60000);

        // Cleanup on close
        request.signal.addEventListener("abort", () => {
          clearInterval(intervalId);
          clearInterval(pollInterval);
          try {
            controller.close();
          } catch (e) {
            // Stream already closed
          }
        });
      },
      cancel() {
        if (intervalId) {
          clearInterval(intervalId);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no", // Disable nginx buffering
      },
    });
  } catch (error) {
    console.error("[LatencyStream] Error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}

// Disable static optimization for SSE
export const dynamic = "force-dynamic";
