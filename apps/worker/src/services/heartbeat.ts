export interface HeartbeatResult {
  status: "UP" | "DOWN";
  latency: number;
  errorReason?: string;
  lastPingAt: string | null;
  secondsSinceLastPing: number | null;
  interval: number;
}

export interface HeartbeatPing {
  id: string;
  monitorId: string;
  pingedAt: string;
  sourceIp: string | null;
  userAgent: string | null;
}

const GRACE_MULTIPLIER = 2;

export function generateHeartbeatToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(36).padStart(2, "0"))
    .join("")
    .slice(0, 48);
}

export async function recordPing(
  prisma: any,
  monitorId: string,
  sourceIp: string | null = null,
  userAgent: string | null = null,
): Promise<HeartbeatPing> {
  const ping = await prisma.heartbeatPing.create({
    data: {
      monitorId,
      sourceIp,
      userAgent,
    },
  });

  const monitor = await prisma.monitor.findUnique({
    where: { id: monitorId },
    select: { interval: true },
  });

  const interval = monitor?.interval || 60;
  const nextCheck = new Date(Date.now() + interval * GRACE_MULTIPLIER * 1000);

  await prisma.monitor.update({
    where: { id: monitorId },
    data: {
      status: "UP",
      lastCheck: new Date(),
      nextCheck,
    },
  });

  return ping;
}

export async function checkHeartbeat(
  prisma: any,
  monitorId: string,
  interval: number,
): Promise<HeartbeatResult> {
  const start = performance.now();

  const latestPing = await prisma.heartbeatPing.findFirst({
    where: { monitorId },
    orderBy: { pingedAt: "desc" },
  });

  const latency = Math.round(performance.now() - start);

  if (!latestPing) {
    return {
      status: "DOWN",
      latency,
      errorReason: "NO_HEARTBEAT_RECEIVED",
      lastPingAt: null,
      secondsSinceLastPing: null,
      interval,
    };
  }

  const pingTime = new Date(latestPing.pingedAt).getTime();
  const now = Date.now();
  const secondsSinceLastPing = Math.floor((now - pingTime) / 1000);
  const maxAllowedGap = interval * GRACE_MULTIPLIER;

  if (secondsSinceLastPing > maxAllowedGap) {
    return {
      status: "DOWN",
      latency,
      errorReason: `HEARTBEAT_MISSED: ${secondsSinceLastPing}s since last ping (max ${maxAllowedGap}s)`,
      lastPingAt: latestPing.pingedAt.toISOString?.() || latestPing.pingedAt,
      secondsSinceLastPing,
      interval,
    };
  }

  return {
    status: "UP",
    latency,
    lastPingAt: latestPing.pingedAt.toISOString?.() || latestPing.pingedAt,
    secondsSinceLastPing,
    interval,
  };
}
