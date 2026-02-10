import { getPrisma } from "@pulseguard/db";
export { LatencyAggregator } from "./durable-objects/latency-aggregator";
export { MonitorChannel } from "./durable-objects/MonitorChannel";

export interface Env {
  CHECK_QUEUE: Queue<any>;
  NOTIFICATION_QUEUE: Queue<any>;
  DATABASE_URL: string;
  RESEND_API_KEY: string;
  LATENCY_AGGREGATOR: DurableObjectNamespace;
  MONITOR_CHANNEL: DurableObjectNamespace;
}

import { connect } from "cloudflare:sockets";
import { verifySession, verifyMonitorAccess } from "./lib/auth";

// Helper: Perform a single check without DB side effects
/**
 * Perform a health check on a given monitor URL.
 *
 * The function checks the status of the URL by making an HTTP GET request, establishing a TCP connection, or sending a ping based on the URL protocol. It measures the latency and captures any error reasons if the check fails. The function handles various protocols and classifies errors into specific categories for better diagnostics.
 *
 * @param monitor - An object containing the URL to be monitored.
 * @returns An object containing the status ("UP" or "DOWN"), the latency in milliseconds, and an optional error reason.
 */
async function performCheck(
  monitor: any,
): Promise<{ status: "UP" | "DOWN" | "MAINTENANCE"; latency: number; errorReason?: string }> {
  // If explicitly in maintenance (passed from caller), skip check
  if (monitor.status === "MAINTENANCE") {
    return { status: "MAINTENANCE", latency: 0 };
  }

  const start = Date.now();
  let currentStatus: "UP" | "DOWN" | "MAINTENANCE" = "DOWN";
  let latency = 0;
  let errorReason: string | undefined = undefined;

  try {
    const urlStr = monitor.url;

    if (urlStr.startsWith("http://") || urlStr.startsWith("https://")) {
      const response = await fetch(urlStr, {
        method: "GET",
        headers: {
          "User-Agent": "PulseGuard-Monitor/1.0",
          Accept: "*/*",
        },
        signal: AbortSignal.timeout((monitor.timeout || 10) * 1000),
      });
      currentStatus = response.ok ? "UP" : "DOWN";

      // CRITICAL: Always read the body to prevent Cloudflare Worker deadlock
      // We don't need the content for UP checks, but we must consume the stream
      await response.text(); 

      if (!response.ok) {
        errorReason = `HTTP_${response.status}`;
      }
    } else if (urlStr.startsWith("tcp://")) {
      // Parse tcp://hostname:port
      const part = urlStr.replace("tcp://", "");
      const [hostname, port] = part.split(":");

      if (!hostname || !port) throw new Error("Invalid TCP URL format");

      const socket = connect({
        hostname,
        port: parseInt(port),
      });

      // Wait for connection
      await socket.opened;
      await socket.close();
      currentStatus = "UP";
    } else if (urlStr.startsWith("ping://")) {
      const hostname = urlStr.replace("ping://", "");
      const socket = connect({
        hostname,
        port: 80,
      });
      await socket.opened;
      await socket.close();
      currentStatus = "UP";
    } else {
      // Fallback or unknown
      throw new Error("Unknown protocol");
    }

    latency = Date.now() - start;
  } catch (err: any) {
    console.error(`Error checking ${monitor.url}:`, err);
    latency = 0;
    currentStatus = "DOWN";

    // Classify Error
    if (err.name === "TimeoutError" || (err.message && err.message.includes("Stats"))) {
      errorReason = "TIMEOUT";
    } else if (
      err.code === "ECONNREFUSED" ||
      (err.message && err.message.includes("Connection refused"))
    ) {
      errorReason = "CONNECTION_REFUSED";
    } else if (err.code === "ENOTFOUND" || (err.message && err.message.includes("getaddrinfo"))) {
      errorReason = "DNS_ERROR";
    } else {
      errorReason = "UNKNOWN_ERROR";
    }
  }

  return { status: currentStatus, latency, errorReason };
}

// Helper: Check for flapping (Rate Limiting)
async function shouldSendAlert(monitorId: string, prisma: any): Promise<boolean> {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  // Count status changes in the last 5 minutes
  const recentEvents = await prisma.monitorEvent.count({
    where: {
      monitorId: monitorId,
      timestamp: { gt: fiveMinutesAgo },
      status: { not: "MAINTENANCE" },
    },
  });

  // If > 3 events in 5 mins (e.g. DOWN -> UP -> DOWN -> ...), suppress
  if (recentEvents > 3) {
    console.warn(`[RateLimit] Flapping detected for ${monitorId}. Suppressing alert.`);
    return false;
  }
  return true;
}

// Helper: Record latency to Aggregator DO
async function recordLatencyToAggregator(
  env: Env | undefined,
  monitorId: string,
  region: string,
  latency: number,
  success: boolean
): Promise<void> {
  if (!env?.LATENCY_AGGREGATOR) return;

  try {
    // Get DO instance (using monitorId as the DO ID for consistent routing)
    const id = env.LATENCY_AGGREGATOR.idFromName(monitorId);
    const stub = env.LATENCY_AGGREGATOR.get(id);

    // Send latency data
    await stub.fetch("https://latency-aggregator/record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        monitorId,
        region,
        latency,
        success,
        timestamp: Date.now(),
      }),
    }).then(r => r.text()); // Consume body
  } catch (error) {
    console.error(`[LatencyAggregator] Failed to record latency:`, error);
  }
}

// Helper: Broadcast live event to MonitorChannel DO
async function broadcastLiveEvent(
  env: Env | undefined,
  monitorId: string,
  event: any
): Promise<void> {
  if (!env?.MONITOR_CHANNEL) return;

  try {
    // Get DO instance (using monitorId as the DO ID)
    const id = env.MONITOR_CHANNEL.idFromName(monitorId);
    const stub = env.MONITOR_CHANNEL.get(id);

    // Send broadcast
    // We don't await this to avoid blocking the check loop (fire and forget)
    stub.fetch("https://monitor-channel/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    }).then(r => r.text()).catch(err => console.error(`[MonitorChannel] Broadcast failed:`, err));

  } catch (error) {
    console.error(`[MonitorChannel] Failed to setup broadcast:`, error);
  }
}


// Helper: Reusable processing logic with Time-Based Limit
export async function processBatch(monitors: any[], prisma: any, env?: Env): Promise<{ processed: string[]; remaining: any[] }> {
  console.log(`Processing batch of ${monitors.length} monitors...`);
  
  // Dynamic import since we just created it
  const { IncidentService } = await import("./lib/incident-service");
  const incidentService = new IncidentService(prisma);
  // REMOVED: Wall-time limit check. 
  // Reason: performance.now() measures wall time (including IO), not CPU time. 
  // Cloudflare Free Plan has 10ms CPU limit but allows longer wall time for IO.
  // Using wall time to limit execution caused premature stops and dropped checks because Queues are not available.
  
  const processedIds: string[] = [];
  const remainingMonitors: any[] = [];

  for (let i = 0; i < monitors.length; i++) {
    const monitor = monitors[i];

    // --- PROCESSING LOGIC START ---
    try {
      // 0. Check for Active Maintenance Window
      const activeWindow = monitor.maintenanceWindows?.[0];
      let maintenanceActive = false;

      if (activeWindow) {
        console.log(
          `[Maintenance] Skipping check for ${monitor.name} (Window: ${activeWindow.startAt} - ${activeWindow.endAt})`,
        );
        maintenanceActive = true;
      }

      // 1. Initial Check
      let result;
      let failedRegions: string[] = [];

      if (maintenanceActive) {
        result = { status: "MAINTENANCE", latency: 0, errorReason: undefined };
      } else {
        // Check if regional monitoring is enabled
        if (monitor.checkRegions) {
          try {
            const { performRegionalChecks, getAverageLatency } =
              await import("./services/regional-monitor");

            const regionalResults = await performRegionalChecks(monitor);
            console.log(
              `[Regional] Checked ${monitor.name} from ${regionalResults.length} regions`,
            );

            // Capture failed regions
            failedRegions = regionalResults.filter((r) => r.status === "DOWN").map((r) => r.region);

            // Store each regional result AND manage regional incidents
            for (const regionalResult of regionalResults) {
              await prisma.monitorEvent.create({
                data: {
                  monitorId: monitor.id,
                  status: regionalResult.status as any,
                  latency: regionalResult.latency,
                  errorReason: regionalResult.errorReason,
                  region: regionalResult.region,
                  timestamp: regionalResult.timestamp,
                },
              });

              // Record latency to aggregator
              await recordLatencyToAggregator(
                env,
                monitor.id,
                regionalResult.region,
                regionalResult.latency,
                regionalResult.status === "UP"
              );

              // Manage Regional Incidents
              if (regionalResult.status === "DOWN") {
                await incidentService.createRegionalIncident(monitor.id, regionalResult.region);
              } else {
                const activeRegional = await incidentService.findActiveRegionalIncident(
                  monitor.id,
                  regionalResult.region,
                );
                if (activeRegional) {
                  await incidentService.resolveRegionalIncident(activeRegional.id);
                }
              }
            }

            // Determine overall status based on threshold
            const failedCount = failedRegions.length;
            const threshold = monitor.alertThreshold || 1;
            const overallStatus = failedCount >= threshold ? "DOWN" : "UP";
            const avgLatency = getAverageLatency(regionalResults);

            result = {
              status: overallStatus,
              latency: avgLatency,
              errorReason:
                overallStatus === "DOWN"
                  ? regionalResults.find((r) => r.status === "DOWN")?.errorReason
                  : failedCount > 0
                    ? `${failedCount} regions failing (below threshold)`
                    : undefined,
            };
          } catch (regionalError) {
            console.error(
              `[Regional] Failed to perform regional checks for ${monitor.name}:`,
              regionalError,
            );
            // Fallback to single check
            result = await performCheck(monitor);
          }
        } else {
          // Standard single-region check
          result = await performCheck(monitor);
        }

        // 2. Double Check Protocol (Retry on Failure) - only for non-regional checks
        if (result.status === "DOWN" && monitor.status !== "DOWN" && !monitor.checkRegions) {
          console.warn(
            `[DoubleCheck] First check failed for ${monitor.name} (${monitor.url}). Retrying in 2s...`,
          );

          // Wait 2000ms
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Retry
          result = await performCheck(monitor);
          console.log(`[DoubleCheck] Retry result for ${monitor.name}: ${result.status}`);
        }
      }

      const { status: currentStatus, latency, errorReason } = result;

      // Circuit Breaker Calculation
      let nextCheckTime = new Date(Date.now() + (monitor.interval || 60) * 1000);
      
      if (currentStatus === "DOWN") {
        try {
           const activeIncident = await incidentService.findActiveIncident(monitor.id);
           if (activeIncident) {
             const downtimeDuration = Date.now() - activeIncident.createdAt.getTime();
             const ONE_HOUR = 60 * 60 * 1000;
             
             if (downtimeDuration > ONE_HOUR) {
               console.log(`[CircuitBreaker] Monitor ${monitor.id} down for >1h. Applying 10m backoff.`);
               const BACKOFF_INTERVAL = 10 * 60 * 1000; // 600s
               nextCheckTime = new Date(Date.now() + BACKOFF_INTERVAL);
             }
           }
        } catch (cbError) {
           console.error(`[CircuitBreaker] Error checking incident duration:`, cbError);
        }
      }

      // Save result and update monitor
      await prisma.$transaction([
        prisma.monitorEvent.create({
          data: {
            monitorId: monitor.id,
            status: currentStatus as any,
            latency: latency,
            errorReason: errorReason,
            timestamp: new Date(),
          },
        }),
        prisma.monitor.update({
          where: { id: monitor.id },
          data: {
            status: currentStatus as any,
            lastCheck: new Date(),
            nextCheck: nextCheckTime,
          },
        }),
      ]);

      // BROADCAST LIVE EVENT
      broadcastLiveEvent(env, monitor.id, {
        type: "check_result",
        monitorId: monitor.id,
        status: currentStatus,
        latency: latency,
        region: "global", // Default for now, update if regional
        timestamp: new Date().getTime(),
      });

      // --- INCIDENT MANAGEMENT ---
      if (currentStatus === "DOWN" && !maintenanceActive) {
        const activeIncident = await incidentService.findActiveIncident(monitor.id);
        const alertable = await shouldSendAlert(monitor.id, prisma);

        if (!activeIncident && alertable) {
          // CREATE NEW INCIDENT
          const incident = await incidentService.createIncident(
            monitor.id,
            `Monitor is DOWN: ${monitor.name}`,
            errorReason ? `Reason: ${errorReason}` : "No error details provided.",
          );

          // Notify (CREATED)
          const notificationPayload = {
            type: "INCIDENT_CREATED" as const,
            monitorId: monitor.id,
            monitorName: monitor.name,
            url: monitor.url,
            status: "DOWN" as const,
            incidentId: incident.id,
            reason: errorReason,
            timestamp: new Date().toISOString(),
            failedRegions: failedRegions.length > 0 ? failedRegions : undefined,
          };

          if (env && env.NOTIFICATION_QUEUE) {
            console.log(`[Notification] Queueing incident ALERT for ${monitor.name}`);
            await env.NOTIFICATION_QUEUE.send(notificationPayload);
          } else {
            // FALLBACK: Direct notification for local dev (queues don't work in dev)
            console.warn(
              `[Notification] Queue not available - sending notification directly for ${monitor.name}`,
            );
            try {
              const { default: notificationHandler } = await import("./notification-handler");
              await notificationHandler.queue(
                {
                  queue: "notifications",
                  messages: [
                    {
                      id: `local-${Date.now()}`,
                      timestamp: new Date(),
                      body: notificationPayload,
                      ack: () => {},
                      retry: () => {},
                    },
                  ],
                  ackAll: () => {},
                  retryAll: () => {},
                } as any,
                env as any,
                {} as any,
              );
            } catch (notifError) {
              console.error(`[Notification] Failed to send direct notification:`, notifError);
            }
          }
        } else if (activeIncident) {
          // Still DOWN
          await incidentService.logStillDown(activeIncident.id);
        }
      } else if (currentStatus === "UP" && !maintenanceActive) {
        const activeIncident = await incidentService.findActiveIncident(monitor.id);

        if (activeIncident) {
          // RESOLVE INCIDENT
          await incidentService.resolveIncident(activeIncident.id);

          // Notify (RESOLVED)
          const notificationPayload = {
            type: "INCIDENT_RESOLVED" as const,
            monitorId: monitor.id,
            monitorName: monitor.name,
            url: monitor.url,
            status: "UP" as const,
            incidentId: activeIncident.id,
            timestamp: new Date().toISOString(),
          };

          if (env && env.NOTIFICATION_QUEUE) {
            console.log(`[Notification] Queueing incident RESOLVED for ${monitor.name}`);
            await env.NOTIFICATION_QUEUE.send(notificationPayload);
          } else {
            // FALLBACK: Direct notification for local dev
            console.warn(
              `[Notification] Queue not available - sending notification directly for ${monitor.name}`,
            );
            try {
              const { default: notificationHandler } = await import("./notification-handler");
              await notificationHandler.queue(
                {
                  queue: "notifications",
                  messages: [
                    {
                      id: `local-${Date.now()}`,
                      timestamp: new Date(),
                      body: notificationPayload,
                      ack: () => {},
                      retry: () => {},
                    },
                  ],
                  ackAll: () => {},
                  retryAll: () => {},
                } as any,
                env as any,
                {} as any,
              );
            } catch (notifError) {
              console.error(`[Notification] Failed to send direct notification:`, notifError);
            }
          }
        } else if (latency > 1000) {
          // High Latency Threshold (1000ms)
          // HIGH LATENCY ALERT
          const notificationPayload = {
            type: "HIGH_LATENCY" as const,
            monitorId: monitor.id,
            monitorName: monitor.name,
            url: monitor.url,
            status: "UP" as const,
            latency: latency,
            timestamp: new Date().toISOString(),
            reason: `High Latency: ${latency}ms`,
          };

          if (env && env.NOTIFICATION_QUEUE) {
            console.log(
              `[Notification] Queueing HIGH LATENCY alert for ${monitor.name} (${latency}ms)`,
            );
            await env.NOTIFICATION_QUEUE.send(notificationPayload);
          } else {
            // FALLBACK: Direct notification for local dev
            console.warn(
              `[Notification] Queue not available - sending notification directly for ${monitor.name}`,
            );
            try {
              const { default: notificationHandler } = await import("./notification-handler");
              await notificationHandler.queue(
                {
                  queue: "notifications",
                  messages: [
                    {
                      id: `local-${Date.now()}`,
                      timestamp: new Date(),
                      body: notificationPayload,
                      ack: () => {},
                      retry: () => {},
                    },
                  ],
                  ackAll: () => {},
                  retryAll: () => {},
                } as any,
                env as any,
                {} as any,
              );
            } catch (notifError) {
              console.error(`[Notification] Failed to send direct notification:`, notifError);
            }
          }
        }
      }
      processedIds.push(monitor.id);
      console.log(`Checked ${monitor.url}: ${currentStatus} (${latency}ms)`);
    } catch (err) {
      console.error(`Failed to process monitor ${monitor.id}:`, err);
      // We count it as processed (failed) to avoid infinite retry loops for bad data
      // Unless it's a timeout error, which might be retryable
      processedIds.push(monitor.id); 
    }
  }

  return { processed: processedIds, remaining: remainingMonitors };
}

export default {
  // Required: Basic fetch handler
  async fetch(request: Request, env: Env, _ctx: ExecutionContext) {
    const url = new URL(request.url);

    // WebSocket Route: /ws/monitors/:id
    if (url.pathname.startsWith("/ws/monitors/")) {
      const monitorId = url.pathname.split("/")[3];
      if (!monitorId) return new Response("Missing Monitor ID", { status: 400 });

      // Auth Check
      const session = await verifySession(request, env);
      if (!session) {
        return new Response("Unauthorized", { status: 401 });
      }

      const hasAccess = await verifyMonitorAccess(session.userId, monitorId, env);
      if (!hasAccess) {
        return new Response("Forbidden", { status: 403 });
      }

      // Forward to Durable Object
      const id = env.MONITOR_CHANNEL.idFromName(monitorId);
      const stub = env.MONITOR_CHANNEL.get(id);

      // We rewrite the URL to /websocket so the DO knows it's a client connection
      const doUrl = new URL("https://monitor-channel/websocket");
      
      // Pass the original request (headers, upgrade, etc) but with new URL
      return stub.fetch(doUrl.toString(), request);
    }


    // API Route: /api/ssl-check
    if (url.pathname === "/api/ssl-check" && request.method === "POST") {
       try {
         const body: any = await request.json();
         const { url: targetUrl } = body;
         
         if (!targetUrl) return new Response("Missing 'url' body param", { status: 400 });

         const { checkSSL } = await import("./services/ssl-check");
         const results = await checkSSL(targetUrl);

         return new Response(JSON.stringify(results), {
           headers: { 
             "Content-Type": "application/json",
             "Access-Control-Allow-Origin": "*",
             "Access-Control-Allow-Methods": "POST, OPTIONS",
             "Access-Control-Allow-Headers": "Content-Type"
           } 
         });
       } catch (err: any) {
         return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" }});
       }
    }
    

    // API Route: /api/port-check
    if (url.pathname === "/api/port-check" && request.method === "POST") {
       try {
         const body: any = await request.json();
         const { host, port } = body;
         
         if (!host || !port) return new Response("Missing host or port", { status: 400 });

         const { checkPort } = await import("./services/port-check");
         const result = await checkPort(host, parseInt(port));

         // Add helper: Current IP (for 'My IP' button)
         // Note: We don't return the IP in the check result, but the frontend might request it separately.
         // For now, minimal return.
         
         return new Response(JSON.stringify(result), {
           headers: { 
             "Content-Type": "application/json",
             "Access-Control-Allow-Origin": "*",
             "Access-Control-Allow-Methods": "POST, OPTIONS",
             "Access-Control-Allow-Headers": "Content-Type"
           } 
         });
       } catch (err: any) {
         return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" }});
       }
    }

    // API Route: /api/global-latency
    if (url.pathname === "/api/global-latency" && request.method === "POST") {
       try {
         const body: any = await request.json();
         const { url: targetUrl } = body;
         
         if (!targetUrl) return new Response("Missing 'url' body param", { status: 400 });

         // Add protocol if missing
         const finalUrl = targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`;

         const { checkGlobalLatency } = await import("./services/global-latency");
         const results = await checkGlobalLatency(finalUrl);

         return new Response(JSON.stringify(results), {
           headers: { 
             "Content-Type": "application/json",
             "Access-Control-Allow-Origin": "*", // Allow CORS for web app
             "Access-Control-Allow-Methods": "POST, OPTIONS",
             "Access-Control-Allow-Headers": "Content-Type"
           } 
         });
       } catch (err: any) {
         return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" }});
       }
    }

    // CORS Preflight
    if (request.method === "OPTIONS") {
       return new Response(null, {
         headers: {
           "Access-Control-Allow-Origin": "*",
           "Access-Control-Allow-Methods": "POST, OPTIONS",
           "Access-Control-Allow-Headers": "Content-Type"
         }
       });
    }

    return new Response("PulseGuard Worker is Running", { status: 200 });
  },

  // 1. Cron: Find pending checks and run them (Free Tier Batch Mode)
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    console.log(`Cron triggered: ${event.cron}`);
    const prisma = getPrisma(env.DATABASE_URL);

    // Monthly PDF Report Trigger
    if (event.cron === "0 9 1 * *") {
      console.log("Starting Monthly Report Job...");
      ctx.waitUntil(
        import("./services/reportGenerator")
          .then((m) => m.generateAndSendMonthlyReports(prisma, env))
          .catch((err) => console.error("Monthly Report Job Failed:", err))
      );
    }

    // FREE TIER CONFIG: Process 5 monitors per cron tick (1 min)
    // Decreased to 5 to avoid CPU limits (exceededCpu error).
    const BATCH_SIZE = 5;

    try {
      // Find active monitors that are due for a check
      const monitors = await prisma.monitor.findMany({
        where: {
          status: { in: ["UP", "DOWN", "MAINTENANCE"] as any },
          OR: [{ nextCheck: null }, { nextCheck: { lte: new Date() } }],
        },
        orderBy: { nextCheck: "asc" }, // Prioritize oldest due
        take: BATCH_SIZE,
        select: {
          id: true,
          url: true,
          interval: true,
          timeout: true,
          status: true,
          name: true,
          checkRegions: true,
          alertThreshold: true,
          // @ts-ignore
          maintenanceWindows: {
            where: {
              startAt: { lte: new Date() },
              endAt: { gte: new Date() },
            },
            take: 1,
          },
        },
      });

      console.log(`Found ${monitors.length} monitors to check.`);

      if (monitors.length === 0) return;

      // --- FREE PLAN: DIRECT EXECUTION ---
      // We process them right here instead of queuing
      const { remaining } = await processBatch(monitors, prisma, env);

      // Offload remaining to Queue if any
      if (remaining.length > 0) {
        if (env.CHECK_QUEUE) {
          console.warn(`[SmartBatch] Offloading ${remaining.length} monitors to Queue due to CPU limits.`);
          // Send remaining monitors as individual messages or small batches
          const messages = remaining.map((m) => ({ body: m }));
          await env.CHECK_QUEUE.sendBatch(messages); 
        } else {
          console.error("[SmartBatch] Critical: CPU limit reached but NO CHECK_QUEUE defined. Checks dropped.");
        }
      }

      console.log(`Monitors processed successfully.`);
    } catch (error) {
      console.error("Error in scheduled handler:", error);
    }
  },

  // 2. Queue Consumer: (Preserved for Paid Plan Upgrade)
  async queue(batch: MessageBatch<any>, env: Env, ctx: ExecutionContext) {
    // Dispatch based on queue name
    if (batch.queue === "notifications") {
      const { default: notificationHandler } = await import("./notification-handler");
      await notificationHandler.queue(batch, env, ctx);
      return;
    }




    // Default: 'monitor-checks' queue
    const prisma = getPrisma(env.DATABASE_URL);
    const monitors = batch.messages.map((msg) => msg.body);

    const { remaining } = await processBatch(monitors, prisma, env);

    // Ack processed messages, Retry remaining
    if (remaining.length > 0) {
      console.warn(`[SmartBatch] Queue processing hit limit. Retrying ${remaining.length} messages.`);
      
      // Get IDs of remaining monitors for lookup
      const remainingIds = new Set(remaining.map(m => m.id));

      // Retry specific messages
      for (const msg of batch.messages) {
        if (remainingIds.has(msg.body.id)) {
          msg.retry();
        } else {
          msg.ack();
        }
      }
    } else {
      // All done
      batch.ackAll();
    }
  },
};

