# ADR 001: Quorum Consensus within AS13335 (Cloudflare DOs)

## Status

Accepted

## Context

PulseGuard's primary synthetic probe fleet runs on geographically pinned Cloudflare Durable Objects across 7 sovereign location hints (`wnam`, `enam`, `weur`, `eeur`, `apac`, `oc`, `sam`). By default, all Cloudflare Workers and Durable Objects egress traffic through Cloudflare's autonomous system (AS13335).

A theoretical failure mode exists where a Cloudflare-internal network routing anomaly or egress partition causes all 7 Cloudflare DOs to fail in reaching a specific origin, while the origin remains accessible to the broader internet.

## Decision

1. **Primary Quorum Baseline:** We accept the architectural trade-off that the standard 4-of-7 quorum consensus is evaluated across Cloudflare's 7 sovereign edge DOs within AS13335. This provides sub-minute distributed consensus without the operational overhead, latency variance, and financial cost of multi-cloud VPCs for entry tiers.
2. **Provider Partition Circuit Breaker:** The Quorum Engine tracks Autonomous System Numbers (ASNs) per measurement. If down consensus is reached but 100% of reporting failures are isolated to AS13335 while an out-of-band sentinel probe (e.g. AS24940 Hetzner/Docker node) confirms the origin is UP, the system suppresses the false `DOWN` alert and demotes the state to `DEGRADED` ("Provider partition on AS13335").
3. **Optional Heterogeneous Sentinels:** Enterprise and self-hosted private probes (registered via `apps/probe`) provide out-of-band ASNs to supplement the Cloudflare DO quorum pool.

## Consequences

- **Positive:** Low-cost, highly responsive sub-minute edge polling from 7 distinct geographic locations without multi-cloud infrastructure sprawl.
- **Accepted Risk:** An outage affecting 100% of Cloudflare egress globally will trigger DOWN consensus unless an out-of-band sentinel probe or private probe is configured for the workspace.
