# Responsive Mobile Design Implementation Plan

## Overview

Implement comprehensive mobile responsiveness for PulseGuard, focusing on:

- Converting the desktop sidebar to a mobile drawer with overlay
- Ensuring proper touch target sizes for mobile interactions
- Maintaining the cyberpunk aesthetic on mobile devices

**Project Type**: WEB (Next.js/React)

---

## Success Criteria

- [x] Sidebar transforms into a slide-in drawer on mobile (< 768px)
- [x] Drawer includes overlay backdrop that dims main content
- [x] Drawer closes when clicking overlay or close button
- [x] All interactive elements meet minimum 44px × 44px touch target size
- [x] Stats grid maintains 1/2/3 column layout across breakpoints
- [x] No horizontal scrolling on mobile devices
- [x] Smooth animations and transitions
- [x] Accessibility: keyboard navigation and screen reader support

---

## Tech Stack

| Technology                | Purpose              | Rationale                                          |
| ------------------------- | -------------------- | -------------------------------------------------- |
| **Tailwind CSS**          | Responsive utilities | Already in use, provides mobile-first breakpoints  |
| **Framer Motion**         | Drawer animations    | Smooth, performant animations with gesture support |
| **React Hooks**           | State management     | `useState` for drawer open/close state             |
| **Lucide React**          | Icons                | Consistent with existing icon system               |
| **CSS Custom Properties** | Theme consistency    | Maintain cyberpunk aesthetic variables             |

---

## File Structure

```
apps/web/src/
├── components/
│   ├── dashboard/
│   │   ├── sidebar.tsx                    # [MODIFY] Add mobile drawer logic
│   │   ├── mobile-sidebar.tsx             # [CREATE] Mobile-specific drawer component
│   │   └── header.tsx                     # [MODIFY] Add hamburger menu button
│   ├── monitors/
│   │   └── details/
│   │       └── stats-grid.tsx             # [VERIFY] Grid responsiveness
│   └── ui/
│       ├── drawer.tsx                      # [CREATE] Reusable drawer component
│       └── overlay.tsx                     # [CREATE] Backdrop overlay component
├── app/
│   └── (app)/
│       └── layout.tsx                      # [MODIFY] Integrate mobile drawer
└── hooks/
    └── use-mobile.tsx                      # [CREATE] Mobile detection hook
```

---

## Task Breakdown

### Phase 1: Foundation & Mobile Detection

#### Task 1.1: Create Mobile Detection Hook

**Agent**: `frontend-specialist`  
**Skill**: `react-best-practices`  
**Priority**: P0 (Blocker for other tasks)  
**Dependencies**: None

**INPUT**:

- Current viewport width
- Tailwind breakpoint values (md: 768px)

**OUTPUT**:

- `hooks/use-mobile.tsx` with `useMobile()` hook
- Returns boolean indicating mobile state
- Handles SSR safely (no hydration mismatch)

**VERIFY**:

```bash
# Hook returns true when window width < 768px
# Hook returns false when window width >= 768px
# No console errors on SSR
```

---

#### Task 1.2: Create Reusable Drawer Component

**Agent**: `frontend-specialist`  
**Skill**: `frontend-design`, `react-best-practices`  
**Priority**: P0  
**Dependencies**: None

**INPUT**:

- Framer Motion for animations
- Cyberpunk design tokens (border-primary, bg-[#050505])

**OUTPUT**:

- `components/ui/drawer.tsx`
- Props: `open`, `onClose`, `children`, `side` (left/right)
- Slide-in animation from left
- Z-index management
- Trap focus when open
- ESC key to close

**VERIFY**:

```bash
# Drawer slides in from left with smooth animation
# Pressing ESC closes drawer
# Focus is trapped within drawer when open
# Accessible via keyboard navigation
```

---

#### Task 1.3: Create Overlay Component

**Agent**: `frontend-specialist`  
**Skill**: `frontend-design`  
**Priority**: P0  
**Dependencies**: None

**INPUT**:

- Opacity transition requirements
- Click handler for closing

**OUTPUT**:

- `components/ui/overlay.tsx`
- Semi-transparent backdrop (bg-black/60)
- Fade-in/out animation
- Click handler to close drawer
- Prevents body scroll when active

**VERIFY**:

```bash
# Overlay dims background content
# Clicking overlay triggers onClose callback
# Body scroll is locked when overlay is visible
# Smooth fade transition
```

---

### Phase 2: Mobile Sidebar Implementation

#### Task 2.1: Create Mobile Sidebar Component

**Agent**: `frontend-specialist`  
**Skill**: `frontend-design`, `react-best-practices`  
**Priority**: P1  
**Dependencies**: Task 1.1, Task 1.2, Task 1.3

**INPUT**:

- Existing `Sidebar` component structure
- Drawer and Overlay components
- Navigation items and branding

**OUTPUT**:

- `components/dashboard/mobile-sidebar.tsx`
- Full-height drawer with sidebar content
- Close button (X) in top-right corner
- Same navigation structure as desktop
- Cyberpunk styling maintained

**VERIFY**:

```bash
# Mobile sidebar renders all navigation items
# Close button is visible and functional
# Styling matches desktop sidebar aesthetic
# Logo and branding are properly displayed
```

---

#### Task 2.2: Add Hamburger Menu to Header

**Agent**: `frontend-specialist`  
**Skill**: `frontend-design`  
**Priority**: P1  
**Dependencies**: Task 1.1

**INPUT**:

- Current `DashboardHeader` component
- `useMobile()` hook
- Menu icon from lucide-react

**OUTPUT**:

- Modified `components/dashboard/header.tsx`
- Hamburger menu button (visible only on mobile)
- Proper touch target size (min 44px × 44px)
- onClick handler to open drawer
- Positioned in top-left of header

**VERIFY**:

```bash
# Hamburger menu visible on mobile (< 768px)
# Hamburger menu hidden on desktop (>= 768px)
# Button meets 44px × 44px minimum size
# Clicking button triggers drawer open
```

---

#### Task 2.3: Update App Layout for Mobile

**Agent**: `frontend-specialist`  
**Skill**: `react-best-practices`  
**Priority**: P1  
**Dependencies**: Task 2.1, Task 2.2

**INPUT**:

- Current `app/(app)/layout.tsx`
- Mobile sidebar component
- Drawer state management

**OUTPUT**:

- Modified layout with conditional sidebar rendering
- Desktop: Show `<Sidebar />` (existing behavior)
- Mobile: Show `<MobileSidebar />` with drawer
- Shared state for drawer open/close
- Proper z-index layering

**VERIFY**:

```bash
# Desktop shows fixed sidebar
# Mobile shows hamburger menu + drawer
# Drawer state persists across navigation
# No layout shift when toggling drawer
```

---

### Phase 3: Touch Target Optimization

#### Task 3.1: Audit Interactive Elements

**Agent**: `frontend-specialist`  
**Skill**: `frontend-design`, `web-design-guidelines`  
**Priority**: P2  
**Dependencies**: None

**INPUT**:

- All button components in the app
- Current touch target sizes

**OUTPUT**:

- List of components needing touch target updates
- Documented in this plan file
- Priority ranking (critical vs nice-to-have)

**VERIFY**:

```bash
# All interactive elements identified
# Current sizes documented
# Priority list created
```

---

#### Task 3.2: Update Critical Touch Targets

**Agent**: `frontend-specialist`  
**Skill**: `frontend-design`, `tailwind-patterns`  
**Priority**: P2  
**Dependencies**: Task 3.1

**INPUT**:

- Components identified in Task 3.1
- Minimum size: 44px × 44px
- Focus areas: Run Check button, Toggle switches, Action buttons

**OUTPUT**:

- Updated button components with proper sizing
- Mobile-specific padding adjustments
- Maintain visual hierarchy
- Files to modify:
  - Monitor action buttons
  - Toggle switches
  - Form submit buttons

**VERIFY**:

```bash
# Run accessibility audit: python .agent/skills/frontend-design/scripts/accessibility_checker.py apps/web
# All critical buttons meet 44px × 44px minimum
# Buttons remain visually balanced
# No overlap or crowding on mobile
```

---

#### Task 3.3: Global Touch Target Standards

**Agent**: `frontend-specialist`  
**Skill**: `tailwind-patterns`, `frontend-design`  
**Priority**: P2  
**Dependencies**: Task 3.2

**INPUT**:

- Tailwind configuration
- Design system tokens

**OUTPUT**:

- Updated Tailwind config with touch-friendly utilities
- Custom classes: `touch-target-sm`, `touch-target-md`, `touch-target-lg`
- Documentation in component library
- Apply to remaining interactive elements

**VERIFY**:

```bash
# Custom utilities available in Tailwind
# Applied consistently across components
# Mobile UX audit passes: python .agent/skills/frontend-design/scripts/mobile_audit.py apps/web
```

---

### Phase 4: Stats Grid Verification

#### Task 4.1: Verify Stats Grid Responsiveness

**Agent**: `frontend-specialist`  
**Skill**: `frontend-design`  
**Priority**: P2  
**Dependencies**: None

**INPUT**:

- Current `stats-grid.tsx` component
- Breakpoint requirements: 1 col (mobile), 2 col (tablet), 3 col (desktop)

**OUTPUT**:

- Verified grid behavior at all breakpoints
- Mobile-specific padding adjustments if needed
- Ensure cards don't overflow on small screens

**VERIFY**:

```bash
# Test at 375px width (mobile): 1 column
# Test at 768px width (tablet): 2 columns
# Test at 1024px width (desktop): 3 columns
# No horizontal scroll at any breakpoint
# Cards maintain proper spacing
```

---

#### Task 4.2: Mobile Stats Grid Optimization

**Agent**: `frontend-specialist`  
**Skill**: `frontend-design`, `performance-profiling`  
**Priority**: P3 (Nice to have)  
**Dependencies**: Task 4.1

**INPUT**:

- Current stats card design
- Mobile viewport constraints

**OUTPUT**:

- Optimized padding for mobile (reduce from p-6 to p-4)
- Font size adjustments if needed
- Ensure readability on small screens
- Maintain cyberpunk aesthetic

**VERIFY**:

```bash
# Stats remain readable on 320px width
# Visual hierarchy preserved
# Animations perform smoothly on mobile
# Lighthouse mobile score >= 90
```

---

### Phase 5: Polish & Accessibility

#### Task 5.1: Keyboard Navigation

**Agent**: `frontend-specialist`  
**Skill**: `web-design-guidelines`  
**Priority**: P2  
**Dependencies**: Task 2.3

**INPUT**:

- Drawer component
- Focus trap requirements
- ARIA attributes

**OUTPUT**:

- Proper focus management in drawer
- Tab order is logical
- ESC key closes drawer
- Focus returns to hamburger menu on close
- ARIA labels for screen readers

**VERIFY**:

```bash
# Tab navigation works within drawer
# ESC key closes drawer
# Focus returns to trigger element
# Screen reader announces drawer state
# Run: python .agent/skills/frontend-design/scripts/accessibility_checker.py apps/web
```

---

#### Task 5.2: Gesture Support

**Agent**: `frontend-specialist`  
**Skill**: `react-best-practices`  
**Priority**: P3 (Nice to have)  
**Dependencies**: Task 2.3

**INPUT**:

- Framer Motion drag gestures
- Drawer component

**OUTPUT**:

- Swipe-to-close gesture for drawer
- Drag threshold: 50% of drawer width
- Smooth animation on release
- Haptic feedback (if supported)

**VERIFY**:

```bash
# Swiping left closes drawer
# Partial swipe snaps back
# Animation is smooth and natural
# Works on touch devices
```

---

#### Task 5.3: Responsive Testing

**Agent**: `frontend-specialist`  
**Skill**: `webapp-testing`  
**Priority**: P2  
**Dependencies**: All previous tasks

**INPUT**:

- Completed responsive implementation
- Device viewport sizes to test

**OUTPUT**:

- Manual testing checklist completed
- Playwright tests for mobile interactions
- Screenshots at key breakpoints
- Bug fixes for any issues found

**VERIFY**:

```bash
# Test on real devices (iOS Safari, Android Chrome)
# Test at breakpoints: 320px, 375px, 768px, 1024px, 1440px
# No layout breaks or overflow
# All interactions work on touch
# Run: python .agent/skills/webapp-testing/scripts/playwright_runner.py http://localhost:3000 --screenshot
```

---

## Implementation Priority Order

| Phase       | Agent                 | Parallel?                            | Estimated Time |
| ----------- | --------------------- | ------------------------------------ | -------------- |
| **Phase 1** | `frontend-specialist` | Tasks 1.1, 1.2, 1.3 can run parallel | 30-45 min      |
| **Phase 2** | `frontend-specialist` | Tasks 2.1, 2.2 parallel; 2.3 serial  | 45-60 min      |
| **Phase 3** | `frontend-specialist` | Tasks 3.1 → 3.2 → 3.3 serial         | 30-45 min      |
| **Phase 4** | `frontend-specialist` | Tasks 4.1 → 4.2 serial               | 20-30 min      |
| **Phase 5** | `frontend-specialist` | Tasks 5.1, 5.2 parallel; 5.3 serial  | 30-45 min      |

**Total Estimated Time**: 2.5 - 3.5 hours

---

## Risk Analysis

| Risk                                                    | Impact | Mitigation                                                                 |
| ------------------------------------------------------- | ------ | -------------------------------------------------------------------------- |
| **Hydration mismatch** (SSR vs client mobile detection) | High   | Use `useEffect` for mobile detection, render both versions with CSS hiding |
| **Z-index conflicts**                                   | Medium | Establish z-index scale in Tailwind config                                 |
| **Performance on low-end devices**                      | Medium | Use CSS transforms for animations, avoid re-renders                        |
| **Touch target too small**                              | High   | Audit with automated tools, manual testing on real devices                 |
| **Drawer animation jank**                               | Medium | Use `will-change`, GPU-accelerated transforms                              |

---

## Dependencies Graph

```
Task 1.1 (useMobile) ──┬──> Task 2.2 (Hamburger)
                       └──> Task 2.1 (Mobile Sidebar)

Task 1.2 (Drawer) ────────> Task 2.1 (Mobile Sidebar)

Task 1.3 (Overlay) ───────> Task 2.1 (Mobile Sidebar)

Task 2.1, 2.2 ────────────> Task 2.3 (Layout Update)

Task 2.3 ─────────────────> Task 5.1 (Keyboard Nav)
                       └──> Task 5.2 (Gestures)

Task 3.1 (Audit) ─────────> Task 3.2 (Critical Targets)

Task 3.2 ─────────────────> Task 3.3 (Global Standards)

Task 4.1 (Verify Grid) ───> Task 4.2 (Optimize Grid)

All Tasks ────────────────> Task 5.3 (Testing)
```

---

## Rollback Strategy

| Phase       | Rollback Action                              | Recovery Time |
| ----------- | -------------------------------------------- | ------------- |
| **Phase 1** | Delete new hook/component files              | < 1 min       |
| **Phase 2** | Revert layout.tsx, remove mobile components  | < 5 min       |
| **Phase 3** | Revert button size changes via git           | < 2 min       |
| **Phase 4** | Revert stats-grid.tsx changes                | < 1 min       |
| **Phase 5** | Remove gesture handlers, revert ARIA changes | < 3 min       |

**Git Strategy**: Create feature branch `feat/responsive-mobile` for all changes

---

## Phase X: Final Verification

### Pre-Deployment Checklist

- [ ] **Lint & Type Check**

  ```bash
  cd apps/web && npm run lint && npx tsc --noEmit
  ```

- [ ] **Accessibility Audit**

  ```bash
  python .agent/skills/frontend-design/scripts/accessibility_checker.py apps/web
  ```

  - All touch targets >= 44px × 44px
  - ARIA labels present on drawer
  - Keyboard navigation works

- [ ] **Mobile UX Audit**

  ```bash
  python .agent/skills/frontend-design/scripts/mobile_audit.py apps/web
  ```

  - No horizontal scroll
  - Touch targets adequate
  - Gestures work smoothly

- [ ] **UX Audit (Psychology Laws)**

  ```bash
  python .agent/skills/frontend-design/scripts/ux_audit.py apps/web
  ```

  - Fitts's Law: Touch targets properly sized
  - Hick's Law: Navigation remains simple
  - Jakob's Law: Drawer behavior matches user expectations

- [ ] **Build Verification**

  ```bash
  cd apps/web && npm run build
  ```

  - No build errors or warnings
  - Bundle size increase < 10KB

- [ ] **Lighthouse Audit (Mobile)**

  ```bash
  python .agent/skills/performance-profiling/scripts/lighthouse_audit.py http://localhost:3000 --mobile
  ```

  - Performance >= 90
  - Accessibility >= 95
  - Best Practices >= 90

- [ ] **Playwright E2E Tests**

  ```bash
  python .agent/skills/webapp-testing/scripts/playwright_runner.py http://localhost:3000 --screenshot --mobile
  ```

  - Mobile drawer opens/closes
  - Navigation works
  - Touch interactions functional

- [ ] **Manual Device Testing**
  - [ ] iPhone (Safari)
  - [ ] Android (Chrome)
  - [ ] iPad (Safari)
  - [ ] Test at 320px, 375px, 768px, 1024px

- [ ] **Rule Compliance**
  - [ ] No purple/violet colors introduced
  - [ ] Cyberpunk aesthetic maintained
  - [ ] Animations smooth and performant
  - [ ] No standard template patterns

---

## Definition of Done

✅ All tasks completed and verified  
✅ All Phase X checks pass  
✅ No console errors or warnings  
✅ Tested on real mobile devices  
✅ Accessibility score >= 95  
✅ Performance score >= 90  
✅ Code reviewed and approved  
✅ Documentation updated  
✅ TODO.md updated (mark items complete)

---

## Notes

- **Design Philosophy**: Maintain the cyberpunk terminal aesthetic on mobile
- **Performance**: Prioritize 60fps animations, use CSS transforms
- **Accessibility**: WCAG 2.1 AA compliance minimum
- **Browser Support**: iOS Safari 14+, Chrome 90+, Firefox 88+
- **Breakpoints**: Mobile (< 768px), Tablet (768px - 1024px), Desktop (>= 1024px)

---

**Plan Created**: 2026-02-02  
**Primary Agent**: `frontend-specialist`  
**Skills Used**: `frontend-design`, `react-best-practices`, `tailwind-patterns`, `web-design-guidelines`
