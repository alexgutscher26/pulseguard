# Latency Heatmap Components

Real-time latency visualization with regional drill-down capabilities.

## Quick Start

```tsx
import { LatencyHeatmap } from "@/components/monitors/latency";

<LatencyHeatmap
  monitorId="monitor-id"
  defaultTimeRange="24h"
  defaultMetricType="both"
/>;
```

## Components

### LatencyHeatmap

Main container component that orchestrates all child components.

**Props**:

- `monitorId: string` - Monitor ID to fetch data for
- `defaultTimeRange?: "1h" | "6h" | "24h" | "7d" | "30d"` - Initial time range (default: "24h")
- `defaultMetricType?: "absolute" | "relative" | "both"` - Initial metric type (default: "both")

### HeatmapGrid

Table-based visualization of latency data across regions and time.

**Features**:

- Color-coded cells (green = fast, red = slow)
- Hover tooltips with detailed metrics
- Click to open regional detail modal
- Incident indicators (pulsing red border)

### HeatmapControls

Time range and metric type selector.

**Features**:

- Time range tabs (1h, 6h, 24h, 7d, 30d)
- Metric type toggle (Absolute, Relative, Both)
- localStorage persistence

### HeatmapLegend

Color scale explanation and incident indicator.

### RegionalDetailModal

Detailed view for a specific region.

**Features**:

- Current metrics (avg, p50, p95, p99, min, max)
- Success rate
- 30-day baseline comparison
- 24-hour trend chart
- Active incident information

### LatencyTimeSeries

24-hour trend chart using Recharts.

**Props**:

- `data: LatencyDataPoint[]` - Array of latency data points
- `showPercentiles?: boolean` - Show P50, P95, P99 lines (default: true)

## Hooks

### useLatencyData

Fetches latency data and subscribes to real-time updates via SSE.

```tsx
const { data, isLoading, error, refetch } = useLatencyData(
  monitorId,
  timeRange,
);
```

**Returns**:

- `data: LatencyHeatmapData | null` - Heatmap data
- `isLoading: boolean` - Loading state
- `error: Error | null` - Error state
- `refetch: () => Promise<void>` - Manual refetch function

### useHeatmapScale

Color scale utilities for latency values.

```tsx
const { getColor, getColorForPoint } = useHeatmapScale(metricType);
```

**Returns**:

- `getColor: (value: number, type: "absolute" | "relative") => string` - Get color for a value
- `getColorForPoint: (point: LatencyDataPoint) => string` - Get color for a data point

## API Endpoints

### GET /api/monitors/[id]/latency-heatmap

Fetches latency heatmap data.

**Query Parameters**:

- `timeRange?: string` - Time range (1h, 6h, 24h, 7d, 30d)
- `metricType?: string` - Metric type (absolute, relative, both)

**Response**:

```json
{
  "monitorId": "string",
  "timeRange": "string",
  "granularity": "ONE_MINUTE" | "FIVE_MINUTE" | "ONE_HOUR",
  "regions": [...],
  "colorScale": {...}
}
```

### GET /api/monitors/[id]/latency-stream

Server-Sent Events endpoint for real-time updates.

**Events**:

- `connected` - Initial connection
- `heartbeat` - Keep-alive (every 30s)
- `latency_update` - New latency data (every 60s)

## Color Scale

### Absolute Latency

- **Green** (< 100ms): Excellent
- **Yellow** (100-300ms): Good
- **Orange** (300-500ms): Slow
- **Red** (> 500ms): Critical

### Relative Performance

- **Green** (< 0.8x baseline): Fast
- **Yellow** (0.8-1.2x baseline): Normal
- **Orange** (1.2-1.5x baseline): Slow
- **Red** (> 1.5x baseline): Critical

## Examples

### Basic Usage

```tsx
<LatencyHeatmap monitorId="abc123" />
```

### Custom Time Range

```tsx
<LatencyHeatmap
  monitorId="abc123"
  defaultTimeRange="7d"
  defaultMetricType="absolute"
/>
```

### Standalone Components

```tsx
import { HeatmapGrid, useLatencyData } from "@/components/monitors/latency";

function CustomHeatmap() {
  const { data } = useLatencyData("abc123", "24h");

  return data ? (
    <HeatmapGrid
      data={data}
      metricType="absolute"
      onRegionClick={(region) => console.log(region)}
    />
  ) : null;
}
```

## Accessibility

- WCAG AA compliant color contrast
- Keyboard navigation support
- Screen reader friendly
- Focus indicators on interactive elements

## Performance

- 100-point sliding window prevents memory bloat
- Automatic reconnection on SSE disconnect (5s retry)
- Caching headers (30s cache, 60s stale-while-revalidate)
- Lazy loading for regional detail modal

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive layout

## Dependencies

- `recharts` - Chart library
- `date-fns` - Date formatting
- `lucide-react` - Icons
- Shadcn UI components

## License

Part of PulseGuard monitoring platform.
