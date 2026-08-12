export type PlanTier = "INITIATE" | "NETRUNNER" | "CONSTRUCT";

export interface PlanLimits {
  maxMonitors: number;
  minIntervalSeconds: number;
  maxAlertChannels: number;
  maxStatusPages: number;
  customDomainAllowed: boolean;
  usageMetered: boolean;
  priorityProbes: boolean;
  /** Max manual run-checks per monitor per window. 0 = unlimited. */
  maxManualChecksPerWindow: number;
  /** Sliding window length in seconds for manual check rate limiting. */
  manualCheckWindowSeconds: number;
}

export interface PlanDetails {
  id: PlanTier;
  name: string;
  badge?: string;
  description: string;
  monthlyPrice: number;
  annualPriceMonthly: number; // Monthly equivalent when billed annually ($180/yr = $15/mo, $780/yr = $65/mo)
  stripePriceIdMonthly?: string;
  stripePriceIdAnnual?: string;
  limits: PlanLimits;
  features: string[];
}

export const PLANS: Record<PlanTier, PlanDetails> = {
  INITIATE: {
    id: "INITIATE",
    name: "The Initiate",
    description: "Perfect for indie developers, side projects & commercial use.",
    monthlyPrice: 0,
    annualPriceMonthly: 0,
    limits: {
      maxMonitors: 50,
      minIntervalSeconds: 60,
      maxAlertChannels: 3,
      maxStatusPages: 1,
      customDomainAllowed: false,
      usageMetered: false,
      priorityProbes: false,
      maxManualChecksPerWindow: 3,
      manualCheckWindowSeconds: 300,
    },
    features: [
      "50 Active Monitors",
      "60-second Heartbeat checks",
      "Free plan includes commercial use",
      "Email & Discord alert dispatches",
      "1 Public Status page",
      "3 Days log & telemetry retention",
    ],
  },
  NETRUNNER: {
    id: "NETRUNNER",
    name: "The Netrunner",
    badge: "THE SLEEP PLAN",
    description:
      "Solo devs who value their sleep with multi-region verification & zero false alarms.",
    monthlyPrice: 19,
    annualPriceMonthly: 15,
    stripePriceIdMonthly:
      process.env.STRIPE_NETRUNNER_MONTHLY_PRICE_ID || "price_netrunner_monthly",
    stripePriceIdAnnual: process.env.STRIPE_NETRUNNER_ANNUAL_PRICE_ID || "price_netrunner_annual",
    limits: {
      maxMonitors: 250,
      minIntervalSeconds: 30,
      maxAlertChannels: 25,
      maxStatusPages: 15,
      customDomainAllowed: true,
      usageMetered: true,
      priorityProbes: true,
      maxManualChecksPerWindow: 10,
      manualCheckWindowSeconds: 300,
    },
    features: [
      "250 Active Monitors",
      "30-second Heartbeat checks",
      "Multi-Region verification & zero false alarms",
      "Anomalous latency indicators",
      "SSL & Port monitoring",
      "15 White-label Status pages",
      "45 Days logs & PDF SLA reports",
    ],
  },
  CONSTRUCT: {
    id: "CONSTRUCT",
    name: "The Construct",
    description: "Enterprise reliability, HFT checks, SAML & Workspaces for professional teams.",
    monthlyPrice: 79,
    annualPriceMonthly: 65,
    stripePriceIdMonthly:
      process.env.STRIPE_CONSTRUCT_MONTHLY_PRICE_ID || "price_construct_monthly",
    stripePriceIdAnnual: process.env.STRIPE_CONSTRUCT_ANNUAL_PRICE_ID || "price_construct_annual",
    limits: {
      maxMonitors: 1500,
      minIntervalSeconds: 10,
      maxAlertChannels: 250,
      maxStatusPages: 75,
      customDomainAllowed: true,
      usageMetered: true,
      priorityProbes: true,
      maxManualChecksPerWindow: 0,
      manualCheckWindowSeconds: 300,
    },
    features: [
      "1,500 Active Monitors",
      "10-second HFT Heartbeat checks",
      "Full Global Pulse coverage (5 regions)",
      "SSO, SAML & Workspaces",
      "PagerDuty, Slack & custom webhooks",
      "75 Private status portals",
      "1 Year log retention & 99.99% SLA",
    ],
  },
};

export interface UsageWarning {
  resource: "monitors" | "alertChannels" | "statusPages";
  label: string;
  used: number;
  limit: number;
  percentage: number;
}

export interface UsageSummary {
  monitorsUsed: number;
  monitorsLimit: number;
  alertChannelsUsed: number;
  alertChannelsLimit: number;
  statusPagesUsed: number;
  statusPagesLimit: number;
  monthlyChecksCount: number;
  plan: PlanTier;
  limits: PlanLimits;
  isApproachingLimit: boolean;
  warnings: UsageWarning[];
  isTrialActive?: boolean;
  trialDaysRemaining?: number;
}
