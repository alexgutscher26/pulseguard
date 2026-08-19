# Self-Hosted SteadyStack — Single-Server Installation Guide

> Deploy the full SteadyStack stack on a single Linux server using Docker Compose.
> Suitable for teams that want full data sovereignty or air-gapped environments.

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│  Your Server                                             │
│                                                          │
│  ┌─────────────┐   ┌─────────────┐   ┌───────────────┐  │
│  │  Caddy      │   │  Next.js    │   │  CF Worker    │  │
│  │  (HTTPS /   │──▶│  Dashboard  │──▶│  (Miniflare / │  │
│  │  Reverse    │   │  :3000      │   │  or external) │  │
│  │  Proxy)     │   └─────────────┘   └───────────────┘  │
│  └─────────────┘                                         │
│       :80/:443                                           │
│                                                          │
│  ┌─────────────┐   ┌─────────────┐   ┌───────────────┐  │
│  │  PostgreSQL │   │  Redis      │   │  Probe Agent  │  │
│  │  :5432      │   │  :6379      │   │  (optional)   │  │
│  └─────────────┘   └─────────────┘   └───────────────┘  │
└──────────────────────────────────────────────────────────┘
```

> **Note on the Worker**: SteadyStack's monitoring engine runs on Cloudflare Workers. Self-hosted deployments connect to Cloudflare for the Worker layer. The guide below covers hosting the **dashboard (Next.js)** and **all stateful infrastructure** (PostgreSQL, and optionally Redis as a resilience fallback) on your own server.

---

## Prerequisites

| Requirement        | Minimum                  | Recommended      |
| ------------------ | ------------------------ | ---------------- |
| OS                 | Ubuntu 22.04 / Debian 12 | Ubuntu 24.04 LTS |
| CPU                | 2 vCPU                   | 4 vCPU           |
| RAM                | 2 GB                     | 4 GB             |
| Disk               | 20 GB SSD                | 40 GB SSD        |
| Docker             | 24+                      | latest           |
| Docker Compose     | v2.20+                   | latest           |
| Domain             | Required                 | Required         |
| Cloudflare account | Required (Workers)       | Required         |

### Install Docker

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
docker --version   # Docker version 24.x.x
```

---

## Step 1 — Clone and Configure

```bash
git clone https://github.com/getsteadystack/SteadyStack.git
cd steadystack
cp .env.example .env.production
```

Edit `.env.production` with your production values:

```bash
nano .env.production
```

### Required Variables

| Variable              | Example                                            | Notes                                |
| --------------------- | -------------------------------------------------- | ------------------------------------ |
| `DATABASE_URL`        | `postgresql://pg:secret@postgres:5432/steadystack` | Internal Docker hostname `postgres`  |
| `DIRECT_URL`          | same as above                                      | Used for migrations                  |
| `BETTER_AUTH_SECRET`  | `$(openssl rand -hex 32)`                          | Generate with `openssl rand -hex 32` |
| `BETTER_AUTH_URL`     | `https://steadystack.yourdomain.com`               | Your public domain                   |
| `NEXT_PUBLIC_APP_URL` | `https://steadystack.yourdomain.com`               | Must match `BETTER_AUTH_URL`         |
| `CORS_ORIGIN`         | `https://steadystack.yourdomain.com`               | Same domain                          |

If you run the optional private probe (`docker-compose.prod.yml` ships the `probe` service):

| Variable                  | Example                         | Notes                                    |
| ------------------------- | ------------------------------- | ---------------------------------------- |
| `STEADYSTACK_API_URL`     | `https://worker.yourdomain.com` | Your SteadyStack Worker URL              |
| `STEADYSTACK_PROBE_TOKEN` | `$(openssl rand -hex 32)`       | Must match the token your Worker accepts |
| `PROBE_REGION`            | `self-hosted`                   | Label shown in the dashboard             |

Generate secrets:

```bash
openssl rand -hex 32   # use as BETTER_AUTH_SECRET and STEADYSTACK_PROBE_TOKEN
```

---

## Step 2 — Production Docker Compose

The production stack ships in the repo as [`docker-compose.prod.yml`](../docker-compose.prod.yml). It runs:

- **Caddy** — reverse proxy with automatic HTTPS (Let's Encrypt)
- **web** — the Next.js dashboard, built from `apps/web/Dockerfile`
- **migrate** — one-off Prisma migration runner (see Step 5)
- **postgres** — PostgreSQL 16 with a named volume
- **redis** — optional, used only as a resilience fallback when `UPSTASH_REDIS_REST_URL` is set; remove the service if unused
- **probe** — optional private probe reporting to your Worker

```bash
docker compose -f docker-compose.prod.yml config   # sanity check
```

---

## Step 3 — Caddy Configuration (Auto-HTTPS)

Create `Caddyfile` in the project root:

```caddyfile
steadystack.yourdomain.com {
    reverse_proxy web:3000

    # Security headers
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "SAMEORIGIN"
        Referrer-Policy "strict-origin-when-cross-origin"
    }

    # Compression
    encode gzip

    # Access log
    log {
        output file /var/log/caddy/access.log {
            roll_size 10mb
            roll_keep 5
        }
    }
}
```

Replace `steadystack.yourdomain.com` with your actual domain.

> Caddy automatically obtains and renews a Let's Encrypt TLS certificate. Ensure ports 80 and 443 are open in your firewall.

---

## Step 4 — DNS Configuration

Point your domain to the server IP before starting:

| Record | Host          | Value              | TTL |
| ------ | ------------- | ------------------ | --- |
| A      | `steadystack` | `<your-server-ip>` | 300 |

Wait for DNS to propagate (`dig steadystack.yourdomain.com`).

---

## Step 5 — Build and Start

```bash
# Build the web and probe images
docker compose -f docker-compose.prod.yml build

# Start the database first, then run migrations
docker compose -f docker-compose.prod.yml up -d postgres

# Run database migrations (Prisma 7 — migrate deploy, not dev)
docker compose -f docker-compose.prod.yml run --rm migrate

# Start all services
docker compose -f docker-compose.prod.yml up -d

# Tail logs
docker compose -f docker-compose.prod.yml logs -f
```

> The `migrate` service mounts the repo checkout and runs
> `bunx prisma migrate deploy` inside `packages/db`. The web image itself is a
> trimmed Next.js standalone build and does **not** include the Prisma CLI, so
> never use `docker compose run web ...` for migrations.

Check that all services are healthy:

```bash
docker compose -f docker-compose.prod.yml ps
```

Dashboard is now live at `https://steadystack.yourdomain.com`. 🎉

---

## Step 6 — Deploy Cloudflare Worker

The monitoring engine runs on Cloudflare. From your local machine (or a CI runner):

```bash
# Authenticate with Cloudflare
npx wrangler login

# Deploy the Worker (connects back to your hosted dashboard)
bun run deploy
```

Set your dashboard URL as `BETTER_AUTH_URL` in your Cloudflare Worker environment (via `wrangler.toml` or Cloudflare dashboard).

---

## Maintenance

### Updating SteadyStack

```bash
git pull origin main
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml run --rm migrate
docker compose -f docker-compose.prod.yml up -d
```

### Database Backups

```bash
# Manual backup
docker exec steadystack-postgres pg_dump -U steadystack steadystack > backup_$(date +%Y%m%d).sql

# Restore
docker exec -i steadystack-postgres psql -U steadystack steadystack < backup_20240101.sql
```

### Automated Daily Backups (cron)

```bash
# Add to root crontab (crontab -e)
0 2 * * * docker exec steadystack-postgres pg_dump -U steadystack steadystack | gzip > /backups/steadystack_$(date +\%Y\%m\%d).sql.gz
```

### Viewing Logs

```bash
docker compose -f docker-compose.prod.yml logs web     # Next.js
docker compose -f docker-compose.prod.yml logs caddy   # Access logs
docker compose -f docker-compose.prod.yml logs postgres
```

---

## Firewall Rules

Open only these ports:

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP (Caddy redirects to HTTPS)
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

---

## Troubleshooting

| Symptom                      | Likely Cause                  | Fix                                                    |
| ---------------------------- | ----------------------------- | ------------------------------------------------------ |
| Caddy certificate error      | DNS not yet propagated        | Wait 5–10 min, then `docker restart steadystack-caddy` |
| Database connection refused  | Wrong `DATABASE_URL` hostname | Use `postgres` (Docker hostname), not `localhost`      |
| Auth redirect loop           | `BETTER_AUTH_URL` mismatch    | Must exactly match the browser-visible domain          |
| Worker can't reach dashboard | Firewall or CORS              | Check `CORS_ORIGIN` matches Worker origin              |

---

## Security Checklist

- [ ] `BETTER_AUTH_SECRET` is at least 32 random characters
- [ ] `POSTGRES_PASSWORD` and `REDIS_PASSWORD` are strong and unique
- [ ] Ports 5432 and 6379 are **not** exposed to the public internet (they are not in this config — keep it that way)
- [ ] Caddy HTTPS is working (`https://` in browser address bar)
- [ ] Firewall is enabled — only 22, 80, 443 are open
- [ ] Automated backups are configured
