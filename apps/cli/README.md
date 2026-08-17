# SteadyStack CLI (`steadystack`)

[![npm version](https://img.shields.io/npm/v/steadystack.svg)](https://www.npmjs.com/package/steadystack)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](https://github.com/getsteadystack/SteadyStack)

The official command-line interface for **SteadyStack** — Monitoring as Code, real-time log streaming, CI/CD deployment gates, and synthetic monitor management.

---

## ⚡ Installation

Install globally via npm, bun, or pnpm:

```bash
# npm
npm install -g steadystack

# bun
bun add -g steadystack

# pnpm
pnpm add -g steadystack
```

Or run instantly without installation using `npx` or `bunx`:

```bash
npx pulseguard --help
# or
bunx pulseguard --help
```

> **Binary Aliases**: Both `pulse` and `pulseguard` are available when installed globally.

---

## 🔑 Authentication

Before using the CLI, authenticate with your PulseGuard API key:

```bash
pulse auth login --key pg_live_your_api_key
```

For self-hosted instances or local development:

```bash
pulse auth login --key <API_KEY> --url http://localhost:3000
```

Check your current authentication status:

```bash
pulse auth status
```

### Environment Variables (CI/CD)

In automated environments like GitHub Actions, GitLab CI, or Docker containers, you can set environment variables instead of running `pulse auth login`:

```bash
export PULSEGUARD_API_KEY="pg_live_..."
export PULSEGUARD_BASE_URL="https://pulseguard.io" # Optional, defaults to https://pulseguard.io
```

---

## 🚀 Commands & Usage

### 1. Monitoring as Code (`monitors apply` & `monitors diff`)

Define your uptime checks, API endpoints, SSL certificates, DNS records, and TCP ports in declarative YAML files:

```yaml
# pulseguard.yaml
monitors:
  - name: production-api
    type: HTTP
    url: https://api.example.com/health
    interval: 30
    timeout: 5
    expectation:
      body_contains: "ok"

  - name: postgres-primary
    type: TCP
    host: db.example.com
    port: 5432
    interval: 60
    timeout: 5
```

Apply the configuration idempotently:

```bash
# Apply a single YAML file
pulse monitors apply pulseguard.yaml

# Preview changes before applying (Dry Run)
pulse monitors apply pulseguard.yaml --dry-run

# Apply all YAML files in a directory
pulse monitors apply ./monitors/

# Diff local YAML files against remote state
pulse monitors diff pulseguard.yaml
```

---

### 2. Monitor Management

```bash
# List all monitors
pulse monitors list
# or
pulse monitors ls --json

# Get details of a specific monitor
pulse monitors get <MONITOR_ID>

# Interactively create a monitor
pulse monitors create

# Delete a monitor
pulse monitors delete <MONITOR_ID>

# Export all current remote monitors into a YAML snapshot
pulse monitors import -o pulseguard.yaml
```

---

### 3. CI/CD Deployment Gates (`pulse wait`)

Block CI/CD pipelines until a service or newly deployed canary passes health checks:

```bash
# Block until monitor is UP (timeout in seconds, exits 0 on UP, exits 1 on failure/timeout)
pulse wait <MONITOR_ID> --timeout 300 --interval 15
```

**GitHub Actions Example**:

```yaml
- name: Deploy Canary
  run: ./deploy.sh

- name: Gate — Wait for Healthy State
  run: npx pulseguard wait ${{ secrets.CANARY_MONITOR_ID }} --timeout 180
  env:
    PULSEGUARD_API_KEY: ${{ secrets.PULSEGUARD_API_KEY }}
```

---

### 4. Instant Health Check Trigger (`pulse trigger`)

Force an immediate health check on any monitor without waiting for the next cron tick:

```bash
pulse trigger <MONITOR_ID>

# Or test a staging/preview URL against the same monitor rules
pulse trigger <MONITOR_ID> --url https://staging.example.com/health
```

---

### 5. Real-Time Log Streaming (`pulse logs tail`)

Stream live ping/probe results and latency metrics directly in your terminal:

```bash
pulse logs tail <MONITOR_ID> -n 20 --interval 5000
```

---

### 6. Migration from Uptime Kuma

Migrate all monitors from an existing Uptime Kuma instance:

```bash
# Direct JSON export import
pulse import kuma -f uptime-kuma-export.json --dry-run
pulse import kuma -f uptime-kuma-export.json
```

---

## 📄 License

Apache-2.0. See [LICENSE](https://github.com/alexgutscher26/pulseguard/blob/master/LICENSE) for details.
