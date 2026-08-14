import type {
  MonitorStatus,
  ProbeCheckResult,
  ProbeHealthState,
  QuorumEvaluation,
  StateChangeEvent,
} from "@pulseguard/types";
import { getRegionByCode, VALID_DO_LOCATION_HINTS } from "@pulseguard/shared";
import type { Env } from "../env";

/**
 * Configurable Quorum Engine Tuning Knobs
 */
export interface QuorumConfig {
  /** Minimum number of failing probes required to confirm a DOWN state (default: 4) */
  minConfirmationCount: number;
  /** Total global edge probes in full quorum pool (default: 7) */
  totalProbesInPool: number;
  /** Maximum window in milliseconds to group check results for quorum (default: 90s) */
  quorumWindowMs: number;
  /** Maximum acceptable latency before a probe measurement is excluded as slow (default: 15,000ms) */
  slowProbeLatencyThresholdMs: number;
  /** Maximum state transitions in 2 hours before a probe is classified as FLAPPING (default: 3) */
  maxTransitionsForFlapping: number;
}

export const DEFAULT_QUORUM_CONFIG: QuorumConfig = {
  minConfirmationCount: 4,
  totalProbesInPool: 7,
  quorumWindowMs: 90_000,
  slowProbeLatencyThresholdMs: 15_000,
  maxTransitionsForFlapping: 3,
};

/**
 * Stateful Quorum Engine with probe flapping tracking
 */
export class QuorumEngine {
  private transitions = new Map<string, number[]>();
  private probeHealth = new Map<string, ProbeHealthState>();

  registerProbeStateTransition(
    probeId: string,
    _status: string,
    timestamp: number = Date.now(),
  ): void {
    const windowStart = timestamp - 2 * 60 * 60 * 1000;
    const list = this.transitions.get(probeId) || [];
    const updated = [...list.filter((t) => t >= windowStart), timestamp];
    this.transitions.set(probeId, updated);

    if (updated.length >= 3) {
      this.probeHealth.set(probeId, "FLAPPING");
    } else {
      this.probeHealth.set(probeId, "ONLINE");
    }
  }

  isProbeFlapping(probeId: string): boolean {
    const list = this.transitions.get(probeId) || [];
    const windowStart = Date.now() - 2 * 60 * 60 * 1000;
    return list.filter((t) => t >= windowStart).length >= 3;
  }

  getProbeHealth(probeId: string): { status: ProbeHealthState; excludedFromQuorum: boolean } {
    const isFlapping = this.isProbeFlapping(probeId);
    const status: ProbeHealthState = isFlapping
      ? "FLAPPING"
      : this.probeHealth.get(probeId) || "ONLINE";
    return {
      status,
      excludedFromQuorum: isFlapping || status === "OFFLINE",
    };
  }

  evaluate(
    monitorId: string,
    results: ProbeCheckResult[],
    config?: QuorumConfig,
  ): QuorumEvaluation {
    return evaluateQuorum(monitorId, results, config, this.probeHealth);
  }
}

/**
 * In-memory rolling window buffer for multi-region check results.
 * Maps monitorId -> ProbeCheckResult[]
 */
const quorumBuffer = new Map<string, ProbeCheckResult[]>();

/**
 * Evaluates multi-region quorum across a collection of check results for a monitor
 */
export function evaluateQuorum(
  monitorId: string,
  results: ProbeCheckResult[],
  config: QuorumConfig = DEFAULT_QUORUM_CONFIG,
  probeHealthMap: Map<string, ProbeHealthState> = new Map(),
): QuorumEvaluation {
  const now = Date.now();
  const validWindow = now - config.quorumWindowMs;

  // 1. Filter out stale results
  const recentResults = results.filter((r) => {
    const t = new Date(r.timestamp).getTime();
    return t >= validWindow;
  });

  // Keep only the newest result per probe/region to avoid duplicate votes from the same vantage point
  const latestByRegion = new Map<string, ProbeCheckResult>();
  for (const r of recentResults) {
    const existing = latestByRegion.get(r.region);
    if (!existing || new Date(r.timestamp) > new Date(existing.timestamp)) {
      latestByRegion.set(r.region, r);
    }
  }

  const distinctResults = Array.from(latestByRegion.values());

  const excludedFlappingProbes: string[] = [];
  const excludedSlowProbes: string[] = [];
  const eligibleResults: ProbeCheckResult[] = [];

  // 2. Exclude Flapping Probes & Slow Probes
  for (const r of distinctResults) {
    const health = probeHealthMap.get(r.probeId) || probeHealthMap.get(r.region) || "ONLINE";

    if (health === "FLAPPING") {
      excludedFlappingProbes.push(r.region);
      continue;
    }

    if (r.latency > config.slowProbeLatencyThresholdMs && r.status === "DOWN") {
      // Exclude slow/congested transit probe from denominator
      excludedSlowProbes.push(r.region);
      continue;
    }

    eligibleResults.push(r);
  }

  const totalEligible = eligibleResults.length;
  const downResults = eligibleResults.filter((r) => r.status === "DOWN");
  const upResults = eligibleResults.filter((r) => r.status === "UP");

  const downRegions = downResults.map((r) => r.region);
  const upRegions = upResults.map((r) => r.region);
  const reportingRegions = eligibleResults.map((r) => r.region);

  // 3. ASN Distribution & Independence
  const asnDistribution: Record<string, number> = {};
  for (const r of downResults) {
    const regionMeta = getRegionByCode(r.region);
    const asn = r.asn || regionMeta?.asn || "AS_UNKNOWN";
    asnDistribution[asn] = (asnDistribution[asn] || 0) + 1;
  }

  // 4. Calculate Average Latency from UP probes
  const totalLatency = upResults.reduce((acc, r) => acc + r.latency, 0);
  const averageLatency = upResults.length > 0 ? Math.round(totalLatency / upResults.length) : 0;

  // Dynamic consensus threshold based on eligible probes:
  // If all 7 probes are eligible, threshold is 4 (4-of-7).
  // If some probes are excluded or partial pool, threshold is majority: Math.max(2, Math.ceil((totalEligible + 1) / 2))
  const requiredDownCount =
    totalEligible >= config.totalProbesInPool
      ? config.minConfirmationCount
      : Math.max(2, Math.ceil((totalEligible + 1) / 2));

  const confirmedDownCount = downResults.length;
  const isDownConsensus = confirmedDownCount >= requiredDownCount && totalEligible >= 2;
  const isRegionalDegradation = confirmedDownCount > 0 && !isDownConsensus;
  const isGlobalOutage = isDownConsensus;

  let finalStatus: "UP" | "DOWN" | "DEGRADED" = "UP";
  let reason: string | undefined = undefined;

  if (isGlobalOutage) {
    finalStatus = "DOWN";
    reason = `Global Outage confirmed by ${confirmedDownCount}/${totalEligible} edge regions (${downRegions.join(", ")})`;
  } else if (isRegionalDegradation) {
    finalStatus = "DEGRADED";
    reason = `Regional Degradation in ${downRegions.join(", ")} (${confirmedDownCount}/${totalEligible} regions failing)`;
  }

  return {
    monitorId,
    finalStatus,
    isDownConsensus,
    isRegionalDegradation,
    isGlobalOutage,
    confirmedDownCount,
    totalEligibleProbes: totalEligible,
    reportingRegions,
    downRegions,
    upRegions,
    excludedFlappingProbes,
    excludedSlowProbes,
    asnDistribution,
    averageLatency,
    timestamp: new Date().toISOString(),
    reason,
  };
}

/**
 * Process a batch of probe check results:
 * 1. Appends to rolling quorum buffer
 * 2. Evaluates quorum consensus
 * 3. Detects state transitions (UP -> DOWN, DOWN -> UP, DEGRADED)
 * 4. Records state changes to database & triggers alerts
 * 5. Flushes 1-minute aggregates to LatencyAggregate
 */
export async function processProbeResultsBatch(
  prisma: any,
  env: Env,
  results: ProbeCheckResult[],
  config: QuorumConfig = DEFAULT_QUORUM_CONFIG,
): Promise<void> {
  if (results.length === 0) return;

  const now = new Date();
  const monitorIds = Array.from(new Set(results.map((r) => r.monitorId)));

  // 1. Fetch current monitor statuses from DB
  const monitors = await prisma.monitor.findMany({
    where: { id: { in: monitorIds } },
    select: {
      id: true,
      name: true,
      status: true,
      interval: true,
      alertThreshold: true,
      userId: true,
    },
  });

  const monitorMap = new Map<string, any>(monitors.map((m: any) => [m.id, m]));

  // 2. Buffer incoming results
  for (const r of results) {
    let buf = quorumBuffer.get(r.monitorId);
    if (!buf) {
      buf = [];
      quorumBuffer.set(r.monitorId, buf);
    }
    buf.push(r);

    // Prune results older than 5 minutes from memory buffer
    const cutoff = Date.now() - 5 * 60 * 1000;
    quorumBuffer.set(
      r.monitorId,
      buf.filter((b) => new Date(b.timestamp).getTime() > cutoff),
    );
  }

  // 3. Evaluate each monitor's quorum consensus
  for (const monitorId of monitorIds) {
    const monitor = monitorMap.get(monitorId);
    if (!monitor) continue;

    const buf = quorumBuffer.get(monitorId) || [];
    const evaluation = evaluateQuorum(monitorId, buf, config);

    const prevStatus: MonitorStatus = monitor.status;
    const newStatus: MonitorStatus =
      evaluation.finalStatus === "DEGRADED"
        ? "DEGRADED"
        : evaluation.finalStatus === "DOWN"
          ? "DOWN"
          : "UP";

    // 4. Handle State Transitions
    if (prevStatus !== newStatus) {
      console.log(
        `[QuorumEngine] State change detected for monitor ${monitor.name} (${monitorId}): ${prevStatus} → ${newStatus} (${evaluation.reason})`,
      );

      // Record state change event in DB
      await prisma.monitorEvent.create({
        data: {
          monitorId,
          status: newStatus === "DEGRADED" ? "DOWN" : newStatus,
          latency: evaluation.averageLatency,
          errorReason: evaluation.reason || `Quorum transition to ${newStatus}`,
          region: evaluation.downRegions.join(",") || "global",
          timestamp: now,
        },
      });

      // Update monitor record
      await prisma.monitor.update({
        where: { id: monitorId },
        data: {
          status: newStatus === "DEGRADED" ? "DOWN" : newStatus,
          lastCheck: now,
          nextCheck: new Date(now.getTime() + (monitor.interval || 60) * 1000),
        },
      });

      // Trigger Incidents and Alerting on DOWN consensus
      if (newStatus === "DOWN" && prevStatus !== "DOWN") {
        try {
          const { IncidentService } = await import("../lib/incident-service");
          const incidentService = new IncidentService(prisma);
          await incidentService.createIncident(
            monitorId,
            `Global Outage: ${monitor.name}`,
            evaluation.reason || "Global outage confirmed across edge quorum",
          );
        } catch (alertErr) {
          console.error(`[QuorumEngine] Failed to create incident:`, alertErr);
        }
      } else if (newStatus === "UP" && prevStatus === "DOWN") {
        try {
          const { IncidentService } = await import("../lib/incident-service");
          const incidentService = new IncidentService(prisma);
          const activeIncident = await incidentService.findActiveIncident(monitorId);
          if (activeIncident) {
            await incidentService.resolveIncident(activeIncident.id);
          }
        } catch (alertErr) {
          console.error(`[QuorumEngine] Failed to resolve incident:`, alertErr);
        }
      }
    } else {
      // Periodic nextCheck bump without writing a raw MonitorEvent row
      await prisma.monitor.update({
        where: { id: monitorId },
        data: {
          lastCheck: now,
          nextCheck: new Date(now.getTime() + (monitor.interval || 60) * 1000),
        },
      });
    }

    // 5. Record 1-minute aggregates to LatencyAggregator DO
    if (env.LATENCY_AGGREGATOR) {
      try {
        const aggregatorId = env.LATENCY_AGGREGATOR.idFromName("global-latency-aggregator");
        const aggregator = env.LATENCY_AGGREGATOR.get(aggregatorId);

        for (const r of results.filter((res) => res.monitorId === monitorId)) {
          await aggregator.fetch("http://internal/record", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              monitorId: r.monitorId,
              region: r.region,
              latency: r.latency,
              success: r.status === "UP",
              timestamp: new Date(r.timestamp).getTime(),
            }),
          });
        }
      } catch (aggErr) {
        // Non-blocking latency aggregation failure
      }
    }
  }
}
