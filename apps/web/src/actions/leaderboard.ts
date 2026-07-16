"use server";

import prisma from "@pulseguard/db";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  image: string | null;
  bio: string | null;
  uptimePct: number;
  totalChecks: number;
  monitorCount: number;
  tier: string;
  statusPageSlug: string | null;
}

export async function getLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  const summaries = await prisma.dailyMonitorSummary.findMany({
    select: {
      checksUp: true,
      checksDown: true,
      monitor: { select: { userId: true, id: true } },
    },
  });

  const aggMap = new Map<string, { totalUp: number; totalDown: number; monitors: Set<string> }>();

  for (const s of summaries) {
    const uid = s.monitor.userId;
    if (!aggMap.has(uid)) aggMap.set(uid, { totalUp: 0, totalDown: 0, monitors: new Set() });
    const agg = aggMap.get(uid)!;
    agg.totalUp += s.checksUp;
    agg.totalDown += s.checksDown;
    agg.monitors.add(s.monitor.id);
  }

  const candidates: { userId: string; totalUp: number; totalDown: number; monitorCount: number }[] = [];
  for (const [userId, agg] of aggMap) {
    const totalChecks = agg.totalUp + agg.totalDown;
    if (totalChecks > 100) {
      candidates.push({ userId, totalUp: agg.totalUp, totalDown: agg.totalDown, monitorCount: agg.monitors.size });
    }
  }

  candidates.sort((a, b) => {
    const aUptime = a.totalUp + a.totalDown > 0 ? a.totalUp / (a.totalUp + a.totalDown) : 0;
    const bUptime = b.totalUp + b.totalDown > 0 ? b.totalUp / (b.totalUp + b.totalDown) : 0;
    if (bUptime !== aUptime) return bUptime - aUptime;
    return (b.totalUp + b.totalDown) - (a.totalUp + a.totalDown);
  });

  const topUserIds = candidates.slice(0, limit).map((c) => c.userId);
  const rankMap = new Map(topUserIds.map((id, i) => [id, i + 1]));

  const [users, pages] = await Promise.all([
    prisma.user.findMany({
      where: { id: { in: topUserIds } },
      select: { id: true, name: true, image: true, tier: true },
    }),
    prisma.statusPage.findMany({
      where: { userId: { in: topUserIds }, isPrivate: false },
      select: { slug: true, userId: true },
    }),
  ]);

  const userMap = new Map(users.map((u) => [u.id, u]));
  const pageMap = new Map(pages.map((p) => [p.userId, p.slug]));

  const entries: LeaderboardEntry[] = [];
  for (const c of candidates.slice(0, limit)) {
    const user = userMap.get(c.userId);
    if (!user) continue;
    const totalChecks = c.totalUp + c.totalDown;
    const uptimePct = totalChecks > 0 ? (c.totalUp / totalChecks) * 100 : 0;
    entries.push({
      rank: rankMap.get(c.userId) ?? 0,
      userId: c.userId,
      name: user.name,
      image: user.image,
      bio: null,
      uptimePct: Math.round(uptimePct * 100) / 100,
      totalChecks,
      monitorCount: c.monitorCount,
      tier: user.tier,
      statusPageSlug: pageMap.get(c.userId) ?? null,
    });
  }
  return entries;
}
