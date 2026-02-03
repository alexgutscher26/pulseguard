---
title: Command Palette (Cmd+K) Implementation Plan
created: 2026-02-02
status: pending
complexity: medium
estimated_time: 6-8 hours
---

# Command Palette (Cmd+K) - Implementation Plan

## 📋 Overview

Implement a global command palette using `cmdk` library that provides quick navigation, monitor management, and action execution within the PulseGuard dashboard.

---

## 🎯 Goals

1. **Quick Navigation**: Jump to monitors, settings, billing, and specific monitor tabs
2. **Monitor Actions**: Pause, edit, delete monitors with confirmation for destructive actions
3. **Quick Creation**: Create new monitors (HTTP, Ping, etc.)
4. **System Actions**: Toggle theme, navigate to settings
5. **Keyboard-First UX**: Full keyboard navigation with visible shortcuts

---

## 🏗️ Architecture

### Component Structure

```
apps/web/components/
├── command-palette/
│   ├── command-palette.tsx          # Main palette component
│   ├── command-groups/
│   │   ├── navigation-commands.tsx  # Go to... commands
│   │   ├── monitor-commands.tsx     # Monitor-specific actions
│   │   ├── creation-commands.tsx    # Create new... commands
│   │   ├── action-commands.tsx      # Global actions
│   │   └── theme-commands.tsx       # UI/Theme toggles
│   ├── command-item.tsx             # Reusable command item
│   ├── confirmation-dialog.tsx      # Inline confirmation
│   └── use-command-palette.tsx      # Hook for state management
```

---

## 📦 Dependencies

### New Packages

```json
{
  "cmdk": "^1.0.0"
}
```

### Existing Dependencies

- `@tanstack/react-query` - For data fetching
- `lucide-react` - Icons
- `next/navigation` - Router
- Existing monitor actions from `actions/monitors.ts`

---

## 🔧 Implementation Phases

### **Phase 1: Setup & Core Infrastructure** (1-2 hours)

#### Tasks

1. **Install Dependencies**

   ```bash
   cd apps/web
   bun add cmdk
   ```

2. **Create Base Command Palette Component**
   - File: `apps/web/components/command-palette/command-palette.tsx`
   - Features:
     - Cmd+K / Ctrl+K keyboard shortcut
     - ESC to close
     - Search/filter functionality
     - Empty state handling
     - Loading states

3. **Create Custom Hook**
   - File: `apps/web/components/command-palette/use-command-palette.tsx`
   - Manage:
     - Open/close state
     - Search query
     - Selected action
     - Confirmation state

4. **Global Keyboard Listener**
   - Add to `apps/web/app/dashboard/layout.tsx`
   - Register Cmd+K / Ctrl+K globally
   - Prevent conflicts with browser shortcuts

**Verification:**

- [ ] Cmd+K opens palette
- [ ] ESC closes palette
- [ ] Search input is auto-focused
- [ ] No console errors

---

### **Phase 2: Navigation Commands** (1 hour)

#### Tasks

1. **Create Navigation Command Group**
   - File: `apps/web/components/command-palette/command-groups/navigation-commands.tsx`
   - Commands:
     - "Go to Dashboard" → `/dashboard`
     - "Go to Monitors" → `/dashboard/monitors`
     - "Go to Incidents" → `/dashboard/incidents`
     - "Go to Settings" → `/dashboard/settings`
     - "Go to Billing" → `/dashboard/billing`
     - "Go to Status Page" → `/dashboard/status-page`

2. **Monitor Navigation**
   - Fetch monitors using `useQuery` + `getMonitors` action
   - Display as "Go to [Monitor Name]"
   - Show monitor status badge (up/down)
   - Navigate to `/dashboard/monitors/[id]`

3. **Monitor Tab Navigation**
   - Sub-commands for each monitor:
     - "Overview" → `/dashboard/monitors/[id]`
     - "Incidents" → `/dashboard/monitors/[id]?tab=incidents`
     - "Settings" → `/dashboard/monitors/[id]?tab=settings`
     - "Events" → `/dashboard/monitors/[id]?tab=events`

**Verification:**

- [ ] All navigation commands appear
- [ ] Clicking navigates correctly
- [ ] Monitor list shows current status
- [ ] Tab navigation works with query params

---

### **Phase 3: Monitor Actions** (2 hours)

#### Tasks

1. **Create Monitor Actions Group**
   - File: `apps/web/components/command-palette/command-groups/monitor-commands.tsx`
   - Actions per monitor:
     - "Pause [Monitor Name]"
     - "Resume [Monitor Name]"
     - "Edit [Monitor Name]"
     - "Delete [Monitor Name]" (requires confirmation)

2. **Global Monitor Actions**
   - "Pause All Monitors" (requires confirmation)
   - "Resume All Monitors" (requires confirmation)
   - "Acknowledge All Alerts"

3. **Confirmation Dialog**
   - File: `apps/web/components/command-palette/confirmation-dialog.tsx`
   - Inline confirmation within palette
   - Show action details
   - "Confirm" / "Cancel" buttons
   - Keyboard navigation (Enter/ESC)

4. **Action Execution**
   - Use existing actions from `actions/monitors.ts`:
     - `updateMonitor` (for pause/resume)
     - `deleteMonitor`
   - Integrate with `useMutation` for optimistic updates
   - Show toast notifications on success/error
   - Auto-close palette on success

**Verification:**

- [ ] Monitor-specific actions appear
- [ ] Pause/Resume toggles correctly
- [ ] Confirmation shows for destructive actions
- [ ] Actions execute and show feedback
- [ ] Optimistic updates work

---

### **Phase 4: Quick Creation** (1 hour)

#### Tasks

1. **Create Creation Commands Group**
   - File: `apps/web/components/command-palette/command-groups/creation-commands.tsx`
   - Commands:
     - "Create HTTP Monitor"
     - "Create Ping Monitor"
     - "Create TCP Monitor"
     - "Create DNS Monitor"

2. **Navigation to Creation Flow**
   - Navigate to `/dashboard/monitors/new?type=[http|ping|tcp|dns]`
   - Pre-select monitor type in form
   - Update `MonitorForm` to read `type` query param

**Verification:**

- [ ] Creation commands appear
- [ ] Navigates to correct form
- [ ] Monitor type is pre-selected

---

### **Phase 5: System Actions** (1 hour)

#### Tasks

1. **Create Action Commands Group**
   - File: `apps/web/components/command-palette/command-groups/action-commands.tsx`
   - Commands:
     - "Toggle Dark Mode"
     - "View Documentation"
     - "Contact Support"
     - "Sign Out"

2. **Theme Toggle Integration**
   - Use existing theme context/hook
   - Execute theme toggle action
   - Show current theme state in command label

3. **External Links**
   - Documentation → Open in new tab
   - Support → Open support page/email

**Verification:**

- [ ] Theme toggle works
- [ ] External links open correctly
- [ ] Sign out redirects to login

---

### **Phase 6: UI/UX Polish** (1-2 hours)

#### Tasks

1. **Keyboard Shortcuts Display**
   - Show shortcuts next to commands:
     - "⌘K" for opening palette
     - "↑↓" for navigation
     - "Enter" to execute
     - "ESC" to close
   - Platform detection (⌘ on Mac, Ctrl on Windows)

2. **Visual Design**
   - Match PulseGuard's glassmorphism aesthetic
   - Dark mode support
   - Smooth animations (fade-in, scale)
   - Backdrop blur
   - Custom scrollbar styling

3. **Icons**
   - Add relevant icons from `lucide-react`:
     - Navigation: `ArrowRight`, `Home`, `Settings`
     - Actions: `Pause`, `Play`, `Trash`, `Edit`
     - Creation: `Plus`, `Activity`
     - Theme: `Sun`, `Moon`

4. **Empty States**
   - "No results found" when search returns nothing
   - Suggestions for common actions

5. **Loading States**
   - Skeleton loaders while fetching monitors
   - Disable actions during mutations

6. **Accessibility**
   - ARIA labels
   - Focus management
   - Screen reader announcements

**Verification:**

- [ ] Keyboard shortcuts are visible
- [ ] Design matches app aesthetic
- [ ] Animations are smooth
- [ ] Icons are appropriate
- [ ] Empty states show correctly
- [ ] Accessible via keyboard only

---

### **Phase 7: Integration & Testing** (1 hour)

#### Tasks

1. **Add to Dashboard Layout**
   - Import `CommandPalette` in `apps/web/app/dashboard/layout.tsx`
   - Render as global component
   - Ensure it doesn't interfere with other modals

2. **Add Visual Hint**
   - Optional: Add "Press ⌘K" hint in dashboard header
   - Subtle, non-intrusive placement

3. **Testing Checklist**
   - [ ] Keyboard shortcuts work (Cmd+K, Ctrl+K, ESC)
   - [ ] All navigation commands work
   - [ ] Monitor actions execute correctly
   - [ ] Confirmations prevent accidental deletions
   - [ ] Quick creation navigates to form
   - [ ] Theme toggle works
   - [ ] Search/filter works
   - [ ] Works on mobile (touch-friendly)
   - [ ] No memory leaks (cleanup on unmount)
   - [ ] Works with existing auth/permissions

4. **Edge Cases**
   - No monitors exist
   - Network errors during action execution
   - Rapid keyboard input
   - Multiple palettes (shouldn't happen)

**Verification:**

- [ ] All features work end-to-end
- [ ] No regressions in existing features
- [ ] Performance is acceptable
- [ ] Mobile experience is good

---

## 🎨 Design Specifications

### Color Palette

```css
/* Command Palette Styles */
--command-bg: hsl(var(--background) / 0.95);
--command-border: hsl(var(--border));
--command-input-bg: hsl(var(--muted));
--command-item-hover: hsl(var(--accent));
--command-item-selected: hsl(var(--primary) / 0.1);
--command-shortcut: hsl(var(--muted-foreground));
```

### Layout

- **Width**: 640px max
- **Height**: Auto (max 60vh)
- **Position**: Fixed, centered
- **Backdrop**: Blur(8px) + dark overlay
- **Border Radius**: 12px
- **Shadow**: Large, elevated

### Typography

- **Search Input**: 16px, medium weight
- **Command Items**: 14px
- **Shortcuts**: 12px, monospace
- **Group Headers**: 12px, uppercase, muted

---

## 🔐 Security Considerations

1. **Action Permissions**
   - Verify user owns monitor before executing actions
   - Use existing auth middleware
   - Server-side validation for all mutations

2. **Confirmation for Destructive Actions**
   - Delete monitor
   - Pause all monitors
   - Resume all monitors

3. **Rate Limiting**
   - Prevent spam of action executions
   - Use existing API rate limits

---

## 📊 Success Metrics

- [ ] Command palette opens in <100ms
- [ ] Search results appear in <50ms
- [ ] Actions execute in <500ms
- [ ] Zero accessibility violations
- [ ] Works on Chrome, Firefox, Safari, Edge
- [ ] Mobile-friendly (responsive)

---

## 🚀 Future Enhancements (Post-MVP)

1. **Recent Commands**
   - Track last 5 used commands
   - Show at top of palette

2. **Command Aliases**
   - "new monitor" → "Create HTTP Monitor"
   - "dark" → "Toggle Dark Mode"

3. **Fuzzy Search**
   - Better matching algorithm
   - Typo tolerance

4. **Command History**
   - Navigate through previous searches
   - Up/Down arrow in empty search

5. **Custom Shortcuts**
   - User-defined keyboard shortcuts
   - Per-action customization

6. **AI-Powered Suggestions**
   - Context-aware command suggestions
   - "You might want to..."

---

## 📝 Files to Create/Modify

### New Files (9)

1. `apps/web/components/command-palette/command-palette.tsx`
2. `apps/web/components/command-palette/use-command-palette.tsx`
3. `apps/web/components/command-palette/command-item.tsx`
4. `apps/web/components/command-palette/confirmation-dialog.tsx`
5. `apps/web/components/command-palette/command-groups/navigation-commands.tsx`
6. `apps/web/components/command-palette/command-groups/monitor-commands.tsx`
7. `apps/web/components/command-palette/command-groups/creation-commands.tsx`
8. `apps/web/components/command-palette/command-groups/action-commands.tsx`
9. `apps/web/components/command-palette/command-groups/theme-commands.tsx`

### Modified Files (2)

1. `apps/web/app/dashboard/layout.tsx` - Add CommandPalette component
2. `apps/web/app/dashboard/monitors/new/page.tsx` - Read `type` query param

### Package Updates (1)

1. `apps/web/package.json` - Add `cmdk` dependency

---

## 🎯 Agent Assignments

| Phase     | Agent                  | Reason                              |
| --------- | ---------------------- | ----------------------------------- |
| Phase 1-2 | `@frontend-specialist` | React component architecture, hooks |
| Phase 3-4 | `@frontend-specialist` | Form handling, mutations, routing   |
| Phase 5-6 | `@frontend-specialist` | UI/UX, theming, accessibility       |
| Phase 7   | `@debugger`            | Testing, edge cases, integration    |

---

## ✅ Definition of Done

- [ ] All phases completed
- [ ] All verification checkboxes passed
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Passes accessibility audit
- [ ] Works on all major browsers
- [ ] Mobile responsive
- [ ] Documentation updated (if needed)
- [ ] User can navigate entire app via keyboard
- [ ] Destructive actions require confirmation
- [ ] Performance metrics met

---

## 📚 References

- [cmdk Documentation](https://cmdk.paco.me/)
- [Vercel Command Palette](https://vercel.com/docs/command-palette)
- [Keyboard Shortcuts Best Practices](https://www.nngroup.com/articles/keyboard-shortcuts/)
- [ARIA Command Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/command/)

---

**Created**: 2026-02-02  
**Estimated Completion**: 6-8 hours  
**Priority**: Medium  
**Dependencies**: None
