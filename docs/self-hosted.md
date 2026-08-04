# Self-Hosted PulseGuard — Single-Server Installation Guide

> Deploy the full PulseGuard stack on a single Linux server using Docker Compose.
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

> **Note on the Worker**: PulseGuard's monitoring engine runs on Cloudflare Workers. Self-hosted deployments connect to Cloudflare for the Worker layer. The guide below covers hosting the **dashboard (Next.js)** and **all stateful infrastructure** (PostgreSQL, Redis) on your own server.

---

## Prerequisites

| Requirement | Minimum | Recommended |
|---|---|---|
| OS | Ubuntu 22.04 / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 vCPU | 4 vCPU |
| RAM | 2 GB | 4 GB |
| Disk | 20 GB SSD | 40 GB SSD |
| Docker | 24+ | latest |
| Docker Compose | v2.20+ | latest |
| Domain | Required | Required |
| Cloudflare account | Required (Workers) | Required |

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
git clone https://github.com/alexgutscher26/pulseguard.git
cd pulseguard
cp .env.example .env.production
```

Edit `.env.production` with your production values:

```bash
nano .env.production
```

### Required Variables

| Variable | Example | Notes |
|---|---|---|
| `DATABASE_URL` | `postgresql://pg:secret@postgres:5432/pulseguard` | Internal Docker hostname `postgres` |
| `DIRECT_URL` | same as above | Used for migrations |
| `BETTER_AUTH_SECRET` | `$(openssl rand -hex 32)` | Generate with `openssl rand -hex 32` |
| `BETTER_AUTH_URL` | `https://pulseguard.yourdomain.com` | Your public domain |
| `NEXT_PUBLIC_APP_URL` | `https://pulseguard.yourdomain.com` | Must match `BETTER_AUTH_URL` |
| `CORS_ORIGIN` | `https://pulseguard.yourdomain.com` | Same domain |

Generate secrets:

```bash
openssl rand -hex 32   # use as BETTER_AUTH_SECRET
```

---

## Step 2 — Production Docker Compose

Create `docker-compose.prod.yml` in the project root:

```yaml
# docker-compose.prod.yml
# Production-ready single-server stack

services:
  # ── Reverse Proxy + TLS (Caddy auto-HTTPS) ──────────────────────────────────
  caddy:
    image: caddy:2-alpine
    container_name: pulseguard-caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - web

  # ── Next.js Dashboard ────────────────────────────────────────────────────────
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    container_name: pulseguard-web
    restart: unless-stopped
    env_file: .env.production
    environment:
      NODE_ENV: production
    expose:
      - "3000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  # ── PostgreSQL ───────────────────────────────────────────────────────────────
  postgres:
    image: postgres:16-alpine
    container_name: pulseguard-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: pulseguard
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-changeme}
      POSTGRES_DB: pulseguard
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U pulseguard -d pulseguard"]
      interval: 5s
      timeout: 5s
      retries: 10

  # ── Redis ────────────────────────────────────────────────────────────────────
  redis:
    image: redis:7-alpine
    container_name: pulseguard-redis
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD:-changeme}
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD:-changeme}", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

  # ── Private Probe (optional — remove if not needed) ──────────────────────────
  probe:
    build:
      context: .
      dockerfile: apps/probe/Dockerfile
    container_name: pulseguard-probe
    restart: unless-stopped
    env_file: .env.production
    environment:
      NODE_ENV: production
    depends_on:
      - web

volumes:
  postgres_data:
  redis_data:
  caddy_data:
  caddy_config:
```

---

## Step 3 — Caddy Configuration (Auto-HTTPS)

Create `Caddyfile` in the project root:

```caddyfile
pulseguard.yourdomain.com {
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

Replace `pulseguard.yourdomain.com` with your actual domain.

> Caddy automatically obtains and renews a Let's Encrypt TLS certificate. Ensure ports 80 and 443 are open in your firewall.

---

## Step 4 — DNS Configuration

Point your domain to the server IP before starting:

| Record | Host | Value | TTL |
|---|---|---|---|
| A | `pulseguard` | `<your-server-ip>` | 300 |

Wait for DNS to propagate (`dig pulseguard.yourdomain.com`).

---

## Step 5 — Build and Start

```bash
# Build the web image
docker compose -f docker-compose.prod.yml build

# Run database migrations
docker compose -f docker-compose.prod.yml run --rm web bun run db:migrate

# Start all services
docker compose -f docker-compose.prod.yml up -d

# Tail logs
docker compose -f docker-compose.prod.yml logs -f
```

Check that all services are healthy:

```bash
docker compose -f docker-compose.prod.yml ps
```

Dashboard is now live at `https://pulseguard.yourdomain.com`. 🎉

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

### Updating PulseGuard

```bash
git pull origin main
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml run --rm web bun run db:migrate
docker compose -f docker-compose.prod.yml up -d
```

### Database Backups

```bash
# Manual backup
docker exec pulseguard-postgres pg_dump -U pulseguard pulseguard > backup_$(date +%Y%m%d).sql

# Restore
docker exec -i pulseguard-postgres psql -U pulseguard pulseguard < backup_20240101.sql
```

### Automated Daily Backups (cron)

```bash
# Add to root crontab (crontab -e)
0 2 * * * docker exec pulseguard-postgres pg_dump -U pulseguard pulseguard | gzip > /backups/pulseguard_$(date +\%Y\%m\%d).sql.gz
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

| Symptom | Likely Cause | Fix |
|---|---|---|
| Caddy certificate error | DNS not yet propagated | Wait 5–10 min, then `docker restart pulseguard-caddy` |
| Database connection refused | Wrong `DATABASE_URL` hostname | Use `postgres` (Docker hostname), not `localhost` |
| Auth redirect loop | `BETTER_AUTH_URL` mismatch | Must exactly match the browser-visible domain |
| Worker can't reach dashboard | Firewall or CORS | Check `CORS_ORIGIN` matches Worker origin |

---

## Security Checklist

- [ ] `BETTER_AUTH_SECRET` is at least 32 random characters
- [ ] `POSTGRES_PASSWORD` and `REDIS_PASSWORD` are strong and unique
- [ ] Ports 5432 and 6379 are **not** exposed to the public internet (they are not in this config — keep it that way)
- [ ] Caddy HTTPS is working (`https://` in browser address bar)
- [ ] Firewall is enabled — only 22, 80, 443 are open
- [ ] Automated backups are configured
