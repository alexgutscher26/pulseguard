# PLAN-production-launch

> **Status**: APPROVED
> **Target Platform**: Hybrid (Vercel + Cloudflare)
> **Database**: Neon (PostgreSQL)

## 1. Executive Summary

This plan outlines the steps to deploy PulseGuard to production. We will use a **Hybrid Architecture**:

- **Frontend (Dashboard)**: Deployed to **Vercel** (for best Next.js performance).
- **Backend (Monitor Engine)**: Deployed to **Cloudflare Workers** (for global distribution and cron jobs).
- **Database**: **Neon** (Serverless Postgres), accessible by both.

---

## 2. Infrastructure Setup (Database)

**Provider**: Neon (console.neon.tech)

### Steps:

1.  **Create Project**: Create a new project `pulseguard-prod` in Neon.
2.  **Get Connection String**: Copy the pooled connection string (e.g., `postgres://user:pass@ep-xyz-pooler.region.aws.neon.tech/neondb?sslmode=require`).
3.  **Migration**:
    - Run from your local machine to push schema to prod:
    ```bash
    # In .env, temporarily set DATABASE_URL=your_prod_url
    bun run db:push
    ```

---

## 3. Worker Deployment (The Heart)

**Provider**: Cloudflare (via Wrangler)

### Code Preparation:

1.  **Environment Variables**:
    - The worker needs `DATABASE_URL` and `RESEND_API_KEY`.
    - We use `wrangler secret put` for production secrets.

2.  **Triggers**:
    - Verify `wrangler.jsonc` has correct crons: `["* * * * *", "*/5 * * * *", "0 * * * *", "0 0 * * *"]`.

### Deployment Steps:

```bash
# 1. Login
cd apps/worker
npx wrangler login

# 2. Set Secrets (Production keys)
npx wrangler secret put DATABASE_URL
# > Paste Neon Pooled URL

npx wrangler secret put RESEND_API_KEY
# > Paste Resend API Key

# 3. Deploy
npx wrangler deploy
```

---

## 4. Web App Deployment (The Interface)

**Provider**: Vercel

### ⚠ Critical Code Change

Currently, `apps/web/next.config.ts` uses `@opennextjs/cloudflare`. Since we are deploying to **Vercel**, we must **remove** this adapter, as Vercel handles Next.js natively.

**Required Edit**:
Modify `apps/web/next.config.ts` to remove `initOpenNextCloudflareForDev` and the import.

### Deployment Steps:

1.  **Push to GitHub**: Ensure all code is committed.
2.  **Vercel Dashboard**:
    - "Add New Project" -> Import `pulseguard` repo.
    - **Root Directory**: `apps/web` (Important! Do not select root).
    - **Framework Preset**: Next.js.
    - **Environment Variables**:
      - `DATABASE_URL`: (Neon Pooled URL)
      - `BETTER_AUTH_SECRET`: (Generate w/ `openssl rand -base64 32`)
      - `BETTER_AUTH_URL`: `https://your-project.vercel.app` (The production domain)
      - `RESEND_API_KEY`: (Same as worker)
      - `NEXT_PUBLIC_APP_URL`: `https://your-project.vercel.app`

3.  **Click Deploy**.

---

## 5. Post-Deployment Verification

1.  **Dashboard Check**: Log in to the Vercel app.
2.  **Monitor Creation**: Create a monitor (e.g., `google.com`).
3.  **Worker Verification**:
    - Wait 2 minutes.
    - Check Dashboard. Does the monitor show "UP" and latency data?
    - _If yes, the Cloudflare Worker is correctly writing to the Shared Database._

---

## 6. Domain Configuration (DNS)

**Goal**: `pulseguard.com`

1.  **Vercel**: Add Domain `pulseguard.com` -> Add A/CNAME records to your registrar.
2.  **Cloudflare**: (Optional) If you want the worker on a custom domain, add routes in `wrangler.toml`, but strictly speaking not required for the backend worker (it runs on crons).

---

## 7. Rollback Plan

If production fails:

1.  **Web**: Vercel Dashboard -> Deployments -> Click "Redeploy" on the previous stable commit.
2.  **Worker**: `npx wrangler rollback` (reverts to previous version).
3.  **DB**: Neon "Time Travel" feature allows resetting DB to a previous timestamp (if data is corrupted).

---

## 8. Next Steps

1.  **Edit `apps/web/next.config.ts`** (I can do this now).
2.  **Run Deploy commands** (You perform this in terminal).
