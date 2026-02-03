# PLAN: Public & Private Status Pages

> **Goal**: Build a multi-tenant status page system allowing PulseGuard users to publish status pages on subdomains (`status.pulseguard.com/slug`) or custom domains (`status.company.com`), with robust privacy and layout options.
> **Architecture**: Next.js Middleware for rewrites + Vercel Platforms Kit pattern.

---

## 🏗️ Phase 1: Data Architecture & Domains

**Goal**: Design the schema for flexible pages and handle domain verification logic.

### 1.1 Database Schema (`apps/web/prisma/schema.prisma`)

- **StatusPage Model**:
  - `slug` (unique, index)
  - `customDomain` (unique, nullable, index)
  - `title`, `description`, `favicon`, `logo`
  - `theme` (JSON: colors, light/dark preference)
  - `password` (hashed, nullable)
  - `requiresAuth` (boolean - for future SSO)
  - `layout` (JSON: order of components, groups)
- **StatusPageMonitor Model**:
  - Many-to-Many link between `StatusPage` and `Monitor`
  - `displayGroup` (string, nullable) - for grouping checks like "API", "Frontend"
  - `displayName` (override original monitor name)

### 1.2 Domain Verification Logic

- **Vercel API Integration**:
  - Utility to add/remove domains from Vercel project via API.
  - Check configuration status (CNAME/SSL).
- **Middleware Update (`apps/web/middleware.ts`)**:
  - **Host Detection**: Parse `req.headers.get("host")`.
  - **Routing Logic**:
    - If host == `app.pulseguard.com`, proceed as normal.
    - If host == `*.pulseguard.com`, rewrite to `/status-page/[subdomain]`.
    - If distinct custom domain, rewrite to `/status-page/_custom/[domain]`.

### 1.3 TRPC Routes (`router/status-page.ts`)

- CRUD for Status Pages.
- `verifyDomain`: Trigger verification check.
- `getPublicPage`: Public-facing procedure to fetch page config by slug/domain (cached).

---

## 🎨 Phase 2: Page Builder & Admin UI

**Goal**: Allow users to design their status page.

### 2.1 Builder Interface (`/dashboard/pages/[id]/edit`)

- **General Settings**: Slug input, Custom Domain input + verification status badge.
- **Theming**: Color picker for "Brand Color", "Background", "Primary Text".
- **Monitor Picker**:
  - List available monitors.
  - Multi-select with checkboxes.
  - Drag-and-drop reordering (use `dnd-kit` or `react-beautiful-dnd`).
- **Preview**: Live side-by-side preview of the status page.

### 2.2 Layout Configuration

- Define "Sections" (e.g., "Active Incidents", "System Status", "Uptime Graphs").
- Toggle visibility of:
  - Header/Footer
  - Response Time Charts (maybe hide for cleaner look)
  - Historical Uptime (90 days vs 30 days)

---

## 🌐 Phase 3: Public Rendering Engine

**Goal**: Render the high-performance public view.

### 3.1 Public Layout (`app/status-page/[slug]/page.tsx`)

- **Dynamic Layout system**:
  - Reads `StatusPage.layout` JSON to render components in order.
  - **Components**:
    - `StatusHeader`: Logo, Subscribe button.
    - `GlobalStatusIndicator`: "All Systems Operational".
    - `ActiveIncidents`: Critical alerts banner.
    - `MonitorGroup`: List of checks in a group.
    - `MaintenanceSchedule`: Upcoming planned works.

### 3.2 Performance & caching

- Use `revalidatePath` when user updates page settings.
- **ISR (Incremental Static Regeneration)** strategy for high traffic pages if possible, or aggressive caching on the database query.

---

## 🔒 Phase 4: Access Control (Private Pages)

**Goal**: Secure private status pages.

### 4.1 Password Protection

- Middleware check:
  - If page has `password` set -> Check for `status_page_auth` cookie.
  - If missing -> Rewrite to `/status-page/auth/[slug]`.
- **Auth Screen**: Simple input form "Enter Password to view status".

### 4.2 Bot Protection

- `robots.txt` dynamic generation (Allow indexing for public, Disallow for private).

---

## ✅ Verification Checklist

### Feature Tests

- [ ] Create a page with slug `demo`. Access at `demo.pulseguard.com` (local simulation).
- [ ] Add Custom Domain, verify headers are parsed correctly.
- [ ] Drag-and-drop monitors, verify order persists on public page.
- [ ] Enable password protection, verify gate works.

### Security/Performance

- [ ] Verify private monitors are NOT exposed via public API if not added to a status page.
- [ ] Check Lighthouse score for public status page (Goal: 100/100 performance).
