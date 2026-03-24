# PulseGuard

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-edge-F38020?style=flat&logo=cloudflare)](https://workers.cloudflare.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
> **A Operational Intelligence Node for Modern Infrastructure**

**PulseGuard** is a next-generation, full-stack website monitoring and uptime platform designed for developers who demand reliability with style. Built on the edge with real-time capabilities, PulseGuard provides comprehensive insights into your infrastructure's health with a stunning cyberpunk-inspired interface.

Powered by the **Better-T-Stack** (Next.js, tRPC, Tailwind, TypeScript) and deployed globally on Cloudflare's edge network.

---

## Features

### Advanced Monitoring

- **Multi-Protocol Support**:
  - **HTTP/HTTPS**: URL checks with status code validation and response time tracking.
  - **Ping/ICMP**: Hostname reachability and latency monitoring.
  - **Port/TCP**: Service availability checks on specific ports.
- **Multi-Region Monitoring**: Check your services from multiple geographic locations simultaneously.
- **Smart Region Selection**: AI-powered region recommendations based on latency probing and traffic patterns.
- **Double-Check Protocol**: Automatic retry logic to prevent false positives.
- **Configurable Check Intervals**: From 30 seconds to 24 hours.

### Intelligent Alerting

- **Multi-Channel Notifications**:
  - **Email**: Beautiful HTML templates with dark mode support.
  - **Slack**: Rich embeds with interactive action buttons.
  - **Discord**: Color-coded status updates with webhook integration.
- **Smart Alert Routing**: Rate limiting to prevent notification spam during outages.
- **Flapping Detection**: Intelligent suppression of rapid state changes.

### Incident Management

- **Automatic Incident Creation**: Triggered when monitors go down.
- **Status Timeline Tracking**: Investigating -> Identified -> Monitoring -> Resolved.
- **Regional Incident Tracking**: Track failures by geographic region.
- **Incident History**: Complete audit trail with event logs and pagination.
- **Manual Status Updates**: Broadcast updates to all notification channels.

### Cyberpunk UI/UX

- **Real-Time WebSocket Feeds**: Live updates without polling using Cloudflare Durable Objects.
- **Data Visualization**:
  - Response time charts with neon-line aesthetics.
  - Latency heatmaps operating as contribution graphs.
  - Real-time status indicators with glow effects.
- **Command Palette (Cmd/Ctrl+K)**: Quick navigation and actions.
- **Keyboard Shortcuts**: Full keyboard control (j/k navigation, / search, c create).
- **Theme System**: Multiple cyberpunk themes including Matrix Green, Cyberpunk Pink, and Blade Runner Orange.
- **Mobile-First Design**: Responsive grid, drawer navigation, optimized touch targets.
- **Aesthetic Elements**: Scanlines, glitch effects, and optional sound FX.

### Security & Reliability

- **Authentication**: Powered by Better-Auth with session management.
- **2FA Support**: Two-factor authentication for enhanced security.
- **Trusted Device Management**: Remember devices for seamless access.
- **Circuit Breaker**: Automatic check frequency reduction for consistently failing monitors.
- **Dead Letter Queues**: Failed jobs preserved for manual inspection.
- **Worker Optimization**: Dynamic batch processing respecting strict CPU limits.

### User Experience

- **Timezone & Format Settings**: User-specific time display preferences.
- **Monitor Filtering**: Quick filter by status (All, Up, Down, Paused).
- **Bulk Actions**: Manage multiple monitors simultaneously.
- **Maintenance Windows**: Schedule downtime to suppress alerts.
- **Event Pagination**: Efficient browsing of historical events.

---

## Tech Stack

PulseGuard is built as a **Turborepo monorepo** managed with **Bun** for maximum performance.

### Frontend

- **Next.js 16** (App Router) - React framework with server components.
- **React 19** - UI library with concurrent features.
- **TailwindCSS v4** - Utility-first CSS with custom design tokens.
- **Shadcn/UI** - Accessible component library.
- **Recharts** - Data visualization for response time charts.
- **Lucide React** - Icon system.
- **CMDK** - Command palette implementation.

### Backend & Edge

- **Cloudflare Workers** - Distributed monitoring agents running globally.
- **Cloudflare Queues** - Job queue for scheduled checks.
- **Cloudflare Durable Objects** - Real-time WebSocket coordination.
- **tRPC** - End-to-end type-safe API layer.
- **Zod** - Runtime type validation.

### Database & ORM

- **PostgreSQL** - Primary data store (via Neon/Supabase).
- **Prisma** - Type-safe ORM with migrations.
- **Better-Auth** - Modern authentication with 2FA support.

### Notifications & Integrations

- **Resend** - Transactional email delivery.
- **React Email** - Type-safe email templates.
- **Webhook Integration** - Slack, Discord, and custom webhooks.

### Developer Experience

- **TypeScript** - Full type safety across the stack.
- **Oxlint & Oxfmt** - Fast linting and formatting.
- **Turbo** - Incremental builds and caching.
- **Bun** - Fast package manager and runtime.

---

## Project Structure

```bash
pulseguard/
├── apps/
│   ├── web/             # Main dashboard (Next.js 16 App Router)
│   │   ├── app/         # App router pages and API routes
│   │   ├── components/  # React components (UI, features, layouts)
│   │   ├── lib/         # Utilities, hooks, and configurations
│   │   └── public/      # Static assets
│   ├── worker/          # Cloudflare Worker for monitoring
│   │   ├── src/         # Worker logic, queue handlers, DO classes
│   │   └── wrangler.toml # Cloudflare configuration
│   └── native/          # React Native mobile app (Expo)
│       └── app/         # Mobile screens and navigation
├── packages/
│   ├── db/              # Prisma schema, migrations, and client
│   │   ├── prisma/      # Database schema and migrations
│   │   └── src/         # Database client exports
│   ├── api/             # tRPC routers and procedures
│   │   └── src/routers/ # Feature-based API routers
│   ├── auth/            # Better-Auth configuration
│   │   └── src/         # Auth setup, providers, and utilities
│   ├── email/           # Email templates and sending logic
│   │   ├── templates/   # React Email templates
│   │   └── src/         # Email service functions
│   ├── config/          # Shared TypeScript and build configs
│   └── env/             # Environment variable validation
└── scripts/             # Utility scripts for development
```

---

## Getting Started

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

    *Example `apps/web/.env`:*

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/pulseguard"
    better_auth_secret="your_secret_here"
    better_auth_url="http://localhost:3000"
    RESEND_API_KEY="re_123..."
    ```

4.  **Database Setup:**

    Push the Prisma schema to your database:

    ```bash
    bun run db:push
    ```

5.  **Run Development Server:**
    Start the entire stack (Web, Worker, and other services):

    ```bash
    bun run dev
    ```

    - Web Dashboard: http://localhost:3000
    - Database Studio: `bun run db:studio`

---

## Available Scripts

| Command               | Description                                       |
| :-------------------- | :------------------------------------------------ |
| `bun run dev`         | Start all apps in development mode (web + worker)|
| `bun run dev:web`     | Start only the web dashboard                      |
| `bun run dev:native`  | Start the mobile app (Expo)                       |
| `bun run build`       | Build all apps and packages for production        |
| `bun run check`       | Run Oxlint and Oxfmt for code quality             |
| `bun run check-types` | Type-check all packages                           |
| `bun run db:push`     | Push schema changes to database (development)     |
| `bun run db:migrate`  | Run production database migrations                |
| `bun run db:studio`   | Open Prisma Studio for database management        |
| `bun run db:generate` | Generate Prisma client                            |
| `bun run deploy`      | Deploy the application stack (Web + Workers)      |
| `bun run destroy`     | Destroy deployed infrastructure                   |

---

## Architecture

PulseGuard follows a **distributed edge-first architecture**:

### Monitoring Flow

1. **Scheduler** (Cloudflare Cron) -> Triggers checks based on monitor intervals.
2. **Queue System** -> Distributes check jobs across worker instances.
3. **Monitor Execution** -> Performs HTTP/Ping/TCP checks from edge locations.
4. **State Management** -> Tracks status changes and triggers incidents.
5. **Notification Engine** -> Sends alerts via configured channels.
6. **Real-time Updates** -> WebSocket broadcasts to connected dashboard clients.

### Data Flow

- **Write Path**: Worker -> PostgreSQL (via Prisma) -> Cache invalidation
- **Read Path**: Dashboard -> tRPC API -> PostgreSQL -> Client cache
- **Real-time**: Durable Objects -> WebSocket -> Dashboard

### Key Design Decisions

- **Edge-first**: Monitoring runs globally on Cloudflare's network.
- **Type-safe**: End-to-end TypeScript with tRPC and Zod validation.
- **Serverless**: No servers to manage, scales automatically.
- **Real-time**: WebSocket integration for live updates.
- **Monorepo**: Shared code and unified development experience.

---

## Deployment

PulseGuard is optimized for deployment on **Cloudflare's edge platform**.

### Web Dashboard

- Deploy to **Cloudflare Pages** with automatic builds.
- Or use **Vercel/Netlify** with Next.js adapter.

### Worker

- Deploy to **Cloudflare Workers** for global distribution.
- Automatic scaling and edge execution.

### Quick Deploy

```bash
bun run deploy
```

*Ensure you have `wrangler` authenticated with your Cloudflare account.*

### Environment Variables

Required environment variables are documented in `.env.example` files in each app directory.

---

## Roadmap

### In Progress

- [ ] Public status pages with custom domains.
- [ ] Advanced monitoring (SSL/TLS, DNS, Heartbeat).
- [ ] Team collaboration and RBAC.
- [ ] Mobile app push notifications.

### Planned Features

- [ ] Keyword monitoring and content validation.
- [ ] Domain expiration tracking.
- [ ] Post-mortem report generation.
- [ ] Terraform provider for IaC.
- [ ] CLI tool for monitor management.
- [ ] Advanced analytics and SLA reports.

See `TODO.md` for the complete roadmap and feature backlog.

---

## Contributing

PulseGuard is built with passion for the developer community. Contributions are welcome.

### Development Setup

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Make your changes.
4. Run tests and linting (`bun run check`).
5. Commit your changes (`git commit -m 'Add amazing feature'`).
6. Push to the branch (`git push origin feature/amazing-feature`).
7. Open a Pull Request.

### Code Standards

- Follow the existing code style.
- Write meaningful commit messages.
- Add tests for new features.
- Update documentation as needed.

---

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

---

## Acknowledgments

Built with:

- Next.js - React framework
- Cloudflare Workers - Edge computing
- Prisma - Database ORM
- tRPC - Type-safe APIs
- Better-Auth - Authentication
- Shadcn/UI - Component library

---

<div align="center">
  <strong>Built with speed and scale by developers, for developers</strong>
  <br />
  <sub>Monitor your infrastructure reliably</sub>
</div>
