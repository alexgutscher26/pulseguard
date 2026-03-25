import { getPrisma } from "@pulseguard/db";
import type { ExecutionContext } from "@cloudflare/workers-types";
export { LatencyAggregator } from "./durable-objects/latency-aggregator";
export { MonitorChannel } from "./durable-objects/MonitorChannel";
import { ProxyMesh, QuantumAnomalyDetector } from "./services/mesh";
import { InsightService, InsightType, InsightSeverity } from "./lib/insight-service";

const mesh = new ProxyMesh();

export interface Env {
  CHECK_QUEUE: Queue<any>;
  NOTIFICATION_QUEUE: Queue<any>;
  DATABASE_URL: string;
  RESEND_API_KEY: string;
  LATENCY_AGGREGATOR: DurableObjectNamespace;
  MONITOR_CHANNEL: DurableObjectNamespace;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
  SHARD_ID?: number;
  TOTAL_SHARDS?: number;
  DNS_CACHE?: KVNamespace;
}

import { connect } from "cloudflare:sockets";
import { performRegionalChecks, getAverageLatency } from "./services/regional-monitor";

// Helper: Perform a single check without DB side effects
/**
 * Perform a health check on a given monitor URL.
 *
 * The function checks the status of the URL by making an HTTP GET request, establishing a TCP connection, or sending a ping based on the URL protocol. It measures the latency and captures any error reasons if the check fails. The function handles various protocols and classifies errors into specific categories for better diagnostics. If the monitor is explicitly marked as "MAINTENANCE", the check is skipped.
 *
 * @param monitor - An object containing the URL to be monitored and optional timeout settings.
 * @returns An object containing the status ("UP", "DOWN", or "MAINTENANCE"), the latency in milliseconds, and an optional error reason.
 */
async function performCheck(
  monitor: any,
  env?: Env,
): Promise<{ status: "UP" | "DOWN" | "MAINTENANCE"; latency: number; errorReason?: string }> {
  // If explicitly in maintenance (passed from caller), skip check
  if (monitor.status === "MAINTENANCE") {
    return { status: "MAINTENANCE", latency: 0 };
  }

  const urlStr = monitor.url;

  // 1. Initial Standard Check
  let result = await performInternalRequest(monitor, urlStr);

  // 2. DNS Fallback Layer: If DNS failed but we have a cached IP
  if (result.status === "DOWN" && result.errorReason === "DNS_ERROR" && env?.DNS_CACHE) {
    try {
      const urlObj = new URL(urlStr);
      const hostname = urlObj.hostname;

      const cachedValue = await env.DNS_CACHE.get(`dns:${hostname}`);
      if (cachedValue) {
        const { ip } = JSON.parse(cachedValue) as { ip: string };
        console.warn(`[DNSFallback] DNS failed for ${hostname}. Retrying via IP ${ip}...`);

        // Re-map the hostname to IP for the fetch
        const ipUrl = urlStr.replace(hostname, ip);
        const fallbackResult = await performInternalRequest(monitor, ipUrl, { Host: hostname });

        if (fallbackResult.status === "UP") {
          console.log(
            `[DNSFallback] SUCCESS: ${hostname} reached via direct IP. False positive avoided.`,
          );
          return fallbackResult;
        }
      }
    } catch (err) {
      // Fallback-of-fallback failure
    }
  }

  return result;
}

/**
 * Reusable core fetch/connection logic
 */
async function performInternalRequest(
  monitor: any,
  urlStr: string,
  extraHeaders?: Record<string, string>,
): Promise<{ status: "UP" | "DOWN" | "MAINTENANCE"; latency: number; errorReason?: string }> {
  const start = performance.now();
  let currentStatus: "UP" | "DOWN" | "MAINTENANCE" = "DOWN";
  let latency = 0;
  let errorReason: string | undefined = undefined;

  try {
    if (urlStr.startsWith("http://") || urlStr.startsWith("https://")) {
      const method = monitor.method || "GET";
      const userHeaders: Record<string, string> = {};

      if (monitor.headers) {
        try {
          const parsed = JSON.parse(monitor.headers);
          if (Array.isArray(parsed)) {
            parsed.forEach((h: { key: string; value: string }) => {
              if (h.key) userHeaders[h.key] = h.value;
            });
          }
        } catch (e) {
          console.error("Failed to parse monitor headers:", e);
        }
      }

      const startFetch = performance.now();
      const response = await fetch(urlStr, {
        method,
        headers: {
          "User-Agent": "PulseGuard-Monitor/1.0",
          Accept: "*/*",
          ...userHeaders,
          ...extraHeaders,
        },
        body: ["POST", "PUT", "PATCH"].includes(method) ? monitor.body : undefined,
        signal: AbortSignal.timeout((monitor.timeout || 10) * 1000),
      });
      currentStatus = response.ok ? "UP" : "DOWN";

      const body = await response.text();
      latency = Math.round(performance.now() - startFetch);
      currentStatus = response.ok ? "UP" : "DOWN";

      // 3. Deep Payload/Status Validation (WASM/Rust Optimized Bridge)
      if (currentStatus === "UP" && monitor.expectation) {
        const { validatePayload } = await import("./lib/payload-parser");
        const validation = validatePayload(body, response.status, monitor.expectation);
        if (!validation.success) {
          currentStatus = "DOWN";
          errorReason = validation.errorMessage || `HTTP_${response.status}`;
        }
      } else if (!response.ok) {
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

    if (latency === 0) {
      latency = Math.round(performance.now() - start);
    }
  } catch (err: any) {
    console.error(`Error checking ${urlStr}:`, err);
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
    } else if (
      err.code === "ENOTFOUND" ||
      (err.message && err.message.includes("getaddrinfo")) ||
      (err.message && err.message.includes("dns"))
    ) {
      errorReason = "DNS_ERROR";
    } else {
      errorReason = "UNKNOWN_ERROR";
    }
  }

  return { status: currentStatus, latency, errorReason };
}

// Helper: Check for flapping (Rate Limiting)
function shouldSendAlert(monitorId: string, eventCounts: Map<string, number>): boolean {
  const recentEvents = eventCounts.get(monitorId) || 0;

  // If > 3 events in 5 mins (e.g. DOWN -> UP -> DOWN -> ...), suppress
  if (recentEvents > 3) {
    console.warn(`[RateLimit] Flapping detected for ${monitorId}. Suppressing alert.`);
    return false;
  }
  return true;
}

// Helper: Record latency to Aggregator DO
/**
 * Records latency data to the aggregator service.
 *
 * This function checks if the LATENCY_AGGREGATOR is defined in the environment. If it is, it retrieves the corresponding
 * DO instance using the monitorId and sends a POST request with the latency data, including the monitorId, region,
 * latency value, success status, and a timestamp. Any errors during the fetch operation are logged to the console.
 *
 * @param {Env | undefined} env - The environment object that may contain the LATENCY_AGGREGATOR.
 * @param {string} monitorId - The identifier for the monitor.
 * @param {string} region - The region associated with the latency data.
 * @param {number} latency - The recorded latency value.
 * @param {boolean} success - Indicates whether the operation was successful.
 */
async function recordLatencyToAggregator(
  env: Env | undefined,
  monitorId: string,
  region: string,
  latency: number,
  success: boolean,
): Promise<void> {
  if (!env?.LATENCY_AGGREGATOR) return;

  try {
    // Get DO instance (using monitorId as the DO ID for consistent routing)
    const id = env.LATENCY_AGGREGATOR.idFromName(monitorId);
    const stub = env.LATENCY_AGGREGATOR.get(id);

    // Send latency data
    await stub
      .fetch("https://latency-aggregator/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monitorId,
          region,
          latency,
          success,
          timestamp: Date.now(),
        }),
      })
      .then((r) => r.text()); // Consume body
  } catch (error) {
    console.error(`[LatencyAggregator] Failed to record latency:`, error);
  }
}

// Helper: Broadcast live event to MonitorChannel DO
/**
 * Broadcasts a live event to the specified monitor channel.
 *
 * This function checks if the MONITOR_CHANNEL is defined in the environment. If it is, it retrieves the DO instance using the monitorId and sends a broadcast request with the event data. The request is sent without awaiting the response to prevent blocking the check loop, allowing for a fire-and-forget approach. Errors during the broadcast setup or execution are logged to the console.
 *
 * @param {Env | undefined} env - The environment object that may contain the MONITOR_CHANNEL.
 * @param {string} monitorId - The identifier for the monitor to which the event is being broadcasted.
 * @param {any} event - The event data to be broadcasted.
 */
async function broadcastLiveEvent(
  env: Env | undefined,
  monitorId: string,
  event: any,
): Promise<void> {
  if (!env?.MONITOR_CHANNEL) return;

  try {
    // Get DO instance (using monitorId as the DO ID)
    const id = env.MONITOR_CHANNEL.idFromName(monitorId);
    const stub = env.MONITOR_CHANNEL.get(id);

    // Send broadcast
    // We don't await this to avoid blocking the check loop (fire and forget)
    stub
      .fetch("https://monitor-channel/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      })
      .then((r) => r.text())
      .catch((err) => console.error(`[MonitorChannel] Broadcast failed:`, err));
  } catch (error) {
    console.error(`[MonitorChannel] Failed to setup broadcast:`, error);
  }
}

// Helper: Reusable processing logic with Time-Based Limit
export async function processBatch(
  monitors: any[],
  prisma: any,
  env: Env,
  ctx: ExecutionContext,
): Promise<{ processed: string[]; remaining: any[] }> {
  console.log(`Processing batch of ${monitors.length} monitors...`);

  const { FallbackQueue } = await import("./lib/fallback-queue");
  const { DatabaseCircuitBreaker } = await import("./lib/circuit-breaker");

  const fallbackQueue = new FallbackQueue(env.UPSTASH_REDIS_REST_URL, env.UPSTASH_REDIS_REST_TOKEN);
  const circuitBreaker = new DatabaseCircuitBreaker(
    env.UPSTASH_REDIS_REST_URL,
    env.UPSTASH_REDIS_REST_TOKEN,
  );

  const circuitState = await circuitBreaker.getState();

  // Dynamic import since we just created it
  const { IncidentService } = await import("./lib/incident-service");
  const incidentService = new IncidentService(prisma);
  const insightService = new InsightService(prisma);
  // REMOVED: Wall-time limit check.
  // Reason: performance.now() measures wall time (including IO), not CPU time.
  // Cloudflare Free Plan has 10ms CPU limit but allows longer wall time for IO.
  // Using wall time to limit execution caused premature stops and dropped checks because Queues are not available.

  const processedIds: string[] = [];
  const remainingMonitors: any[] = [];

  // --- BULK FETCH DATA START ---
  const monitorIds = monitors.map((m) => m.id);
  const activeIncidentsMap = new Map<string, any>();
  const eventCountsMap = new Map<string, number>();

  // 1. Fetch Active Incidents
  const activeIncidents = await incidentService.findActiveIncidentsForMonitors(monitorIds);
  for (const incident of activeIncidents) {
    // The service returns list ordered by createdAt desc.
    // We want to map monitorId -> latest incident.
    if (!activeIncidentsMap.has(incident.monitorId)) {
      activeIncidentsMap.set(incident.monitorId, incident);
    }
  }

  // 2. Fetch Event Counts (for flapping detection)
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const eventCounts = await prisma.monitorEvent.groupBy({
    by: ["monitorId"],
    where: {
      monitorId: { in: monitorIds },
      timestamp: { gt: fiveMinutesAgo },
      status: { not: "MAINTENANCE" },
    },
    _count: true,
  });

  for (const count of eventCounts) {
    eventCountsMap.set(count.monitorId, count._count);
  }
  // --- BULK FETCH DATA END ---

  for (let i = 0; i < monitors.length; i++) {
    const monitor = monitors[i];

    // --- DYNAMIC THRESHOLDING CALCULATION ---
    let effectiveTimeout = monitor.timeout || 10;
    let capturedLatencies: number[] | undefined;

    if (monitor.dynamicThresholding) {
      try {
        const lastEvents = await prisma.monitorEvent.findMany({
          where: { monitorId: monitor.id, status: "UP" },
          orderBy: { timestamp: "desc" },
          take: 50, // Get recent events to compute p95
          select: { latency: true },
        });

        if (lastEvents.length >= 10) {
          const latencies = lastEvents.map((e: any) => e.latency);
          capturedLatencies = latencies;
          // Sort ascending to find p95
          const sorted = [...latencies].sort((a: number, b: number) => a - b);
          const p95Index = Math.floor(sorted.length * 0.95);
          const p95Latency = sorted[p95Index];

          // Calc dynamic (p95 + 30% buffer, convert ms to seconds)
          let calcTimeout = (p95Latency * 1.3) / 1000;

          // Enforce bounds min 2, max 30
          if (calcTimeout < 2) calcTimeout = 2;
          if (calcTimeout > 30) calcTimeout = 30;

          effectiveTimeout = calcTimeout;
          console.log(
            `[DynamicThreshold] ${monitor.name}: p95=${p95Latency}ms -> New Timeout=${effectiveTimeout.toFixed(2)}s`,
          );
        }
      } catch (calcErr) {
        console.error(`[DynamicThreshold] Failed to calculate for ${monitor.name}:`, calcErr);
      }
    }

    // Set the resolved timeout on the monitor object for the checks
    monitor.timeout = effectiveTimeout;

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
            const regionalResults = await performRegionalChecks(monitor);
            console.log(
              `[Regional] Checked ${monitor.name} from ${regionalResults.length} regions`,
            );

            // Capture failed regions
            failedRegions = regionalResults.filter((r) => r.status === "DOWN").map((r) => r.region);

            const isMajorOutage = failedRegions.length >= (monitor.alertThreshold || 1);
            const overallStatus = isMajorOutage ? "DOWN" : "UP";
            const avgLatency = getAverageLatency(regionalResults);

            // AGGRESSIVE AGGREGATION: Smart Filtering to save DB space and CPU
            // We store ALL regional results in the Durable Object (LatencyAggregator) for high-res charts.
            // But in the main DB (MonitorEvent), we only store:
            // 1. The summary "global" result
            // 2. Individual regional results ONLY if they are DOWN (for incident tracking)
            const eventsToCreate = [];

            // Add the summary event
            eventsToCreate.push({
              monitorId: monitor.id,
              status: overallStatus as any,
              latency: avgLatency,
              errorReason: isMajorOutage ? `${failedRegions.length} regions failing` : undefined,
              region: "global",
              timestamp: new Date(),
            });

            // Store each regional result in LatencyAggregator (Fire and forget)
            for (const regionalResult of regionalResults) {
              ctx.waitUntil(
                recordLatencyToAggregator(
                  env,
                  monitor.id,
                  regionalResult.region,
                  regionalResult.latency,
                  regionalResult.status === "UP",
                ),
              );

              // Only add to DB if DOWN (to save massive IOPS)
              if (regionalResult.status === "DOWN") {
                eventsToCreate.push({
                  monitorId: monitor.id,
                  status: "DOWN" as any,
                  latency: regionalResult.latency,
                  errorReason: regionalResult.errorReason,
                  region: regionalResult.region,
                  timestamp: regionalResult.timestamp,
                });

                // Manage Regional Incidents
                await incidentService.createRegionalIncident(monitor.id, regionalResult.region);
              } else {
                // Auto-resolve regional incident if previously down
                const activeRegional = await incidentService.findActiveRegionalIncident(
                  monitor.id,
                  regionalResult.region,
                );
                if (activeRegional) {
                  await incidentService.resolveRegionalIncident(activeRegional.id);
                }
              }
            }

            // BATCH CREATE (Highly efficient)
            if (eventsToCreate.length > 0) {
              await prisma.monitorEvent.createMany({
                data: eventsToCreate,
              });
            }

            result = {
              status: overallStatus,
              latency: avgLatency,
              errorReason: isMajorOutage ? `${failedRegions.length} regions failing` : undefined,
            };
          } catch (regionalError) {
            console.error(
              `[Regional] Failed to perform regional checks for ${monitor.name}:`,
              regionalError,
            );
            // Fallback to single check
            result = await performCheck(monitor, env);
          }
        } else {
          // Standard single-region check
          result = await performCheck(monitor, env);
        }

        // 2. Multi-Vector Verification Protocol (Retry & Proxy on Failure)
        if (result.status === "DOWN" && monitor.status !== "DOWN" && !monitor.checkRegions) {
          console.warn(
            `[MultiVector] First check failed for ${monitor.name} (${monitor.url}). Executing Multi-Vector Verification...`,
          );

          // Wait 1000ms before retry
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Base retry from current region
          let retryResult = await performCheck(monitor, env);

          // If still DOWN locally and it's an HTTP check, try from an external proxy (Region B)
          if (retryResult.status === "DOWN" && monitor.url.startsWith("http")) {
            try {
              console.log(
                `[MultiVector] Local check confirmed DOWN. Attempting fallback via Component 18-1-0 (Proxy Mesh)...`,
              );
              const proxyResult = await mesh.component_18_1_0(monitor.url, 5000);

              if (proxyResult.status === "UP") {
                console.log(
                  `[MultiVector] Component 18-1-0 reported UP! False positive averted for ${monitor.name}. Mesh Load: OK.`,
                );
                retryResult.status = "UP";
                retryResult.errorReason = undefined;
                // We keep the initially higher latency to reflect the degraded state realistically
              } else {
                console.log(
                  `[MultiVector] Component 18-1-0 also DOWN. Trying final vector Component 18-1-1...`,
                );
                const secondaryProxy = await mesh.component_18_1_1(monitor.url, 5000);
                if (secondaryProxy.status === "UP") {
                  console.log(
                    `[MultiVector] Component 18-1-1 reported UP! False positive averted for ${monitor.name}.`,
                  );
                  retryResult.status = "UP";
                  retryResult.errorReason = undefined;
                } else {
                  console.log(
                    `[MultiVector] Component 18-1-1 also DOWN. Trying final High-Fidelity Vector 19-3-1...`,
                  );
                  // Use captured latencies for quantum verification if available
                  const finalVector = await mesh.component_19_3_1(
                    monitor.url,
                    capturedLatencies || [],
                    2000,
                  );
                  if (finalVector.status === "UP") {
                    console.log(
                      `[MultiVector] Component 19-3-1 reported UP! False positive averted for ${monitor.name}. (Anomaly: ${finalVector.anomaly?.isAnomaly})`,
                    );
                    retryResult.status = "UP";
                    retryResult.errorReason = undefined;
                  } else {
                    console.warn(
                      `[MultiVector] ALL verification vectors (Local, Retry, 18-1-0, 18-1-1, 19-3-1) confirmed DOWN for ${monitor.name}.`,
                    );
                  }
                }
              }
            } catch (err) {
              console.warn(`[MultiVector] Mesh verification failed, preserving DOWN state:`, err);
            }
          }

          result = retryResult;
          console.log(
            `[MultiVector] Final verification result for ${monitor.name}: ${result.status}`,
          );
        }
      }

      const { status: currentStatus, latency, errorReason } = result;

      // --- QUANTUM ANOMALY DETECTION (Invisible AI) ---
      if (capturedLatencies) {
        const anomaly = QuantumAnomalyDetector.detect(latency, capturedLatencies);
        if (anomaly.isAnomaly) {
          console.warn(
            `[Mesh] QUANTUM ANOMALY detected for ${monitor.name}! Z-Score: ${anomaly.score}`,
          );
          
          // Store insight
          await insightService.createInsight({
            monitorId: monitor.id,
            type: InsightType.ANOMALY,
            severity: anomaly.score > 5 ? InsightSeverity.CRITICAL : InsightSeverity.WARNING,
            message: `Latency Anomaly Detected: ${monitor.name} is performing significantly outside expected baseline (Z-Score: ${anomaly.score}).`,
            metadata: { score: anomaly.score, latency }
          });
        }

        // Periodically run heuristic advice (every ~10 checks)
        if (Math.random() < 0.1) {
          try {
            const recentEvents = await prisma.monitorEvent.findMany({
              where: { monitorId: monitor.id, status: "UP" },
              orderBy: { timestamp: "desc" },
              take: 20
            });
            await insightService.analyzeAndProvideAdvice(monitor.id, monitor.name, recentEvents);
          } catch (e) {
            console.error(`[InsightAdvice] Failed for ${monitor.name}:`, e);
          }
        }
      }

      // Circuit Breaker Calculation
      let nextCheckTime = new Date(Date.now() + (monitor.interval || 60) * 1000);

      if (currentStatus === "DOWN") {
        try {
          const activeIncident = await incidentService.findActiveIncident(monitor.id);
          if (activeIncident) {
            const downtimeDuration = Date.now() - activeIncident.createdAt.getTime();
            const ONE_HOUR = 60 * 60 * 1000;

            if (downtimeDuration > ONE_HOUR) {
              console.log(
                `[CircuitBreaker] Monitor ${monitor.id} down for >1h. Applying 10m backoff.`,
              );
              const BACKOFF_INTERVAL = 10 * 60 * 1000; // 600s
              nextCheckTime = new Date(Date.now() + BACKOFF_INTERVAL);
            }
          }
        } catch (cbError) {
          console.error(`[CircuitBreaker] Error checking incident duration:`, cbError);
        }
      }

      // --- PERSISTENCE: Save result and update monitor ---
      const persistUpdate = async () => {
        try {
          if (circuitState === "OPEN") {
            throw new Error("CircuitBreaker: OPEN. Avoiding database writes.");
          }

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

          // Successfully saved - if we were in HALF_OPEN, we can now mark as healthy
          if (circuitState === "HALF_OPEN") {
            await circuitBreaker.recordSuccess();
          }
        } catch (dbErr: any) {
          console.error(`[Persistence] Primary DB failure for ${monitor.name}:`, dbErr.message);

          // Record failure to circuit breaker (may trip)
          await circuitBreaker.recordFailure(dbErr);

          // Fallback to Redis for the Event (durability)
          await fallbackQueue.push({
            monitorId: monitor.id,
            status: currentStatus,
            latency: latency,
            errorReason: errorReason,
            timestamp: new Date().toISOString(),
          });
        }
      };

      // We usually want to await this to ensure sequential processing in the batch if needed
      // but in a serverless env, we can fire-and-forget IF we wrap it in waitUntil,
      // however here we are in a loop so it's safer to await to avoid overwhelming the worker's open sockets.
      await persistUpdate();

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
        const activeIncident = activeIncidentsMap.get(monitor.id);
        const alertable = shouldSendAlert(monitor.id, eventCountsMap);

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
            runbookUrl: monitor.runbookUrl,
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
        const activeIncident = activeIncidentsMap.get(monitor.id);

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
        } else {
          // CHECK FOR CUSTOM ALERT RULES (Latency Thresholds)
          const latencyRule = monitor.alertRules?.find(
            (r: any) => r.trigger === "LATENCY" && r.enabled,
          );

          const threshold = latencyRule?.threshold || 1000; // Default to 1000ms if no rule
          const comparison = latencyRule?.comparison || "GT";

          const isHighLatency = comparison === "GT" ? latency > threshold : latency < threshold;

          if (isHighLatency) {
            // HIGH LATENCY ALERT
            const notificationPayload = {
              type: "HIGH_LATENCY" as const,
              monitorId: monitor.id,
              monitorName: monitor.name,
              url: monitor.url,
              status: "UP" as const,
              latency: latency,
              timestamp: new Date().toISOString(),
              reason: `High Latency: ${latency}ms (Threshold: ${threshold}ms)`,
            };

            if (env && env.NOTIFICATION_QUEUE) {
              console.log(
                `[Notification] Queueing HIGH LATENCY alert for ${monitor.name} (${latency}ms > ${threshold}ms)`,
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
      }
      // --- DNS CACHE CAPTURE: Store last known good IP ---
      if (currentStatus === "UP" && env.DNS_CACHE) {
        try {
          const urlObj = new URL(monitor.url);
          const hostname = urlObj.hostname;

          // We only resolve if it's not a raw IP already
          if (!/^[0-9.]+$/.test(hostname)) {
            // We don't await this to keep the check loop fast
            const { resolveDNS } = await import("./lib/dns-resolver");
            resolveDNS(hostname)
              .then((ip) => {
                if (ip && env.DNS_CACHE) {
                  env.DNS_CACHE.put(
                    `dns:${hostname}`,
                    JSON.stringify({ ip, timestamp: Date.now() }),
                    {
                      expirationTtl: 60 * 60 * 24, // 24 hours
                    },
                  );
                }
              })
              .catch(() => {});
          }
        } catch (dnsErr) {
          // Silently ignore DNS capture failures
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
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    try {
      const url = new URL(request.url);

      // WebSocket Route: /ws/monitors/:id
      if (url.pathname.startsWith("/ws/monitors/")) {
        try {
          const monitorId = url.pathname.split("/")[3];
          if (!monitorId) return new Response("Missing Monitor ID", { status: 400 });

          // Perform Auth Check (verify session cookie or allow if on a public status page)
          const cookieHeader = request.headers.get("Cookie");
          let isAuthenticated = false;
          let prisma = getPrisma(env.DATABASE_URL);

          // Support token via query param as fallback for cross-origin WebSockets
          let rawToken: string | null | undefined = url.searchParams.get("token");

          console.log(
            `[WS] Handshake for Monitor: ${monitorId}. Cookie present: ${!!cookieHeader}`,
          );

          if (!rawToken && cookieHeader) {
            const secureMatch = cookieHeader.match(/__Secure-better-auth\.session_token=([^;]+)/);
            const regularMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
            rawToken = secureMatch?.[1] || regularMatch?.[1] || null;
          }

          console.log(`[WS] Extracted Token: ${rawToken ? "✓ Found" : "✗ Missing"}`);

          // Perform Auth Check with Retry logic for stale DB connections
          const performHandshake = async (retry: boolean = true): Promise<Response | null> => {
            try {
              if (rawToken) {
                const token = decodeURIComponent(rawToken);
                const session = await prisma.session.findUnique({
                  where: { token },
                  select: { userId: true, expiresAt: true },
                });

                if (session && session.expiresAt > new Date()) {
                  const monitor = await prisma.monitor.findUnique({
                    where: { id: monitorId },
                    select: { userId: true },
                  });

                  if (monitor && monitor.userId === session.userId) {
                    isAuthenticated = true;
                  }
                }
              }

              if (!isAuthenticated) {
                // Fallback: If no valid session, check if monitor is exposed on any public Status Page
                const publicMonitor = await prisma.statusPageMonitor.findFirst({
                  where: {
                    monitorId: monitorId,
                    statusPage: { isPrivate: false },
                  },
                });

                if (!publicMonitor) {
                  return new Response("Unauthorized", { status: 401 });
                }
                isAuthenticated = true; // Mark as authenticated via public access
              }
              return null; // Success, continue
            } catch (err: any) {
              if (
                retry &&
                (err.message?.includes("Connection terminated unexpectedly") ||
                  err.message?.includes("is closed") ||
                  err.message?.includes("not found"))
              ) {
                console.warn(
                  `[WS Handshake] Stale DB connection detected. Resetting Prisma and retrying...`,
                );
                const { resetPrisma } = await import("@pulseguard/db");
                resetPrisma(env.DATABASE_URL);
                // Re-get the new instance
                prisma = getPrisma(env.DATABASE_URL);
                // Retry
                return await performHandshake(false); // Only retry once
              }
              throw err; // Re-throw if retry failed or hit different error
            }
          };

          const authResponse = await performHandshake();
          if (authResponse) return authResponse;

          if (!isAuthenticated) {
            return new Response("Unauthorized", { status: 401 });
          }

          // Forward to Durable Object
          const id = env.MONITOR_CHANNEL.idFromName(monitorId);
          const stub = env.MONITOR_CHANNEL.get(id);

          // We rewrite the URL to /websocket so the DO knows it's a client connection
          const doUrl = new URL("https://monitor-channel/websocket");

          // Pass the original request (headers, upgrade, etc) but with new URL
          return stub.fetch(doUrl.toString(), request);
        } catch (err: any) {
          console.error(`[WS ERROR] Critical failure in /ws/monitors/ handler:`, err);
          return new Response(`Internal Server Error: ${err.message}\nStack: ${err.stack}`, {
            status: 500,
          });
        }
      }

      // API Route: /api/dns-audit
      if (url.pathname === "/api/dns-audit" && request.method === "POST") {
        try {
          const body: any = await request.json();
          const { domain: targetDomain } = body;

          if (!targetDomain) return new Response("Missing 'domain' body param", { status: 400 });

          const { auditDNS } = await import("./services/dns-audit");
          const results = await auditDNS(targetDomain);

          return new Response(JSON.stringify(results), {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
            },
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      // API Route: /api/payload-audit
      if (url.pathname === "/api/payload-audit" && request.method === "POST") {
        try {
          const body: any = await request.json();
          const { url: targetUrl, pattern } = body;

          if (!targetUrl) return new Response("Missing 'url' body param", { status: 400 });

          const finalUrl = targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`;

          const { auditPayload } = await import("./services/payload-audit");
          const results = await auditPayload(finalUrl, pattern);

          return new Response(JSON.stringify(results), {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
            },
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      // API Route: /api/security-headers
      if (url.pathname === "/api/security-headers" && request.method === "POST") {
        try {
          const body: any = await request.json();
          const { url: targetUrl } = body;

          if (!targetUrl) return new Response("Missing 'url' body param", { status: 400 });

          const finalUrl = targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`;

          const { checkSecurityHeaders } = await import("./services/security-headers");
          const results = await checkSecurityHeaders(finalUrl);

          return new Response(JSON.stringify(results), {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
            },
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
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
              "Access-Control-Allow-Headers": "Content-Type",
            },
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
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

          return new Response(JSON.stringify(result), {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
            },
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
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
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
            },
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      // CORS Preflight
      if (request.method === "OPTIONS") {
        return new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      }

      return new Response("PulseGuard Worker is Running", { status: 200 });
    } catch (globalErr: any) {
      console.error(`[GLOBAL WORKER ERROR]`, globalErr);
      return new Response(`Global Worker Error: ${globalErr.message}`, { status: 500 });
    }
  },

  // 1. Cron: Find pending checks and run them (Free Tier Batch Mode)
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    console.log(`Cron triggered: ${event.cron}`);
    let prisma = getPrisma(env.DATABASE_URL);

    // Monthly PDF Report Trigger
    if (event.cron === "0 9 1 * *") {
      console.log("Starting Monthly Report Job...");
      ctx.waitUntil(
        import("./services/reportGenerator")
          .then((m) => m.generateAndSendMonthlyReports(prisma, env))
          .catch((err) => console.error("Monthly Report Job Failed:", err)),
      );
    }

    // --- DATABASE SYNC: Restore data from Redis fallback if DB is healthy ---
    const { DatabaseCircuitBreaker } = await import("./lib/circuit-breaker");
    const circuitBreaker = new DatabaseCircuitBreaker(
      env.UPSTASH_REDIS_REST_URL,
      env.UPSTASH_REDIS_REST_TOKEN,
    );
    const circuitState = await circuitBreaker.getState();

    if (circuitState !== "OPEN") {
      ctx.waitUntil(
        import("./services/db-sync")
          .then((m) => m.syncFallbackToDatabase(prisma, env))
          .catch((err) => console.error("[Sync] Background task failed:", err)),
      );
    }

    // FREE TIER CONFIG: Process 5 monitors per cron tick (1 min)
    // Decreased to 5 to avoid CPU limits (exceededCpu error).
    const BATCH_SIZE = 5;

    const totalShards = Number(env.TOTAL_SHARDS || 1);
    const shardId = Number(env.SHARD_ID || 0);

    const runWithRetry = async (retry: boolean = true): Promise<any> => {
      try {
        // Find active monitors that are due for a check, but only for THIS shard
        // We use a raw query to fetch just the IDs that belong to the current shard's hash-space.
        // Postgres: Use abs(hashtext(id)) % totalShards = shardId
        const targetIds: { id: string }[] = await prisma.$queryRaw`
          SELECT id FROM "Monitor"
          WHERE ("status" IN ('UP', 'DOWN', 'MAINTENANCE'))
          AND ("nextCheck" IS NULL OR "nextCheck" <= NOW())
          AND (abs(hashtext(id)) % ${totalShards}) = ${shardId}
          ORDER BY "nextCheck" ASC
          LIMIT ${BATCH_SIZE}
        `;
        return targetIds;
      } catch (err: any) {
        if (
          retry &&
          (err.message?.includes("Connection terminated unexpectedly") ||
            err.message?.includes("is closed") ||
            err.message?.includes("not found"))
        ) {
          console.warn(
            `[Sync] Stale DB connection detected in schedule. Resetting Prisma and retrying...`,
          );
          const { resetPrisma } = await import("@pulseguard/db");
          resetPrisma(env.DATABASE_URL);
          // Re-get new prisma instance
          prisma = getPrisma(env.DATABASE_URL);
          // Retry
          return await runWithRetry(false);
        }
        throw err;
      }
    };

    try {
      // Shard-based monitor fetching
      const targetIds = await runWithRetry();

      if (targetIds.length === 0) return;

      const ids = targetIds.map((t: { id: any }) => t.id);

      // Fetch full monitor data for the batch
      const monitors = await prisma.monitor.findMany({
        where: { id: { in: ids } },
        select: {
          id: true,
          url: true,
          interval: true,
          timeout: true,
          status: true,
          name: true,
          checkRegions: true,
          alertThreshold: true,
          dynamicThresholding: true,
          runbookUrl: true,
          method: true,
          headers: true,
          body: true,
          // @ts-ignore
          maintenanceWindows: {
            where: {
              startAt: { lte: new Date() },
              endAt: { gte: new Date() },
            },
            take: 1,
          },
          alertRules: {
            where: { enabled: true },
          },
        },
      });

      console.log(`Found ${monitors.length} monitors to check.`);

      if (monitors.length === 0) return;

      // --- FREE PLAN: DIRECT EXECUTION ---
      // We process them right here instead of queuing
      const { remaining } = await processBatch(monitors, prisma, env, ctx);

      // Offload remaining to Queue if any
      if (remaining.length > 0) {
        if (env.CHECK_QUEUE) {
          console.warn(
            `[SmartBatch] Offloading ${remaining.length} monitors to Queue due to CPU limits.`,
          );
          // Send remaining monitors as individual messages or small batches
          const messages = remaining.map((m) => ({ body: m }));
          await env.CHECK_QUEUE.sendBatch(messages);
        } else {
          console.error(
            "[SmartBatch] Critical: CPU limit reached but NO CHECK_QUEUE defined. Checks dropped.",
          );
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

    const { remaining } = await processBatch(monitors, prisma, env, ctx);

    // Ack processed messages, Retry remaining
    if (remaining.length > 0) {
      console.warn(
        `[SmartBatch] Queue processing hit limit. Retrying ${remaining.length} messages.`,
      );

      // Get IDs of remaining monitors for lookup
      const remainingIds = new Set(remaining.map((m) => m.id));

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
