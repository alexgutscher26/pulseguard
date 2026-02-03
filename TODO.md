# PulseGuard Comprehensive Roadmap & TODO

> **Philosophy**: PulseGuard is not just a monitoring tool; it's a **Cyberpunk Operational Intelligence Node**. The interface should feel like hacking into a Gibson, but the reliability must be enterprise-grade.

---

## 🛑 P0: Critical Infrastructure & Stability (Immediate)

These items block general reliability or user trust.

### 🔔 Notification Engine (The Voice of the System)

- [x] **Notification Channels Schema**
  - Create `NotificationChannel` model (Type: `EMAIL`, `DISCORD`, `SLACK`, `WEBHOOK`, `TELEGRAM`, `SMS`).
  - Create `AlertRule` model (Conditions: `When status changes to DOWN`, `When latency > 2000ms`, `When certificate expires < 7 days`).
- [x] **Worker Alert Logic**
  - Detect state change in `apps/worker/src/index.ts`.
  - Queue `notification` jobs when a monitor goes DOWN.
  - **Rate Limiting**: Prevent "Alert/Resolve" flapping loops (e.g., max 1 alert per 5 mins per monitor).
- [x] **Email Integration**
  - Integrate Resend or generic SMTP provider.
  - Design valid HTML email templates (Dark mode supported, Cyberpunk accents).
- [x] **Discord/Slack Webhooks**
  - Payload formatting for rich embeds (Color: Red for Down, Green for Up).
  - Include "View in PulseGuard" button.
- [x] **Incident Management (Core)**
  - Create `Incident` model linked to Monitors.
  - Auto-create Incident on DOWN alert.
  - Allow manual status updates (Investigating, Identified, Monitoring, Resolved).
  - Broadcast updates to all Notification Channels.

### 🛡️ False Positive Prevention

- [x] **"Double Check" Protocol**
  - If a check fails (Status != 200), **do not write DOWN immediately**.
  - Wait 2 seconds.
  - Retry the check.
  - Only if 2nd check fails -> Mark DOWN.
- [x] **Timeouts vs. Errors**
  - Differentiate between `Connection Refused` (Service down) vs `Timeout` (Network congestion).
  - Log specific error codes to `MonitorEvent.errorReason`.

### ⚡ Worker Reliability

- [x] **Dead Letter Queues (DLQ)**
  - Ensure failed jobs in Cloudflare Queues are not lost but moved to a DLQ for manual inspection.
- [x] **Cloudflare Limits Management**
  - Enhance batch processing to respect the 10ms CPU time on free workers (split batches dynamically).
- [x] **Circuit Breaker**
  - If a monitor fails consistently for > 1 hour, reduce check frequency to save resources until it recovers.

---

## 🎨 P1: UI/UX - "The Cyberpunk Terminal"

The goal is to wow the user. Think _Tron Legacy_ meets _Mr. Robot_.

### 🖥️ Dashboard 2.0

- [x] **Live WebSocket Feeds**
  - Replace `useQuery` polling with true WebSockets (Cloudflare Durable Objects or Pusher).
  - Show real-time "ping" animations on the dashboard.
- [x] **Data Visualization**
  - **Response Time Chart**: Use `Recharts` for a neon-line area chart showing latency over 24h.
  - **Uptime Heatmap**: GitHub-style contribution graph where blocks are days/hours (Green=100%, Yellow=99%, Red=<90%).
  - **Geomap**: SVG map showing _where_ the request was initiated from.
- [x] **Aesthetic Elements**
  - **Scanlines**: CSS overlay with strict pointer-events-none to give CRT texture.
  - **Glitch Text**: On 404 pages or critical errors, use CSS glitch effects.
  - **Sound FX (Toggleable)**: Subtle "blip" on successful check, "alarm" sound on critical failure.
  - **Theme Switcher**: "Matrix Green", "Cyberpunk Pink", "Blade Runner Orange".

### ⌨️ Power User Features

- [x] **Command Palette (Cmd+K)**
  - Quick navigation: "Go to Monitor X", "Create New Monitor", "View Incidents".
  - Actions: "Acknowledge all alerts".
- [x] **Keyboard Shortcuts**
  - `j/k` to navigate monitor list.
  - `/` to search.
  - `c` to create monitor.

### 📱 Mobile Experience

- [x] **Responsive Grid**
  - Ensure `MonitorStatsGrid` collapses to 1 column on mobile.
  - Sidebar should be a drawer on mobile.
- [x] **Touch Targets**
  - Increase size of "Run Check" and "Toggle" buttons for thumb usage.

### 📱 Mobile Enhancements (Nice to Have)

- [ ] **Swipe-to-close gesture** for drawer
- [ ] **Haptic feedback** on mobile devices
- [ ] **Additional touch target optimizations** for form elements
- [ ] **Mobile-specific header condensing**
- [ ] **Mobile optimization improvements** (currently works but could be better)

### � Advanced UI Features (Post-MVP)

- [ ] **Command Palette Enhancements**:
  - Recent commands history
  - Command aliases ("new monitor" → "Create HTTP Monitor")
  - Fuzzy search
  - Command history navigation (↑↓ in empty search)
  - Custom user-defined shortcuts
  - AI-powered command suggestions
- [ ] **Advanced Visualizations**:
  - D3.js heatmap visualization
  - WebGL rendering for 100+ regions
  - Global map visualization
  - Region comparison view
  - Custom region grouping
- [ ] **Data Export**:
  - Export to CSV/PNG
  - Latency SLA tracking
  - Correlation analysis
- [ ] **Dashboard Customization**:
  - Multi-monitor comparison
  - Custom dashboards
  - Real-time anomaly detection visualization

---

## �🛠️ P2: Advanced Monitoring Features

Expand what PulseGuard can actually guard.

### 🕵️ Advanced Monitors

- [ ] **Keyword Monitor**
  - Input: "Expected String" or "Forbidden String".
  - Logic: Fetch HTML -> Check `body.includes(string)`.
  - Use Case: Detecting if valid content loaded vs blank 200 OK page.
- [ ] **SSL/TLS Sentinel**
  - Check certificate expiry date, issuer, and validity.
  - Alert: "Certificate expires in 30/14/7/3/1 days".
- [ ] **TCP/Port Monitor**
  - Verify `connect()` to database ports (5432) or Redis (6379) works.
- [ ] **DNS Watchdog**
  - Check if domain resolves to expected IP.
  - Detect DNS propagation issues.
- [ ] **Domain Expiration Guard**
  - **Whois/RDAP Logic**: Fetch domain registry data to track `Expiration Date`.
  - **Alert Schedule**: Notify 30, 14, 7, and 1 day before expiration to prevent loss.
  - **Dashboard**: Display graphical "Days Remaining" countdown.
  - **Status Checks**: Alert on `serverHold`, `clientHold`, or `pendingDelete` statuses.
- [ ] **Heartbeat / Cron Monitor**
  - "Inverse" monitoring. Provide a unique webhook URL.
  - User's backup job calls the URL.
  - Alert if URL _not_ called within X timeframe.
- [x] **Multi-Region Monitoring (Global Pulse)**
  - **User Requirement**: "Is my site down in Tokyo vs New York?"
  - **Implementation**:
    - ✅ Allow users to select specific check regions.
    - ✅ Regional check execution in Worker.
    - ✅ Store regional performance data.
    - ✅ Display regional uptime statistics.
    - **Note**: Free tier uses sequential checks. For true multi-region, upgrade to Durable Objects or paid plan.

### 🔄 Multi-Region Enhancements

**True Multi-Region (Paid)**:

- [ ] Implement Durable Objects for guaranteed regional execution
- [ ] Use Cloudflare Load Balancer for advanced routing
- [ ] Predictive latency alerts (ML-based)

---

## 📢 P3: Status Pages & Incident Management

Public-facing transparency for users.

### 🌐 Status Pages

- [x] **Public & Private Status Pages**
  - Route: `status.pulseguard.com/[slug]` or Custom Domain (CNAME).
  - **Private Pages**: Password protection, SSO-based access, or IP Whitelisting.
  - **SEO Control**: Toggle `robots.txt` to index/no-index status pages.
  - **Granular Visibility**: Toggle display of Uptime %, Response Time Charts, specific URLs, or "Paused" monitors.
  - Branding: Custom Logo, Favicon, CSS overrides.
- [x] **Status Page Analytics**
  - Text: "Who is checking my status?"
  - Integration: Google Analytics, Plausible, or minimal built-in view counter.
- [x] **Global Audience (i18n)**
  - Auto-translate status page based on browser locale.
  - Support manual language toggle for status page visitors.
- [x] **Incident History & Widgets**
  - Show active incidents, planned maintenance timelines, and historical uptime.
  - **Embeddable Status Widget**: JS snippet to show "All Systems Operational" on user's own website.
- [x] **Subscription System**
  - 'Subscribe to Updates' button on Status Pages.
  - Support Email, RSS, and Atom feeds.

### 📝 Incident Response

- [ ] **Incident Templates**
  - Pre-written updates for common issues ("Investigating Connectivity Issues", "Scheduled Maintenance").
- [ ] **Post-Mortems**
  - Generate a Markdown report after incident resolution.

---

## 🔌 P4: Integrations & Notifications

Connect PulseGuard to the world.

### 🤖 Chat & Voice

- [ ] **Telegram Bot**
  - Start a chat with `@PulseGuardBot` to get alerts.
  - Telegram messages are a great way how to stay alerted.
- [ ] **SMS & Voice Call**
  - Twilio/Vonage integration for critical P0 alerts (wake up call).
- [ ] **Matrix / Rocket.Chat**
  - Support open-source chat protocols.
- [ ] **Mattermost**
  - Get status update on your Mattermost.
- [ ] **MS Teams**
  - Get notifications inside your MS Teams app to alert everyone in the group.

### 🏢 DevOps Tools

- [ ] **PagerDuty / Opsgenie**
  - Bidirectional sync (Ack in PagerDuty -> Ack in PulseGuard).
  - Send up & down events and auto-resolve your incidents in PagerDuty.
- [ ] **Linear / Jira**
  - Auto-create tickets when downtime > X minutes.

### 📢 Webhooks

- [ ] **Custom Webhooks**
  - Support Handlebars/Mustache templates for payload customization.
  - "Test Webhook" button.
  - For advanced alerting you can setup webhooks to your own system or app.

---

## 📊 P5: Data & Analytics

Turn logs into insights.

### 🗄️ Database Optimization

- [ ] **Data Aggregation Jobs**
  - **Problem**: `MonitorEvent` grows by 1440 rows/day per monitor.
  - **Solution**: Cron job to compact raw events > 7 days old into `DailySummary`.
- [ ] **Retention Policy**
  - Free Tier: Keep raw logs 3 days.
  - Pro Tier: Keep raw logs 30 days.
  - Job to `DELETE FROM MonitorEvent` based on policies.

### 📈 Reporting

- [ ] **SLA Reports**
  - Calculate exact uptime (99.95%, 99.99%) per week/month.
- [ ] **Monthly PDF Report**
  - Auto-generate and email a PDF summary for managers.
- [ ] **Export Data**
  - CSV / JSON export of raw logs for audit compliance.

---

## 🛡️ P6: Security & Team

Enterprise-grade controls.

### 🔐 Security

- [ ] **2FA / MFA**
  - TOTP (Google Authenticator) support.
- [ ] **Audit Logs**
  - Track who created/deleted monitors, who changed status page settings.
- [ ] **API Access Tokens**
  - Create Scoped API Keys (Read-only, Write-only) for CI/CD integration.
- [ ] **Email Verification**
  - Add email verification to BetterAuth registration flow
  - Create tRPC mutation for sending welcome emails
  - Add email preferences UI in settings
  - Ensure no PII in logs

### 👥 Team Collaboration

- [ ] **Organization Support**
  - Users belong to `Workspaces`.
  - Monitors belong to `Workspaces`.
- [ ] **RBAC (Role-Based Access Control)**
  - `Owner`: Billing + Delete.
  - `Admin`: Edit settings.
  - `Editor`: Edit Monitors.
  - `Viewer`: Read-only.

---

## 💻 P7: Developer Experience

- [ ] **CLI Tool**
  - `npm i -g pulseguard-cli`
  - `pulse monitor list`, `pulse check <url>`.
- [ ] **Public API**
  - Documented REST API with Swagger/OpenAPI.
- [ ] **Terraform Provider**
  - Manage PulseGuard monitors via Infrastructure as Code (IaC).
- [ ] **Backend API Enhancements**
  - Monitor pause/resume endpoints
  - Monitor deletion endpoints
  - Bulk monitor actions endpoints

---

## 💰 P8: Monetization & SaaS Features

Preparing for launch.

### 💳 Billing Infrastructure

- [ ] **Stripe Integration**
  - Subscriptions: Free (5 monitors), Pro (50 monitors), Business (Unlimited).
  - Webhooks: Listen for `invoice.payment_failed` to downgrade/pause workspace.
- [ ] **Add-ons & Upsells**
  - **Full White Label**: +$200/month.
    - Removes "Powered by PulseGuard".
    - Full custom domain & CSS control.
  - **Status Pages (Pro/Business)**:
    - Base: 1 Status Page included in Pro? (User specified +$20/mo/each).
    - Add-on: +$20/month per status page.
    - Bundle: 5 pages for $100/mo ($20/each).
- [ ] **Usage Tracking**
  - Track "Check Runs" per month.
  - Hard limits on free tier.

---

## 📱 P9: Native App (Expo/React Native)

For the admin on the go.

- [ ] **Push Notifications**
  - Implement Expo Push Tokens.
  - Send pushes for DOWN status.
- [ ] **Widget Support**
  - iOS Home Screen widget showing "System Status: 98%".
- [ ] **Biometric Unlock**
  - FaceID/TouchID to open the app (Security).
- [ ] **WatchOS App**
  - Quick status view on Apple Watch.

---

## 🧪 P10: Testing & Quality Assurance

- [ ] **Unit Tests**
  - Refactor Worker logic to be testable without real Fetch.
  - Test Status Transition State Machine.
- [ ] **E2E Tests (Playwright)**
  - Flow: Sign Up -> Create Monitor -> Verify Listing -> Delete Monitor.
- [ ] **Load Testing**
  - Simulate 10,000 active monitors to ensure Cron handler finishes in time.

---

## 🧹 P11: Refactoring & Code Quality

- [ ] **Shared Core Package**
  - Move `fetch` and `ping` logic to a shared `@pulseguard/core` package.
- [ ] **Error Handling**
  - Global Error Boundary in React.
  - Standardized API Error format.

---

## 🚀 P12: Indie Dev Focus (Key Differentiators)

Strategies to win the indie developer market against established giants.

### 💎 Key Areas to Improve

- [ ] **Generous Free Tier Strategy**
  - Offer unlimited monitors with frequent checks (e.g., 1-minute) to beat UptimeRobot (50 monitors, 5-min checks).
  - Focus on volume of users over immediate monetization.
- [ ] **Zero-Code Integration**
  - One-click connection to Vercel, Netlify, and GitHub projects.
  - Auto-import projects as monitors.
- [ ] **Automated Incident Communication**
  - "Set and Forget" mode: Auto-update status page and blast notifications (Slack/Discord) upon confirmed downtime.
  - Reduce manual overhead for solo founders.
- [ ] **Developer-Centric Analytics**
  - Go beyond simple uptime. Provide "Root Cause Hints" (e.g., "DNS failed", "SSL Handshake Error", "Timeout vs Reset").
  - Performance trend analysis.
- [ ] **Deep Branding (White Label)**
  - Custom domains, CSS injection for status pages, and logo replacement.
  - Make the status page look native to the indie dev's brand.
- [ ] **Community & Templates**
  - "Cloneable" monitoring setups for popular stacks (e.g., "The Next.js Bundle", "The Supabase Bundle").
  - Community repository of status page themes.
- [ ] **No Vendor Lock-In Guarantee**
  - One-click "Export All" (Config + Data) to JSON/CSV.
  - Explicit "Easy Exit" promise to build trust.

### 💡 Innovative Features for Indie Devs

- [ ] **Side Project Health Checks**
  - Specialized "Cron Job" monitors for scheduled tasks (backups, email digests).
  - "Low Traffic" mode for dormant side projects.
- [ ] **Status Page as Marketing**
  - Changelog feed integration.
  - "Request Feature" or "Feedback" widgets directly on the status page.
  - Show "System Reliability" as a sales badge.
- [ ] **Extreme Simplicity & Performance**
  - UI loads in < 500ms.
  - Minimal resource usage client-side.
- [ ] **Privacy-First Intelligence**
  - Option to make analytics public or strictly private.
  - Transparent data retention policies.

---

## 🧠 P13: AI Empowerment Layer (Invisible & Low-Friction)

Bolt on AI in focused places: anomaly detection, smarter alerts, and "explain what went wrong" helpers.

### 🤖 Concrete AI Features

- [ ] **Adaptive Anomaly Detection**
  - Learn "normal" latency/error rates per endpoint.
  - Alert on deviations (e.g., 3x higher latency) instead of static thresholds.
- [ ] **Predictive Downtime Warnings**
  - Forecast slowdowns based on historical traffic/incidents.
  - Nudge devs _before_ users are affected.
- [ ] **Incident Summarization (LLM)**
  - Auto-generate plain-language summaries ("Deployment X caused latency spike").
  - Link to key logs/traces.
- [ ] **Smart Alert Routing**
  - Group related errors (e.g., 10 failures from 1 deploy = 1 alert).
  - Prevent notification spam during outages.
- [ ] **Log Anomaly Insights**
  - Surface new error types or unusual stack traces automatically.

### 🏗️ Data & Tech Stack

- [ ] **Data Pipeline**
  - Store Time-series metrics (Latency, Error Rate).
  - Track Events (Deploys, Config Changes).
  - Structured Logs (for ML analysis).
- [ ] **Minimal AI Stack**
  - **Anomaly**: Managed Time-series API (or simple z-score model).
  - **LLM Helpers**: Call LLM for summaries and remediation steps only.
  - **Hybrid Logic**: Combine static rules (5xx > 10%) with ML scores.

### 🎨 Indie-Dev UX

- [ ] **"Don't Wake Me" Profiles**
  - Set sleep hours; only alert if severity score is Critical (e.g., Payment failure).
- [ ] **Plain-English Timelines**
  - Replace complex charts with narrative: "09:02 Deploy -> 09:04 Latency Doubled".
- [ ] **Actionable Suggestions**
  - Buttons: "Mute Check", "Auto-create Runbook", "Add Alert Rule".

### 📅 AI Phasing Plan

- [ ] **Phase 1 (Weekend)**
  - Simple baseline anomaly model (latency/uptime).
  - LLM summary for incidents > X mins.
- [ ] **Phase 2**
  - Correlate anomalies with Deploy Events.
  - Implement Quiet Hours & Severity Scoring.
- [ ] **Phase 3**
  - Predictive hints ("Sunday deploys fail often").
  - Auto-generated runbooks from repeated incidents.

---

## 🧲 P14: Growth Engines (SEO Magnets)

High-value, free utilities to drive SEO traffic and capture developer leads.

### 🛠️ Requested Tools

- [ ] **IP Subnet Calculator**
  - CIDR to IP range conversion.
  - Visualization of subnet masks.
- [ ] **MX Record Lookup**
  - Verify mail server configurations (SPF/DKIM/DMARC analysis).
  - Instant deliverability score.
- [ ] **Uptime & Downtime Calculator**
  - SLA Translator: "What does 99.999% mean in minutes per year?"
  - Marketing hook: "See how much downtime costs you."
- [ ] **Cron Expression Generator**
  - Natural language to Cron syntax (e.g., "Every weekday at 5 PM").
  - Explanation of complex cron strings.
- [ ] **Website Change Detector**
  - Visual diff tool for web pages.
  - Alert on specific HTML element changes.

### 🚀 PulseGuard Exclusive Tools

- [ ] **Global Latency Checker**
  - "Ping my site from 10 cities instantly."
  - Showcase PulseGuard's multi-region capability.
- [ ] **SSL/TLS Health Check**
  - Visualize certificate chain and expiry.
  - Check for legacy protocols (TLS 1.0/1.1).
- [ ] **Port Forwarding Tester**
  - Simple check: "Is port 25565 open?" (Gamers/Home labbers).
- [ ] **Regex Tester for Monitoring**
  - Sandbox for testing "Keyword Monitor" regular expressions against real HTML.

---

## 🐛 Known Issues & Technical Debt

### Current Issues

- [ ] **RegionalDetailModal** is a placeholder (needs full implementation)
- [ ] **Mobile optimization** (currently works but could be improved)

### Future Considerations

- [ ] Consider adding **D3.js** for advanced visualizations (optional enhancement)
- [ ] Add **export functionality** (CSV/PNG) - future enhancement
- [ ] Evaluate **WebGL rendering** for large-scale visualizations

---

## � Notes

- All completed features are marked with [x]
- Priority levels (P0-P14) indicate implementation order
- Items without checkboxes are informational or context
- See README.md for current implemented features
