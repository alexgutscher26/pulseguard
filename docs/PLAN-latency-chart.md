# PLAN-latency-chart: 24h Response Time Visualization

> **Goal**: Implement a high-performance, neon-aesthetic "Response Time" area chart for the Monitor Details page using Recharts and aggregated latency data.

## 1. Context & Architecture

- **Location**: `apps/web/app/(dashboard)/monitor/[id]`
- **Data Source**: `LatencyAggregate` table in Postgres (via Prisma).
- **Tech Stack**:
  - `Recharts` for visualization.
  - `Server Actions` for data fetching.
  - `Tailwind CSS` for styling and neon effects.
- **Aesthetic**:
  - Neon glow using CSS `drop-shadow`.
  - Dynamic coloring: Green (Healthy) → Yellow (Warning) → Red (Critical).

## 2. Implementation Steps

### Phase 1: Backend (Data Access)

- [ ] **Create Server Action**: `getMonitorLatencyHistory` in `apps/web/actions/latency.ts` (or similar).
  - **Input**: `monitorId: string`, `timeRange: '24h'`.
  - **Query**: Fetch `LatencyAggregate` items where `timestamp > now - 24h`.
  - **Optimization**: Ensure data is sorted by timestamp ASC.
  - **Return Type**: `Array<{ timestamp: number, avgLatency: number, minLatency: number, maxLatency: number }>`

### Phase 2: Component Implementation

- [ ] **Create Component**: `apps/web/components/charts/response-time-chart.tsx`.
- [ ] **Setup Recharts**:
  - Use `<ResponsiveContainer>`, `<AreaChart>`, `<XAxis>`, `<YAxis>`, `<Tooltip>`, `<Area>`.
- [ ] **Styling & Neon Effect**:
  - Define SVG `<defs>` for gradients (`<linearGradient>`).
  - **Dynamic Stroke**: Calculate average latency of the dataset to determine the primary color (Green/Yellow/Red).
  - **CSS Filter**: Apply `filter: drop-shadow(0 0 8px currentColor)` to the path for the neon glow.
- [ ] **Custom Tooltip**:
  - Create a dark-mode optimized tooltip showing accurate timestamp and latency values.

### Phase 3: Integration

- [ ] **Update Page**: `apps/web/app/(dashboard)/monitor/[id]/page.tsx`.
- [ ] **Loading State**: Add a skeleton loader for the chart area.
- [ ] **Error Handling**: precise empty states if no data is available (e.g., "No metric data for this period").

## 3. Verification Checklist

- [ ] **Visual**: Chart glows and uses correct colors based on latency values.
- [ ] **Data**: Accurately reflects 24h of data from `LatencyAggregate`.
- [ ] **Responsive**: Resizes correctly on mobile/desktop.
- [ ] **Performance**: Tooltip hovers are smooth; initial load is fast.
