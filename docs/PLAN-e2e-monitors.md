# Plan: E2E Testing Suite Implementation

> **Objective**: Implement a robust E2E testing suite using Playwright to cover critical user flows: Sign Up → Create Monitor → Verify Listing → Delete Monitor.

## 1. Architecture & Strategy

- **Location**: `apps/e2e` (New Package)
  - _Rationale_: Decouples testing from `apps/web` code, allowing full-stack verification (Web + Worker + DB).
- **Framework**: Playwright
- **Database Strategy**:
  - Use a dedicated test database URL (e.g., `postgres://.../pulseguard_test`).
  - Implement a `global-setup.ts` to seed/reset the database before runs.
- **Auth Strategy**:
  - Implement a helper to programmatically create users or bypass auth via session cookies if possible.
  - For the "Sign Up" test, test the UI flow directly.

## 2. Implementation Steps

### Phase 1: Scaffolding (`apps/e2e`) @frontend-specialist

- [ ] Create `apps/e2e` directory and `package.json`.
- [ ] Install `@playwright/test` and types.
- [ ] Configure `playwright.config.ts`:
  - [ ] Base URL: `http://localhost:3000` (or `http://localhost:3001` if strictly dev).
  - [ ] Projects: Chromium, Firefox, WebKit.
- [ ] Add `test:e2e` script to root `package.json` (using turbo to run deps).

### Phase 2: Test Infrastructure @backend-specialist

- [ ] Create `apps/e2e/lib/db.ts`: Direct Prisma client for test setup/teardown.
- [ ] Create `apps/e2e/global-setup.ts`:
  - Check (or create) a test user account.
  - Clean up previous test runs (e.g., delete monitors created by the test user).

### Phase 3: Auth Flow Test (`auth.spec.ts`)

- [ ] **Test Case 1: New User Sign Up**
  - Go to `/register`.
  - Fill form (Name, Email, Password).
  - Submit.
  - Verify redirect to Dashboard.
  - Verify DB record created (optional, or trust UI).

### Phase 4: Monitor CRUD Flow (`monitors.spec.ts`)

- [ ] **Prerequisite**: Login as test user (use `beforeEach` or `storageState`).
- [ ] **Test Case 1: Create Monitor**
  - Click "New Monitor".
  - Select Type: "HTTP".
  - Name: "E2E Test Monitor".
  - URL: `https://example.com`.
  - Save.
  - Verify success toast/message.
- [ ] **Test Case 2: Verify Listing**
  - Ensure user is on Dashboard/Monitors list.
  - Assert "E2E Test Monitor" is visible.
  - Assert status is "Pending" or "Up" (if worker runs).
- [ ] **Test Case 3: Delete Monitor**
  - Click "Delete" action on the monitor.
  - Confirm modal (if exists).
  - Verify monitor is removed from list.

### Phase 5: CI/CD Integration @devops

- [ ] Add `test` job to GitHub Actions workflow.
- [ ] Configure Github Action to:
  - Docker up (DB).
  - `bun install`.
  - `bun run build`.
  - `bun run test:e2e`.

## 3. Verification Checklist

- [ ] `bun run test:e2e` passes locally.
- [ ] Tests use a separate DB or cleanup cleanly (idempotent).
- [ ] Screenshots/Video recording on failure is enabled.
