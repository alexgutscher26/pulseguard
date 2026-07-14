export interface ProbeRegistration {
  id: string;
  name: string;
  token: string;
  status: string;
}

export interface ProbeJob {
  id: string;
  monitorId: string;
  url: string;
  type: string;
  timeout: number;
  method?: string;
  headers?: string;
  body?: string;
  expectation?: string;
  script?: string;
}

export interface ProbeResult {
  monitorId: string;
  status: "UP" | "DOWN";
  latency: number;
  errorReason?: string;
  timestamp: string;
  region?: string;
}

export interface ProbeHeartbeatResult {
  probeId: string;
  status: "UP" | "DOWN";
  secondsSinceLastHeartbeat: number;
}

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return "pg_probe_" + Array.from(bytes)
    .map((b) => b.toString(36).padStart(2, "0"))
    .join("")
    .slice(0, 40);
}

export async function registerProbe(
  prisma: any,
  userId: string,
  name: string,
  platform?: string,
  region?: string,
  heartbeatInterval: number = 60,
): Promise<ProbeRegistration> {
  const token = generateToken();
  const probe = await prisma.probe.create({
    data: {
      name,
      token,
      userId,
      platform: platform || null,
      region: region || null,
      heartbeatInterval,
      status: "ACTIVE",
    },
  });
  return { id: probe.id, name: probe.name, token: probe.token, status: probe.status };
}

export async function authenticateProbe(
  prisma: any,
  token: string,
): Promise<{ id: string; name: string; userId: string } | null> {
  const probe = await prisma.probe.findUnique({
    where: { token },
    select: { id: true, name: true, userId: true, status: true },
  });
  if (!probe || probe.status !== "ACTIVE") return null;
  return probe;
}

export async function pollJobs(
  prisma: any,
  probeId: string,
  maxJobs: number = 10,
): Promise<ProbeJob[]> {
  // Fetch monitors assigned to this probe that are due for a check
  const assignments = await prisma.probeAssignment.findMany({
    where: { probeId },
    include: {
      monitor: {
        select: {
          id: true,
          url: true,
          type: true,
          timeout: true,
          method: true,
          headers: true,
          body: true,
          expectation: true,
          script: true,
          interval: true,
          nextCheck: true,
          lastCheck: true,
        },
      },
    },
    take: maxJobs,
  });

  const jobs: ProbeJob[] = [];
  const now = new Date();

  for (const assignment of assignments) {
    const m = assignment.monitor;
    const isDue = !m.nextCheck || new Date(m.nextCheck) <= now;
    if (isDue) {
      jobs.push({
        id: assignment.id,
        monitorId: m.id,
        url: m.url,
        type: m.type,
        timeout: m.timeout || 10,
        method: m.method || "GET",
        headers: m.headers || undefined,
        body: m.body || undefined,
        expectation: m.expectation || undefined,
        script: m.script || undefined,
      });
    }
  }

  return jobs;
}

export async function reportResult(
  prisma: any,
  probeId: string,
  result: ProbeResult,
): Promise<void> {
  await prisma.monitorEvent.create({
    data: {
      monitorId: result.monitorId,
      status: result.status,
      latency: result.latency,
      errorReason: result.errorReason || null,
      region: result.region || `probe:${probeId}`,
      probeId,
      timestamp: result.timestamp ? new Date(result.timestamp) : new Date(),
    },
  });

  // Update monitor status
  await prisma.monitor.update({
    where: { id: result.monitorId },
    data: {
      status: result.status,
      lastCheck: new Date(),
      nextCheck: new Date(Date.now() + 60 * 1000), // Default 60s polling
    },
  });
}

export async function recordHeartbeat(
  prisma: any,
  probeId: string,
  ipAddress?: string,
): Promise<void> {
  await prisma.probe.update({
    where: { id: probeId },
    data: {
      lastHeartbeat: new Date(),
      status: "ACTIVE",
      ipAddress: ipAddress || undefined,
    },
  });
}

export async function checkProbeHeartbeats(
  prisma: any,
): Promise<ProbeHeartbeatResult[]> {
  const probes = await prisma.probe.findMany({
    where: { status: { not: "DISCONNECTED" } },
    select: { id: true, lastHeartbeat: true, heartbeatInterval: true },
  });

  const results: ProbeHeartbeatResult[] = [];
  const now = Date.now();

  for (const probe of probes) {
    if (!probe.lastHeartbeat) {
      results.push({ probeId: probe.id, status: "DOWN", secondsSinceLastHeartbeat: -1 });
      continue;
    }

    const secondsSince = Math.floor((now - probe.lastHeartbeat.getTime()) / 1000);
    const maxGap = probe.heartbeatInterval * 3; // 3x grace multiplier
    const status = secondsSince > maxGap ? "DOWN" : "UP";

    if (status === "DOWN") {
      await prisma.probe.update({
        where: { id: probe.id },
        data: { status: "DISCONNECTED" },
      });
    }

    results.push({ probeId: probe.id, status, secondsSinceLastHeartbeat: secondsSince });
  }

  return results;
}
