# Latency Heatmap - Frontend Implementation Guide

**For**: Frontend Developer  
**Status**: Backend Complete, Frontend Pending  
**Estimated Time**: 20-22 hours

---

## 📋 Quick Start

### Backend APIs Available

#### 1. Heatmap Data API

```typescript
GET /api/monitors/[id]/latency-heatmap?timeRange=24h&metricType=both

Response:
{
  monitorId: string;
  timeRange: string;
  granularity: "ONE_MINUTE" | "FIVE_MINUTE" | "ONE_HOUR";
  regions: Array<{
    region: string;
    data: Array<{
      timestamp: number;
      absolute: { avg, p50, p95, p99, min, max };
      relative: { vsBaseline: number } | null;
      hasIncident: boolean;
      sampleCount: number;
      successRate: number;
    }>;
    baseline: number | null;
    currentIncident: { id, status, startedAt } | null;
  }>;
  colorScale: {
    absolute: { min, max };
    relative: { min, max };
  };
}
```

#### 2. Real-time Updates (SSE)

```typescript
GET /api/monitors/[id]/latency-stream

Events:
- type: "connected" - Initial connection
- type: "heartbeat" - Keep-alive (every 30s)
- type: "latency_update" - New latency data
```

---

## 🎨 Component Structure

### Required Components

```
src/components/monitors/latency/
├── LatencyHeatmap.tsx          # Main container (TASK 6)
├── HeatmapGrid.tsx             # Heatmap visualization (TASK 6)
├── HeatmapLegend.tsx           # Color scale legend (TASK 6)
├── HeatmapControls.tsx         # Time range selector (TASK 7)
├── RegionalDetailModal.tsx     # Drill-down modal (TASK 8)
├── LatencyTimeSeries.tsx       # Trend chart (TASK 8)
└── hooks/
    ├── useLatencyData.ts       # Data fetching + SSE (TASK 9)
    ├── useHeatmapScale.ts      # Color calculations
    └── useRegionalBaseline.ts  # Baseline logic
```

---

## 🎯 TASK 6: Heatmap Visualization

### Component: `LatencyHeatmap.tsx`

**Props**:

```typescript
interface LatencyHeatmapProps {
  monitorId: string;
  defaultTimeRange?: "1h" | "6h" | "24h" | "7d" | "30d";
  defaultMetricType?: "absolute" | "relative" | "both";
}
```

**Features**:

- Container component that orchestrates all child components
- Manages state for selected time range and metric type
- Handles loading and error states
- Responsive layout (grid on desktop, list on mobile)

**Example Structure**:

```tsx
export function LatencyHeatmap({
  monitorId,
  defaultTimeRange = "24h",
}: LatencyHeatmapProps) {
  const [timeRange, setTimeRange] = useState(defaultTimeRange);
  const [metricType, setMetricType] = useState<
    "absolute" | "relative" | "both"
  >("both");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const { data, isLoading, error } = useLatencyData(monitorId, timeRange);

  return (
    <div className="space-y-4">
      <HeatmapControls
        timeRange={timeRange}
        metricType={metricType}
        onTimeRangeChange={setTimeRange}
        onMetricTypeChange={setMetricType}
      />

      {isLoading && <HeatmapSkeleton />}
      {error && <ErrorMessage error={error} />}

      {data && (
        <>
          <HeatmapGrid
            data={data}
            metricType={metricType}
            onRegionClick={setSelectedRegion}
          />
          <HeatmapLegend colorScale={data.colorScale} metricType={metricType} />
        </>
      )}

      {selectedRegion && (
        <RegionalDetailModal
          monitorId={monitorId}
          region={selectedRegion}
          onClose={() => setSelectedRegion(null)}
        />
      )}
    </div>
  );
}
```

---

### Component: `HeatmapGrid.tsx`

**Visualization Options**:

#### Option A: Recharts (Recommended for simplicity)

```tsx
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export function HeatmapGrid({
  data,
  metricType,
  onRegionClick,
}: HeatmapGridProps) {
  const chartData = useMemo(() => {
    return data.regions.flatMap((region) =>
      region.data.map((point) => ({
        region: region.region,
        timestamp: point.timestamp,
        value:
          metricType === "absolute"
            ? point.absolute.avg
            : point.relative?.vsBaseline,
        hasIncident: point.hasIncident,
      })),
    );
  }, [data, metricType]);

  const colorScale = useHeatmapScale(data.colorScale, metricType);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart>
        <XAxis dataKey="timestamp" type="number" domain={["auto", "auto"]} />
        <YAxis dataKey="region" type="category" />
        <Tooltip content={<CustomTooltip />} />
        <Scatter
          data={chartData}
          fill={(entry) => colorScale(entry.value)}
          onClick={(entry) => onRegionClick(entry.region)}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
```

#### Option B: D3.js (For advanced customization)

```tsx
import * as d3 from "d3";

export function HeatmapGrid({
  data,
  metricType,
  onRegionClick,
}: HeatmapGridProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    const colorScale = d3
      .scaleSequential(d3.interpolateRdYlGn)
      .domain([500, 50]);

    // Render heatmap cells
    svg
      .selectAll("rect")
      .data(data.regions.flatMap((r) => r.data))
      .join("rect")
      .attr("x", (d) => xScale(d.timestamp))
      .attr("y", (d) => yScale(d.region))
      .attr("width", cellWidth)
      .attr("height", cellHeight)
      .attr("fill", (d) => colorScale(d.absolute.avg))
      .on("click", (event, d) => onRegionClick(d.region));
  }, [data, metricType]);

  return <svg ref={svgRef} width="100%" height={400} />;
}
```

---

### Component: `HeatmapLegend.tsx`

**Color Scale Specifications**:

```tsx
const COLOR_SCALES = {
  absolute: {
    ranges: [
      { max: 100, color: "hsl(120, 70%, 50%)", label: "< 100ms (Excellent)" },
      { max: 300, color: "hsl(60, 70%, 50%)", label: "100-300ms (Good)" },
      { max: 500, color: "hsl(30, 70%, 50%)", label: "300-500ms (Slow)" },
      { max: Infinity, color: "hsl(0, 70%, 50%)", label: "> 500ms (Critical)" },
    ],
  },
  relative: {
    ranges: [
      {
        max: 0.8,
        color: "hsl(120, 70%, 50%)",
        label: "< 0.8x baseline (Fast)",
      },
      {
        max: 1.2,
        color: "hsl(60, 70%, 50%)",
        label: "0.8-1.2x baseline (Normal)",
      },
      {
        max: 1.5,
        color: "hsl(30, 70%, 50%)",
        label: "1.2-1.5x baseline (Slow)",
      },
      {
        max: Infinity,
        color: "hsl(0, 70%, 50%)",
        label: "> 1.5x baseline (Critical)",
      },
    ],
  },
};

export function HeatmapLegend({ colorScale, metricType }: HeatmapLegendProps) {
  const scales =
    metricType === "both"
      ? [COLOR_SCALES.absolute, COLOR_SCALES.relative]
      : [COLOR_SCALES[metricType]];

  return (
    <div className="flex gap-8">
      {scales.map((scale, idx) => (
        <div key={idx} className="flex items-center gap-2">
          {scale.ranges.map((range, i) => (
            <div key={i} className="flex items-center gap-1">
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: range.color }}
              />
              <span className="text-sm text-muted-foreground">
                {range.label}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

---

## 🎯 TASK 7: Heatmap Controls

### Component: `HeatmapControls.tsx`

```tsx
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function HeatmapControls({
  timeRange,
  metricType,
  onTimeRangeChange,
  onMetricTypeChange,
}: HeatmapControlsProps) {
  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("heatmap-time-range", timeRange);
    localStorage.setItem("heatmap-metric-type", metricType);
  }, [timeRange, metricType]);

  return (
    <div className="flex items-center justify-between">
      <Tabs value={timeRange} onValueChange={onTimeRangeChange}>
        <TabsList>
          <TabsTrigger value="1h">1 Hour</TabsTrigger>
          <TabsTrigger value="6h">6 Hours</TabsTrigger>
          <TabsTrigger value="24h">24 Hours</TabsTrigger>
          <TabsTrigger value="7d">7 Days</TabsTrigger>
          <TabsTrigger value="30d">30 Days</TabsTrigger>
        </TabsList>
      </Tabs>

      <ToggleGroup
        type="single"
        value={metricType}
        onValueChange={onMetricTypeChange}
      >
        <ToggleGroupItem value="absolute">Absolute</ToggleGroupItem>
        <ToggleGroupItem value="relative">Relative</ToggleGroupItem>
        <ToggleGroupItem value="both">Both</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
```

---

## 🎯 TASK 8: Regional Detail Modal

### Component: `RegionalDetailModal.tsx`

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LatencyTimeSeries } from "./LatencyTimeSeries";

export function RegionalDetailModal({
  monitorId,
  region,
  onClose,
}: RegionalDetailModalProps) {
  const { data, isLoading } = useRegionalDetail(monitorId, region);

  return (
    <Dialog open={!!region} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{getRegionFlag(region)}</span>
            {getRegionName(region)}
          </DialogTitle>
        </DialogHeader>

        {isLoading && <Skeleton />}

        {data && (
          <div className="space-y-6">
            {/* Metrics Table */}
            <div className="grid grid-cols-3 gap-4">
              <MetricCard label="Average" value={`${data.current.avg}ms`} />
              <MetricCard label="P95" value={`${data.current.p95}ms`} />
              <MetricCard label="P99" value={`${data.current.p99}ms`} />
              <MetricCard label="Min" value={`${data.current.min}ms`} />
              <MetricCard label="Max" value={`${data.current.max}ms`} />
              <MetricCard
                label="Success Rate"
                value={`${(data.current.successRate * 100).toFixed(1)}%`}
              />
            </div>

            {/* 24-Hour Trend */}
            <div>
              <h3 className="text-lg font-semibold mb-2">24-Hour Trend</h3>
              <LatencyTimeSeries data={data.history} />
            </div>

            {/* Incident Timeline */}
            {data.incident && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Current Incident</h3>
                <IncidentCard incident={data.incident} />
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

---

## 🎯 TASK 9: Real-time Data Hook

### Hook: `useLatencyData.ts`

```tsx
import { useState, useEffect } from "react";

export function useLatencyData(monitorId: string, timeRange: string) {
  const [data, setData] = useState<LatencyHeatmapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    async function fetchInitialData() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/monitors/${monitorId}/latency-heatmap?timeRange=${timeRange}`,
        );
        if (!res.ok) throw new Error("Failed to fetch heatmap data");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    function setupSSE() {
      eventSource = new EventSource(
        `/api/monitors/${monitorId}/latency-stream`,
      );

      eventSource.onmessage = (event) => {
        const update = JSON.parse(event.data);

        if (update.type === "latency_update") {
          setData((prev) => {
            if (!prev) return prev;
            return mergeLatencyUpdate(prev, update);
          });
        }
      };

      eventSource.onerror = () => {
        console.error("SSE connection error, reconnecting...");
        eventSource?.close();
        setTimeout(setupSSE, 5000); // Reconnect after 5s
      };
    }

    fetchInitialData().then(() => {
      setupSSE();
    });

    return () => {
      eventSource?.close();
    };
  }, [monitorId, timeRange]);

  return { data, isLoading, error };
}

function mergeLatencyUpdate(
  prev: LatencyHeatmapData,
  update: any,
): LatencyHeatmapData {
  const regionIndex = prev.regions.findIndex((r) => r.region === update.region);
  if (regionIndex === -1) return prev;

  const updatedRegions = [...prev.regions];
  updatedRegions[regionIndex] = {
    ...updatedRegions[regionIndex],
    data: [
      ...updatedRegions[regionIndex].data,
      {
        timestamp: update.timestamp,
        absolute: update.latency,
        relative: null, // Calculate if baseline available
        hasIncident: false,
        sampleCount: update.sampleCount,
        successRate: update.successRate,
      },
    ].slice(-100), // Keep last 100 points
  };

  return { ...prev, regions: updatedRegions };
}
```

---

## 🎨 Design Specifications

### Colors (WCAG AA Compliant)

```css
/* Absolute Latency */
--latency-excellent: hsl(120, 70%, 50%); /* < 100ms */
--latency-good: hsl(60, 70%, 50%); /* 100-300ms */
--latency-slow: hsl(30, 70%, 50%); /* 300-500ms */
--latency-critical: hsl(0, 70%, 50%); /* > 500ms */

/* Incident Overlay */
--incident-border: hsl(0, 70%, 50%);
--incident-pulse: hsl(0, 70%, 50%, 0.3);
```

### Animations

```css
@keyframes pulse-incident {
  0%,
  100% {
    box-shadow: 0 0 0 0 var(--incident-pulse);
  }
  50% {
    box-shadow: 0 0 0 8px transparent;
  }
}

.incident-cell {
  border: 2px solid var(--incident-border);
  animation: pulse-incident 2s infinite;
}
```

---

## 🧪 Testing Checklist

### Unit Tests

- [ ] `useLatencyData` hook handles SSE reconnection
- [ ] Color scale calculations are accurate
- [ ] Percentile displays match backend data

### Integration Tests

- [ ] API endpoints return correct data structure
- [ ] SSE connection establishes and receives updates
- [ ] Time range changes trigger new API calls

### E2E Tests (Playwright)

- [ ] Heatmap renders with 50+ regions in < 500ms
- [ ] Clicking region opens detail modal
- [ ] Time range selector updates heatmap
- [ ] Real-time updates appear within 5 seconds
- [ ] Keyboard navigation works (Tab, Enter, Escape)

### Accessibility

- [ ] Color contrast ratio > 4.5:1
- [ ] Screen reader announces region selection
- [ ] Keyboard-only navigation possible
- [ ] Focus indicators visible

---

## 📦 Dependencies to Install

```bash
# If using Recharts
npm install recharts

# If using D3.js
npm install d3 @types/d3

# For date formatting
npm install date-fns
```

---

## 🚀 Quick Implementation Order

1. **Start with `useLatencyData` hook** (TASK 9)
   - Get data flowing first
   - Test API integration

2. **Build `HeatmapControls`** (TASK 7)
   - Simple UI component
   - Quick win

3. **Create `HeatmapGrid` skeleton** (TASK 6)
   - Display raw data in table first
   - Then add visualization

4. **Add `HeatmapLegend`** (TASK 6)
   - Visual polish

5. **Implement `RegionalDetailModal`** (TASK 8)
   - Drill-down functionality

6. **Polish & Optimize** (TASK 12)
   - Performance tuning
   - Accessibility fixes

---

## 💡 Tips

- **Start simple**: Display data in a table before adding fancy visualizations
- **Test with mock data**: Create fixtures for 50+ regions to test performance
- **Mobile-first**: Heatmap should work on tablets (consider horizontal scroll)
- **Error handling**: Show friendly messages when SSE disconnects
- **Loading states**: Use skeletons, not spinners

---

## 📞 Need Help?

- Backend APIs are documented in `docs/API_LATENCY_HEATMAP.md`
- Database schema in `packages/db/prisma/schema/latency.prisma`
- Example regional data in `apps/worker/src/services/regional-monitor.ts`

---

**Good luck! 🚀**
