# Terraform Provider for PulseGuard 🛡️

The official HashiCorp Terraform provider for [PulseGuard](https://pulseguard.io) — Edge-native, zero-false-positive uptime and synthetic monitoring platform.

## Features

- **Monitoring as Code**: Manage HTTP, PING, PORT, SSL, DNS, and HEARTBEAT synthetic monitors in HCL.
- **Headers & Payloads**: Full support for custom HTTP request headers, methods, and request bodies.
- **Sovereign Edge Region Targeting**: Pin checks across North America (`wnam`, `enam`), Europe (`weur`, `eeur`), and Asia-Pacific (`apac`, `apac-ne`, `apac-se`).
- **Incident Escalation Channels**: Configure PagerDuty, Opsgenie, Slack, Discord, Telegram, SMS, Email, and Webhook dispatch channels directly from IaC.
- **Dynamic Thresholding & Runbooks**: Enable AI-driven latency anomaly detection and incident remediation runbook links.

## Quick Start

```hcl
terraform {
  required_providers {
    pulseguard = {
      source  = "alexgutscher26/pulseguard"
      version = "~> 1.0"
    }
  }
}

provider "pulseguard" {
  api_key = var.pulseguard_api_key # or export PULSEGUARD_API_KEY
}

# Fetch available edge probe regions
data "pulseguard_regions" "edge" {}

# Create an Edge Uptime Monitor
resource "pulseguard_monitor" "app_gateway" {
  name     = "App Gateway"
  url      = "https://app.example.com/health"
  type     = "HTTP"
  interval = 30
  timeout  = 5
  method   = "GET"

  headers = {
    "X-Synthetic-Check" = "PulseGuard-Edge"
  }

  check_regions   = ["wnam", "weur", "apac"]
  alert_threshold = 2
  dynamic_thresholding = true
  runbook_url     = "https://wiki.example.com/runbooks/api"
  tags            = ["prod", "frontend"]
}

# Configure an Alert Notification Channel
resource "pulseguard_alert_channel" "pagerduty_sre" {
  name = "PagerDuty SRE High Priority"
  type = "PAGERDUTY"
  config_json = jsonencode({
    routingKey = "R015PXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  })
}
```

## Authentication

Generate a scoped API key in your PulseGuard dashboard under **Workspace Settings → API Keys**.

Set via provider config or environment variable:

```bash
export PULSEGUARD_API_KEY="pg_live_xxxxxxxxxxxxxxxx"
export PULSEGUARD_HOST_URL="https://app.pulseguard.io" # Optional, defaults to production
```

## Development & Building

To build the provider binary locally for Terraform CLI development:

```bash
cd packages/terraform-provider
go build -o terraform-provider-pulseguard
```

To configure local overrides in `~/.terraformrc` or `%APPDATA%/terraform.rc`:

```hcl
provider_installation {
  dev_overrides {
    "alexgutscher26/pulseguard" = "<path-to-pulseguard>/packages/terraform-provider"
  }
  direct {}
}
```
