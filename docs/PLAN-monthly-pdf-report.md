# Plan: Monthly PDF Report Automation

## Overview

Automate the generation and delivery of monthly performance reports to managers. This system will run on a Cloudflare Worker CRON schedule, calculate key metrics for the previous month, generate a professional PDF using React components, and email it as an attachment.

## Success Criteria

- [ ] **Automated Trigger**: Runs automatically on the 1st of every month at 9 AM UTC.
- [ ] **PDF Generation**: Creates a visually compliant PDF on the Edge (no puppeteer).
- [ ] **Data Accuracy**: Correctly aggregates "Last Month" data (e.g., Jan 1 - Jan 31).
- [ ] **Delivery**: Emails are successfully delivered with the PDF attached.

## Tech Stack

- **Runtime**: Cloudflare Workers (Edge compatible)
- **PDF Engine**: `@react-pdf/renderer` (Pure JS, lightweight, works on Edge)
- **Email**: `resend` (via `@pulseguard/email` package)
- **Database**: Prisma (aggregated queries)

## File Structure

```text
packages/
  email/
    src/
      templates/
        MonthlyReport.tsx      # React-PDF Layout
apps/
  worker/
    src/
      schedules/
        monthlyReport.ts       # Cron Handler
      services/
        reportGenerator.ts     # Data -> PDF logic
        analyticsService.ts    # DB Aggregation logic
```

## Task Breakdown

### Phase 1: Foundation & Data

- [x] **Task 1: Analytics Aggregation Service**
  - **Goal**: Create a service to fetch "previous month" stats.
  - **Input**: Date range (Start of month, End of month).
  - **Output**: JSON object `{ globalUptime, totalIncidents, avgResponseTime, criticalEvents[] }`.
  - **Verify**: Unit test with mock data ensures correct averaging logic.

### Phase 2: PDF Template (React-PDF)

- [x] **Task 2: Install Dependencies**
  - **Action**: Add `@react-pdf/renderer` to `@pulseguard/email` or `@pulseguard/worker` (recommend `email` package for reuse).
  - **Verify**: Package installs without peer dependency warnings.
  - _Note_: `@react-pdf/renderer` sometimes requires polyfills for Node/Buffer in specific envs; verify in Worker.

- [x] **Task 3: Create PDF Component**
  - **Goal**: Build `MonthlyReportDocument` component.
  - **Details**: Header with Logo, Stats Grid (Uptime, Incidents, Latency), formatted Incident List table.
  - **Verify**: Render to a local file stream to visually inspect layout.

### Phase 3: Worker Integration

- [x] **Task 4: Report Generator Service**
  - **Goal**: Glue code. Fetch Data (Task 1) -> Render PDF (Task 3) -> Return Buffer.
  - **Verify**: Service returns a valid `Buffer` or `Uint8Array`.

- [x] **Task 5: Email Attachment Logic**
  - **Goal**: Update `@pulseguard/email` send function to support attachments if not already present, or use `resend` directly in the worker for this specific blast.
  - **Verify**: Send test email with dummy PDF.

- [x] **Task 6: Cron Schedule Handler**
  - **Goal**: Create `monthlyReport.ts` scheduled handler.
  - **Logic**:
    - Check if `event.cron` matches "0 9 1 \* \*" (1st of month, 9 AM).
    - Fetch all admins/managers (Project Plan: Filter by `User.role === 'ADMIN'`).
    - Generate PDF (once, logic permitting, or per team if multi-tenant).
    - Send emails.
  - **Verify**: Trigger manually via `wrangler` to test flow.

## Phase X: Verification

- [ ] **Manual Trigger Test**: Run `wrangler dev --test-scheduled` and trigger the specific cron.
- [ ] **PDF Visual Check**: Verify fonts, images, and layout on the generated PDF.
- [ ] **Data Check**: Compare PDF stats against Dashboard stats for the same period.
