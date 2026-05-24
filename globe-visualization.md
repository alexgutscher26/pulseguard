# 3D Network Visualization: rotating Three.js globe

This plan outlines the design and implementation of a rotating 3D network globe for the PulseGuard dashboard. It maps real-time edge pings with laser arcs firing from monitoring regions towards target nodes, synced directly with WebSocket events.

---

## Success Criteria

1. **Three.js Core Library**: Install `three` and `@types/three` dependencies.
2. **Dashboard Visual Panel**: A glassmorphic collapsible panel above the monitor list displaying the rotating 3D globe.
3. **Laser Arcs Animation**: Real-time laser lines spawning and drawing paths (arcs) from regional coordinates (North America, Europe, Asia) to a center marker when pings occur.
4. **WebSocket Synchronization**: Connect to the dashboard monitor stream; every ping triggers a corresponding laser burst on the globe with latency stats.
5. **Interactive Controls**: Users can drag to spin the globe, hover over nodes to view latencies, and toggle the visualization.

---

## Project Type

**WEB** (Next.js web application)

---

## Tech Stack

- **Framework**: Next.js, React 19
- **3D Engine**: Vanilla Three.js (dynamic import for optimization)
- **Styling**: Tailwind CSS v4, Lucide Icons
- **Real-time**: WebSockets

---

## Proposed Changes

### [Component Name] Dashboard 3D Visualization

#### [NEW] [globe-visualization.tsx](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/src/components/dashboard/globe-visualization.tsx)

Create a component encapsulating the Three.js scene, rendering the wireframe globe, dot matrix continents, target nodes, and dynamic laser spline arcs.

#### [MODIFY] [dashboard.tsx](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/src/app/%28app%29/dashboard/dashboard.tsx)

Integrate the Globe Visualization panel at the top of the dashboard, toggled by a "Show Map Matrix" switch.

---

## Task Breakdown

### Task 1: Package Installation & Three.js Canvas Scaffolding

- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`, `react-best-practices`
- **Priority**: P1
- **Dependencies**: None
- **INPUT**: Active environment.
- **OUTPUT**: Installation of `three` package and initial canvas element with basic rotating wireframe sphere.
- **VERIFY**: Canvas loads and renders a rotating 3D sphere.

### Task 2: Globe Texturing & Coordinate Mapping

- **Agent**: `frontend-specialist`
- **Skills**: `ui-ux-pro-max`
- **Priority**: P1
- **Dependencies**: Task 1
- **INPUT**: Wireframe sphere.
- **OUTPUT**: Particle dot-matrix representing earth landmasses and coordinates mapped for regional nodes (Frankfurt, Singapore, Oregon).
- **VERIFY**: Globe looks like a holographic cyberpunk map with regional nodes positioned correctly.

### Task 3: Real-time Laser splines & Spark animations

- **Agent**: `frontend-specialist`
- **Skills**: `react-best-practices`
- **Priority**: P1
- **Dependencies**: Task 2
- **INPUT**: Live WebSocket pings.
- **OUTPUT**: Custom laser arcs (quadratic bezier splines) that animate/draw themselves on ping events and fade out after completion.
- **VERIFY**: Triggering a check draws an animated laser path to the target node.

### Task 4: Interactive Dashboard Toolbar

- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`
- **Priority**: P2
- **Dependencies**: Task 3
- **INPUT**: Live Globe panel.
- **OUTPUT**: Integrates the globe in `dashboard.tsx` with controls to expand/collapse and drag-to-rotate interaction.
- **VERIFY**: Globe expands and collapses correctly without breaking main layout.

### Task 5: Master Checklist Verification

- **Agent**: `test-engineer`
- **Skills**: `webapp-testing`
- **Priority**: P3
- **Dependencies**: Task 4
- **INPUT**: Complete system.
- **OUTPUT**: Typechecks, lint checks, and bundles build cleanly.
- **VERIFY**: Next builds pass.

---

## Verification Plan

### Automated Tests

- Typecheck: `bun run check-types`
- Next.js build verification: `bun run build`

### Manual Verification

- Expand map matrix on dashboard.
- Observe globe rotation.
- Run a check on a monitor, check if laser fires from origin region to target destination.
- Verify drag rotation works.
