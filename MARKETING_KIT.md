# SteadyStack — Marketing Assets & Launch Distribution Kit

> **Official Positioning Hook**: _"Know the second your stack breaks."_  
> **Category**: Developer Tools / DevOps / Synthetic Uptime Monitoring / Cloud Infrastructure  
> **Website**: `https://steadystack.dev` (or self-hosted)  
> **Repository**: `https://github.com/getsteadystack/SteadyStack`

---

## 🎨 1. Visual Brand Assets & File Map

| Asset                                | Location / Public URL                                                                                                                                                   | Dimensions          | Purpose                                                    |
| :----------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------ | :--------------------------------------------------------- |
| **Brand Icon (SVG)**                 | [`apps/web/public/icon.svg`](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/public/icon.svg)                                                               | Scalable Vector     | App icon, tab icons, mobile bookmarks                      |
| **Brand Full Logo (SVG)**            | [`apps/web/public/logo.svg`](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/public/logo.svg)                                                               | Scalable Vector     | Header, navigation, docs, press kits                       |
| **Favicon (SVG)**                    | [`apps/web/public/favicon.svg`](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/public/favicon.svg)                                                         | 32x32 Vector        | Browser tab favicon                                        |
| **Favicon (Multi ICO)**              | [`apps/web/public/favicon.ico`](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/public/favicon.ico)                                                         | 16/32/48 Multi      | Legacy browser fallback                                    |
| **Square Avatar / Thumbnail**        | [`apps/web/public/marketing/ph-thumbnail-240x240.jpg`](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/public/marketing/ph-thumbnail-240x240.jpg)           | 240x240 / 512x512   | Product Hunt thumbnail, Twitter profile, Directory avatars |
| **OpenGraph Banner**                 | [`apps/web/public/og-image.png`](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/public/og-image.png)                                                       | 1200x630            | Social link unfurling (Twitter, LinkedIn, Slack, Discord)  |
| **PH Gallery Slide 1: Hero**         | [`apps/web/public/marketing/ph-gallery-1-hero.jpg`](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/public/marketing/ph-gallery-1-hero.jpg)                 | 1270x760 (16:9)     | "Know the second your stack breaks" Hero slide             |
| **PH Gallery Slide 2: Quorum**       | [`apps/web/public/marketing/ph-gallery-2-quorum.jpg`](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/public/marketing/ph-gallery-2-quorum.jpg)             | 1270x760 (16:9)     | Multi-Region Edge Quorum (Zero False Positives)            |
| **PH Gallery Slide 3: Status Pages** | [`apps/web/public/marketing/ph-gallery-3-status-pages.jpg`](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/public/marketing/ph-gallery-3-status-pages.jpg) | 1270x760 (16:9)     | Branded Public Status Pages & Multi-Channel Alerting       |
| **Social / GitHub Header**           | [`apps/web/public/marketing/social-header-banner.jpg`](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/public/marketing/social-header-banner.jpg)           | 1500x500 / 1280x640 | Twitter / X header & GitHub repo social preview            |
| **Web App Manifest**                 | [`apps/web/public/site.webmanifest`](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/public/site.webmanifest)                                               | JSON Config         | PWA install & Android metadata                             |

---

## 🏷️ 2. Core Elevator Pitches (Character Counted)

### Ultra-Short Tagline (≤ 60 chars)

```text
Know the second your stack breaks with edge synthetic checks.
```

_(59 characters)_

### Short Pitch (≤ 100 chars)

```text
Edge-native synthetic uptime monitoring that confirms outages across regions with zero false alarms.
```

_(99 characters)_

### Medium Pitch (≤ 250 chars)

```text
SteadyStack is an open-source, edge-native synthetic monitoring platform. It runs 60-second multi-region quorum checks, generates branded status pages, and alerts you via Slack, Discord, SMS, and Webhooks before users notice downtime.
```

_(243 characters)_

### Standard Elevator Pitch (≤ 500 chars)

```text
Most uptime monitors ping from a single data center, spamming on-call engineers with false alarms whenever a transient network hop jitters. SteadyStack solves this at the edge: 7-region distributed quorum verification confirms genuine outages in milliseconds before waking your team. Enjoy 60s checks, custom-domain public status pages, SSL expiry warnings, cron heartbeats, and full REST/CLI automation — without hostage pricing.
```

_(444 characters)_

### Full Long Description (Markdown for Directories)

```markdown
SteadyStack is the next-generation, edge-native synthetic uptime monitoring and observability platform built for modern engineering teams and self-hosters.

### Key Features:
- 🌐 **Multi-Region Quorum Verification**: Synthetic checks execute across 7 global edge regions simultaneously. Outages require multi-node consensus (4-of-7 quorum) before triggering an incident, eliminating false positives from transient regional routing anomalies.
- ⚡ **Sub-Minute Synthetic Probes**: HTTP/HTTPS, SSL certificate validation, DNS resolution, TCP ports, and background cron heartbeats.
- 🎨 **Branded Public Status Pages**: Host status pages on your custom domain (`status.yourdomain.com`) with incident timelines, subscriber notifications, and sleek dark/light themes.
- 🔔 **Multi-Channel Alert Routing**: Instant escalation via Slack, Discord, PagerDuty, Webhooks, SMS, and Email.
- 🛠️ **Developer-First Architecture**: Full REST API, tRPC endpoints, Docker probe agent for private VPC monitoring, and native CLI tooling.
- 💸 **Fair Commercial Free Tier**: Generous 60-second checks and unlimited public status pages without punitive upgrade walls.
```

---

## 🚀 3. Product Hunt Launch Submission Pack

### Title

```text
SteadyStack
```

### Tagline (≤ 60 chars)

```text
Know the second your stack breaks: Edge synthetic monitoring
```

### Pricing Model

- Free tier available (Commercial-friendly)
- Self-hostable & Cloud Hosted

### Topics & Tags

`Developer Tools`, `Open Source`, `DevOps`, `Tech`, `SaaS`, `Monitoring`, `Productivity`

### Maker Comment (Post immediately upon launch)

```markdown
Hey Product Hunt! 👋

I'm thrilled to introduce **SteadyStack** — the edge-native synthetic monitoring platform built to end false alarm fatigue once and for all.

### Why we built SteadyStack:
If you've managed production apps, you've experienced this: you get woken up at 3:00 AM by a pager alert saying your API is down, only to find out your service was 100% fine and it was just a transient routing hiccup at a single monitoring vendor's data center. Or worse: legacy tools charging $50+/month just for 1-minute check intervals and basic status pages.

We built SteadyStack from the ground up on Cloudflare's global edge network to rethink synthetic monitoring:

1. 🌐 **7-Region Edge Quorum**: When a failure is detected, SteadyStack cross-checks the target from 7 edge regions concurrently. An incident is only raised when consensus (4-of-7) confirms the outage. Zero false alarms.
2. ⏱️ **Sub-Minute Synthetic Probes**: Automated checks for HTTP/S, SSL cert expiration, DNS propagation, and cron dead-man switches.
3. 📊 **Branded Status Pages**: Deliver transparent incident timelines to your customers on custom domains (`status.yourdomain.com`).
4. 🔌 **Integrations Everywhere**: Real-time alerting to Slack, Discord, PagerDuty, Webhooks, Email, and SMS.
5. 💻 **Open & Developer-Centric**: Self-hostable via Docker/Helm or use our cloud platform, with full REST API and CLI support.

We'd love to get your feedback, hear how you monitor your stack, and answer any technical questions!

Thank you so much for the support! 🚀
```

---

## 📂 4. Directory Submission Copy Kit

### A. DevHunt (`devhunt.org`)

- **Name**: SteadyStack
- **Tagline**: Edge-native synthetic monitoring with multi-region quorum checks
- **Tech Stack**: Next.js 16, Cloudflare Workers, OpenNext, TypeScript, Prisma, PostgreSQL, Docker
- **Open Source**: Yes (`https://github.com/getsteadystack/SteadyStack`)
- **Key Feature**: Zero false positive alerts via 7-region edge consensus and sub-minute synthetic probes.

### B. SaaSHub & AlternativeTo (`alternativeto.net` & `saashub.com`)

- **Alternative to**: UptimeRobot, Better Stack, Pingdom, Statuspage.io, Datadog Synthetics
- **Category**: Uptime Monitoring / Status Page Service / DevOps Tool
- **Key Differentiator vs. UptimeRobot**: SteadyStack provides 60s checks on its free tier, 7-region quorum consensus verification, and modern customizable status pages without paywalling basic SRE features.
- **Key Differentiator vs. Better Stack**: Fully open architecture, transparent self-hosting options, and edge-native Cloudflare probe execution.

### C. Uneed (`uneed.best`) & BetaList (`betalist.com`)

- **Pitch**: The edge-native monitoring platform that confirms server and website outages across global regions before notifying on-call engineers.
- **Target Audience**: Developers, DevOps Engineers, SaaS Founders, Freelancers, and SREs.

### D. 1000.tools & Toolify / Futurepedia

- **Short Summary**: Real-time website & API synthetic uptime monitor with automated edge quorum verification, SSL alerts, and custom status pages.

---

## ⚡ 5. Developer Community Posts

### Hacker News: Show HN

**Title**: `Show HN: SteadyStack – Edge-native synthetic monitoring with multi-region quorum`  
**Text**:

```markdown
Hi HN! We built SteadyStack (https://github.com/getsteadystack/SteadyStack), an open-source synthetic uptime monitoring engine designed to eliminate false positive alerts.

### The Problem:
Traditional synthetic pollers ping your servers from a single AWS/GCP region. If a regional ISP has a route flap, you get an alert even if 99% of your global users are experiencing zero downtime.

### How SteadyStack Works:
- **Edge Quorum**: Probes are orchestrated across Cloudflare Workers in 7 global regions. When a probe fails, an immediate quorum check runs across peer nodes. Only when 4-of-7 nodes confirm the failure is an incident dispatched.
- **Durable State**: Utilizes Durable Objects for state consensus and sub-50ms latency aggregation.
- **All-in-one Monitoring**: HTTP(S), SSL cert validity, DNS resolution, cron job heartbeats, and private VPC agents via Docker.
- **Public Status Pages**: Custom domain support with 90-day uptime history and incident post-mortems.

The web app is built with Next.js 16 (OpenNext), Prisma, and PostgreSQL. We’d love to hear your feedback on the architecture and quorum logic!
```

### Reddit: r/selfhosted & r/devops

**Title**: `[Open Source] SteadyStack – Multi-region synthetic uptime monitoring with edge quorum confirmation`  
**Body**:

```markdown
Hey everyone! We've just open-sourced SteadyStack, an edge-native synthetic monitoring platform and status page system.

Key features:
- Multi-region edge quorum verification (no more 3 AM alerts due to a single transit hiccup)
- 60-second checks for HTTP/S, SSL, DNS, TCP, and Cron heartbeats
- Branded status pages with custom domains and incident subscriber updates
- Multi-channel alerts (Slack, Discord, PagerDuty, Webhooks, Email)
- Self-hostable via Docker Compose / Helm chart or run on Cloudflare edge

Repo: https://github.com/getsteadystack/SteadyStack
Live Demo & Docs: https://steadystack.dev

Feel free to check it out, run it locally, and let us know what features or probe types you'd like to see next!
```

---

## 🛡️ 6. Embeddable Status & Launch Badges

```markdown
<!-- SteadyStack Status Badge -->
[![SteadyStack Status](https://img.shields.io/badge/SteadyStack-Operational-10b981?style=flat-square&logo=cloudflare)](https://steadystack.dev)

<!-- Product Hunt Launch Badge -->
<a href="https://www.producthunt.com/posts/steadystack" target="_blank">
  <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=steadystack&theme=dark" alt="SteadyStack on Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" />
</a>
```
