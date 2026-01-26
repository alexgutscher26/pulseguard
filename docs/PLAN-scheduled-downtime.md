# Plan: Scheduled Downtime (Maintenance Windows)

> **Goal**: Implement scheduled maintenance windows where monitors are silenced and displayed with a distinct "MAINTENANCE" status.

## 1. Database Schema `schema.prisma`

We need to store the maintenance configuration and update the monitor status enum.

### 1.1 New Model: `MaintenanceWindow`

```prisma
model MaintenanceWindow {
  id          String   @id @default(cuid())
  monitorId   String
  monitor     Monitor  @relation(fields: [monitorId], references: [id], onDelete: Cascade)

  description String?  // e.g. "Weekly DB Upgrade"
  startAt     DateTime
  endAt       DateTime

  // Future-proofing for recurrence (optional for V1, but good to have field)
  // rule      String?  // e.g. CRON or RRule string

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([monitorId])
  @@index([startAt, endAt])
}
```

### 1.2 Update Enum: `MonitorStatus`

Update the existing status enum (or string union in code if not an enum) to include `MAINTENANCE`.

- Effect: `UP | DOWN | PAUSED | MAINTENANCE`

---

## 2. Worker Logic (The "Sentinel")

The worker needs to be "maintenance-aware" before performing checks or sending alerts.

### 2.1 Check Logic Modification

Inside `checkMonitor` (or the worker's main loop):

1.  **Fetch Active Windows**: Query `MaintenanceWindow` where `monitorId == id` AND `now() BETWEEN startAt AND endAt`.
2.  **If Active Window Found**:
    - **Skip Network Request**: Do not ping the target (optional, but saves resources). OR ping anyway but ignore result.
    - **Force Status**: Set `Monitor.status = 'MAINTENANCE'`.
    - **Log Event**: Create `MonitorEvent` with status `MAINTENANCE` (latency 0).
    - **Suppress Alerts**: Ensure no "DOWN" alerts are queued.

### 2.2 Dashboard Stats

- ensure `MAINTENANCE` status counts as "Active" but doesn't negatively impact Uptime calculations (exclude from denominator?).
- For now, we will treat it as "Neutral" in uptime calcs (like PAUSED).

---

## 3. User Interface

### 3.1 Maintenance Management UI

New Tab in `dashboard/monitors/[id]/settings` called "Maintenance".

- **List**: Show upcoming and past windows.
- **Create**: Form to select Start Date/Time and End Date/Time.
- **Delete**: Remove a window (if canceled).

### 3.2 Dashboard Indicators

- **Status Pill**: New Blue/Yellow badge: `MAINTENANCE`.
- **Monitors Table**:
  - Row highlight or icon indicating scheduled work.
- **Uptime Bar**:
  - Render `MAINTENANCE` events as a distinct color (e.g., Blue/Yellow blocks) instead of Green/Red.

---

## 4. Implementation Steps

### Phase 1: Database & Core Types

- [ ] Add `MaintenanceWindow` to `schema.prisma`.
- [ ] Run `bun prisma migrate dev`.
- [ ] Update frontend types to support `MAINTENANCE` status.

### Phase 2: Worker Logic

- [ ] Update `worker/src/index.ts` to check for maintenance windows.
- [ ] Implement the "Skip & Set Status" logic.
- [ ] Ensure `MonitorEvent` handles the new status string.

### Phase 3: Dashboard UI Updates

- [ ] Update `MonitorsTable` to render `MAINTENANCE` badge.
- [ ] Update `UptimeBar` component to handle maintenance color.
- [ ] (Optional) Update Dashboard Search/Filter to include maintenance.

### Phase 4: Management UI

- [ ] Create server actions: `createMaintenanceWindow`, `deleteMaintenanceWindow`.
- [ ] Build UI component: `components/monitors/maintenance-list.tsx`.
- [ ] Integrate into `settings/page.tsx`.

---

## 5. Visual Design Specs

- **Color**: Yellow (`text-yellow-500`, `bg-yellow-500/10`) or Blue (`text-blue-500`, `bg-blue-500/10`) depending on "Info" vs "Warning" vibez. User requested Blue/Yellow. Let's go **Amber/Yellow** for "Maintenance" as it implies "Caution/Work in Progress".
- **Icon**: `Construction` or `Wrench` from `lucide-react`.
