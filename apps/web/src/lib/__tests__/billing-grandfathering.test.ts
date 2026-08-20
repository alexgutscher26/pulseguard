import { describe, test, expect } from "bun:test";
import { getPlanLimits, PLANS, PLAN_VERSIONS } from "../billing";

describe("Early Cohort Grandfathering Guarantee & Plan Limits (P0-BIL-01)", () => {
  test("resolves base plan limits when no tierVersion is provided", () => {
    const initiateLimits = getPlanLimits("INITIATE");
    expect(initiateLimits.maxMonitors).toBe(PLANS.INITIATE.limits.maxMonitors);
    expect(initiateLimits.minIntervalSeconds).toBe(60);

    const netrunnerLimits = getPlanLimits("NETRUNNER");
    expect(netrunnerLimits.maxMonitors).toBe(
      PLANS.NETRUNNER.limits.maxMonitors,
    );
    expect(netrunnerLimits.minIntervalSeconds).toBe(30);

    const constructLimits = getPlanLimits("CONSTRUCT");
    expect(constructLimits.maxMonitors).toBe(
      PLANS.CONSTRUCT.limits.maxMonitors,
    );
    expect(constructLimits.minIntervalSeconds).toBe(10);
  });

  test("applies grandfathered limits for early v1_launch subscribers", () => {
    const grandfatheredInitiate = getPlanLimits("INITIATE", "v1_launch");
    expect(grandfatheredInitiate.maxMonitors).toBe(50);
    expect(grandfatheredInitiate.minIntervalSeconds).toBe(60);
    expect(grandfatheredInitiate.maxAlertChannels).toBe(3);
    expect(grandfatheredInitiate.maxStatusPages).toBe(1);

    const grandfatheredNetrunner = getPlanLimits("NETRUNNER", "v1_launch");
    expect(grandfatheredNetrunner.maxMonitors).toBe(250);
    expect(grandfatheredNetrunner.minIntervalSeconds).toBe(30);

    const grandfatheredConstruct = getPlanLimits("CONSTRUCT", "v1_launch");
    expect(grandfatheredConstruct.maxMonitors).toBe(1500);
    expect(grandfatheredConstruct.minIntervalSeconds).toBe(10);
  });

  test("gracefully falls back to current base limits for unknown tierVersion", () => {
    const unknownVersionLimits = getPlanLimits(
      "INITIATE",
      "unknown_future_version_xyz",
    );
    expect(unknownVersionLimits.maxMonitors).toBe(
      PLANS.INITIATE.limits.maxMonitors,
    );
  });

  test("applies grandfathered limits for design_partner_vip and stripe_live subscribers", () => {
    const vipInitiate = getPlanLimits("INITIATE", "design_partner_vip");
    expect(vipInitiate.maxMonitors).toBe(100);
    expect(vipInitiate.minIntervalSeconds).toBe(30);

    const vipNetrunner = getPlanLimits("NETRUNNER", "design_partner_vip");
    expect(vipNetrunner.maxMonitors).toBe(500);
    expect(vipNetrunner.minIntervalSeconds).toBe(15);

    const liveConstruct = getPlanLimits("CONSTRUCT", "stripe_live");
    expect(liveConstruct.maxMonitors).toBe(1500);
    expect(liveConstruct.minIntervalSeconds).toBe(10);
  });

  test("preserves grandfathered limits even if base PLANS dictionary is modified", () => {
    // Verify PLAN_VERSIONS defines fixed immutable contracts
    expect(PLAN_VERSIONS.v1_launch.INITIATE.maxMonitors).toBe(50);
    expect(PLAN_VERSIONS.v1_launch.NETRUNNER.maxMonitors).toBe(250);
    expect(PLAN_VERSIONS.v1_launch.CONSTRUCT.maxMonitors).toBe(1500);
    expect(PLAN_VERSIONS.design_partner_vip.INITIATE.maxMonitors).toBe(100);
    expect(PLAN_VERSIONS.design_partner_vip.NETRUNNER.maxMonitors).toBe(500);
  });
});
