# Project Plan: Latency Heatmap with Regional Visualization

**Created**: 2026-01-31  
**Status**: ✅ Complete  
**Complexity**: High  
**Estimated Duration**: 3-4 days

---

## Executive Summary

Implement a real-time latency heatmap visualization that displays regional performance metrics with historical trends. The heatmap will integrate with the existing regional incident tracking system, support multi-granularity time aggregates (1-minute, 5-minute, hourly), and provide interactive drill-down capabilities for detailed regional analysis.

---

## Phase -1: Context Check

### Current System Analysis

**Existing Components** (from REGIONAL_MONITORING.md):

- ✅ Regional monitoring infrastructure
- ✅ Regional incident tracking with configurable thresholds
- ✅ Database schema for regional failures
- ✅ Worker-based monitoring system

**Integration Points**:

- Regional incident tracking system
- Monitor check results
- Alert threshold configuration
- Real-time event streaming

**Tech Stack**:

- **Frontend**: Next.js 14+, React, TypeScript, Tailwind CSS
- **Backend**: Cloudflare Workers, Durable Objects
- **Database**: D1 (SQLite)
- **Real-time**: WebSockets or Server-Sent Events (SSE)
- **Visualization**: D3.js or Recharts for heatmap rendering

---

## Phase 0: Requirements & Constraints

### Functional Requirements

1. **Multi-Granularity Latency Tracking**
   - 1-minute aggregates (recent data)
   - 5-minute aggregates (medium-term)
   - Hourly aggregates (long-term trends)
   - Automatic downsampling of older data

2. **Dual Metric Display**
   - Absolute latency values (ms)
   - Relative performance vs. baseline

3. **Interactive Features**
   - Click region → detailed metrics modal/panel
   - Time range selector (1h, 6h, 24h, 7d, 30d)
   - Real-time updates (WebSocket/SSE)
   - Hover tooltips with instant metrics

4. **Regional Integration**
   - Sync with existing regional incident tracking
   - Visual indicators for regions with active incidents
   - Threshold breach highlighting

### Non-Functional Requirements

- **Performance**: Heatmap renders in < 500ms
- **Real-time**: Updates within 5 seconds of new data
- **Scalability**: Support 50+ regions per monitor
- **Accessibility**: WCAG 2.1 AA compliant color schemes
- **Mobile**: Responsive design for tablet/mobile

### Constraints

- Must use existing D1 database
- Must integrate with current Worker architecture
- Must maintain backward compatibility with existing monitoring
- Data retention: 1-minute (7 days), 5-minute (30 days), hourly (1 year)

---

## Phase 1: Architecture & Design

### 1.1 Database Schema Extensions

**New Tables**:

```sql
-- Latency aggregates table
CREATE TABLE latency_aggregates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  monitor_id TEXT NOT NULL,
  region TEXT NOT NULL,
  timestamp INTEGER NOT NULL, -- Unix timestamp
  granularity TEXT NOT NULL, -- '1m', '5m', '1h'

  -- Metrics
  avg_latency REAL NOT NULL,
  min_latency REAL NOT NULL,
  max_latency REAL NOT NULL,
  p50_latency REAL NOT NULL,
  p95_latency REAL NOT NULL,
  p99_latency REAL NOT NULL,

  -- Metadata
  sample_count INTEGER NOT NULL,
  success_rate REAL NOT NULL,

  FOREIGN KEY (monitor_id) REFERENCES monitors(id) ON DELETE CASCADE
);

CREATE INDEX idx_latency_monitor_region_time
  ON latency_aggregates(monitor_id, region, granularity, timestamp DESC);

CREATE INDEX idx_latency_timestamp
  ON latency_aggregates(timestamp);

-- Regional baselines for relative performance
CREATE TABLE regional_baselines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  monitor_id TEXT NOT NULL,
  region TEXT NOT NULL,
  baseline_latency REAL NOT NULL, -- 30-day rolling average
  last_updated INTEGER NOT NULL,

  FOREIGN KEY (monitor_id) REFERENCES monitors(id) ON DELETE CASCADE,
  UNIQUE(monitor_id, region)
);
```

**Schema Updates**:

```sql
-- Add latency tracking to existing regional_failures table
ALTER TABLE regional_failures
  ADD COLUMN avg_latency REAL;

ALTER TABLE regional_failures
  ADD COLUMN latency_threshold REAL;
```

### 1.2 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Monitor Check Worker                    │
│  • Executes regional checks                                 │
│  • Records raw latency per region                           │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│              Latency Aggregation Worker (DO)                │
│  • Receives raw latency data                                │
│  • Computes 1-min aggregates in memory                      │
│  • Flushes to D1 every minute                               │
│  • Triggers downsampling for 5-min/hourly                   │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                  Downsampling Cron Worker                   │
│  • Runs every 5 minutes                                     │
│  • Aggregates 1-min → 5-min                                 │
│  • Runs hourly: 5-min → 1-hour                              │
│  • Cleanup: Delete old 1-min data (>7 days)                 │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    D1 Database (Storage)                    │
│  • latency_aggregates (multi-granularity)                   │
│  • regional_baselines (for relative metrics)                │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│              Heatmap API Endpoint (Next.js)                 │
│  GET /api/monitors/[id]/latency-heatmap                     │
│  • Query params: timeRange, granularity, metricType         │
│  • Returns: regional latency matrix + incidents             │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│           Real-time Updates (SSE/WebSocket)                 │
│  • Stream new latency data to connected clients             │
│  • Push incident state changes                              │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                 Frontend Heatmap Component                  │
│  • Renders interactive heatmap (D3.js/Recharts)             │
│  • Real-time updates via SSE                                │
│  • Click → Regional detail modal                            │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Component Architecture

**Frontend Components**:

```
src/components/monitors/latency/
├── LatencyHeatmap.tsx          # Main heatmap container
├── HeatmapGrid.tsx             # D3.js/Canvas-based grid renderer
├── HeatmapControls.tsx         # Time range + metric type selector
├── HeatmapLegend.tsx           # Color scale legend
├── RegionalDetailModal.tsx     # Drill-down modal
├── LatencyTimeSeries.tsx       # Historical trend chart
└── hooks/
    ├── useLatencyData.ts       # Data fetching + SSE subscription
    ├── useHeatmapScale.ts      # Color scale computation
    └── useRegionalBaseline.ts  # Baseline calculations
```

**Backend Components**:

```
workers/
├── latency-aggregator/         # Durable Object for aggregation
│   ├── index.ts
│   └── aggregator.ts
├── downsampling-cron/          # Scheduled downsampling
│   └── index.ts
└── utils/
    └── latency-calculator.ts   # Percentile calculations

app/api/monitors/[id]/
├── latency-heatmap/
│   └── route.ts                # GET endpoint
└── latency-stream/
    └── route.ts                # SSE endpoint
```

---

## Phase 2: Implementation Plan

### Task Breakdown

#### **TASK 1: Database Schema & Migrations** (Agent: `backend-specialist`)

**Priority**: P0  
**Duration**: 4 hours

**Subtasks**:

1. Create migration file for `latency_aggregates` table
2. Create migration file for `regional_baselines` table
3. Add indexes for query optimization
4. Update `regional_failures` schema with latency columns
5. Write seed data for testing

**Deliverables**:

- `migrations/0XX_latency_heatmap_schema.sql`
- Updated Prisma schema (if applicable)

**Verification**:

```bash
# Run migration
wrangler d1 migrations apply pulseguard-db --local

# Verify tables
wrangler d1 execute pulseguard-db --local --command \
  "SELECT name FROM sqlite_master WHERE type='table';"
```

---

#### **TASK 2: Latency Aggregation Worker (DO)** (Agent: `backend-specialist`)

**Priority**: P0  
**Duration**: 6 hours  
**Dependencies**: TASK 1

**Subtasks**:

1. Create Durable Object class `LatencyAggregator`
2. Implement in-memory buffer for 1-minute windows
3. Calculate percentiles (p50, p95, p99) using streaming algorithm
4. Flush aggregates to D1 every minute
5. Handle regional baseline updates
6. Add error handling & retry logic

**Deliverables**:

- `workers/latency-aggregator/aggregator.ts`
- `workers/latency-aggregator/index.ts`
- Unit tests

**Key Implementation**:

```typescript
// Streaming percentile calculation (P-Square algorithm)
class PercentileCalculator {
  private markers: number[] = [];

  addValue(value: number) {
    /* ... */
  }
  getPercentile(p: number): number {
    /* ... */
  }
}

export class LatencyAggregator implements DurableObject {
  private buffer: Map<string, LatencyBuffer> = new Map();

  async recordLatency(monitorId: string, region: string, latency: number) {
    const key = `${monitorId}:${region}`;
    let buffer = this.buffer.get(key) || new LatencyBuffer();
    buffer.add(latency);
    this.buffer.set(key, buffer);
  }

  async flushAggregates() {
    // Compute aggregates and write to D1
  }
}
```

**Verification**:

- Unit tests for percentile calculations
- Integration test: Send 1000 latency samples → verify aggregates

---

#### **TASK 3: Downsampling Cron Worker** (Agent: `backend-specialist`)

**Priority**: P0  
**Duration**: 4 hours  
**Dependencies**: TASK 2

**Subtasks**:

1. Create scheduled worker (runs every 5 minutes)
2. Implement 1-min → 5-min aggregation
3. Implement 5-min → hourly aggregation (runs hourly)
4. Implement data cleanup (delete old 1-min data)
5. Add logging & monitoring

**Deliverables**:

- `workers/downsampling-cron/index.ts`
- `wrangler.toml` cron configuration

**Cron Schedule**:

```toml
[triggers]
crons = [
  "*/5 * * * *",  # Every 5 minutes: 1m→5m downsampling
  "0 * * * *"     # Every hour: 5m→1h downsampling + cleanup
]
```

**Verification**:

```bash
# Test locally
wrangler dev workers/downsampling-cron/index.ts

# Trigger manually
curl -X POST http://localhost:8787/__scheduled
```

---

#### **TASK 4: Heatmap API Endpoint** (Agent: `backend-specialist`)

**Priority**: P1  
**Duration**: 5 hours  
**Dependencies**: TASK 1, TASK 2

**Subtasks**:

1. Create `GET /api/monitors/[id]/latency-heatmap` endpoint
2. Implement query parameter validation (timeRange, granularity, metricType)
3. Query latency aggregates from D1
4. Fetch regional baselines for relative metrics
5. Merge with regional incident data
6. Format response for frontend consumption
7. Add caching headers

**API Contract**:

```typescript
// Request
GET /api/monitors/abc123/latency-heatmap?timeRange=24h&metricType=both

// Response
{
  "monitorId": "abc123",
  "timeRange": "24h",
  "granularity": "5m",
  "regions": [
    {
      "region": "us-east-1",
      "data": [
        {
          "timestamp": 1706745600,
          "absolute": { "avg": 120, "p50": 115, "p95": 180, "p99": 250 },
          "relative": { "vsBaseline": 1.15 }, // 15% slower than baseline
          "hasIncident": false
        }
      ],
      "baseline": 104.5,
      "currentIncident": null
    }
  ],
  "colorScale": {
    "absolute": { "min": 50, "max": 500 },
    "relative": { "min": 0.5, "max": 2.0 }
  }
}
```

**Deliverables**:

- `app/api/monitors/[id]/latency-heatmap/route.ts`
- API tests

---

#### **TASK 5: Real-time SSE Endpoint** (Agent: `backend-specialist`)

**Priority**: P1  
**Duration**: 4 hours  
**Dependencies**: TASK 2

**Subtasks**:

1. Create `GET /api/monitors/[id]/latency-stream` SSE endpoint
2. Subscribe to Latency Aggregator DO updates
3. Stream new latency data to clients
4. Handle client disconnections
5. Add heartbeat mechanism

**Deliverables**:

- `app/api/monitors/[id]/latency-stream/route.ts`

**Implementation**:

```typescript
export async function GET(req: Request) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Subscribe to DO updates
      const subscription = await aggregatorDO.subscribe(monitorId);

      for await (const update of subscription) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(update)}\n\n`),
        );
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
```

---

#### **TASK 6: Heatmap Visualization Component** (Agent: `frontend-specialist`)

**Priority**: P1  
**Duration**: 8 hours  
**Dependencies**: TASK 4

**Subtasks**:

1. Create `LatencyHeatmap.tsx` container component
2. Implement `HeatmapGrid.tsx` using D3.js or Canvas
3. Build color scale generator (green-yellow-red gradient)
4. Add hover tooltips with instant metrics
5. Implement click handlers for regional drill-down
6. Add loading states & error handling
7. Ensure WCAG AA color contrast compliance

**Design Specifications**:

- **Color Scale (Absolute)**:
  - < 100ms: `hsl(120, 70%, 50%)` (green)
  - 100-300ms: `hsl(60, 70%, 50%)` (yellow)
  - 300-500ms: `hsl(30, 70%, 50%)` (orange)
  - > 500ms: `hsl(0, 70%, 50%)` (red)

- **Color Scale (Relative)**:
  - < 0.8x baseline: Green
  - 0.8-1.2x baseline: Yellow
  - 1.2-1.5x baseline: Orange
  - > 1.5x baseline: Red

- **Incident Overlay**: Red border + pulsing animation

**Deliverables**:

- `src/components/monitors/latency/LatencyHeatmap.tsx`
- `src/components/monitors/latency/HeatmapGrid.tsx`
- `src/components/monitors/latency/HeatmapLegend.tsx`
- Storybook stories

**Accessibility**:

- Keyboard navigation support
- Screen reader announcements for region selection
- Pattern overlays for colorblind users (optional toggle)

---

#### **TASK 7: Heatmap Controls & Time Range Selector** (Agent: `frontend-specialist`)

**Priority**: P1  
**Duration**: 3 hours  
**Dependencies**: TASK 6

**Subtasks**:

1. Create `HeatmapControls.tsx` component
2. Implement time range selector (1h, 6h, 24h, 7d, 30d)
3. Add metric type toggle (Absolute / Relative / Both)
4. Add granularity auto-selection based on time range
5. Persist user preferences in localStorage

**Time Range → Granularity Mapping**:

- 1h, 6h: 1-minute aggregates
- 24h: 5-minute aggregates
- 7d, 30d: Hourly aggregates

**Deliverables**:

- `src/components/monitors/latency/HeatmapControls.tsx`

---

#### **TASK 8: Regional Detail Modal** (Agent: `frontend-specialist`)

**Priority**: P2  
**Duration**: 5 hours  
**Dependencies**: TASK 6

**Subtasks**:

1. Create `RegionalDetailModal.tsx` component
2. Display detailed metrics (avg, p50, p95, p99, min, max)
3. Show historical trend chart (last 24h)
4. Display current incident status (if any)
5. Add "View Full History" link to dedicated page
6. Implement smooth animations (slide-in)

**Modal Content**:

- Region name & flag icon
- Current latency metrics (table)
- 24-hour trend chart (line graph)
- Incident timeline (if applicable)
- Success rate percentage

**Deliverables**:

- `src/components/monitors/latency/RegionalDetailModal.tsx`
- `src/components/monitors/latency/LatencyTimeSeries.tsx`

---

#### **TASK 9: Real-time Data Hook** (Agent: `frontend-specialist`)

**Priority**: P1  
**Duration**: 4 hours  
**Dependencies**: TASK 5, TASK 6

**Subtasks**:

1. Create `useLatencyData.ts` hook
2. Implement SSE subscription logic
3. Merge real-time updates with existing data
4. Handle reconnection on disconnect
5. Add optimistic updates for smooth UX

**Deliverables**:

- `src/components/monitors/latency/hooks/useLatencyData.ts`

**Implementation**:

```typescript
export function useLatencyData(monitorId: string, timeRange: string) {
  const [data, setData] = useState<LatencyHeatmapData | null>(null);

  useEffect(() => {
    // Initial fetch
    fetch(`/api/monitors/${monitorId}/latency-heatmap?timeRange=${timeRange}`)
      .then((res) => res.json())
      .then(setData);

    // SSE subscription
    const eventSource = new EventSource(
      `/api/monitors/${monitorId}/latency-stream`,
    );
    eventSource.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setData((prev) => mergeUpdate(prev, update));
    };

    return () => eventSource.close();
  }, [monitorId, timeRange]);

  return data;
}
```

---

#### **TASK 10: Integration with Monitor Check Worker** (Agent: `backend-specialist`)

**Priority**: P0  
**Duration**: 3 hours  
**Dependencies**: TASK 2

**Subtasks**:

1. Update monitor check worker to record latency per region
2. Send latency data to LatencyAggregator DO
3. Update regional incident creation to include latency metrics
4. Add latency threshold checks

**Deliverables**:

- Updated `workers/monitor-check/index.ts`

**Integration Point**:

```typescript
// In monitor check worker
async function checkRegion(monitor: Monitor, region: string) {
  const startTime = Date.now();
  const response = await fetch(monitor.url, {
    /* ... */
  });
  const latency = Date.now() - startTime;

  // Send to aggregator
  await latencyAggregatorDO.recordLatency(monitor.id, region, latency);

  // Check threshold
  if (latency > monitor.latencyThreshold) {
    await createRegionalIncident(monitor.id, region, { avgLatency: latency });
  }
}
```

---

#### **TASK 11: Integration with Monitor Detail Page** (Agent: `frontend-specialist`)

**Priority**: P2  
**Duration**: 2 hours  
**Dependencies**: TASK 6, TASK 7

**Subtasks**:

1. Add "Latency Heatmap" tab to monitor detail page
2. Integrate `LatencyHeatmap` component
3. Add responsive layout for mobile
4. Update navigation

**Deliverables**:

- Updated `app/monitors/[id]/page.tsx`

---

#### **TASK 12: Testing & Quality Assurance** (Agent: `debugger`)

**Priority**: P0  
**Duration**: 6 hours  
**Dependencies**: All previous tasks

**Subtasks**:

1. Unit tests for aggregation logic
2. Integration tests for API endpoints
3. E2E tests for heatmap interactions
4. Performance testing (50+ regions, 30-day data)
5. Accessibility audit (WCAG AA)
6. Cross-browser testing
7. Mobile responsiveness testing

**Test Scenarios**:

- ✅ Latency data aggregates correctly across granularities
- ✅ Heatmap renders 50 regions in < 500ms
- ✅ Real-time updates appear within 5 seconds
- ✅ Regional detail modal shows accurate data
- ✅ Time range changes update heatmap correctly
- ✅ Incident overlays display on affected regions
- ✅ Color scales are accessible (contrast ratio > 4.5:1)
- ✅ Keyboard navigation works for all interactions

**Deliverables**:

- Test suite (Jest + Playwright)
- Performance benchmark report
- Accessibility audit report

---

#### **TASK 13: Documentation** (Agent: `orchestrator`)

**Priority**: P2  
**Duration**: 3 hours  
**Dependencies**: TASK 12

**Subtasks**:

1. Update `REGIONAL_MONITORING.md` with heatmap documentation
2. Create API documentation for new endpoints
3. Write user guide for heatmap features
4. Document data retention policies
5. Add troubleshooting guide

**Deliverables**:

- Updated `docs/REGIONAL_MONITORING.md`
- `docs/API_LATENCY_HEATMAP.md`
- `docs/USER_GUIDE_HEATMAP.md`

---

## Phase 3: Deployment & Rollout

### Deployment Checklist

**Pre-Deployment**:

- [ ] Run full test suite
- [ ] Performance benchmarks pass
- [ ] Accessibility audit complete
- [ ] Database migrations tested in staging
- [ ] Worker bindings configured
- [ ] Environment variables set

**Deployment Steps**:

1. Deploy database migrations to production D1
2. Deploy Latency Aggregator DO
3. Deploy Downsampling Cron Worker
4. Deploy API endpoints
5. Deploy frontend components
6. Enable SSE streaming
7. Monitor for errors (first 24 hours)

**Rollback Plan**:

- Feature flag: `ENABLE_LATENCY_HEATMAP` (default: false)
- If critical issues: disable feature flag
- Database migrations are additive (no breaking changes)

---

## Phase 4: Monitoring & Optimization

### Success Metrics

**Performance**:

- Heatmap render time: < 500ms (p95)
- API response time: < 200ms (p95)
- SSE latency: < 5 seconds
- Database query time: < 100ms (p95)

**Usage**:

- % of users viewing heatmap
- Average session duration on heatmap
- Click-through rate on regional details

**System Health**:

- Aggregation worker error rate: < 0.1%
- Downsampling success rate: > 99.9%
- SSE connection stability: > 95%

### Optimization Opportunities

**Phase 4.1** (Post-Launch):

- Implement WebGL rendering for 100+ regions
- Add predictive latency alerts (ML-based)
- Export heatmap as PNG/PDF
- Add region comparison view

**Phase 4.2** (Future):

- Global latency map (world map visualization)
- Latency correlation analysis (identify patterns)
- Custom region grouping
- Latency SLA tracking

---

## Risk Assessment

| Risk                                              | Probability | Impact | Mitigation                                                |
| ------------------------------------------------- | ----------- | ------ | --------------------------------------------------------- |
| D1 query performance degrades with large datasets | Medium      | High   | Implement aggressive indexing + data archival             |
| Real-time updates cause excessive DB writes       | Medium      | Medium | Batch writes in 1-minute windows                          |
| Heatmap rendering slow on low-end devices         | Low         | Medium | Use Canvas instead of SVG, implement virtualization       |
| SSE connections drop frequently                   | Low         | Medium | Implement automatic reconnection with exponential backoff |
| Color scale not accessible                        | Low         | High   | Add pattern overlays, test with colorblind simulators     |

---

## Dependencies & Prerequisites

**External Dependencies**:

- D3.js v7+ or Recharts v2+ (heatmap rendering)
- EventSource API (SSE support)

**Internal Dependencies**:

- Existing regional monitoring system
- Cloudflare Workers + Durable Objects
- D1 database
- Next.js 14+ App Router

**Team Skills Required**:

- TypeScript/React expertise
- D3.js or data visualization experience
- Cloudflare Workers/DO knowledge
- Database optimization skills

---

## Timeline

| Phase                               | Duration | Start        | End          |
| ----------------------------------- | -------- | ------------ | ------------ |
| **Phase 1**: Database & Backend     | 1.5 days | Day 1        | Day 2 (noon) |
| **Phase 2**: Frontend Components    | 1.5 days | Day 2 (noon) | Day 4 (noon) |
| **Phase 3**: Integration & Testing  | 1 day    | Day 4 (noon) | Day 5 (noon) |
| **Phase 4**: Documentation & Deploy | 0.5 days | Day 5 (noon) | Day 5 (EOD)  |

**Total Estimated Duration**: 4-5 days (single developer, full-time)

---

## Agent Assignments

| Task         | Primary Agent         | Support Agent      |
| ------------ | --------------------- | ------------------ |
| TASK 1-5, 10 | `backend-specialist`  | `debugger`         |
| TASK 6-9, 11 | `frontend-specialist` | `debugger`         |
| TASK 12      | `debugger`            | `security-auditor` |
| TASK 13      | `orchestrator`        | -                  |

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Approve database schema** changes
3. **Set up feature flag** (`ENABLE_LATENCY_HEATMAP`)
4. **Create GitHub issues** for each task
5. **Run `/create`** to start implementation

---

## Questions for Stakeholder Review

1. Should we support custom region definitions (beyond AWS regions)?
2. What is the acceptable data retention cost for 1-year hourly aggregates?
3. Should we implement rate limiting on the SSE endpoint?
4. Do we need export functionality (CSV/JSON) for latency data?
5. Should the heatmap support multiple monitors simultaneously?

---

**Plan Status**: ✅ Ready for Review  
**Next Command**: `/create` (to begin implementation)
