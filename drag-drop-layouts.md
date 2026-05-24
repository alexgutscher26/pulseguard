# Drag & Drop Layouts: Custom Monitor Grid

This plan outlines the design and implementation of a custom drag-and-drop dashboard grid for PulseGuard. It allows users to switch between a list table view and a custom grid view where they can drag, drop, and resize cards/charts for individual monitors, with local persistence for their custom layouts.

---

## Success Criteria

1. **Dual Dashboard Views**: Users can toggle between the original `MonitorsTable` list view and the new `MonitorsGrid` view.
2. **Interactive Drag & Drop**: Drag handles to reorder monitor cards smoothly with animation.
3. **Resizable Cards**: Toggle between three size modes per monitor:
   - `Standard (1x1)`: Compact status and name card.
   - `Wide (2x1)`: Medium card showing status, name, and a mini latency chart.
   - `Large (2x2)`: Focus card showing status, detailed stats, and full latency/uptime chart.
4. **Layout Persistence**: Store grid order, card size, and view preferences in `localStorage` so settings persist across reloads.
5. **Cyberpunk Theme Consistency**: Glassmorphic, dark-mode cards with custom status glow and smooth Framer Motion transitions.

---

## Project Type

**WEB** (Next.js web application)

---

## Tech Stack

- **Framework**: Next.js (App Router, React 19)
- **Styling**: Tailwind CSS v4, Lucide Icons
- **Animation**: Framer Motion (native drag/layout support)
- **State/Persistence**: React State, `localStorage`
- **Charts**: Recharts, Custom SVGs

---

## Proposed Changes

### [Component Name] Dashboard 2.0 Customization

#### [NEW] [monitors-grid.tsx](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/src/components/dashboard/monitors-grid.tsx)

Create a new grid component that displays monitors using Framer Motion's layout animations, supports resizing, and custom drag-and-drop ordering.

#### [NEW] [monitor-grid-card.tsx](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/src/components/dashboard/monitor-grid-card.tsx)

Create a component for individual monitor cards supporting three layout sizes, containing mini charts (uptime history, latency) and active states.

#### [MODIFY] [dashboard.tsx](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/src/app/%28app%29/dashboard/dashboard.tsx)

Integrate the layout view switcher (Grid vs List Table) and the MonitorsGrid component.

---

## Task Breakdown

### Task 1: Component Scaffolding

- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`, `react-best-practices`
- **Priority**: P1
- **Dependencies**: None
- **INPUT**: Active monitors list.
- **OUTPUT**: Initial static layout code for grid layout switches and card representations.
- **VERIFY**: Monitors list can be displayed in a responsive grid.

### Task 2: Drag and Drop & Layout Persistence Implementation

- **Agent**: `frontend-specialist`
- **Skills**: `react-best-practices`
- **Priority**: P1
- **Dependencies**: Task 1
- **INPUT**: Grid list of monitor cards.
- **OUTPUT**: Drag & Drop capability using Framer Motion's `Reorder` or standard drag event handlers, persisting the order to `localStorage`.
- **VERIFY**: Dragging cards updates the order in UI and saves order state to `localStorage`.

### Task 3: Resizable Cards & Mini Charts

- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`
- **Priority**: P1
- **Dependencies**: Task 2
- **INPUT**: Grid cards.
- **OUTPUT**: Controls on cards (in "Edit Mode") to change grid size (1x1, 2x1, 2x2). Each card dynamically adjusts content to render mini Recharts or SVG charts on Wide/Large modes.
- **VERIFY**: Card sizes can be changed, and layout smoothly updates with grid columns adapting dynamically. Layout preferences are stored in `localStorage`.

### Task 4: UI/UX Aesthetic Polish

- **Agent**: `frontend-specialist`
- **Skills**: `ui-ux-pro-max`
- **Priority**: P2
- **Dependencies**: Task 3
- **INPUT**: Functional Grid view.
- **OUTPUT**: Cyberpunk visual styling, glow highlights matching monitor status, glassmorphic card design, and hover/focus transition details.
- **VERIFY**: Interactive feedback satisfies modern design aesthetics and fits system theme.

### Task 5: Verification & Tests

- **Agent**: `test-engineer`
- **Skills**: `webapp-testing`
- **Priority**: P3
- **Dependencies**: Task 4
- **INPUT**: Complete Drag and Drop layout functionality.
- **OUTPUT**: Basic React test structure or Playwright tests to verify grid mode toggle, drag handles, and local storage retention.
- **VERIFY**: Dev server runs properly, linters pass, and components build without errors.

---

## Verification Plan

### Automated Tests

- Run validation suite: `python .agent/scripts/checklist.py .`
- Test build process: `bun run build` in root and apps/web.

### Manual Verification

- Deploy locally, toggle between grid and table dashboard views, drag multiple cards, change card sizes, reload page to verify layout retention.

---

## ✅ PHASE X COMPLETE
- Lint: ✅ Pass (Oxlint runs cleanly on root; Next.js builds successfully)
- Security: ✅ No critical issues (Passed vulnerability security check)
- Build: ✅ Success
- Date: 2026-05-24

