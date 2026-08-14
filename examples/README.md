# Monitoring as Code — Examples

This directory contains ready-to-use YAML examples for the `pulse monitors apply` command.

> **Prerequisites**: `pulse auth login` with a valid API key.

## Usage

```bash
# Preview changes without applying
pulse monitors apply --dry-run monitors.yml

# Apply a single file
pulse monitors apply monitors.yml

# Apply all files in a directory
pulse monitors apply ./monitors/

# Diff current state against a file
pulse monitors diff monitors.yml
```

## Files

| File                                       | Description                                         |
| ------------------------------------------ | --------------------------------------------------- |
| [`http-basic.yml`](./http-basic.yml)       | Simple HTTP uptime check                            |
| [`http-advanced.yml`](./http-advanced.yml) | HTTP with assertions, headers, and regional routing |
| [`ssl-domain.yml`](./ssl-domain.yml)       | SSL/TLS certificate + domain expiry monitoring      |
| [`tcp-port.yml`](./tcp-port.yml)           | TCP port reachability                               |
| [`dns.yml`](./dns.yml)                     | DNS record validation                               |
| [`heartbeat.yml`](./heartbeat.yml)         | Cron-job heartbeat / dead man's switch              |
| [`keyword.yml`](./keyword.yml)             | HTTP with keyword assertion (contains/not-contains) |
| [`api-suite.yml`](./api-suite.yml)         | Production API suite with grouped monitors          |
| [`ci-gate.yml`](./ci-gate.yml)             | CI/CD deployment gate using `pulse wait`            |

---

## Schema Reference

Every monitor shares these top-level fields:

```yaml
name: string # Required — unique monitor name (used as identifier)
type: string # Required — monitor type (see below)
url: string # Required for most types
interval: number # Check interval in seconds (30–86400). Default: 60
regions: string[] # Probe regions. Default: ["us-east", "eu-west", "ap-southeast"]
alerts: string[] # Alert channel names from your workspace
tags: string[] # Arbitrary tags for filtering
enabled: boolean # Default: true
```

**Supported types**: `HTTP`, `HTTPS`, `TCP`, `SSL`, `DNS`, `DOMAIN`, `HEARTBEAT`, `PING`, `WEBSOCKET`, `GRAPHQL`, `DATABASE`, `BGP`, `BROWSER`, `SEQUENCE`, `MCP`
