# Security Policy

At PulseGuard, we take the security of our **Cyberpunk Operational Intelligence Node** seriously. We minimize the attack surface, enforce zero-trust principles, and appreciate the community's help in disclosing security vulnerabilities responsibly.

> **Philosophy**: "Assume breach. Trust nothing. Verify everything. Defense in depth."

## Supported Versions

As a SaaS platform, we primarily support the latest deployed version.

| Component          | Version | Supported          | Notes                                     |
| :----------------- | :------ | :----------------- | :---------------------------------------- |
| **Cloud Platform** | Current | :white_check_mark: | The latest deployment on `pulseguard.com` |
| **Native App**     | Latest  | :white_check_mark: | Latest release on App Store / Play Store  |
| **Self-Hosted**    | < 1.0.0 | :x:                | Not currently supported                   |

## Reporting a Vulnerability

If you discover a security vulnerability within PulseGuard, please refrain from disclosing it publicly until we have addressed it.

### 1. How to Report

Please email us at **security@pulseguard.com**.

**Must Include:**

- **Type**: (e.g., XSS, SQLi, IDOR, RCE)
- **Asset**: Full URL, API endpoint, or file path
- **PoC**: Proof of Concept or reproduction steps
- **Impact**: Estimated business or data impact

### 2. Our Response Process

1.  **Acknowledge**: We will acknowledge your report within **48 hours**.
2.  **Triaging**: We will validate the vulnerability and assign severity (Critical, High, Medium, Low) based on CVSS/OWASP.
3.  **Remediation**:
    - **Critical**: < 24 hours
    - **High**: < 3 days
    - **Medium**: < 7 days
4.  **Disclosure**: Once fixed, we will credit you in our [CHANGELOG.md](./CHANGELOG.md) (unless you prefer anonymity).

## Scope

### ✅ In Scope (Vulnerability Rewards Eligible)

- PulseGuard Web Dashboard (`dashboard.pulseguard.com`)
- PulseGuard API (`api.pulseguard.com`)
- PulseGuard Worker / Monitor Engine
- Authentication Logic (BetterAuth integration)
- Data Leaks (PII exposure)

### ❌ Out of Scope

- Social Engineering (Phishing)
- Physical Security
- Denial of Service (DDoS) - _Handled by Cloudflare_
- Spam / Rate Limiting (unless it causes service degradation)
- 3rd Party Integrations (e.g., Resend, Stripe) - _Report to them directly_

## Security Practices

We adhere to the **OWASP Top 10 (2025)** and enforce:

- **Zero Trust**: No implicit trust between services (Worker <-> API <-> DB).
- **Least Privilege**: Scoped API keys and database roles.
- **Audit Logs**: All critical actions are logged.

For architectural details, please review [ARCHITECTURE.md](./ARCHITECTURE.md).
