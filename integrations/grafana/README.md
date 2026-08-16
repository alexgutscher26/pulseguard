# PulseGuard Grafana Integration 📊

Seamlessly stream real-time uptime statuses, quorum consensus metrics, and multi-region edge latency from **PulseGuard** into your existing Grafana dashboards.

---

## 1. Prometheus Scrape Configuration

Add a scrape job to your `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'pulseguard'
    scrape_interval: 30s
    metrics_path: '/api/v1/metrics/prometheus'
    scheme: 'https'
    static_configs:
      - targets: ['app.pulseguard.io'] # or your self-hosted instance domain
    authorization:
      type: Bearer
      credentials: 'pg_live_xxxxxxxxxxxxxxxxxxxx' # Your PulseGuard API Key
```

---

## 2. Import the Pre-Built Dashboard

1. In Grafana, navigate to **Dashboards → New → Import**.
2. Upload [`dashboard.json`](./dashboard.json) from this directory or paste its contents.
3. Select your Prometheus data source when prompted.
4. Click **Import**.

---

## 3. Metrics Reference

| Metric Name                           | Type  | Description                                                                                                 |
| :------------------------------------ | :---- | :---------------------------------------------------------------------------------------------------------- |
| `pulseguard_monitor_status`           | Gauge | `1` for UP, `0` for DOWN, `2` for PAUSED/MAINTENANCE                                                        |
| `pulseguard_monitor_latency_ms`       | Gauge | Average round-trip response time (ms) partitioned by sovereign edge region (`wnam`, `enam`, `weur`, `apac`) |
| `pulseguard_monitor_interval_seconds` | Gauge | Configured check frequency in seconds                                                                       |
