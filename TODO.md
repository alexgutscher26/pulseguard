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
- [ ] **Multi-Vector Verification**
  - If Region A reports DOWN, attempt a ping from Region B before confirming DOWN state globally.
- [ ] **Dynamic Thresholding**
  - Automatically adjust timeout limits based on historical average latency for a specific monitor.

### ⚡ Worker Reliability & Performance

- [x] **Dead Letter Queues (DLQ)**
  - Ensure failed jobs in Cloudflare Queues are not lost but moved to a DLQ for manual inspection.
- [x] **Cloudflare Limits Management**
  - Enhance batch processing to respect the 10ms CPU time on free workers (split batches dynamically).
- [x] **Circuit Breaker**
  - If a monitor fails consistently for > 1 hour, reduce check frequency to save resources until it recovers.
- [ ] **Connection Pooling Resiliency**
  - Implement a fallback datastore (e.g., Redis layer) if the primary database (Neon/Supabase) connection pool is exhausted during a massive failover event.
- [ ] **Worker Scaling & Sharding**
  - Map monitors to specific worker shards by ID hash to evenly distribute load and prevent "thundering herd" problems when cron triggers thousands of checks simultaneously.
- [ ] **DNS Fallback Strategy**
  - Cache recent IP addresses for monitors in a KV store if primary DNS resolution fails, distinguishing between application downtime and actual DNS failure.

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
  - **Theme Switcher**: "Matrix Green", "Cyberpunk Pink", "Blade Runner Orange", "High-Contrast Terminal".
- [ ] **Advanced Visual Dashboards**
  - **Drag & Drop Layouts**: Allow users to configure their own monitor grid, resizing charts for focus.
  - **Terminal-Only Mode**: A UI mode that mimics a pure CLI inside the browser. Users type commands or watch a log stream instead of GUI widgets.
  - **3D Network Visualization**: Use Three.js for a rotating globe showing real-time ping lasers across regions.

### ⌨️ Power User Features

- [x] **Command Palette (Cmd+K)**
  - Quick navigation: "Go to Monitor X", "Create New Monitor", "View Incidents".
  - Actions: "Acknowledge all alerts".
- [x] **Keyboard Shortcuts**
  - `j/k` to navigate monitor list.
  - `/` to search.
  - `c` to create monitor.
- [ ] **Command Palette Enhancements**:
  - Recent commands history & AI-powered command suggestions based on user context.
  - Command aliases ("new monitor" → "Create HTTP Monitor").
  - Fuzzy search spanning across documentation, monitors, and incidents.

### 📱 Mobile Experience

- [x] **Responsive Grid**
  - Ensure `MonitorStatsGrid` collapses to 1 column on mobile.
  - Sidebar should be a drawer on mobile.
- [x] **Touch Targets**
  - Increase size of "Run Check" and "Toggle" buttons for thumb usage.
- [ ] **Swipe-to-close gesture** for drawer.
- [ ] **Haptic feedback** on mobile devices (via browser vibration API where supported).
- [ ] **PWA Support**: Installable Progressive Web App with off-line cached views of the latest dashboard state.

---

## 🛠️ P2: Advanced Monitoring Features

Expand what PulseGuard can actually guard. 

### 🕵️ Core Advanced Monitors

- [ ] **Keyword & Payload Monitor**
  - Input: "Expected String" or "Forbidden String".
  - Logic: Fetch HTML -> Check `body.includes(string)`.
  - JSON Path Extraction: Verify specific JSON keys/values match assertions (e.g., `$.status === "healthy"`).
- [ ] **SSL/TLS Sentinel**
  - Check certificate expiry date, issuer, and validity.
  - Alert: "Certificate expires in 30/14/7/3/1 days". Include checks for legacy protocols (TLS 1.0/1.1 deprecation warnings).
- [ ] **TCP/Port Monitor**
  - Verify `connect()` to database ports (5432) or Redis (6379) works via lightweight TCP ping.
- [ ] **DNS Watchdog**
  - Check if domain resolves to expected IP. Detect DNS propagation anomalies.
- [ ] **Domain Expiration Guard**
  - Fetch WHOIS/RDAP data. Alert on `serverHold`, `clientHold`, or `pendingDelete` statuses.
- [ ] **Heartbeat / Cron Monitor (Push Monitoring)**
  - "Inverse" monitoring. Provide a unique webhook URL. Alert if URL _not_ called within user-defined timeframe. Useful for backup job verifications.

### 🧪 API & Synthetic Monitors (Pro/Business)

- [ ] **Synthetic Browser Testing**
  - Run actual headless Playwright/Puppeteer instances in edge workers. Verify heavy SPA load behaviors and interactive elements.
- [ ] **Multi-Step API Sequence Check**
  - Chain requests: Login & extract JWT token -> Fetch protected data route -> Assert data -> Logout.
- [ ] **GraphQL Introspection Monitor**
  - Continually query specific GraphQL mutations/queries and validate typed schema returns.
- [ ] **gRPC & WebSocket Stream Monitor**
  - Maintain a live WebSocket connection or gRPC stream for X seconds and assert message payload rate.
- [ ] **Database Direct Query Monitor**
  - Run a lightweight `SELECT 1` or measure specific slow query execution times across Postgres, MySQL, or MongoDB directly.

### 🌍 Multi-Region Capabilities

- [x] **Multi-Region Monitoring (Global Pulse)**
  - Stores regional performance data and executes checks from selected origins.
- [ ] **True Concurrent Global Ping (Paid)**
  - Implement Cloudflare Durable Objects to guarantee simultaneously fired checks from exactly 5/10/20 requested global datacenters.
- [ ] **BGP Route Monitoring**
  - Detect BGP leaks or route hijacking affecting user traffic routing to the monitored endpoints.

---

## 📢 P3: Status Pages & Incident Management

Public-facing transparency for users and internal collaboration for teams.

### 🌐 Status Pages

- [x] **Public & Private Status Pages**
  - Route: `status.pulseguard.com/[slug]` or Custom Domain (CNAME).
  - Private Pages: Password protection, SS0-based access, IP Whitelisting.
- [ ] **Multi-Tenant Status Pages**
  - Allow B2B SaaS users to render isolated status pages for *their* individual clients, showing only relevant service parts.
- [ ] **Deep Aesthetic Injection**
  - Allow users to inject custom CSS/JS for fully white-labeled page rendering. 
- [x] **Global Audience (i18n)**
  - Auto-translate status page based on browser locale.
- [x] **Subscription System**
  - Support Email, RSS, and Atom feeds.
- [ ] **SLA Customer Portal**
  - A secure view where clients can log in to generate official SLA performance reports for billing discussions.

### 📝 Incident Response

- [x] **Incident Templates**
  - Pre-written updates for common issues ("Investigating", "Monitoring", "Resolved").
- [ ] **Automated Runbook Linkage**
  - Attach predefined Confluence or Markdown runbooks depending on which monitor failed, presenting immediate remediation steps to the responding dev.
- [ ] **Post-Mortem Collaboration Board**
  - Rich text editor with timeline integration. Auto-populate timeline events from ping logs during the downtime window.

---

## 🔌 P4: Integrations & Notifications

Connect PulseGuard natively to the entire DevOps toolchain.

### 🤖 Chat & Voice

- [ ] **Telegram Bot**
  - Start a chat with `@PulseGuardBot`.
- [ ] **SMS & Voice Call (Critical Escalations)**
  - Twilio/Vonage integration for P0 alerts (wake up calls with text-to-speech incident details).
- [ ] **Matrix / Rocket.Chat / Mattermost**
  - Support open-source and self-hosted chat protocols.
- [ ] **Microsoft Teams & Discord Rich Bots**
  - Interactive cards inside chat where users can "Acknowledge" the incident directly from the IM client.

### 🏢 Enterprise DevOps Tools

- [ ] **PagerDuty / Opsgenie / Splunk On-Call**
  - Bidirectional sync: Ack in PagerDuty -> Auto-Ack in PulseGuard. Auto-resolve upon recovery.
- [ ] **Linear / Jira / GitHub Issues**
  - Auto-create priority tickets when downtime exceeds customizable thresholds.
- [ ] **ServiceNow / Datadog Native Integrations**
  - Forward metrics directly into existing enterprise SIEMs.

### 📢 Webhooks & Automations

- [ ] **Custom Templated Webhooks**
  - Support Handlebars/Mustache templates to shape outgoing JSON payloads precisely to the target's expectations.
- [ ] **Webhook Retry Policies**
  - Implement exponential backoff if the user's receiver endpoint is also down.
- [ ] **Zapier / Make.com / n8n Apps**
  - Publish official integrations for low-code automation workflows.

---

## 📊 P5: Data & Analytics

Turn raw logs into operational intelligence.

### 🗄️ Database Optimization

- [x] **Data Aggregation Jobs**
  - Cron job to compact raw events > 7 days old into `DailySummary`.
- [ ] **Time-Series Engine Migration**
  - Shift raw ping metrics from Postgres to ClickHouse or InfluxDB for massive scale analytic querying at dashboard render time.
- [ ] **Tiered Retention Policies (S3 Glacier)**
  - Archive 1+ year old compliance data automatically into cheap cold storage.

### 📈 Reporting & Trends

- [x] **SLA & Uptime Reports**
  - Calculate exact uptime (99.95%, 99.99%) per timeframe.
- [x] **Monthly PDF Summary Reports**
  - Auto-generate branded, styled PDFs for managerial review.
- [ ] **Performance Regression Analysis**
  - "Your API is 15% slower this week compared to last week."
- [ ] **Grafana Integration**
  - Publish an official Grafana Data Source plugin pointing to PulseGuard APIs.

---

## 🛡️ P6: Security & Team

Enterprise-grade controls to pass strict compliance reviews.

### 🔐 Security & Compliance

- [ ] **2FA / MFA / Passkeys**
  - WebAuthn and TOTP support for user accounts.
- [ ] **SSO for Enterprise (SAML / OIDC)**
  - Active Directory, Okta, and Google Workspace integrations.
- [ ] **Session & Token Management**
  - Remote logout capabilities, API key scoping (Read vs Write vs Admin), IP whitelisting per token.
- [ ] **Immutable Audit Trails**
  - Track who created/deleted monitors, updated status pages, or modified billing. Ready for SOC2 evidence.

### 👥 Team Collaboration

- [ ] **RBAC (Role-Based Access Control)**
  - `Owner`, `Admin`, `Editor` (Monitors only), `Viewer`, `Billing Manager`.
- [ ] **Workspace Segregation**
  - Allow one user to belong to multiple organizations seamlessly.
- [ ] **On-Call Schedules & Escalation Policies**
  - Built-in lightweight scheduling: Send to Person A first, wait 5 mins, escalate to Person B, wait 10 mins, alert entire Slack channel.

---

## 💻 P7: Developer Experience

Made for developers, by developers.

- [ ] **Official CLI Tool (`pulseguard-cli`)**
  - Commands: `pulse monitor ls`, `pulse trigger <id>`, `pulse logs tail`.
- [ ] **Terraform & Pulumi Providers**
  - Manage PulseGuard architecture purely as code (IaC) alongside the rest of the stack.
- [ ] **Language SDKs**
  - Publish official typed libraries for Node.js, Python, Go, and Rust.
- [ ] **CI/CD Integrations (GitHub Actions, Vercel, Netlify)**
  - Automatically create a transient monitor for ephemeral PR preview environments. Destroy monitor when PR merges. 

---

## 💰 P8: Monetization & SaaS Features

Preparing for sustainable revenue and scale.

### 💳 Pricing Strategy & Tiers (Focus: Margin over Volume)

- [ ] **Tier 1: The Initiate (Free / Hobbyist)**
  - Gateway tier for indie hackers. Better than competitors to capture market share.
  - Specs: 50 nodes, 3-min checks, single-region, 3-day retention.
  - Value: Faster checks (3m vs 5m) gets them to install on day 1. "Powered by PulseGuard" status pages act as referral engines.
- [ ] **Tier 2: The Netrunner ($14/mo - Pro / Indie Founder)**
  - For solo founders who don't want to look unprofessional and hate false alarms.
  - Specs: 200 nodes, 30-second checks, multi-region verification, custom domains, 30-day retention.
  - Value: Custom branding and the "Invisible AI" layer that saves time (Adaptive Anomaly Detection, predictive warnings).
- [ ] **Tier 3: The Construct ($69/mo - Business / Team)**
  - Enterprise-grade reliability without corporate bore. Agency goldmine.
  - Specs: Unlimited nodes (fair use), 10-second checks, concurrent global pulse, 1-year retention.
  - Value: RBAC, workspaces (separate client statuses for agencies), SSO, PagerDuty/Linear integration, AI-runbooks.

### 💳 Billing Infrastructure

- [ ] **Stripe Advanced Integrations**
  - Subscriptions mapping to Initiate, Netrunner, and Construct tiers.
  - Invoice history UI and self-serve tier upgrading/downgrading.
- [ ] **Automated Retention Flows**
  - "Cancel with offer" logic. If a user tries to leave, offer a 3-month discount automatically to retain them.
---

## 📱 P9: Native App & Wearables

For the on-call admin who is living their life.

- [ ] **Native iOS/Android App (React Native/Expo)**
  - Fully offline-capable UI using cached state. Quick ack gestures and biometric locking (FaceID).
- [ ] **Push Notification Deep Linking**
  - Tapping an alert immediately opens the relevant Incident runbook inside the app.
- [ ] **Ecosystem Integrations**
  - Apple Watch / WearOS complications (quick glance uptime %).
  - iOS/Android Home Screen widgets.
  - Siri / Google Assistant / Alexa integration: "Hey Siri, are my servers healthy right now?"

---

## 🧪 P10: Testing, QA & Chaos Engineering

- [x] **E2E Tests (Playwright)**
  - Core flows: Sign Up -> Monitor creation -> Report viewing.
- [ ] **Load & Stress Testing**
  - Simulate 50,000 active monitors and 2,000 simultaneous state-change events to ensure event handlers don't queue bloat.
- [ ] **Chaos Engineering Protocol**
  - Randomly kill edge worker instances in staging to verify DLQ and Retry mechanisms operate flawlessly without data loss.
- [ ] **Continuous Performance CI**
  - Run Lighthouse scoring automatically on all PRs to ensure the Dashboard does not degrade in Core Web Vitals.
- [ ] **Visual Regression Testing**
  - Ensure UI modifications do not subtly break mobile layout rendering.

---

## 🧹 P11: Refactoring & Code Quality

- [ ] **Strict Monorepo Boundaries**
  - Optimize Turborepo / NX configurations for faster incremental builds and stricter dependency boundaries between `app/` and `packages/`.
- [ ] **WebAssembly (WASM) Parsers**
  - Migrate heavy regex/payload parsing components inside the Worker to Rust-compiled WASM for significantly reduced CPU time.
- [ ] **Shared Core Logic Packages**
  - Extract universal `@pulseguard/core` (fetch, ping algorithms) and `@pulseguard/types` out of web/worker limits for clean DRY architecture.
- [ ] **Strict TS & No-Any Policy**
  - Incrementally enable highest level TS strictness and ban temporary `any` casts.

---

## 🚀 P12: Indie Dev Focus & OpenStatus Killer (Differentiators)

Strategies to win the indie developer market against established giants and modern competitors like OpenStatus. Focus on simplicity, affordability, and specific indie pain points.

### ⚔️ Beating OpenStatus (Feature Differentiators)
- [ ] **Zero-Code Integration**: Make it effortless. 1-click setups for GitHub, Vercel, and Netlify.
- [ ] **Built-in Incident Communication**: Automate status page updates and cross-channel notifications (Slack/Discord) reducing manual panic for solo devs.
- [ ] **Developer-Friendly Analytics**: Provide actionable insights instead of raw data. Tell them *where* the request died.
- [ ] **No Vendor Lock-In**: Provide a guaranteed 1-click Export/Migration tool to eliminate the fear of SaaS entrapment.

### 💡 Innovative Indie Features
- [ ] **Automated Health Checks for Side Projects**: Specialized cron-job and heartbeat monitoring for the dormant projects that pay the bills.
- [ ] **Status Page as a Marketing Tool**: Integrate changelogs, feature request boards, and feedback loops directly into the status page.
- [ ] **Lightweight & Fast**: Highly optimized performance to respect the minimal bandwidth and compute resources of indie stacks.
- [ ] **Privacy-First Intelligence**: Emphasize transparency for developers protective of their uptime metrics.

### 📊 Competitive Comparison (PulseGuard vs OpenStatus)
| Feature | OpenStatus | PulseGuard (Indie Focus) |
| :--- | :--- | :--- |
| **Check Interval** | 1-5 minutes | 1-minute (Initiate) / 30-sec (Netrunner) |
| **Setup Complexity**| Medium | One-click Integrations |
| **Status Page Branding**| Custom Domains | Full Cyberpunk Aesthetic Control |
| **Incident Comm.** | Manual Slack / Email | Fully Automated + Templates |
| **Analytics & Insights**| Basic | Actionable, AI-assisted |
| **Community & Templates**| Basic | Extensive (1-click Stack Imports) |
| **Export & Migration**| Possible | Effortless 1-click JSON |

### 🚀 Marketing Strategy: "Stop Monitor Hoarding, Start Monitoring Smarter"
Because the Free Tier is limited (50 monitors/3m), we market **Quality, Aesthetics, and Intelligence.** We are the premium tool with a generous trial.

- [ ] **"The Stack" Templates (Community Marketing)**
  - Create one-click templates (e.g. "The Perfect Next.js Monitoring Setup"). Don't sell "monitoring", sell "1-click peace of mind for your specific stack."
  - Share these templates organically on Dev.to, r/NextJS, and r/Supabase.
- [ ] **"Better Than Industry Standard" Comparisons**
  - Explicitly attack the standard 5-minute Free Tier of competitors.
  - "5 minutes is too long. PulseGuard gives you 3-minute checks for free." Show visual timelines to prove the point.
- [ ] **The "Ugly Status Page" Nudge (Gentle Shaming)**
  - Intentionally clearly brand the free status pages. Then inside the app: "Your page is getting traffic! Upgrade so your customers don't see our ads."
- [ ] **Market "Sleep Mode" (The AI Feature Hook)**
  - Solo devs hate waking up at 3 AM for false alarms. Sell the $14 Netrunner plan as "The Sleep Plan."
  - "PulseGuard filters out 2-second blips. If we call you, it's real."
- [ ] **Guerrilla Operations**
  - Build a showcase directory of beautifully designed "Cyberpunk" Pro status pages (users love showing off).
  - "Roast My Stack" threads: Ask users for URLs, run manual checks, and reply with custom PulseGuard reports showing TTFB and error rates.

---

## 🧠 P13: AI Empowerment Layer (Invisible & Low-Friction)

Bolt on AI in highly focused, deterministic places without adding hallucination risk to core metrics. Keep it invisible and low-friction—no flashy chatbots.

### 🤖 Invisible AI & Implementation

- [ ] **Simple Baseline Anomaly Logic (No ML needed yet)**
  - Ingest checks into a `monitor_checks` table with (ts, region, status, latency_ms, http_code).
  - Run a CRON job (every 5-10m) checking the last X hours for the same weekday. Compute average + standard deviation.
  - Trigger "Anomaly Warning" if `current_latency > avg_latency + 3*std_latency`.
- [ ] **LLM Helpers - Incident Summarization**
  - Trigger ONLY on incident transitions (down > X mins).
  - Send the last 20 checks + deploy timestamps to an LLM.
  - Prompt: "Explain in 2 short sentences for an indie dev; suggest 1 specific action." 
  - Result: "Checkout API timing out from EU for 9 minutes after a deploy; roll back or check DB connectivity."
- [ ] **LLM Helpers - Status Page Generator**
  - A dashboard toggle that auto-generates customer-friendly public status updates ("Elevated errors on API. Fix deploying.") from internal technical summaries.
- [ ] **Smart Alert Routing & Tuning Advice**
  - Prioritize grouped alerts (10 errors from 1 deploy = 1 alert).
  - Offer LLM suggestions for "flapping" monitors: "This monitor flaps. We suggest increasing timeout or reducing frequency."
- [ ] **Indie-Dev Specific UX**
  - **"Don't wake me for this" Profiles**: Set sleep hours. Only break through for critical severity scores (e.g. payment/signup failures).
  - **Plain-English Timelines**: Replace charts with "09:02 Deploy -> 09:04 Latency Doubled".
  - **Actionable Buttons**: "Mute check", "Auto-create runbook", instead of complicated graphs.

### 📅 AI Rollout Phasing

- [ ] **Phase 1 (The Baseline)**
  - Build anomaly detection on uptime/latency with a simple std-dev baseline model. Add LLM summary triggering on "down > X mins".
- [ ] **Phase 2 (Correlation & UX)**
  - Correlate anomalies with Deploy Events/Config changes. Implement "Quiet Hours + Severity Scoring".
- [ ] **Phase 3 (Predictive Analytics)**
  - Predictive hints ("Endpoint often fails after Sunday deploys; try a canary?"). AI-generated runbooks based on recurring incidents.

---

## 🧲 P14: Growth Engines (SEO Magnets)

High-value, free utilities to drive SEO traffic, built on PulseGuard's core tech.

- [ ] **IP Subnet Calculator**
- [ ] **MX & DNS Record Lookup Analyzer** (SPF/DKIM/DMARC health score)
- [ ] **Cron Expression Generator & Debugger**
- [ ] **Regex Tester specifically for HTML payload monitoring**
- [ ] **HTTP Headers & Security Analyzer**
- [ ] **Visual Website Diff Tool**
- [x] **Global Latency Checker**
- [x] **SSL/TLS Health Check Visualizer**
- [x] **Port Forwarding Tester**

---

## 🧩 P15: PulseGuard Ecosystem (Extensions & Bridges)

- [ ] **Browser Extensions (Chrome, Firefox, Safari)**
  - "Add to PulseGuard" button in the browser toolbar instantly converts the active tab into a monitored endpoint.
- [ ] **VS Code Extension**
  - See live status of the services you are coding against directly in the IDE status bar.
- [ ] **Slack/Discord "Internal" Viewers**
  - Mini-apps living entirely inside the communication tool, enabling full status interaction without opening the browser dashboard.

---

## 🏆 P16: User Gamification & Engagement

Encourage better infrastructure practices through gentle positive reinforcement.

- [ ] **Reliability Achievements**
  - Unlock badges like "Iron Clad" (100% Uptime for 30 days) or "Quick Draw" (Resolved an incident in under 5 minutes).
- [ ] **Weekly Infrastructure Health Score**
  - Gamified summary emails visually comparing this week's stability and average response time to last week's.
- [ ] **Community Leaderboards / "Powered By" Hall of Fame**
  - Feature indie-hackers with top-tier SLAs in marketing showcases.

---

## 🌍 P17: Open Source Strategy & Community

Building an ecosystem that outlasts the core product.

- [ ] **Open Source Core Edition**
  - Extract the pure ping/store/alert baseline into a fully capable, self-hostable Docker container. Treat Cloud version as the "Enterprise / No-Hassle" implementation.
- [ ] **Public Plugin Architecture**
  - Allow the community to write custom Monitor Types (e.g. "Monitor my specific Minecraft Server Protocol" or "Check my Ethereum node block height").
- [ ] **Bug Bounty & Security Program**
  - Establish responsible disclosure guidelines and offer bounties for critical vulnerabilities found by community researchers. 

---

## 🐛 Known Issues & Technical Debt

### Current Issues

- [x] **RegionalDetailModal** is a placeholder (needs full implementation)
- [x] **Mobile optimization** (currently works but could be improved dynamically)

### Future Considerations

- [ ] Thoroughly evaluate **WebGL rendering** for massive-scale mapping visualizations if regions scale past 50 points of presence.
- [ ] Continuous auditing of Cloudflare Worker CPU limits, keeping an eye on V8 isolate spin-up times for the websocket handler.

---

## 📝 Notes

- All completed features are marked with `[x]`.
- Priority levels indicate general implementation order but focus may shift based on user metrics and requests.
- Items without checkboxes provide context, philosophy, or architectural reasoning.
- Refer to `README.md` for currently deployed feature sets and architecture layout.
