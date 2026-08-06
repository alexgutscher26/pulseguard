/**
 * Global Product Configuration & Limits
 */

export const PRODUCT_CONFIG = {
  FREE_CHECKS_LIMIT: 10000,
  LATENCY_GOAL_MS: 50,
  DEFAULT_CHECK_INTERVAL_SECONDS: 60,
  MIN_CHECK_INTERVAL_SECONDS: 30,
  MAX_TIMEOUT_SECONDS: 30,
  FREE_TIER_MAX_MONITORS: 50,
  FREE_TIER_MAX_STATUS_PAGES: 1,
  FREE_TIER_MAX_SEATS: 1,
  FREE_TIER_RETENTION_DAYS: 3,

  /**
   * The Grandfathering Guarantee: Early cohort users retain their launch
   * free-tier limits permanently, even if future free tier limits change.
   */
  LAUNCH_TIER_VERSION: "v1_launch",
  GRANDFATHER_GUARANTEE_ENABLED: true,
};

export const TIER_TRIGGERS = {
  FREE_FOREVER: [
    "60-second check intervals",
    "50 active monitors",
    "Multi-region consensus & zero false positives",
    "Slack, Discord & Email dispatches",
    "1 Public Status Page (PulseGuard branded)",
    "Commercial use permitted",
  ],
  PAID_TRIGGERS: [
    "Custom domain on status pages",
    "White-label status pages (removing PulseGuard footer)",
    "More than 1 seat / Team RBAC",
    "On-call escalation policies & schedules",
    "Private probe agents (VPC / On-prem)",
    "30-day & 1-year log retention",
    "SMS & Phone voice call alerts",
    "Browser synthetics beyond base allowance",
  ],
};
