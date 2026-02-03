# PLAN: Incident History & Embeddable Status Widget

## Overview

Implement a comprehensive incident history display system with planned maintenance timelines, historical uptime visualization, and an embeddable status widget that external websites can use to show current system status.

**Why:** Users need visibility into past incidents and scheduled maintenance to build trust. External users want a simple way to embed a status badge on their own sites without building custom integrations.

---

## Project Type

**WEB** - Next.js dashboard enhancement + API endpoint

---

## Success Criteria

| Criteria                                    | Measurement                              |
| ------------------------------------------- | ---------------------------------------- |
| Incident history displays with pagination   | 30/60/90 day configurable lookback       |
| Maintenance timeline shows upcoming windows | Sorted by start date, visual timeline    |
| Historical uptime percentage calculated     | From `MonitorEvent` aggregation          |
| Widget endpoint returns CORS-protected JSON | Respects `allowedDomains` config         |
| Widget JS snippet embeddable                | Simple `<script>` tag with customization |
| Widget styling configurable in dashboard    | Colors, badge text saved to DB           |

---

## Tech Stack

| Component       | Technology             | Rationale                  |
| --------------- | ---------------------- | -------------------------- |
| Frontend        | Next.js 14+ App Router | Existing stack             |
| Styling         | Tailwind CSS           | Existing design system     |
| API             | Next.js Route Handlers | Simple, edge-compatible    |
| Database        | Prisma + PostgreSQL    | Existing schema            |
| Widget Delivery | CDN-cached JS          | Performance, embeddability |

---

## File Structure

```
packages/db/prisma/schema/
├── status-page.prisma            # UPDATE: Add widget config fields

apps/web/src/
├── actions/
│   └── status-pages.ts           # UPDATE: Add widget config actions
├── app/
│   ├── (app)/dashboard/pages/[id]/
│   │   └── page.tsx              # UPDATE: Add Incidents/History tab
│   └── api/
│       └── widget/
│           ├── [slug]/
│           │   └── status/
│           │       └── route.ts  # NEW: Widget JSON endpoint
│           └── embed.js/
│               └── route.ts      # NEW: Widget JS script endpoint
├── components/
│   ├── status-pages/
│   │   ├── incident-history-tab.tsx       # NEW: Incident history + uptime
│   │   ├── maintenance-timeline.tsx       # NEW: Upcoming maintenance view
│   │   ├── uptime-percentage-card.tsx     # NEW: Calculated uptime stat
│   │   └── widget-configurator.tsx        # NEW: Widget settings form
│   └── widgets/
│       └── status-badge-preview.tsx       # NEW: Live preview in dashboard
└── lib/
    └── uptime-calculator.ts      # NEW: Uptime calculation utility

apps/public/ (or CDN dist)
└── pulseguard-widget.js          # Compiled embeddable widget
```

---

## Database Schema Changes

### StatusPage Model Updates

```prisma
model StatusPage {
  // ... existing fields ...

  // Widget Configuration (NEW)
  widgetEnabled       Boolean  @default(false)
  widgetAllowedDomains String? // Comma-separated, "*" = any, null = same-origin only
  widgetBadgeText     Json?    // { operational: "All Systems Go", partial: "Some Issues", major: "Major Outage" }
  widgetTheme         Json?    // { bgColor: "#1a1a2e", textColor: "#00ff88", borderRadius: "8px" }

  // History Configuration (NEW)
  historyDays         Int      @default(90) // 30, 60, or 90
}
```

---

## Task Breakdown

### Phase 1: Database & Backend Foundation

#### Task 1.1: Update StatusPage Schema

- **Agent:** `backend-specialist`
- **Skills:** `database-design`, `prisma`
- **Priority:** P0 (Blocker)
- **Dependencies:** None
- **INPUT:** Current `status-page.prisma`
- **OUTPUT:** Updated schema with widget & history fields
- **VERIFY:**
  - `bunx prisma generate` succeeds
  - `bunx prisma db push` applies changes
  - TypeScript types include new fields

#### Task 1.2: Create Uptime Calculator Utility

- **Agent:** `backend-specialist`
- **Skills:** `clean-code`, `testing-patterns`
- **Priority:** P1
- **Dependencies:** None
- **INPUT:** `MonitorEvent` records + time range
- **OUTPUT:** `/lib/uptime-calculator.ts` with `calculateUptime(monitorId, days): number`
- **VERIFY:**
  - Returns percentage (0-100)
  - Handles edge cases (no events, all down, all up)
  - Unit test passes

#### Task 1.3: Add Widget Config Server Actions

- **Agent:** `backend-specialist`
- **Skills:** `api-patterns`, `clean-code`
- **Priority:** P1
- **Dependencies:** Task 1.1
- **INPUT:** Widget form data (domains, colors, badge text)
- **OUTPUT:** Updated `/actions/status-pages.ts` with `updateWidgetConfig()`
- **VERIFY:**
  - Auth check passes
  - Validation for domain formats
  - Database updates correctly

---

### Phase 2: Widget API Endpoints

#### Task 2.1: Create Widget Status JSON Endpoint

- **Agent:** `backend-specialist`
- **Skills:** `api-patterns`, `nodejs-best-practices`
- **Priority:** P0
- **Dependencies:** Task 1.1
- **INPUT:** GET `/api/widget/[slug]/status`
- **OUTPUT:** JSON response with current status + CORS headers
- **VERIFY:**
  ```json
  {
    "status": "operational" | "partial" | "major",
    "message": "All Systems Operational",
    "monitors": [{ "name": "API", "status": "UP" }],
    "lastUpdated": "2024-01-01T00:00:00Z"
  }
  ```

  - CORS: Only allowed domains can fetch
  - Response cached for 60s

#### Task 2.2: Create Embeddable Widget JS Endpoint

- **Agent:** `frontend-specialist`
- **Skills:** `clean-code`, `frontend-design`
- **Priority:** P1
- **Dependencies:** Task 2.1
- **INPUT:** GET `/api/widget/embed.js?slug=xxx`
- **OUTPUT:** JavaScript that:
  - Fetches status from Task 2.1 endpoint
  - Renders badge into target element
  - Applies user-configured styles
- **VERIFY:**
  - Script runs in `<script>` tag
  - No external dependencies
  - Respects configured colors/text

---

### Phase 3: Dashboard UI - Incident History

#### Task 3.1: Create Incident History Tab Component

- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`, `react-best-practices`
- **Priority:** P1
- **Dependencies:** Task 1.2
- **INPUT:** Monitor incidents + events
- **OUTPUT:** `incident-history-tab.tsx` with:
  - Paginated incident list (from existing `Incident` model)
  - Uptime percentage card (from Task 1.2)
  - Date range selector (30/60/90 days)
- **VERIFY:**
  - Matches cyberpunk design system
  - Pagination works
  - Responsive on mobile

#### Task 3.2: Create Maintenance Timeline Component

- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P1
- **Dependencies:** None
- **INPUT:** `MaintenanceWindow` records for status page monitors
- **OUTPUT:** `maintenance-timeline.tsx` visual timeline component
- **VERIFY:**
  - Shows upcoming maintenance (next 30 days)
  - Shows active maintenance with countdown
  - Past maintenance shows as completed

#### Task 3.3: Create Uptime Percentage Card

- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P2
- **Dependencies:** Task 1.2
- **INPUT:** Uptime percentage number
- **OUTPUT:** `uptime-percentage-card.tsx` with:
  - Large percentage display
  - Visual indicator (green/yellow/red)
  - Trend arrow compared to previous period
- **VERIFY:**
  - 99.9%+ = green, 99%+ = yellow, else red
  - Accessible contrast

---

### Phase 4: Dashboard UI - Widget Configuration

#### Task 4.1: Create Widget Configurator Component

- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`, `react-best-practices`
- **Priority:** P1
- **Dependencies:** Task 1.3
- **INPUT:** Current widget settings
- **OUTPUT:** `widget-configurator.tsx` with:
  - Enable/disable toggle
  - Allowed domains input (textarea, one per line)
  - Badge text customization (operational/partial/major)
  - Theme color pickers (bg, text, border)
- **VERIFY:**
  - Form saves via server action
  - Validation feedback on invalid domains
  - Live preview updates

#### Task 4.2: Create Status Badge Preview Component

- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P2
- **Dependencies:** Task 4.1
- **INPUT:** Widget theme + badge text config
- **OUTPUT:** `status-badge-preview.tsx` live preview
- **VERIFY:**
  - Updates in real-time as config changes
  - Shows all 3 states (operational/partial/major)

#### Task 4.3: Create Embed Code Generator

- **Agent:** `frontend-specialist`
- **Skills:** `clean-code`
- **Priority:** P2
- **Dependencies:** Task 2.2
- **INPUT:** Status page slug
- **OUTPUT:** UI component showing copyable embed code:
  ```html
  <div id="pulseguard-status"></div>
  <script src="https://yourdomain.com/api/widget/embed.js?slug=xxx"></script>
  ```
- **VERIFY:**
  - Copy button works
  - Code is valid HTML

---

### Phase 5: Integration & Polish

#### Task 5.1: Add Widget Tab to Status Page Editor

- **Agent:** `frontend-specialist`
- **Skills:** `react-best-practices`
- **Priority:** P1
- **Dependencies:** Task 4.1, Task 4.2, Task 4.3
- **INPUT:** Current status page editor tabs
- **OUTPUT:** New "Widget" tab containing configurator + preview + embed code
- **VERIFY:**
  - Tab navigation works
  - Settings persist across tab switches

#### Task 5.2: Add History Tab to Status Page Editor

- **Agent:** `frontend-specialist`
- **Skills:** `react-best-practices`
- **Priority:** P1
- **Dependencies:** Task 3.1, Task 3.2, Task 3.3
- **INPUT:** Current status page editor
- **OUTPUT:** New "History" tab containing:
  - Uptime card
  - Incident history (paginated)
  - Maintenance timeline
- **VERIFY:**
  - Data loads correctly
  - Responsive layout

---

## Phase X: Verification Checklist

### Automated Checks

- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes
- [ ] `bunx prisma generate` succeeds
- [ ] `npm run build` succeeds

### Manual Verification

- [ ] Widget endpoint returns correct CORS headers
- [ ] Widget blocks requests from non-allowed domains
- [ ] Embed script renders badge correctly on external page
- [ ] Incident history shows correct data with pagination
- [ ] Maintenance timeline displays upcoming windows
- [ ] Uptime percentage calculates correctly
- [ ] Widget configurator saves settings
- [ ] Color picker applies to badge preview

### Security

- [ ] Widget endpoint rate-limited
- [ ] No sensitive data exposed in widget response
- [ ] Domain validation prevents wildcard bypass

---

## Risk Assessment

| Risk                               | Mitigation                                  |
| ---------------------------------- | ------------------------------------------- |
| CORS bypass                        | Strict origin validation, no regex patterns |
| Widget endpoint abuse              | Cache responses, rate limit by IP           |
| Uptime calculation accuracy        | Unit tests with edge cases                  |
| JS widget conflicts with host page | Namespace all CSS, use shadow DOM if needed |

---

## Implementation Notes

### Widget JS Structure (Reference)

```javascript
(function () {
  const config = window.PulseGuardWidget || {};
  const slug = config.slug || document.currentScript.dataset.slug;

  fetch(`/api/widget/${slug}/status`)
    .then((r) => r.json())
    .then((data) => {
      const container = document.getElementById(
        config.target || "pulseguard-status",
      );
      container.innerHTML = `<div class="pg-badge" style="...">
        ${data.message}
      </div>`;
    });
})();
```

### CORS Validation Logic

```typescript
function validateOrigin(origin: string, allowedDomains: string): boolean {
  if (allowedDomains === "*") return true;
  if (!allowedDomains) return false;

  const allowed = allowedDomains.split(",").map((d) => d.trim());
  return allowed.some((domain) => {
    if (domain.startsWith("*.")) {
      return origin.endsWith(domain.slice(1));
    }
    return origin === `https://${domain}` || origin === `http://${domain}`;
  });
}
```

---

## Next Steps

After plan approval:

1. Run `/create` to begin implementation
2. Start with Phase 1 (database schema)
3. Proceed through phases sequentially

---
