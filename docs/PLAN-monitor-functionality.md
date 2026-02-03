# Plan: Monitor Functionality & Analytics

> **Goal**: Implement end-to-end functionality for creating monitors, listing them, and viewing detailed analytics for each monitor.

## 1. Database Schema Design (Prisma)

We need to define the data model for Monitors and their Analytics/Events.

- [ ] **Update `packages/db/prisma/schema/schema.prisma`**
  - Add `Monitor` model:
    - `id`: String (CUID/UUID) @id
    - `name`: String
    - `url`: String
    - `type`: String (HTTP, PING, PORT) - Enum?
    - `interval`: Int (seconds)
    - `timeout`: Int (seconds)
    - `status`: String (UP, DOWN, PAUSED) - Enum?
    - `userId`: String (relation to User if Auth is set up, otherwise string for now)
    - `createdAt`, `updatedAt`
  - Add `MonitorEvent` (or `Heartbeat`) model (for analytics history):
    - `id`: String @id
    - `monitorId`: String (FK)
    - `status`: String (UP/DOWN)
    - `latency`: Int (ms)
    - `timestamp`: DateTime
  - _Note_: PulseGuard seems to use BetterAuth, need to check if User model exists or if we hook into it.

## 2. Server Actions (Backend Logic)

Implement the logic to handle form submissions and database queries.

- [ ] **Create `apps/web/src/server/actions/monitors.ts`**
  - `createMonitor(data)`: Validates input (Zod) and inserts into DB.
  - `getMonitors()`: Fetches list for the main dashboard/monitors page.
  - `getMonitor(id)`: Fetches single monitor details.
  - `deleteMonitor(id)`: Removes a monitor.

## 3. "Add Monitor" Integration

Connect the UI form to the backend.

- [ ] **Update `apps/web/src/components/monitors/monitor-form.tsx`**
  - Convert to Client Component (if not already).
  - Use `useActionState` or `react-hook-form` + `zod` to handle submission.
  - Call `createMonitor` action on submit.
  - Handle success (toast + redirect to `/dashboard/monitors`).

## 4. Monitors List Implementation

Replace mock data with real database data.

- [ ] **Update `apps/web/src/app/(app)/dashboard/monitors/page.tsx`**
  - Fetch monitors using `getMonitors`.
  - Pass data to `MonitorList`.
- [ ] **Update `apps/web/src/components/monitors/monitor-list.tsx`**
  - Accept `monitors` prop.
  - Map real data to table rows.
  - **Click Handler**: Ensure clicking a row navigates to `/dashboard/monitors/[id]`.

## 5. Detailed Analytics Page

Implement the dynamic detail view based on `code.html`.

- [ ] **Create Page Route: `apps/web/src/app/(app)/dashboard/monitors/[id]/page.tsx`**
  - Dynamic route parameter `[id]`.
  - Fetch specific monitor data + recent events.
- [ ] **Create Components for Detail View**
  - `MonitorHeader`: Status, URL, switch toggle.
  - `MonitorStatsGrid`: Uptime, Response Time, Downtime cards.
  - `UptimeChart`: Visual bar chart (can use Recharts or custom CSS bars like `code.html`).
  - `ResponseTimeChart`: Line chart.
  - `IncidentHistory`: Table of recent down events.
- [ ] **Styling**: Port the Cyberpunk/Clean design from `code.html` to these React components.

## 6. Verification

- [ ] Verify database migration runs successfully (`bun db:push` or similar).
- [ ] Verify creating a monitor works and shows up in the DB.
- [ ] Verify clicking list item opens detail page with correct ID.
