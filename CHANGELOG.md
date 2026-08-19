# Changelog

All notable changes to PulseGuard are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Release notes are generated automatically from [Conventional Commits](https://www.conventionalcommits.org/) via GitHub Actions on every tag push.

---

## [1.1.2] - 2026-08-19

### Fixed

- **Auth / Workspaces:** Fixed race condition causing duplicate personal workspace creation on initial user onboarding with atomic Better-Auth signup hook, in-memory mutex synchronization, and self-healing duplicate cleanup.
- **Monitoring Engine:** Upgraded Regional Probes, Durable Objects, and Edge Check services to send authentic Chrome 133 Client Hints (`Sec-CH-UA`, `Sec-Fetch-Dest`, `Sec-Fetch-Mode`) preventing false-positive WAF blocks on Cloudflare and Vercel.
- **Secret Management:** Hardened AES-256-GCM encrypted header resolution across worker queues and manual verification triggers.
- **Database Connectivity:** Fixed SSL negotiation logic in Supabase Supavisor pooler client adapters.

### Added

- **Security Portal:** Added platform security documentation, encryption specifications, and vulnerability disclosure policy at `/security`.

---

[Unreleased]: https://github.com/alexgutscher26/pulseguard/compare/v1.1.2...HEAD
[1.1.2]: https://github.com/alexgutscher26/pulseguard/releases/tag/v1.1.2
