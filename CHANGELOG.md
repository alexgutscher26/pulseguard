# Changelog

All notable changes to PulseGuard are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Release notes are generated automatically from [Conventional Commits](https://www.conventionalcommits.org/) via GitHub Actions on every tag push.

---

## [Unreleased]

### Added

- Self-hosted installation guide (`docs/self-hosted.md`)
- Helm chart for Kubernetes deployment (`helm/pulseguard/`)
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and GitHub issue templates
- `examples/` directory with Monitoring as Code YAML templates
- `docker-compose.yml` for full local development stack (PostgreSQL, Redis, MailHog)
- Automated release notes via GitHub Actions (`release.yml`)

---

<!-- Releases are inserted here automatically by the release workflow -->

[Unreleased]: https://github.com/alexgutscher26/pulseguard/compare/HEAD...HEAD
