import db, { resetPrisma } from "@pulseguard/db";
import { PLANS, type PlanTier, type UsageSummary, type UsageWarning } from "./billing";
import { isFeatureEnabled, getFeatureError, type FeatureFlag } from "./feature-flags";
import { sendUsageLimitWarning } from "@pulseguard/email";

/**
 * Resolves active plan tier for a user (Server-only).
 */
export async function getUserPlan(userId: string): Promise<PlanTier> {
  let user: any = null;
  let subscription: any = null;

  try {
    user = await db.user.findUnique({
      where: { id: userId },
      include: { subscription: true } as any,
    });
    subscription = user?.subscription;
  } catch {
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

  // Auto-grant 14-day NETRUNNER trial on first account setup
  if (!subscription && user) {
    const trialEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    try {
      subscription = await db.subscription.create({
        data: {
          userId,
          plan: "NETRUNNER",
          status: "TRIALING",
          trialEndsAt: trialEnd,
          currentPeriodStart: new Date(),
          currentPeriodEnd: trialEnd,
        },
      });
    } catch {}
  }

  if (subscription?.status === "TRIALING") {
    const trialEnd = subscription.trialEndsAt || subscription.currentPeriodEnd;
    if (trialEnd && new Date() < new Date(trialEnd)) {
      return "NETRUNNER";
    }

    // Trial has expired — transition status
    try {
      await db.subscription.update({
        where: { userId },
        data: { status: "EXPIRED", plan: "INITIATE" },
      });
    } catch {}
    return "INITIATE";
  }

  const rawPlan = (subscription?.plan || user?.tier || "INITIATE").toUpperCase();
  if (rawPlan === "ADMIN" || rawPlan === "ENTERPRISE") return "CONSTRUCT";
  if (rawPlan === "PRO") return "NETRUNNER";
  return rawPlan in PLANS ? (rawPlan as PlanTier) : "INITIATE";
}

/**
 * Fetch usage stats and quota limits for a given user (Server-only).
 */
export async function getUserUsageSummary(userId: string): Promise<UsageSummary> {
  const plan = await getUserPlan(userId);

  const [monitorsCount, alertChannelsCount, statusPagesCount, eventsCount, subscription] =
    await Promise.all([
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
      db.subscription.findUnique({ where: { userId } }).catch(() => null),
    ]);

  const details = PLANS[plan];

  const warnings: UsageWarning[] = [];

  const monitorPct = Math.round((monitorsCount / details.limits.maxMonitors) * 100);
  if (monitorPct >= 80) {
    warnings.push({
      resource: "monitors",
      label: "Active Monitors",
      used: monitorsCount,
      limit: details.limits.maxMonitors,
      percentage: monitorPct,
    });
  }

  const alertChannelPct = Math.round((alertChannelsCount / details.limits.maxAlertChannels) * 100);
  if (alertChannelPct >= 80) {
    warnings.push({
      resource: "alertChannels",
      label: "Alert Channels",
      used: alertChannelsCount,
      limit: details.limits.maxAlertChannels,
      percentage: alertChannelPct,
    });
  }

  const statusPagePct = Math.round((statusPagesCount / details.limits.maxStatusPages) * 100);
  if (statusPagePct >= 80) {
    warnings.push({
      resource: "statusPages",
      label: "Status Pages",
      used: statusPagesCount,
      limit: details.limits.maxStatusPages,
      percentage: statusPagePct,
    });
  }

  let isTrialActive = false;
  let trialDaysRemaining = 0;

  if (subscription?.status === "TRIALING") {
    const trialEnd = subscription.trialEndsAt || subscription.currentPeriodEnd;
    if (trialEnd) {
      const msRemaining = new Date(trialEnd).getTime() - Date.now();
      if (msRemaining > 0) {
        isTrialActive = true;
        trialDaysRemaining = Math.max(1, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
      }
    }
  }

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
    isApproachingLimit: warnings.length > 0,
    warnings,
    isTrialActive,
    trialDaysRemaining,
  };
}

/**
 * Checks usage summary and sends an automated warning email if limits are approaching.
 */
export async function checkAndNotifyUsageLimits(userId: string): Promise<void> {
  try {
    const summary = await getUserUsageSummary(userId);
    if (!summary.isApproachingLimit || summary.warnings.length === 0) return;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });

    if (!user?.email) return;

    await sendUsageLimitWarning(user.email, {
      userName: user.name || "Operator",
      planName: PLANS[summary.plan]?.name || summary.plan,
      warnings: summary.warnings,
    });
  } catch (err) {
    console.error("Failed to dispatch usage limit warning notification:", err);
  }
}

/**
 * Asserts that a user has access to a specific feature flag.
 */
export async function assertFeatureFlag(
  userId: string,
  flag: FeatureFlag,
): Promise<{ allowed: boolean; error?: string; plan: PlanTier }> {
  const plan = await getUserPlan(userId);
  if (!isFeatureEnabled(plan, flag)) {
    return {
      allowed: false,
      error: getFeatureError(flag),
      plan,
    };
  }
  return { allowed: true, plan };
}

/**
 * Server-side check before creating/updating a monitor.
 */
export async function assertMonitorLimits(
  userId: string,
  params: {
    type?: string;
    interval?: number;
    checkRegionsCount?: number;
    dynamicThresholding?: boolean;
    isNew?: boolean;
  },
): Promise<{ allowed: boolean; error?: string }> {
  const summary = await getUserUsageSummary(userId);
  const plan = summary.plan;
  const limits = summary.limits;

  if (params.isNew && summary.monitorsUsed >= limits.maxMonitors) {
    return {
      allowed: false,
      error: `Monitor quota reached (${summary.monitorsUsed}/${limits.maxMonitors}). Upgrade to unlock more monitors.`,
    };
  }

  if (params.interval !== undefined && params.interval < limits.minIntervalSeconds) {
    return {
      allowed: false,
      error: `Minimum check interval for your current plan (${plan}) is ${limits.minIntervalSeconds}s.`,
    };
  }

  if (params.type === "BROWSER" && !isFeatureEnabled(plan, "browser_monitors")) {
    return { allowed: false, error: getFeatureError("browser_monitors") };
  }

  if (params.type === "SEQUENCE" && !isFeatureEnabled(plan, "sequence_monitors")) {
    return { allowed: false, error: getFeatureError("sequence_monitors") };
  }

  if (
    (params.type === "MCP" || params.type === "DATABASE") &&
    !isFeatureEnabled(plan, "mcp_database_monitors")
  ) {
    return { allowed: false, error: getFeatureError("mcp_database_monitors") };
  }

  if ((params.checkRegionsCount ?? 0) > 1 && !isFeatureEnabled(plan, "multi_region")) {
    return { allowed: false, error: getFeatureError("multi_region") };
  }

  if (params.dynamicThresholding && !isFeatureEnabled(plan, "dynamic_thresholding")) {
    return { allowed: false, error: getFeatureError("dynamic_thresholding") };
  }

  return { allowed: true };
}

/**
 * Server-side check before creating/updating a status page.
 */
export async function assertStatusPageLimits(
  userId: string,
  params: {
    customDomain?: string;
    isPasswordProtected?: boolean;
    isWhiteLabeled?: boolean;
    isNew?: boolean;
  },
): Promise<{ allowed: boolean; error?: string }> {
  const summary = await getUserUsageSummary(userId);
  const plan = summary.plan;
  const limits = summary.limits;

  if (params.isNew && summary.statusPagesUsed >= limits.maxStatusPages) {
    return {
      allowed: false,
      error: `Status page quota reached (${summary.statusPagesUsed}/${limits.maxStatusPages}). Upgrade your plan to create more status pages.`,
    };
  }

  if (params.customDomain && !isFeatureEnabled(plan, "custom_domains")) {
    return { allowed: false, error: getFeatureError("custom_domains") };
  }

  if (params.isPasswordProtected && !isFeatureEnabled(plan, "private_status_pages")) {
    return { allowed: false, error: getFeatureError("private_status_pages") };
  }

  if (params.isWhiteLabeled && !isFeatureEnabled(plan, "white_label_status_pages")) {
    return {
      allowed: false,
      error: getFeatureError("white_label_status_pages"),
    };
  }

  return { allowed: true };
}

/**
 * Server-side check before creating/updating an alert channel.
 */
export async function assertNotificationChannelLimits(
  userId: string,
  params: {
    type: string;
    isNew?: boolean;
  },
): Promise<{ allowed: boolean; error?: string }> {
  const summary = await getUserUsageSummary(userId);
  const plan = summary.plan;
  const limits = summary.limits;

  if (params.isNew && summary.alertChannelsUsed >= limits.maxAlertChannels) {
    return {
      allowed: false,
      error: `Alert channel quota reached (${summary.alertChannelsUsed}/${limits.maxAlertChannels}). Upgrade your plan to add more alert channels.`,
    };
  }

  if (params.type === "SMS" && !isFeatureEnabled(plan, "sms_alerts")) {
    return { allowed: false, error: getFeatureError("sms_alerts") };
  }

  if (params.type === "WEBHOOK" && !isFeatureEnabled(plan, "custom_webhooks_pagerduty")) {
    return {
      allowed: false,
      error: getFeatureError("custom_webhooks_pagerduty"),
    };
  }

  if (params.type === "PAGERDUTY" && !isFeatureEnabled(plan, "pagerduty_integration")) {
    return { allowed: false, error: getFeatureError("pagerduty_integration") };
  }

  return { allowed: true };
}

// ─── Manual check sliding-window store ───────────────────────────────────────
// Keyed by "<userId>:<monitorId>". Per-isolate; resets on cold-start.
type ManualCheckStore = Map<string, number[]>;
const g = globalThis as typeof globalThis & { __mcStore?: ManualCheckStore };
if (!g.__mcStore) g.__mcStore = new Map();

/**
 * Rate-limits on-demand (manual) monitor checks per user per monitor.
 *
 * - INITIATE : 3 checks / 5 min
 * - NETRUNNER: 10 checks / 5 min
 * - CONSTRUCT : unlimited
 *
 * Uses an in-process sliding window; state resets on Worker cold-start.
 */
export async function assertManualCheckRateLimit(
  userId: string,
  monitorId: string,
): Promise<{ allowed: boolean; error?: string; retryAfterSeconds?: number }> {
  const plan = await getUserPlan(userId);
  const limits = PLANS[plan].limits;

  // 0 = unlimited (CONSTRUCT)
  if (limits.maxManualChecksPerWindow === 0) return { allowed: true };

  const windowMs = limits.manualCheckWindowSeconds * 1000;
  const maxChecks = limits.maxManualChecksPerWindow;
  const key = `${userId}:${monitorId}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  const timestamps = (g.__mcStore!.get(key) ?? []).filter((ts) => ts > windowStart);

  if (timestamps.length >= maxChecks) {
    const oldestInWindow = timestamps[0]!;
    const retryAfterSeconds = Math.ceil((oldestInWindow + windowMs - now) / 1000);
    const windowMinutes = limits.manualCheckWindowSeconds / 60;
    return {
      allowed: false,
      error: `Manual check limit reached (${maxChecks} per ${windowMinutes} min). Try again in ${retryAfterSeconds}s.`,
      retryAfterSeconds,
    };
  }

  timestamps.push(now);
  g.__mcStore!.set(key, timestamps);
  return { allowed: true };
}
