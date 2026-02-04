# PLAN-sla-reports

> **Status**: APPROVED
> **Owner**: @pulseguard/project-planner
> **Priority**: P5

## 1. Overview

**Objective**: Implement precise SLA (Service Level Agreement) reporting capabilities for monitors, enabling users to view exact uptime percentages (e.g., 99.99%) over specific timeframes (Weekly, Monthly).

**Key Features**:

1.  **Exact Uptime Calculation**: Aggregated form `DailyMonitorSummary` + Real-time `MonitorEvent` data.
2.  **Report View**: A dedicated "Reports" tab in the Monitor Detail view.
3.  **Visual Breakdown**: Day-by-day uptime histogram and summary cards.
4.  **Export Ready**: Structure data for future PDF/CSV export.

---

## 2. Technical Architecture

### 2.1 Data Sources

We will use a hybrid data fetching strategy to ensure 100% accuracy while maintaining performance.

| Timeframe                           | Source                | Granularity      | Notes                                                                                        |
| ----------------------------------- | --------------------- | ---------------- | -------------------------------------------------------------------------------------------- |
| **Historical Days** (T-1 and older) | `DailyMonitorSummary` | Daily Aggregates | Already computed by `downsampling-cron.ts`. Contains `checksUp`, `checksTotal`, `uptimePct`. |
| **Current Day** (T-0)               | `MonitorEvent`        | Raw Events       | Calculated on-the-fly to provide real-time status.                                           |

### 2.2 Calculation Logic

**Formula**:

```typescript
Overall Uptime % = (Total Successful Checks / Total Checks) * 100
```

_Note: This effectively weights days by the number of checks, handling intervals where checks might be paused or frequency changed._

**Downtime Duration**:

```typescript
Total Downtime (min) = Σ (Daily Downtime) + (Today's Downtime)
```

### 2.3 Schema Logic

No new database schema is required. We rely on the existing `DailyMonitorSummary` model:

```prisma
model DailyMonitorSummary {
  date           DateTime
  uptimePct      Float
  checksTotal    Int
  checksUp       Int
  checksDown     Int
  downDuration   Int
  // ...
}
```

---

## 3. Implementation Plan

### Phase 1: Backend API (tRPC)

Create a new tRPC router `reports` or extend `monitor` router.

**Procedure**: `getSlaReport`

- **Input**: `{ monitorId: string, range: '7d' | '30d' | 'custom', startDate?: Date, endDate?: Date }`
- **Logic**:
  1.  Resolve date range (UTC).
  2.  Query `DailyMonitorSummary` for full days in range.
  3.  Query `MonitorEvent` for the _partial_ current day (if range includes today).
  4.  Merge datasets:
      - `periodTotalChecks = sum(daily.checksTotal) + today.count`
      - `periodUpChecks = sum(daily.checksUp) + today.upCount`
  5.  Return types: `aggregate` (totals) and `dailyBreakdown` (array).

### Phase 2: Frontend UI

**New Tab**: `MonitorLayout` -> `Reports` (next to Overview, Incidents, Settings).

**Components**:

1.  **DateRangeFilter**: Simple dropdown (Last 7 Days, Last 30 Days, This Month, Last Month).
2.  **SLACard**:
    - Big Metrics: "99.98% Uptime", "2m 13s Downtime".
    - SLA Badge: "Passes 99.9% SLA" (Green) / "Fails" (Red).
3.  **UptimeHistogram**:
    - Bar chart showing daily uptime %.
    - Tooltip: "Jan 12: 100% (1440 checks)".
4.  **DowntimeLog** (Optional MVP): List of days with <100% uptime.

---

## 4. Work Breakdown Structure (WBS)

### Task 1: API Implementation

- [ ] Create `reports.ts` in tRPC router.
- [ ] Implement `getSlaReport` logic.
- [ ] Add unit tests for uptime calculation (verifying weighted averages).

### Task 2: UI Implementation

- [ ] Create `ReportsTab.tsx`.
- [ ] Implement `DateRangePicker` component.
- [ ] Build `SLASummaryCards` text component.
- [ ] Build `DailyUptimeChart` (using Recharts or existing chart lib).

### Task 3: Integration & Polish

- [ ] Hook up tRPC to Frontend.
- [ ] Add loading states and empty states (new monitors).
- [ ] Verify UTC vs Local time display consistency.

---

## 5. Open Questions & Assumptions

- **Maintenance Windows**: Currently assumed that "Maintenance" status events are excluded from `checksDown` or treated neutrally. **Decision**: Explicitly exclude `MAINTENANCE` status from `checksTotal` to avoid penalizing SLA.
- **Timezones**: Reports will be calculated in UTC (based on `DailySummary`), but UI should ideally localized. For MVP, we will stick to UTC days to match backend aggregation.

## 6. Socratic Validation

- **Q: Why exact calculation?**
  - A: "Average of Averages" is mathematically incorrect for SLA (e.g., a day with 1 check at 100% shouldn't weight same as a day with 1000 checks at 50%). Summing raw counts is required.
- **Q: Impact on DB?**
  - A: Very low. `DailyMonitorSummary` is small (1 row/day). `MonitorEvent` query is limited to < 24 hours.

---

**Next Steps**:

1.  Approve Plan.
2.  Run `/create` to scaffold the UI.
