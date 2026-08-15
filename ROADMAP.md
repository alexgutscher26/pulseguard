# PulseGuard Public Roadmap 🗺️

> Our vision: **Edge-native, zero-false-positive operational intelligence for modern infrastructure.**
> We believe in radical transparency, zero vendor lock-in, and treating self-hosters as first-class citizens.

---

## 🎯 How We Prioritize

1. **Reliability over Features**: A monitoring system must never generate false alerts or crash under load.
2. **Edge-First Architecture**: Compute checks at the edge closest to your users (7 sovereign regions).
3. **Zero Lock-In**: Complete data export, Prometheus/Blackbox compatibility, and 1-command migrations.
4. **Self-Hosters as Distribution**: If you self-host, you get the exact same engine that powers our cloud.

---

## 🚀 Roadmap Overview

```
┌─────────────────────────┐   ┌─────────────────────────┐   ┌─────────────────────────┐
│       NOW (Q3 2026)     │   │      NEXT (Q4 2026)     │   │     FUTURE (2027+)      │
│  In Active Development  │──▶│     Planned & Scoped    │──▶│     Under Research      │
│                         │   │                         │   │                         │
│ • Quorum Consensus v2   │   │ • Synthetic Journeys    │   │ • Embedded Air-Gap DO   │
│ • Uptime Kuma Importer  │   │ • OTel Remote-Write     │   │ • Global P2P Probe Mesh │
│ • Helm DaemonSet Probe  │   │ • Org Multi-Tenant RBAC │   │ • Autonomous BGP Anomaly│
└─────────────────────────┘   └─────────────────────────┘   └─────────────────────────┘
```

---

## 🟢 Shipped & Active Features

- [x] **7-Region Sovereign Edge Probes**: Pinned execution across North America (`wnam`, `enam`), Europe (`weur`, `eeur`), and Asia-Pacific (`apac`, `apac-ne`, `apac-se`).
- [x] **4-of-7 Quorum Consensus Voting Engine**: Majority multi-region consensus before declaring global outages; eliminate localized ISP false alarms.
- [x] **Team Management & Organization RBAC**: Multi-tenant organizations, team invitations, member management, and granular role permissions (`Owner`, `Admin`, `Member`, `Viewer`).
- [x] **Comprehensive SLA Report Exports (PDF, JSON, Web)**: Automated monthly uptime and downtime accounting, contractual SLA breach detection, and downloadable branded PDF/JSON reports.
- [x] **PagerDuty & Multi-Channel Alerting**: Direct PagerDuty routing integration, interactive Slack blocks, Discord rich embeds, Telegram, SMS, Email (React Email), and custom Webhooks.
- [x] **One-Command Uptime Kuma Importer**:
  - CLI: `pulse import kuma backup.json`
  - Web: Instant drag-and-drop backup import with live dry-run preview table.
- [x] **WASM Payload Assertions**: Rust-compiled WebAssembly regex and JSONPath assertions running in <1ms on Cloudflare Workers.
- [ ] **Kubernetes Helm Chart Probe DaemonSet**: Native Helm chart for deploying internal private probe agents across Kubernetes clusters with automatic token registration.
- [ ] **Automated Incident Runbook Actions**: Trigger webhooks or serverless repair jobs automatically when specific alert thresholds are reached.

---

## 🟡 Next (Q4 2026 — Planned & Scoped)

- [ ] **Multi-Step Synthetic Browser Journeys**:
  - Declarative YAML/JSON browser test runner (login flows, cart checkout, token exchanges).
  - Headless Chromium execution with visual step-by-step failure screenshot diffs.
- [ ] **OpenTelemetry (OTel) Native Ingestion**:
  - Accept OpenTelemetry metrics, traces, and logs directly into PulseGuard edge receivers.
  - Prometheus remote-write compatibility (`/api/v1/write`).
- [ ] **SAML 2.0 & Enterprise SSO**:
  - Okta, Google Workspace, Azure AD, and Keycloak single sign-on for organization accounts.
- [ ] **Automated Incident Post-Mortem Synthesis**:
  - AI-assisted root cause analysis synthesizing timeline events, response headers, and traceroute logs into clean markdown post-mortems.

---

## 🟣 Future (2027+ — Under Research & Exploration)

- [ ] **Air-Gapped Single-Binary Mode**:
  - Compile the Durable Object + Miniflare engine into a standalone Rust binary for completely offline, sovereign military/banking deployments.
- [ ] **Autonomous BGP & Anycast Routing Sentinel**:
  - Real-time global BGP routing table anomaly detection and DNS hijacking alerts.
- [ ] **Global Peer-to-Peer Probe Mesh**:
  - Distributed mutual verification network allowing self-hosters to cross-verify uptime across thousands of independent developer nodes.

---

## 💡 Have an Idea?

We shape this roadmap based on community feedback.

- Vote on upcoming features or pitch new ideas in [GitHub Discussions → Ideas](https://github.com/alexgutscher26/pulseguard/discussions/categories/ideas).
- Report bugs via [GitHub Issues](https://github.com/alexgutscher26/pulseguard/issues).
- Want to contribute? Check our [`good first issue`](https://github.com/alexgutscher26/pulseguard/labels/good%20first%20issue) label in [CONTRIBUTING.md](./CONTRIBUTING.md).
