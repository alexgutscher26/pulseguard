- User Request: @[/plan] - [ ] **Mobile optimization** (currently works but could be improved)
- Mode: PLANNING ONLY
- Output: docs/PLAN-mobile-optimization.md

## Task Breakdown

### 1. Touch Gestures (Swipe-to-Close)

- [ ] **Audit Drawer Component**: Verify if `@/components/ui/drawer` (Vaul) is configured correctly for left-side gestures.
- [ ] **Implement Swipe Logic**: If the default drawer doesn't support left-edge swipe to close smoothly, integrating `use-gesture` or configuring Vaul's `direction="left"` props correctly.
- [ ] **Testing**: Verify swipe acts naturally on mobile viewports.

### 2. Haptic Feedback System

- [ ] **Create Hook**: Implement `useHaptic()` hook wrapping `navigator.vibrate`.
  - [ ] Support different patterns: `light` (10ms), `medium` (40ms), `success` (double tap), `error` (long).
- [ ] **Integration**:
  - [ ] Add haptic feedback to `DashboardHeader` menu trigger.
  - [ ] Add to `MobileSidebar` navigation links.
  - [ ] Add to key actions in `MonitorStatsGrid` (Start/Stop/Pause).
  - [ ] Sidebar "Upgrade Plan" button.

### 3. Header Optimization

- [ ] **Condense Layout**:
  - [ ] On mobile (<640px), ensure the Title ("SYSTEM//OVERVIEW") is strictly truncated or hidden if the viewport is too narrow.
  - [ ] Reduce padding on very small screens.
  - [ ] Ensure the "Add Monitor" button (currently hidden) has a mobile equivalent or is accessible via FAB (Floating Action Button) or Command Palette. -> _Decision: Keep it hidden to declutter, rely on Command Palette or Mobile Menu._

### 4. Touch Target Improvements

- [ ] **Form Elements**:
  - [ ] Review `MonitorForm` (if accessible) to ensure inputs have `min-height: 44px`.
- [ ] **Interactive Elements**:
  - [ ] Verify `MobileSidebar` links have sufficient padding (already `px-3 py-2`, consider increasing to `py-3` for easier tapping).
  - [ ] Ensure Close buttons (`X`) are at least 44x44px.

## Agent Assignments

- **Frontend Specialist**:
  - Implement `useHaptic` hook.
  - Refactor `MobileSidebar` and `DashboardHeader`.
  - Tuning Tailwind classes for specific breakpoints (`xs`, `sm`, `md`).
- **UX Designer (Role)**:
  - Verify the "feel" of haptics (not too annoying).

## Verification Checklist

- [ ] Mobile Drawer closes with a left-swipe gesture.
- [ ] Tapping sidebar links triggers a light vibration on supported devices.
- [ ] Header does not overflow or break layout on iPhone SE (320px width).
- [ ] All clickable icons are at least 44x44px in the mobile view.
