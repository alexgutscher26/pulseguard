# Terraform Provider for PulseGuard 🛡️

The official HashiCorp Terraform provider for [PulseGuard](https://pulseguard.io) — Edge-native, zero-false-positive uptime and synthetic monitoring platform.

## Features

- **Monitoring as Code**: Manage HTTP, TCP, SSL, DNS, and multi-step synthetic monitors in HCL.
- **Sovereign Edge Region Targeting**: Pin checks across North America (`wnam`, `enam`), Europe (`weur`, `eeur`), and Asia-Pacific (`apac`, `apac-ne`, `apac-se`).
- **Incident Escalation Channels**: Configure PagerDuty, Opsgenie, Slack, Discord, and Webhook dispatch channels directly from IaC.
- **Dynamic Thresholding**: Enable AI-driven latency anomaly detection and quorum consensus rules.

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

resource "pulseguard_monitor" "app_gateway" {
  name     = "App Gateway"
  url      = "https://app.example.com/health"
  type     = "HTTP"
  interval = 30

  check_regions = ["wnam", "weur", "apac"]
  alert_threshold = 2
  tags = ["prod", "frontend"]
}
```

## Authentication

Generate a scoped API key in your PulseGuard dashboard under **Workspace Settings → API Keys**.

Set via provider config or environment variable:

```bash
export PULSEGUARD_API_KEY="pg_live_xxxxxxxxxxxxxxxx"
```

## Documentation

Full schema documentation is published on the [Terraform Registry](https://registry.terraform.io/providers/alexgutscher26/pulseguard/latest/docs).
