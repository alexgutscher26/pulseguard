# Project Plan: Synthetic Browser Testing

This document defines the tasks, file modifications, and verification gates for implementing edge-rendered Puppeteer checks in Cloudflare Workers.

## Success Criteria
- [ ] Add `BROWSER` enum value to `MonitorType` database schema.
- [ ] Implement declarative Puppeteer runner in Cloudflare Worker.
- [ ] Add step configuration builder UI in the monitor setup form.
- [ ] Support on-demand browser checks from the Next.js frontend by delegating to the Worker API.
- [ ] Uptime, latency, and events for `BROWSER` type checks are accurately stored in PostgreSQL.

## Tech Stack
- **Edge Runtime**: Cloudflare Workers + Wrangler v4.
- **Automation**: `@cloudflare/puppeteer` connecting to Cloudflare Browser Rendering service.
- **Database**: Prisma client + PostgreSQL (Supabase).
- **Frontend**: Next.js 16 + React 19, Tailwind CSS.

## File Structure
- `packages/db/prisma/schema/schema.prisma` (Modify)
- `apps/worker/package.json` (Modify)
- `apps/worker/wrangler.jsonc` (Modify)
- `apps/worker/src/lib/browser-runner.ts` (New)
- `apps/worker/src/index.ts` (Modify)
- `apps/web/src/actions/monitors.ts` (Modify)
- `apps/web/src/components/monitors/monitor-form.tsx` (Modify)

---

## Task Breakdown

### Task 1: Database Schema Expansion
- **Agent**: `database-architect`
- **Skills**: `database-design`
- **INPUT**: Current `schema.prisma` files.
- **OUTPUT**: Updated schemas with `BROWSER` type and `script` string field.
- **VERIFY**: `bun run db:generate` compiles successfully with no types mismatch.

### Task 2: Worker Environment Integration
- **Agent**: `devops-engineer`
- **Skills**: `deployment-procedures`
- **INPUT**: `wrangler.jsonc` and `package.json` in `apps/worker`.
- **OUTPUT**: Puppeteer library installed, browser binding added to config.
- **VERIFY**: Worker builds with type checks passing.

### Task 3: Edge Puppeteer Runner
- **Agent**: `qa-automation-engineer`
- **Skills**: `webapp-testing`
- **INPUT**: New `browser-runner.ts` file path.
- **OUTPUT**: Declarative step evaluator that launches Puppeteer and runs assertions.
- **VERIFY**: Unit checks or dry-run test execution runs successfully.

### Task 4: Worker API Endpoint & Routing
- **Agent**: `backend-specialist`
- **Skills**: `api-patterns`
- **INPUT**: `apps/worker/src/index.ts` routing.
- **OUTPUT**: `/api/check-now` route which handles on-demand execution.
- **VERIFY**: Sending POST request to endpoint initiates browser run and returns JSON.

### Task 5: Server Actions Upgrades
- **Agent**: `backend-specialist`
- **Skills**: `api-patterns`
- **INPUT**: Zod schemas in `apps/web/src/actions/monitors.ts`.
- **OUTPUT**: Validation schemas updated; custom delegation for `BROWSER` manual checks.
- **VERIFY**: Call `checkMonitor` with BROWSER monitor ID triggers the Worker call.

### Task 6: Frontend Step Builder UI
- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`
- **INPUT**: `monitor-form.tsx` in Next.js app.
- **OUTPUT**: Visual steps editor (GOTO, CLICK, FILL, ASSERT) that compiles JSON array script.
- **VERIFY**: Submitting a BROWSER type monitor stores the steps array correctly.

---

## Phase X: Verification Checklist

- [ ] `checklist.py` validation checks pass.
- [ ] No purple/violet color hex codes added.
- [ ] Next.js production build completes successfully: `npm run build`
- [ ] Manual test creation and run of a browser monitor works locally.
