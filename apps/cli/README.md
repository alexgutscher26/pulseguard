# SteadyStack CLI (`steadystack`)

<p align="center">
  <a href="https://steadystack.dev">
    <img src="https://raw.githubusercontent.com/getsteadystack/SteadyStack/master/apps/web/public/brand/logo.svg" alt="SteadyStack Logo" width="80" height="80" />
  </a>
</p>

<p align="center">
  <strong>Monitoring as Code, real-time edge telemetry streaming, and CI/CD deployment gates for high-velocity teams.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/steadystack"><img src="https://img.shields.io/npm/v/steadystack.svg?style=flat-square&color=10b981" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/steadystack"><img src="https://img.shields.io/npm/dm/steadystack.svg?style=flat-square&color=3b82f6" alt="npm downloads" /></a>
  <a href="https://github.com/getsteadystack/SteadyStack/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-blue.svg?style=flat-square" alt="License" /></a>
  <a href="https://steadystack.dev/docs"><img src="https://img.shields.io/badge/docs-steadystack.dev-6366f1.svg?style=flat-square" alt="Documentation" /></a>
</p>

---

## ⚡ Quickstart

### 1. Installation

Install globally using your package manager of choice:

```bash
# npm
npm install -g steadystack

# bun
bun add -g steadystack

# pnpm
pnpm add -g steadystack

# yarn
yarn global add steadystack
```

Or run instantly without installation via `npx` or `bunx`:

```bash
npx steadystack --help
# or
bunx steadystack --help
```

> **Binary Aliases**: Both `steadystack` and `pulse` command binaries are registered when installed globally.

---

### 2. Authentication

Authenticate your terminal session using your API key from [SteadyStack Dashboard](https://steadystack.dev/dashboard/settings/api-keys):

```bash
# Cloud Platform
steadystack auth login --key pg_live_your_api_key

# Self-Hosted or Local Development
steadystack auth login --key <API_KEY> --url https://your-instance.com
```

Verify your active profile and connection:

```bash
steadystack auth status
```

#### CI/CD & Automated Environments

Set environment variables in headless environments (GitHub Actions, GitLab CI, Jenkins, Docker) without needing interactive login:

```bash
export STEADYSTACK_API_KEY="pg_live_..."
export STEADYSTACK_BASE_URL="https://steadystack.dev" # Optional, defaults to https://steadystack.dev
```

---

## 🛠️ Feature Overview

| Capability               | Command                      | Description                                                                  |
| :----------------------- | :--------------------------- | :--------------------------------------------------------------------------- |
| **Monitoring as Code**   | `steadystack monitors apply` | Declarative YAML configuration with idempotent syncing & `--dry-run`.        |
| **Drift Detection**      | `steadystack monitors diff`  | Colorized diff comparing local YAML specs against live remote cloud state.   |
| **CI/CD Quality Gate**   | `steadystack wait`           | Blocks pipelines until canary or service reaches healthy quorum.             |
| **Live Telemetry Tail**  | `steadystack logs tail`      | Live-streaming probe pings, latency charts, and regional verdicts.           |
| **Ad-Hoc Health Checks** | `steadystack trigger`        | Force instantaneous quorum health checks across edge regions.                |
| **1-Click Migration**    | `steadystack import kuma`    | Import monitors, intervals, and tags directly from Uptime Kuma JSON exports. |

---

## 📄 Monitoring as Code (Declarative YAML)

Define your synthetic checks, APIs, SSL certificates, TCP ports, and heartbeats in standard `steadystack.yaml` files.

### Example `steadystack.yaml` Spec

```yaml
version: "1"
monitors:
  # 1. High-Frequency HTTP / REST API with Payload Validation
  - name: production-api-health
    type: HTTP
    url: https://api.example.com/v1/health
    interval: 30 # seconds
    timeout: 5 # seconds
    method: GET
    headers:
      Accept: application/json
      Authorization: "Bearer ${API_AUTH_TOKEN}"
    expectation:
      status_code: 200
      body_contains: "all systems operational"
      json_schema:
        status: "ok"
    checkRegions:
      - wnam # US West (San Jose)
      - weur # Western Europe (Frankfurt)
      - apac # Asia Pacific (Singapore)
    tags:
      - production
      - tier-0
      - api

  # 2. Database TCP Port Monitor
  - name: postgres-primary
    type: TCP # or PORT
    host: db.prod.example.com
    port: 5432
    interval: 60
    timeout: 3
    tags:
      - database
      - infrastructure

  # 3. SSL / TLS Certificate Expiry Monitor
  - name: wildcard-ssl-certificate
    type: SSL
    host: example.com
    interval: 86400 # 24h
    alertThreshold: 14 # Alert 14 days before expiration
    tags:
      - security

  # 4. Authoritative DNS Resolution
  - name: primary-dns-check
    type: DNS
    host: example.com
    interval: 300
    timeout: 5

  # 5. Background Worker Cron Heartbeat (Dead-Man's Switch)
  - name: nightly-backup-cron
    type: HEARTBEAT
    interval: 86400
    timeout: 3600 # 1 hour grace period
    runbookUrl: https://wiki.example.com/runbooks/backup-recovery
```

---

### Applying & Syncing Configurations

```bash
# 1. Dry run preview (detects creations, updates, and removals without modifying state)
steadystack monitors apply steadystack.yaml --dry-run

# 2. Apply configuration idempotently
steadystack monitors apply steadystack.yaml

# 3. Apply all monitor files within a directory
steadystack monitors apply ./infra/monitoring/

# 4. Detect configuration drift against remote cloud state
steadystack monitors diff steadystack.yaml

# 5. Export current cloud monitors to a declarative YAML snapshot
steadystack monitors import -o steadystack.yaml
```

---

## 🚦 CI/CD Deployment Gates (`steadystack wait`)

Block your continuous delivery pipelines until newly deployed infrastructure passes all synthetic health checks. Exits `0` on healthy status, or `1` on timeout/failure.

### GitHub Actions Workflow Example

```yaml
name: Production Deployment & Canary Gate

on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Deploy Service / Blue-Green Canary
        run: ./scripts/deploy-production.sh

      # 🛡️ Quality Gate: Block pipeline until canary endpoint is UP
      - name: Verify Health via SteadyStack
        run: npx steadystack wait ${{ secrets.STEADYSTACK_CANARY_MONITOR_ID }} --timeout 180 --interval 10
        env:
          STEADYSTACK_API_KEY: ${{ secrets.STEADYSTACK_API_KEY }}

      - name: Promote Canary to 100% Traffic
        run: ./scripts/promote-traffic.sh
```

### CLI Command Options

```bash
# Wait for monitor to become healthy with custom timeout and interval
steadystack wait <MONITOR_ID> --timeout 300 --interval 15

# Force a manual probe check before evaluating status
steadystack wait <MONITOR_ID> --trigger-on-start
```

---

## 🔍 Real-Time Probe Streaming (`steadystack logs tail`)

Stream live edge probe events, regional latency breakdowns, and status transitions directly in your terminal:

```bash
# Stream last 20 events and poll live every 3 seconds
steadystack logs tail <MONITOR_ID> -n 20 --interval 3000

# Stream formatted as structured JSON for log pipelines
steadystack logs tail <MONITOR_ID> --json
```

---

## ⚡ Instant Ad-Hoc Probing (`steadystack trigger`)

Trigger an immediate multi-region check without waiting for the scheduled background interval:

```bash
# Run immediate multi-region check
steadystack trigger <MONITOR_ID>

# Test a canary or preview URL with the same assertion rules
steadystack trigger <MONITOR_ID> --url https://pr-412.preview.example.com/health
```

---

## 📦 Monitor Management CLI Reference

```bash
# List all active monitors
steadystack monitors list
# or short alias with JSON output
steadystack monitors ls --json

# Filter monitors by tag or status
steadystack monitors list --tag production --status DOWN

# View comprehensive monitor details & SLA metrics
steadystack monitors get <MONITOR_ID>

# Interactive monitor creation wizard
steadystack monitors create

# Pause / Resume monitoring
steadystack monitors pause <MONITOR_ID>
steadystack monitors resume <MONITOR_ID>

# Delete a monitor
steadystack monitors delete <MONITOR_ID> --force
```

---

## 🔄 Uptime Kuma Migration

Seamlessly migrate your infrastructure monitoring from Uptime Kuma to SteadyStack:

```bash
# 1. Export your monitors from Uptime Kuma UI as a JSON file

# 2. Run a dry run to inspect mapped monitor configs
steadystack import kuma -f uptime-kuma-export.json --dry-run

# 3. Import all monitors, tags, and intervals into SteadyStack
steadystack import kuma -f uptime-kuma-export.json
```

---

## 📚 Configuration Reference

### Environment Variables

| Variable               | Description                                            | Default                   |
| :--------------------- | :----------------------------------------------------- | :------------------------ |
| `STEADYSTACK_API_KEY`  | API Key for SteadyStack authentication (`pg_live_...`) | —                         |
| `STEADYSTACK_BASE_URL` | Base API URL for self-hosted instances                 | `https://steadystack.dev` |
| `PULSEGUARD_API_KEY`   | _(Legacy)_ Fallback API Key environment variable       | —                         |
| `PULSEGUARD_BASE_URL`  | _(Legacy)_ Fallback Base API URL                       | `https://steadystack.dev` |

---

## 📄 License

Licensed under the [Apache-2.0 License](https://github.com/getsteadystack/SteadyStack/blob/master/LICENSE).
