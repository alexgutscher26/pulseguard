# PulseGuard Comprehensive Roadmap & TODO

> **Philosophy**: PulseGuard is not just a monitoring tool; it's a **Cyberpunk Operational Intelligence Node**. The interface should feel like hacking into a Gibson, but the reliability must be enterprise-grade.

---

## 🛑 P0: Critical Infrastructure & Stability (Immediate)

These items block general reliability or user trust.

### 🔔 Notification Engine (The Voice of the System)

- [ ] **Notification Channels Schema**
  - Create `NotificationChannel` model (Type: `EMAIL`, `DISCORD`, `SLACK`, `WEBHOOK`).
  - Create `AlertRule` model (Conditions: `When status changes to DOWN`, `When latency > 2000ms`).
- [ ] **Worker Alert Logic**
  - Detect state change in `packages/worker/src/index.ts`.
  - Queue `notification` jobs when a monitor goes DOWN.
  - **Rate Limiting**: Prevent "Alert/Resolve" flapping loops (e.g., max 1 alert per 5 mins per monitor).
- [ ] **Email Integration**
  - Integrate Resend or generic SMTP provider.
  - Design valid HTML email templates (Dark mode supported).
- [ ] **Discord/Slack Webhooks**
  - Payload formatting for rich embeds (Color: Red for Down, Green for Up).

### 🛡️ False Positive Prevention

- [ ] **"Double Check" Protocol**
  - If a check fails (Status != 200), **do not write DOWN immediately**.
  - Wait 2 seconds.
  - Retry the check (ideally from a different region, but retry logic is step 1).
  - Only if 2nd check fails -> Mark DOWN.
- [ ] **Timeouts vs. Errors**
  - Differentiate between `Connection Refused` (Service down) vs `Timeout` (Network congestion).
  - Log specific error codes to `MonitorEvent.errorReason`.

### ⚡ Worker Reliability

- [ ] **Dead Letter Queues (DLQ)**
  - Ensure failed jobs in Cloudflare Queues are not lost but moved to a DLQ for manual inspection.
- [ ] **Cloudflare Limits Management**
  - Enhance batch processing to respect the 10ms CPU time on free workers (split batches dynamically).

---

## 🎨 P1: UI/UX - "The Cyberpunk Terminal"

The goal is to wow the user. Think _Tron Legacy_ meets _Mr. Robot_.

### 🖥️ Dashboard 2.0

- [ ] **Live WebSocket Feeds**
  - Replace `useQuery` polling with true WebSockets (Cloudflare Durable Objects usually required, or use `1s` polling for now with visual smoothing).
- [ ] **Data Visualization**
  - **Response Time Chart**: Use `Recharts` for a neon-line area chart showing latency over 24h.
  - **Uptime Heatmap**: GitHub-style contribution graph where blocks are days/hours (Green=100%, Yellow=99%, Red=<90%).
  - **Geomap**: SVG map showing _where_ the request was initiated from (even if currently single region, prepare UI).
- [ ] **Aesthetic Elements**
  - **Scanlines**: CSS overlay with strict pointer-events-none to give CRT texture.
  - **Glitch Text**: On 404 pages or critical errors, use CSS glitch effects.
  - **Sound FX (Optional/Toggleable)**: Subtle "blip" on successful check (User setting: default OFF).

### 📱 Mobile Experience

- [ ] **Responsive Grid**
  - Ensure `MonitorStatsGrid` collapses to 1 column on mobile.
  - Sidebar should be a drawer on mobile.
- [ ] **Touch Targets**
  - Increase size of "Run Check" and "Toggle" buttons for thumb usage.

---

## 🛠️ P2: Advanced Monitoring Features

Expand what PulseGuard can actually guard.

### 🕵️ Advanced Monitors

- [ ] **Keyword Monitor**
  - Input: "Expected String". Logic: Fetch HTML -> Check `body.includes(string)`.
  - Use Case: Detecting if valid content loaded vs blank 200 OK page.
- [ ] **SSL/TLS Sentinel**
  - Check certificate expiry date.
  - Alert: "Certificate expires in 3 days".
- [ ] **TCP/Port Monitor**
  - Verify `connect()` to database ports (5432) or Redis (6379) works.
- [ ] **DNS Watchdog**
  - Check if domain resolves to expected IP.

### 🌐 Public Status Pages

- [ ] **Public Page Generator**
  - Route: `pulseguard.com/status/[slug]`.
  - Config: Allow users to select _which_ monitors appear on their status page.
  - Branding: Allow custom logo/title for Pro users.
- [ ] **Incident History**
  - Manually add "Investigating", "Identified", "Resolved" notes to the status page.

### 🗓️ Maintenance Windows

- [ ] **Scheduled Downtime**
  - Schema: `MaintenanceWindow` (start, end, monitorIds).
  - Logic: Worker checks "Is current time inside maintenance window?" -> If yes, skip alarm logic.

---

## 💰 P3: Monetization & SaaS Features

Preparing for launch.

### 💳 Billing Infrastructure

- [ ] **Stripe Integration**
  - Subscriptions: Free (5 monitors), Pro (50 monitors), Business (Unlimited).
  - Webhooks: Listen for `invoice.payment_failed` to downgrade/pause workspace.
- [ ] **Usage Tracking**
  - Track "Check Runs" per month.
  - Hard limits on free tier (e.g., 5 min interval minimum).

### 👥 Team Collaboration

- [ ] **Organization Support**
  - Users belong to `Workspaces`.
  - Monitors belong to `Workspaces`, not just `Users`.
- [ ] **RBAC (Role-Based Access Control)**
  - `Owner`: Billing + Delete.
  - `Editor`: Edit Monitors.
  - `Viewer`: Read-only.

---

## 📊 P4: Data Engineering & Scalability

Handling millions of pings.

### 🗄️ Database Optimization

- [ ] **Data Aggregation Jobs**
  - **Problem**: `MonitorEvent` grows by 1440 rows/day per monitor (1 min checks).
  - **Solution**: Cron job to compact raw events > 7 days old into `DailySummary` (Avg Latency, Uptime %).
- [ ] **Retention Policy**
  - Free Tier: Keep raw logs 3 days.
  - Pro Tier: Keep raw logs 30 days.
  - Job to `DELETE FROM MonitorEvent` based on policies.
- [ ] **Indexing**
  - Review `@@index([monitorId, timestamp])` for fast range queries.

---

## 📱 P5: Native App (Expo/React Native)

For the admin on the go.

- [ ] **Push Notifications**
  - Implement Expo Push Tokens.
  - Send pushes for DOWN status.
- [ ] **Widget Support**
  - iOS Home Screen widget showing "System Status: 98%".
- [ ] **Biometric Unlock**
  - FaceID/TouchID to open the app (Security).

---

## 🧪 P6: Testing & Quality Assurance

- [ ] **Unit Tests**
  - Refactor Worker logic to be testable without real Fetch.
  - Test Status Transition State Machine (UP->DOWN, DOWN->UP, Flapping).
- [ ] **E2E Tests (Playwright)**
  - Flow: Sign Up -> Create Monitor -> Verify Listing -> Delete Monitor.
- [ ] **Load Testing**
  - Simulate 10,000 active monitors to ensure Cron handler finishes in time.

## 🧹 Refactoring

- [ ] **Shared Core Package**
  - Move `fetch` and `ping` logic to a shared `@pulseguard/core` package so the Web UI can "Test Now" without duplicating Worker logic.
- [ ] **Error Handling**
  - Global Error Boundary in React.
  - Standardized API Error format.
