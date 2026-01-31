# PulseGuard

**PulseGuard** is a modern, full-stack website monitoring and uptime platform. It provides real-time insights into your infrastructure's health, offering multi-protocol monitoring options, instant alerts, and detailed status reporting.

Built with performance and scalability in mind, PulseGuard leverages the **Better-T-Stack** (Next.js, tRPC, Tailwind, TypeScript) and runs seamlessly on the Edge.

---

## 🚀 Features

- **Multi-Protocol Monitoring**:
  - **HTTP/HTTPS**: targeted URL checks with status code validation.
  - **Ping/ICMP**: Hostname reachability and latency tracking.
  - **Port/TCP**: Service availability on specific ports.
- **Real-Time Dashboard**: Interactive UI for viewing monitor status, uptime graphs, and response times.
- **Incident Management**:
  - Automatic incident creation when monitors go down.
  - Incident timeline tracking (Investigating -> Identified -> Resolved).
  - "Flapping" detection to prevent alert fatigue.
- **Multi-Channel Alerting**:
  - **Email**: Instant notifications via Resend.
  - **Slack**: Rich message formatting with interactive buttons.
  - **Discord**: Embedded status updates and color-coded alerts.
- **Regional Checks**: Support for simulating checks from multiple geographic regions (configuration ready).
- **Maintenance Windows**: Schedule downtime to suppress alerts during planned maintenance.

---

## 🛠️ Tech Stack

This project is a monorepo managed by **Turborepo** and **Bun**.

- **Frontend**: Next.js 16 (App Router), React, TailwindCSS, Shadcn/UI.
- **Backend / Edge**: Cloudflare Workers (for distributed monitoring agents).
- **Database**: PostgreSQL (via Prisma ORM).
- **API**: tRPC for end-to-end type safety.
- **Authentication**: Better-Auth.
- **Package Manager**: Bun.

---

## 📂 Project Structure

```bash
pulseguard/
├── apps/
│   ├── web/             # Main dashboard application (Next.js)
│   ├── worker/          # Edge worker for background monitoring jobs (Cloudflare)
│   └── native/          # Mobile companion app (React Native / Expo)
├── packages/
│   ├── db/              # Prisma schema and client
│   ├── api/             # Shared tRPC routers and API logic
│   ├── auth/            # Authentication configuration
│   ├── email/           # Email templates and sending logic
│   └── infra/           # Infrastructure deployment configuration
└── scripts/             # Utility scripts
```

---

## ⚡ Getting Started

### Prerequisites

- **Bun** (v1.0.0 or later)
- **PostgreSQL** database (Local or Cloud)
- **Node.js** (v20+ recommended)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/pulseguard.git
    cd pulseguard
    ```

2.  **Install dependencies:**

    ```bash
    bun install
    ```

3.  **Environment Configuration:**
    - Copy `.env.example` to `.env` in `apps/web` and `apps/worker` (if applicable).
    - Ensure your `DATABASE_URL` is set correctly in `packages/db/.env` or the root `.env`.

    _Example `apps/web/.env`:_

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/pulseguard"
    better_auth_secret="your_secret_here"
    better_auth_url="http://localhost:3000"
    RESEND_API_KEY="re_123..."
    ```

4.  **Database Setup:**
    d
    Push the Prisma schema to your database:

    ```bash
    bun run db:push
    ```

5.  **Run Development Server:**
    Start the entire stack (Web, Worker, and other services):
    ```bash
    bun run dev
    ```

    - Web Dashboard: [http://localhost:3000](http://localhost:3000)
    - Database Studio: `bun run db:studio`

---

## 📜 Scripts

| Command              | Description                                        |
| :------------------- | :------------------------------------------------- |
| `bun run dev`        | Start all applications in development mode.        |
| `bun run build`      | Build all apps and packages for production.        |
| `bun run check`      | Run linter (Oxlint) and formatter (Oxfmt).         |
| `bun run db:push`    | Push schema changes to the database (prototyping). |
| `bun run db:migrate` | Run production migrations.                         |
| `bun run deploy`     | Deploy the application stack (Web + Workers).      |

---

## 🌐 Deployment

PulseGuard is optimized for deployment on **Cloudflare**.

1.  **Web App**: Deployed using Cloudflare Pages or Next.js adapter.
2.  **Workers**: Monitoring agents deployed to Cloudflare Workers for global distribution.

To deploy manualy:

```bash
bun run deploy
```

_Ensure you have `wrangler` authenticated with your Cloudflare account._
