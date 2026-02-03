# Subscription System Plan

> **Goal**: Add "Subscribe to Updates" functionality to Status Pages with Email, RSS, and Atom feed support.

---

## Overview

Enable visitors of public Status Pages to subscribe to monitor status updates. Subscribers can choose:

- **Email notifications** (major incidents + maintenance only, double opt-in)
- **RSS/Atom feeds** (two variants: incidents-only or all-events)
- **Per-monitor subscriptions** (granular control for large pages)

---

## Project Type

**WEB** - Frontend + Backend changes within existing Next.js monorepo.

---

## Success Criteria

- [ ] "Subscribe to Updates" button visible on public Status Pages
- [ ] Email subscription with double opt-in verification flow
- [ ] RSS and Atom feed endpoints returning valid XML
- [ ] Subscription management page (update preferences, unsubscribe)
- [ ] Per-monitor subscription selection UI
- [ ] Email notifications sent on incident creation/update and maintenance

---

## Tech Stack

| Layer        | Technology                     | Rationale                            |
| ------------ | ------------------------------ | ------------------------------------ |
| **Database** | Prisma (existing)              | Extend `status-page.prisma` schema   |
| **Email**    | Resend (existing)              | Already integrated for notifications |
| **Feeds**    | Native XML generation          | Simple, no external deps needed      |
| **Auth**     | Token-based (unguessable UUID) | For manage/unsubscribe links         |

---

## File Structure

```
packages/db/prisma/schema/
├── status-page.prisma            # UPDATE: Add Subscriber + SubscriptionToken models

apps/web/src/
├── actions/
│   └── subscriptions.ts          # NEW: Server actions for subscribe/unsubscribe
├── app/
│   ├── api/
│   │   └── feeds/
│   │       └── [slug]/
│   │           ├── rss/
│   │           │   └── route.ts          # NEW: RSS feed (incidents-only)
│   │           ├── rss-all/
│   │           │   └── route.ts          # NEW: RSS feed (all events)
│   │           ├── atom/
│   │           │   └── route.ts          # NEW: Atom feed (incidents-only)
│   │           └── atom-all/
│   │               └── route.ts          # NEW: Atom feed (all events)
│   └── [locale]/
│       └── subscribe/
│           ├── [token]/
│           │   └── page.tsx              # NEW: Email verification page
│           └── manage/
│               └── [token]/
│                   └── page.tsx          # NEW: Subscription management page
├── components/
│   └── status-pages/
│       ├── subscribe-modal.tsx           # NEW: Subscribe modal with options
│       ├── monitor-selector.tsx          # NEW: Per-monitor checkbox list
│       └── feed-links.tsx                # NEW: RSS/Atom link buttons
├── lib/
│   └── feeds/
│       ├── rss-generator.ts              # NEW: RSS XML builder
│       └── atom-generator.ts             # NEW: Atom XML builder
└── emails/
    ├── subscription-confirm.tsx          # NEW: Double opt-in email template
    └── status-update.tsx                 # NEW: Incident notification email
```

---

## Task Breakdown

### Phase 1: Database Schema (Agent: `backend-specialist`)

- [x] **Task 1.1**: Add `StatusPageSubscriber` model
  - **INPUT**: Current `status-page.prisma`
  - **OUTPUT**: New model with `email`, `verified`, `preferences`, `token` fields
  - **VERIFY**: `npx prisma validate` passes

- [x] **Task 1.2**: Add `SubscriptionToken` model for verification/manage links
  - **INPUT**: Schema file
  - **OUTPUT**: Token model with `type` (VERIFY | MANAGE), `expiresAt`
  - **VERIFY**: `npx prisma validate` passes

- [x] **Task 1.3**: Add `MonitorSubscription` join table (per-monitor granularity)
  - **INPUT**: Schema file
  - **OUTPUT**: Many-to-many between `StatusPageSubscriber` and `Monitor`
  - **VERIFY**: Run `npx prisma db push` successfully

---

### Phase 2: Subscription Server Actions (Agent: `backend-specialist`)

- [x] **Task 2.1**: Create `subscriptions.ts` with `initiateSubscription()` action
  - **INPUT**: Email, StatusPageId, selected MonitorIds
  - **OUTPUT**: Creates unverified subscriber + sends confirmation email
  - **VERIFY**: Check database for new subscriber row

- [x] **Task 2.2**: Add `verifySubscription()` action
  - **INPUT**: Verification token
  - **OUTPUT**: Sets `verified: true`, redirects to success page
  - **VERIFY**: Subscriber status updates in DB

- [x] **Task 2.3**: Add `updatePreferences()` action
  - **INPUT**: Manage token, new monitor selections
  - **OUTPUT**: Updates `MonitorSubscription` records
  - **VERIFY**: Preferences update correctly

- [x] **Task 2.4**: Add `unsubscribe()` action
  - **INPUT**: Manage token or email+pageId
  - **OUTPUT**: Soft delete or hard delete subscriber
  - **VERIFY**: Subscriber removed from DB

---

### Phase 3: Email Templates (Agent: `frontend-specialist`)

- [x] **Task 3.1**: Create `subscription-confirm.tsx` email template
  - **INPUT**: Subscriber email, verification URL, page title
  - **OUTPUT**: React Email component with cyberpunk styling
  - **VERIFY**: Preview renders correctly

- [x] **Task 3.2**: Create `status-update.tsx` email template
  - **INPUT**: Incident title, status, affected monitors, manage URL
  - **OUTPUT**: Notification email with incident summary
  - **VERIFY**: Preview renders correctly

---

### Phase 4: Feed Generation (Agent: `backend-specialist`)

- [x] **Task 4.1**: Create `rss-generator.ts` utility
  - **INPUT**: Status page data, incidents list
  - **OUTPUT**: Valid RSS 2.0 XML string
  - **VERIFY**: Validate against RSS spec (online validator)

- [x] **Task 4.2**: Create `atom-generator.ts` utility
  - **INPUT**: Status page data, incidents list
  - **OUTPUT**: Valid Atom 1.0 XML string
  - **VERIFY**: Validate against Atom spec

- [x] **Task 4.3**: Create `/api/feeds/[slug]/rss/route.ts` (incidents-only)
  - **INPUT**: Slug param
  - **OUTPUT**: RSS XML response with correct Content-Type
  - **VERIFY**: `curl` returns valid XML

- [x] **Task 4.4**: Create `/api/feeds/[slug]/rss-all/route.ts` (all events)
  - **INPUT**: Slug param
  - **OUTPUT**: RSS with all monitor status changes
  - **VERIFY**: Feed includes recent events

- [x] **Task 4.5**: Create Atom feed routes (mirror RSS logic)
  - **OUTPUT**: `/atom` and `/atom-all` endpoints
  - **VERIFY**: Both return valid Atom XML

---

### Phase 5: UI Components (Agent: `frontend-specialist`)

- [x] **Task 5.1**: Create `SubscribeModal` component
  - **INPUT**: Status page ID, monitors list
  - **OUTPUT**: Modal with email input + monitor checkboxes + feed links
  - **VERIFY**: Modal opens/closes, form submits

- [x] **Task 5.2**: Create `MonitorSelector` component
  - **INPUT**: Monitors array, selected IDs
  - **OUTPUT**: Checkbox list with "Select All" toggle
  - **VERIFY**: Selection state updates correctly

- [x] **Task 5.3**: Create `FeedLinks` component
  - **INPUT**: Page slug
  - **OUTPUT**: RSS/Atom icon buttons with copy-to-clipboard
  - **VERIFY**: Links are correct, copy works

- [x] **Task 5.4**: Update `PublicView` to integrate Subscribe button
  - **INPUT**: Current "Get Updates" button (line 119-121)
  - **OUTPUT**: Opens `SubscribeModal` on click
  - **VERIFY**: Modal appears when clicked

---

### Phase 6: Subscription Pages (Agent: `frontend-specialist`)

- [x] **Task 6.1**: Create verification page `/subscribe/[token]`
  - **INPUT**: Token from URL
  - **OUTPUT**: Success/error message, auto-verify on load
  - **VERIFY**: Visiting valid token verifies subscription

- [x] **Task 6.2**: Create management page `/subscribe/manage/[token]`
  - **INPUT**: Manage token from URL
  - **OUTPUT**: Form to update monitor selections or unsubscribe
  - **VERIFY**: Changes save correctly

---

### Phase 7: Notification Integration (Agent: `backend-specialist`)

- [x] **Task 7.1**: Update `notification-handler.ts` in worker
  - **INPUT**: Current notification logic
  - **OUTPUT**: Add logic to find subscribers for affected monitor -> send email
  - **VERIFY**: Simulated incident triggers email to subscriber

- [x] **Task 7.2**: Final Polish & Testing
  - **INPUT**: Review all flows
  - **OUTPUT**: Ensure unsubscribe link works, emails look good
  - **VERIFY**: Full E2E manual test pass

---

## Phase X: Verification Checklist

- [ ] **Lint**: `npm run lint` passes
- [ ] **Types**: `npx tsc --noEmit` passes
- [ ] **Build**: `npm run build` completes
- [ ] **Security**: No API tokens exposed, tokens are unguessable UUIDs
- [ ] **RSS Validation**: Feeds validate at https://validator.w3.org/feed/
- [ ] **GDPR**: Double opt-in implemented, unsubscribe works
- [ ] **Manual Test**: Full subscribe → verify → receive update → unsubscribe flow

---

## Risks & Mitigations

| Risk                   | Mitigation                                |
| ---------------------- | ----------------------------------------- |
| Email deliverability   | Use Resend with verified domain           |
| Token brute-force      | Use 32-char random tokens + rate limiting |
| Feed spam/abuse        | Rate limit feed endpoints                 |
| Large subscriber lists | Batch email sending (queue-based)         |

---

## Notes

- Existing "Get Updates" button in `public-view.tsx` (line 119) is currently non-functional → will become the Subscribe trigger
- Per-monitor subscriptions require a join table, not just a JSON array, for efficient querying
- Atom feeds are preferred by some RSS readers; providing both maximizes compatibility
- Consider adding webhook subscription type in future iteration

---

## Estimated Effort

| Phase           | Tasks  | Estimated Time |
| --------------- | ------ | -------------- |
| 1: Schema       | 3      | 30 min         |
| 2: Actions      | 4      | 1 hour         |
| 3: Emails       | 2      | 45 min         |
| 4: Feeds        | 5      | 1.5 hours      |
| 5: UI           | 4      | 1.5 hours      |
| 6: Pages        | 2      | 45 min         |
| 7: Integration  | 2      | 1 hour         |
| X: Verification | -      | 30 min         |
| **Total**       | **22** | **~7-8 hours** |
