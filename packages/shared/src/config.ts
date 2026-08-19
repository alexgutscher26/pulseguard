/**
 * Global Product Configuration & Limits
 */

export const PRODUCT_CONFIG = {
  FREE_CHECKS_LIMIT: 10000,
  LATENCY_GOAL_MS: 50,
  DEFAULT_CHECK_INTERVAL_SECONDS: 60,
  FREE_TIER_STANDARD_INTERVAL_SECONDS: 180, // 3-minute check interval for standard free tier
  FREE_TIER_1M_FAST_MONITORS_LIMIT: 10, // 1-minute check interval for up to 10 monitors on free tier
  PAID_TIER_FAST_INTERVAL_SECONDS: 30, // 30-second check interval on Pro / Enterprise
  MIN_CHECK_INTERVAL_SECONDS: 30,
  MAX_TIMEOUT_SECONDS: 30,
  FREE_TIER_MAX_MONITORS: 50,
  FREE_TIER_MAX_STATUS_PAGES: 1,
  FREE_TIER_MAX_SEATS: 1,
  FREE_TIER_RETENTION_DAYS: 3,
  FREE_TIER_PRIMARY_REGIONS_COUNT: 3, // wnam, weur, apac
  FREE_TIER_QUORUM: "2-of-3 Quorum Consensus",
  PAID_TIER_SOVEREIGN_REGIONS_COUNT: 7,
  PAID_TIER_QUORUM: "4-of-7 Quorum Consensus",

  /**
   * The Grandfathering Guarantee: Early cohort users retain their launch
   * free-tier limits permanently, even if future free tier limits change.
   */
  LAUNCH_TIER_VERSION: "v1_launch",
  GRANDFATHER_GUARANTEE_ENABLED: true,
};

export const TIER_TRIGGERS = {
  FREE_FOREVER: [
    "3-minute checks (1-min for up to 10 monitors)",
    "50 active monitors",
    "3 Primary edge regions with 2-of-3 Quorum consensus",
    "Ad-hoc manual diagnostics from 100+ countries (Globalping)",
    "Slack, Discord & Email dispatches",
    "1 Public Status Page (SteadyStack branded)",
    "Commercial use permitted",
  ],
  PAID_TRIGGERS: [
    "Full 7-region sovereign mesh with 4-of-7 Quorum consensus",
    "30-second rapid check intervals",
    "Custom domain on status pages",
    "White-label status pages (removing SteadyStack footer)",
    "More than 1 seat / Team RBAC",
    "On-call escalation policies & schedules",
    "Private probe agents (VPC / On-prem)",
    "30-day & 1-year log retention",
    "SMS & Telegram alert dispatches",
    "Browser synthetics beyond base allowance",
  ],
};
