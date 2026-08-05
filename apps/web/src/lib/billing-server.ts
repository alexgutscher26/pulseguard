import db, { resetPrisma } from "@pulseguard/db";
import { PLANS, type PlanTier, type UsageSummary } from "./billing";

/**
 * Fetch usage stats and quota limits for a given user (Server-only).
 */
export async function getUserUsageSummary(userId: string): Promise<UsageSummary> {
  let user: any = null;
  let subscription: any = null;

  try {
    user = await db.user.findUnique({
      where: { id: userId },
      include: { subscription: true } as any,
    });
    subscription = user?.subscription;
  } catch {
    // Proactively clear stale dev singleton if schema changed while server was running
    try {
      await resetPrisma();
    } catch {}

    user = await db.user.findUnique({
      where: { id: userId },
    });

    try {
      if ("subscription" in db) {
        subscription = await (db as any).subscription.findUnique({
          where: { userId },
        });
      }
    } catch {}
  }

  const [monitorsCount, alertChannelsCount, statusPagesCount, eventsCount] = await Promise.all([
    db.monitor.count({ where: { userId } }),
    db.notificationChannel.count({ where: { userId } }),
    db.statusPage.count({ where: { userId } }),
    db.monitorEvent.count({
      where: {
        monitor: { userId },
        timestamp: {
          gte: new Date(new Date().setDate(1)), // Beginning of current month
        },
      },
    }),
  ]);

  const rawPlan = (subscription?.plan || user?.tier || "INITIATE").toUpperCase();
  const plan: PlanTier = rawPlan in PLANS ? (rawPlan as PlanTier) : "INITIATE";
  const details = PLANS[plan];

  return {
    monitorsUsed: monitorsCount,
    monitorsLimit: details.limits.maxMonitors,
    alertChannelsUsed: alertChannelsCount,
    alertChannelsLimit: details.limits.maxAlertChannels,
    statusPagesUsed: statusPagesCount,
    statusPagesLimit: details.limits.maxStatusPages,
    monthlyChecksCount: eventsCount,
    plan,
    limits: details.limits,
  };
}
