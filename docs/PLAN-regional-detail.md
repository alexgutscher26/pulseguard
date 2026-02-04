- User Request: @[/plan] do this if we havent already done - [ ] **RegionalDetailModal** is a placeholder (needs full implementation)
- Mode: PLANNING ONLY
- Output: docs/PLAN-regional-detail.md

## Task Breakdown

### 1. Verification Phase

- [ ] **Data Integration Check**: Verify `RegionalDetailModal.tsx` handles real data scenarios from `useLatencyData.ts`.
  - [ ] Test loading states (`isLoading` prop functionality).
  - [ ] Test empty states (Region with no data).
  - [ ] Test error states (API failure).
- [ ] **Component Functionality Audit**:
  - [ ] Verify `LatencyTimeSeries` correctly renders charts with provided `detailedData`.
  - [ ] Check `MetricCard` rendering logic for Average, P50, P95, etc.
  - [ ] Validate `getRegionFlag` and `getRegionName` cover all supported regions.
- [ ] **Integration Logic**:
  - [ ] Verify `HeatmapGrid` properly triggers the modal on region click.
  - [ ] Confirm `LatencyHeatmap.tsx` passes correct props to the modal.

### 2. Polish & Enhancement Phase

- [ ] **UI/UX Refinements (Cyberpunk Aesthetic)**:
  - [ ] Ensure Modal background uses PulseGuard's glassmorphism tokens (if applicable).
  - [ ] Verify `Badge` variants for incidents (`destructive` vs `default`).
  - [ ] Check responsive implementation (Mobile layout for charts/grid are explicit in `RegionalDetailModal.tsx` but verified visually).
- [ ] **Data Precision**:
  - [ ] Ensure rounding logic (e.g., `Math.round` for latency) is consistent across the UI.
  - [ ] Validate percentage formatting for Success Rate.

### 3. Finalization

- [ ] **Code Cleanup**:
  - [ ] Remove any residual "placeholder" comments if found (none detected in initial scan, but thorough check required).
  - [ ] Ensure `console.error` calls are appropriate for production debug or wrapped in a logger.
- [ ] **Documentation**:
  - [ ] Update TODO.md to mark this item as complete.
  - [ ] Documentation of granular regions if new ones are added.

## Agent Assignments

- **Frontend Specialist**:
  - Review `RegionalDetailModal.tsx`, `LatencyTimeSeries.tsx` for Cyberpunk design system alignment.
  - Refactor any inconsistent styles (e.g., ensuring `text-muted-foreground` is used correctly).
- **Backend Specialist**:
  - Verify `route.ts` correctly handles queries for specific regions if edge cases arise (though code looks mostly complete).

## Verification Checklist

- [ ] Modal opens when clicking a region in `LatencyHeatmap`.
- [ ] Data loads and populates generic metrics cards.
- [ ] Chart renders without errors.
- [ ] "Active Incident" badge appears only when `hasIncident` is true.
- [ ] Responsive design works on mobile widths (<768px).
