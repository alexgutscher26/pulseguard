# Latency Heatmap Implementation Progress

**Date**: 2026-01-31  
**Status**: In Progress (Backend Complete, Frontend Pending)

---

## ✅ Completed Tasks

### TASK 1: Database Schema & Migrations (COMPLETE)

- ✅ Created `latency.prisma` schema with:
  - `LatencyAggregate` model (multi-granularity support)
  - `RegionalBaseline` model (30-day rolling averages)
  - `LatencyGranularity` enum (ONE_MINUTE, FIVE_MINUTE, ONE_HOUR)
- ✅ Updated `Monitor` model with latency relations
- ✅ Updated `RegionalIncident` model with latency tracking fields
- ✅ Generated Prisma client

**Files Created/Modified**:

- `packages/db/prisma/schema/latency.prisma`
- `packages/db/prisma/schema/schema.prisma`
- `packages/db/prisma/schema/incident.prisma`

---

### TASK 2: Latency Aggregation Worker (DO) (COMPLETE)

- ✅ Created `PercentileCalculator` class for streaming percentile calculations
- ✅ Created `LatencyBuffer` class for in-memory buffering
- ✅ Implemented `LatencyAggregator` Durable Object with:
  - In-memory 1-minute window buffering
  - Automatic flush every 60 seconds
  - Percentile calculations (p50, p95, p99)
  - Regional baseline updates (exponential moving average)
  - Real-time subscriber notifications
  - SSE endpoint for streaming updates

**Files Created**:

- `apps/worker/src/lib/latency-calculator.ts`
- `apps/worker/src/durable-objects/latency-aggregator.ts`

---

### TASK 3: Downsampling Cron Worker (COMPLETE)

- ✅ Implemented 1-min → 5-min downsampling (runs every 5 minutes)
- ✅ Implemented 5-min → 1-hour downsampling (runs hourly)
- ✅ Implemented automatic cleanup:
  - 1-minute data: 7-day retention
  - 5-minute data: 30-day retention
  - Hourly data: 1-year retention (no cleanup)
- ✅ Weighted average calculations for accurate aggregation

**Files Created**:

- `apps/worker/src/downsampling-cron.ts`

---

### TASK 4: Heatmap API Endpoint (COMPLETE)

- ✅ Created `GET /api/monitors/[id]/latency-heatmap` endpoint
- ✅ Automatic granularity selection based on time range:
  - 1h, 6h: 1-minute aggregates
  - 24h: 5-minute aggregates
  - 7d, 30d: Hourly aggregates
- ✅ Returns both absolute and relative metrics
- ✅ Includes regional baselines and active incidents
- ✅ Dynamic color scale calculation
- ✅ Caching headers (30s cache, 60s stale-while-revalidate)

**Files Created**:

- `apps/web/src/app/api/monitors/[id]/latency-heatmap/route.ts`

---

### TASK 5: Real-time SSE Endpoint (COMPLETE)

- ✅ Created `GET /api/monitors/[id]/latency-stream` endpoint
- ✅ Server-Sent Events (SSE) implementation
- ✅ Heartbeat mechanism (every 30 seconds)
- ✅ Automatic polling for new aggregates (every 60 seconds)
- ✅ Proper cleanup on client disconnect
- ✅ Authentication and authorization

**Files Created**:

- `apps/web/src/app/api/monitors/[id]/latency-stream/route.ts`

---

### TASK 10: Integration with Monitor Check Worker (COMPLETE)

- ✅ Added `LATENCY_AGGREGATOR` to worker environment
- ✅ Created `recordLatencyToAggregator()` helper function
- ✅ Integrated latency recording into regional monitoring loop
- ✅ Sends latency data to Durable Object for each regional check

**Files Modified**:

- `apps/worker/src/index.ts`

---

## 🚧 Pending Tasks

### TASK 6: Heatmap Visualization Component (PENDING)

**Priority**: P1  
**Estimated Time**: 8 hours

**Components to Create**:

- `src/components/monitors/latency/LatencyHeatmap.tsx`
- `src/components/monitors/latency/HeatmapGrid.tsx`
- `src/components/monitors/latency/HeatmapLegend.tsx`

**Requirements**:

- D3.js or Recharts for heatmap rendering
- Color scale: Green → Yellow → Orange → Red
- Hover tooltips with instant metrics
- Click handlers for regional drill-down
- WCAG AA color contrast compliance
- Incident overlay (red border + pulsing animation)

---

### TASK 7: Heatmap Controls & Time Range Selector (PENDING)

**Priority**: P1  
**Estimated Time**: 3 hours

**Component to Create**:

- `src/components/monitors/latency/HeatmapControls.tsx`

**Features**:

- Time range selector (1h, 6h, 24h, 7d, 30d)
- Metric type toggle (Absolute / Relative / Both)
- Granularity auto-selection
- localStorage persistence

---

### TASK 8: Regional Detail Modal (PENDING)

**Priority**: P2  
**Estimated Time**: 5 hours

**Components to Create**:

- `src/components/monitors/latency/RegionalDetailModal.tsx`
- `src/components/monitors/latency/LatencyTimeSeries.tsx`

**Features**:

- Detailed metrics table (avg, p50, p95, p99, min, max)
- 24-hour trend chart
- Incident timeline
- Success rate percentage

---

### TASK 9: Real-time Data Hook (PENDING)

**Priority**: P1  
**Estimated Time**: 4 hours

**Hook to Create**:

- `src/components/monitors/latency/hooks/useLatencyData.ts`

**Features**:

- SSE subscription logic
- Merge real-time updates with existing data
- Automatic reconnection on disconnect
- Optimistic updates

---

### TASK 11: Integration with Monitor Detail Page (PENDING)

**Priority**: P2  
**Estimated Time**: 2 hours

**File to Modify**:

- `app/monitors/[id]/page.tsx`

**Changes**:

- Add "Latency Heatmap" tab
- Integrate LatencyHeatmap component
- Responsive layout

---

### TASK 12: Testing & Quality Assurance (PENDING)

**Priority**: P0  
**Estimated Time**: 6 hours

**Test Coverage Needed**:

- Unit tests for aggregation logic
- Integration tests for API endpoints
- E2E tests for heatmap interactions
- Performance testing (50+ regions, 30-day data)
- Accessibility audit (WCAG AA)
- Cross-browser testing

---

### TASK 13: Documentation (PENDING)

**Priority**: P2  
**Estimated Time**: 3 hours

**Documents to Create/Update**:

- Update `docs/REGIONAL_MONITORING.md`
- Create `docs/API_LATENCY_HEATMAP.md`
- Create `docs/USER_GUIDE_HEATMAP.md`

---

## 🔧 Configuration Needed

### Worker Configuration (wrangler.toml)

**Status**: PENDING

Need to add:

```toml
[[durable_objects.bindings]]
name = "LATENCY_AGGREGATOR"
class_name = "LatencyAggregator"
script_name = "pulseguard-worker"

[[triggers]]
crons = [
  "*/5 * * * *",  # Every 5 minutes: 1m→5m downsampling
  "0 * * * *"     # Every hour: 5m→1h downsampling + cleanup
]
```

### Database Migration

**Status**: PENDING

Need to run:

```bash
cd packages/db
npx prisma migrate dev --name add_latency_heatmap
```

---

## 📊 Progress Summary

**Overall Progress**: 50% Complete

| Phase                    | Status      | Progress |
| ------------------------ | ----------- | -------- |
| Backend (Tasks 1-5, 10)  | ✅ Complete | 100%     |
| Frontend (Tasks 6-9, 11) | 🚧 Pending  | 0%       |
| Testing (Task 12)        | 🚧 Pending  | 0%       |
| Documentation (Task 13)  | 🚧 Pending  | 0%       |

---

## 🎯 Next Steps

1. **Configure Worker** (wrangler.toml + Durable Object bindings)
2. **Run Database Migration**
3. **Implement Frontend Components** (Tasks 6-9)
4. **Integration Testing**
5. **Deploy to Staging**

---

## 📝 Notes

- All backend infrastructure is complete and ready for testing
- Frontend components can be developed in parallel
- SSE endpoint is ready for real-time updates
- Downsampling cron worker needs to be deployed separately
- Consider adding feature flag for gradual rollout

---

**Last Updated**: 2026-01-31 17:49 CST
