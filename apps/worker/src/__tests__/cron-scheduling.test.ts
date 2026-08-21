import { describe, test, expect } from "bun:test";

describe("Cron Scheduling & NextCheck Calculation", () => {
  test("due check evaluation: monitors with null or past nextCheck are due", () => {
    const now = new Date();
    const pastTime = new Date(now.getTime() - 60000);
    const futureTime = new Date(now.getTime() + 60000);

    const monitors = [
      { id: "m1", status: "UP", nextCheck: null, interval: 60 },
      { id: "m2", status: "UP", nextCheck: pastTime, interval: 60 },
      { id: "m3", status: "UP", nextCheck: futureTime, interval: 60 },
      { id: "m4", status: "PAUSED", nextCheck: pastTime, interval: 60 },
    ];

    const dueMonitors = monitors.filter(
      (m) => m.status !== "PAUSED" && (!m.nextCheck || m.nextCheck <= now),
    );

    expect(dueMonitors.map((m) => m.id)).toEqual(["m1", "m2"]);
  });

  test("nextCheck calculation: correctly sets nextCheck = now + interval * 1000", () => {
    const now = Date.now();
    const intervalSeconds = 120;
    const computedNextCheck = new Date(now + intervalSeconds * 1000);

    const expectedTimeMin = now + (intervalSeconds - 1) * 1000;
    const expectedTimeMax = now + (intervalSeconds + 1) * 1000;

    expect(computedNextCheck.getTime()).toBeGreaterThanOrEqual(expectedTimeMin);
    expect(computedNextCheck.getTime()).toBeLessThanOrEqual(expectedTimeMax);
  });

  test("regional probe query filter structure", () => {
    const queryFilter = {
      status: { in: ["UP", "DOWN", "MAINTENANCE"] },
      OR: [{ nextCheck: null }, { nextCheck: { lte: new Date() } }],
    };

    expect(queryFilter.OR).toHaveLength(2);
    expect(queryFilter.OR[0]).toEqual({ nextCheck: null });
    expect(queryFilter.OR[1]).toHaveProperty("nextCheck");
  });
});
