# Plan: Incident Management System (Core)

> **Goal:** implement a robust incident management system that links to Monitors, handles auto-creation/resolution, manages "flapping" monitors, and maintains a strict audit timeline.

## 1. Context & Requirements

### Key Decisions (Socratic Gate)

- **Auto-Resolution:** Monitors returning to `UP` state will automatically resolve the associated active incident.
- **Flapping Logic:** If a monitor goes `DOWN` while an incident is recently resolved (within a threshold) or active, it appends to the existing lifecycle rather than spamming new incidents.
- **Notification Strategy:** Minimize noise. Broadcast ONLY on `Created` (Triggered) and `Resolved`. Manual status updates or intermediate checks do not trigger broadcasts.
- **Audit Trail:** Full "Incident Timeline" required. Every status change, auto-event, or manual note must be logged as an immutable event.

### Tech Stack

- **Database:** Prisma (PostgreSQL) - New `Incident` and `IncidentEvent` models.
- **Backend:** Next.js Server Actions / API Handlers + Cloudflare Worker (for automation).
- **Frontend:** Incident Dashboard (List + Details view).

---

## 2. Architecture & Schema Design

### 2.1 Database Schema (Prisma)

We need to introduce `Incident` and `IncidentTimeline` (or `IncidentEvent`) tables.

```prisma
model Incident {
  id              String           @id @default(cuid())
  monitorId       String
  monitor         Monitor          @relation(fields: [monitorId], references: [id])
  status          IncidentStatus   @default(ONGOING) // ONGOING, RESOLVED, ACKNOWLEDGED
  severity        Severity         @default(HIGH)
  title           String
  description     String?
  startedAt       DateTime         @default(now())
  resolvedAt      DateTime?

  // Relations
  events          IncidentEvent[]

  // Audits
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  @@index([monitorId])
  @@index([status])
}

model IncidentEvent {
  id              String           @id @default(cuid())
  incidentId      String
  incident        Incident         @relation(fields: [incidentId], references: [id], onDelete: Cascade)
  type            EventType        // STATE_CHANGE, ALERT_SENT, COMMENT, AUTO_RESOLVE
  message         String
  createdAt       DateTime         @default(now())
}

enum IncidentStatus {
  INVESTIGATING
  IDENTIFIED
  MONITORING
  RESOLVED
}
```

### 2.2 Worker Logic (Automation)

The Worker (`apps/worker`) is the source of truth for monitor health. It must be updated to handle incident lifecycle.

**Logic Flow in `checkMonitor`:**

1. **Check Result:** DOWN.
   - _Is there an active incident?_
     - **Yes:** Log "Still Down" event to timeline (silent).
     - **No:** CREATE new `Incident` -> Status: `INVESTIGATING` -> Create "Down detected" Event -> **Notify (Triggered)**.
2. **Check Result:** UP.
   - _Is there an active incident?_
     - **Yes:** UPDATE incident status -> `RESOLVED` -> Set `resolvedAt` -> Create "Auto-resolved" Event -> **Notify (Resolved)**.
     - **No:** Do nothing (steady state).

---

## 3. Task Breakdown

### Phase 1: Database & Core Models

- [ ] **Schema Update:** Add `Incident` and `IncidentEvent` models to `schema.prisma`.
- [ ] **Migration:** Run migration to apply changes.
- [ ] **Seed Data:** (Optional) Create a mock incident for UI dev.

### Phase 2: Worker Implementation (The Brain)

- [ ] **Incident Service:** Create `services/incident.ts` in Worker.
  - `createIncident(monitorId, errorDebug)`
  - `resolveIncident(incidentId)`
  - `logEvent(incidentId, type, message)`
- [ ] **Check Logic:** Modify `checkMonitor` function.
  - Integrate the logic flow defined in Architecture 2.2.
  - Ensure "Flapping" re-opens or updates existing if within X minutes (optional refinement).
- [ ] **Notification Hook:** Ensure existing notification dispatch logic now triggers off _Incident_ events, not just raw Monitor status changes (to respect the "Critical Only" rule).

### Phase 3: API & Server Actions

- [ ] **Action:** `getIncidents(projectId)` - List view with filters (Active vs Past).
- [ ] **Action:** `getIncidentDetails(id)` - Full details + Timeline.
- [ ] **Action:** `updateIncidentStatus(id, status)` - Manual intervention (e.g., changing to "Identified").
  - Must implicitly create a Timeline event ("User X changed status to Identified").

### Phase 4: Frontend UI (Dashboard)

- [ ] **Incident List Component:** Table showing Active incidents at the top.
- [ ] **Incident Detail Page:**
  - Header: Status badge, Duration, Monitor link.
  - Main: Timeline view (vertical list of events).
  - Sidebar/Action: "Update Status" dropdown (Manual override).

### Phase 5: Verification & Testing

- [ ] **Unit Test:** `IncidentService` correctly handles state transitions.
- [ ] **E2E Test:**
  1. Force Monitor DOWN (Mock). -> Verify Incident Created.
  2. Verify Notification Sent.
  3. Force Monitor UP (Mock). -> Verify Incident Resolved.
  4. Verify Resolution Notification.
  5. Check Timeline for audit trail.

---

## 4. Agent Strategy

| Task Scope   | Primary Agent         | Stats                                            |
| :----------- | :-------------------- | :----------------------------------------------- |
| Schema & API | `backend-specialist`  | Focus on data integrity and clean Actions.       |
| Worker Logic | `backend-specialist`  | Critical path. Must handle concurrency/flapping. |
| Dashboard UI | `frontend-specialist` | Needs "Cyberpunk" aesthetic for Timeline/Status. |

## 5. Next Steps

1. **Approve Schema:** User checks `schema.prisma` proposal.
2. **Execute Phase 1:** Apply DB changes.
3. **Execute Phase 2:** Update Worker logic.
