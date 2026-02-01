import { getPrisma } from "@pulseguard/db";
export { LatencyAggregator } from "./durable-objects/latency-aggregator";

export interface Env {
  CHECK_QUEUE: Queue<any>;
  NOTIFICATION_QUEUE: Queue<any>;
  DATABASE_URL: string;
  RESEND_API_KEY: string;
  LATENCY_AGGREGATOR: DurableObjectNamespace;
}

import { connect } from "cloudflare:sockets";

// Helper: Perform a single check without DB side effects
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
    });
  } catch (error) {
    console.error(`[LatencyAggregator] Failed to record latency:`, error);
  }
}


// Helper: Reusable processing logic with Time-Based Limit
/**
 * Process a batch of monitors and manage their status and incidents.
 *
 * This function iterates through the provided monitors, checking their status and handling incidents based on their current state. It incorporates a time budget to ensure processing does not exceed limits, performs regional checks if enabled, and manages incident creation and resolution. The results of each monitor are saved to the database, and notifications are sent based on the monitor's status and latency.
 *
 * @param monitors - An array of monitor objects to be processed.
 * @param prisma - The Prisma client instance for database operations.
 * @param env - Optional environment configuration for notifications.
 * @returns A promise that resolves to an object containing processed monitor IDs and any remaining monitors.
 */
export async function processBatch(monitors: any[], prisma: any, env?: Env): Promise<{ processed: string[]; remaining: any[] }> {
  console.log(`Processing batch of ${monitors.length} monitors...`);
  
  // Dynamic import since we just created it
  const { IncidentService } = await import("./lib/incident-service");
  const incidentService = new IncidentService(prisma);
  const startTime = performance.now();
  const TIME_LIMIT_MS = 8; // Safety buffer for 10ms CPU limit (Free Tier)

  const processedIds: string[] = [];
  const remainingMonitors: any[] = [];

  for (let i = 0; i < monitors.length; i++) {
    const monitor = monitors[i];

    // Check Time Budget
    if (performance.now() - startTime > TIME_LIMIT_MS) {
      console.warn(`[SmartBatch] CPU time limit reached (${(performance.now() - startTime).toFixed(2)}ms). Offloading ${monitors.length - i} monitors.`);
      remainingMonitors.push(...monitors.slice(i));
      break; 
    }

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
  async fetch(_request: Request, _env: Env, _ctx: ExecutionContext) {
    return new Response("PulseGuard Worker is Running", { status: 200 });
  },

  // 1. Cron: Find pending checks and run them (Free Tier Batch Mode)
  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext) {
    console.log("Cron triggered: checking for due monitors...");
    const prisma = getPrisma(env.DATABASE_URL);

    // FREE TIER CONFIG: Process 10 monitors per cron tick (1 min)
    // This avoids CPU limits and Queue costs.
    const BATCH_SIZE = 10;

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
