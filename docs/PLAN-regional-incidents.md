# Plan: Regional Incident Tracking

Implement threshold-based alerting and per-region incident tracking for multi-region monitors. This ensures that transient failures in a single region don't trigger global alerts unless a specific threshold of failures is met.

## 🎯 Success Criteria

- [ ] Users can configure an **Alert Threshold** (number of regions) for each monitor.
- [ ] Individual regional failures create **Regional Incidents** (distinct from Main Incidents).
- [ ] A **Main Incident** (and subsequent alerts) is only triggered when the number of failing regions reaches the configured threshold.
- [ ] Main Incidents are automatically resolved as soon as the failure count drops below the threshold.
- [ ] Regional Incidents are tracked and resolved independently in the database.

## 🏗️ Tech Stack

- **Database**: Prisma with separate `RegionalIncident` table.
- **Worker**: Cloudflare Worker with updated status aggregation logic.
- **Frontend**: Next.js (App Router) with updated Monitor Form and Incident History.

## 📂 File Structure Changes

- `packages/db/prisma/schema/incident.prisma`: Add `RegionalIncident` model.
- `packages/db/prisma/schema/schema.prisma`: Add `alertThreshold` to `Monitor` model.
- `apps/worker/src/index.ts`: Update incident management loop.
- `apps/worker/src/lib/incident-service.ts`: Add methods for regional incident management.
- `apps/web/src/components/monitors/monitor-form.tsx`: Add threshold configuration.
- `apps/web/src/actions/monitors.ts`: Update validation/server actions for `alertThreshold`.

## 📝 Task Breakdown

### Phase 1: Database & Schema

- **Task 1.1**: Update `Monitor` model in `schema.prisma`.
  - Add `alertThreshold Int @default(1)`.
  - **Verification**: Run `npx prisma validate`.
- **Task 1.2**: Create `RegionalIncident` model in `incident.prisma`.
  - Fields: `id`, `monitorId`, `region`, `status`, `startedAt`, `resolvedAt`.
  - Relation to `Monitor`.
  - **Verification**: Run `npx prisma generate`.

### Phase 2: Worker Engine (Core Logic)

- **Task 2.1**: Update `IncidentService` in `apps/worker/src/lib/incident-service.ts`.
  - Add `findActiveRegionalIncident(monitorId, region)`.
  - Add `createRegionalIncident(monitorId, region)`.
  - Add `resolveRegionalIncident(incidentId)`.
  - **Verification**: Type check passes.
- **Task 2.2**: Update `processBatch` in `apps/worker/src/index.ts`.
  - Refactor the regional check loop to manage `RegionalIncident` records for every failing/recovered region.
  - Calculate `failedCount` and compare against `monitor.alertThreshold`.
  - Trigger/Resolve Main `Incident` strictly based on threshold.
  - **Verification**: Log check results to ensure threshold logic works.

### Phase 3: Dashboard UI & Configuration

- **Task 3.1**: Update `MonitorForm` in `apps/web/src/components/monitors/monitor-form.tsx`.
  - Add "Alert Threshold" input (numeric) under regional selection.
  - **Verification**: UI reflects new field.
- **Task 3.2**: Update Server Actions in `apps/web/src/actions/monitors.ts`.
  - Update Zod schema and Prisma calls to include `alertThreshold`.
  - **Verification**: Saving a monitor with threshold 2 updates the DB correctly.
- **Task 3.3**: Update `IncidentHistory` in `apps/web/src/components/monitors/details/incident-history.tsx`.
  - (Optional but recommended) Display regional incidents or group them under the main incident.
  - **Verification**: Dashboard shows region-specific downtime items.

## 🏁 Phase X: Verification Checklist

- [ ] **Threshold Test**: Set threshold to 2, fail 1 region -> Verify NO main incident/alert.
- [ ] **Alert Test**: Set threshold to 2, fail 2 regions -> Verify Main Incident created + Alert sent.
- [ ] **Auto-Resolve Test**: Threshold 2, 2 regions down, 1 recovers -> Verify Main Incident resolves immediately.
- [ ] **Individual Tracking**: Verify `RegionalIncident` table is populated correctly per region.
- [ ] **Lint & Build**: `bun run lint` and `bun run build`.
