# Security Policy

At **PulseGuard**, we treat the security of our **Operational Intelligence Node** as paramount. We adhere to enterprise-grade standards, minimize the attack surface, and enforce zero-trust architecture. We sincerely appreciate the global security community's efforts in participating in responsible disclosure.

> **Philosophy**: *"Assume breach. Trust nothing. Verify everything. Defense in depth."*

---

## 🛡️ Supported Versions

As a continuously deployed SaaS platform, we only actively protect and maintain the latest deployed versions.

| Component          | Version | Supported          | Notes                                      |
| :----------------- | :------ | :----------------- | :----------------------------------------- |
| **Cloud Platform** | Current | :white_check_mark: | The latest deployment on `pulseguard.com`  |
| **Edge Workers**   | Current | :white_check_mark: | The active regional monitoring ping assets |
| **Self-Hosted**    | < 1.0.0 | :x:                | Local installations are not yet supported  |

---

## 🛑 Reporting a Vulnerability

If you've identified a vulnerability within the PulseGuard infrastructure, we ask that you act in good faith and report it to us privately before making any public disclosure.

### 1. How to Report

Please encrypt your findings and email them to **security@pulseguard.com**.

**Must Include:**
* **Vulnerability Type**: (e.g., XSS, SQLi, IDOR, SSRF, RCE, Broken Auth)
* **Affected Asset**: Full URL, API endpoint, or file path.
* **Proof of Concept (PoC)**: Clear reproduction steps, video, or script.
* **Impact**: Your estimated business or data compromise severity.

### 2. PGP Encryption (Recommended)

To protect sensitive disclosures, please encrypt your payload using our public PGP key:
```text
Key Fingerprint: F01F B94B 7137 896D 7204  2757 702A FB2A EB67 BCF1
[Download Public Key](apps/web/public/pgp-key.txt)
```

### 3. Response SLA

We are committed to rapid response. You can expect:
1. **Acknowledge**: Initial response within **48 hours**.
2. **Triaging**: Validation and CVSS assigned within **5 days**.
3. **Remediation**:
    * **Critical**: < 24 hours
    * **High**: < 3 days
    * **Medium**: < 7 days
    * **Low**: Processed during standard sprint cycles.
4. **Resolution**: You will be notified when the issue is mitigated and patched.

---

## 🤝 Safe Harbor

When conducting vulnerability research in accordance with this policy, we consider your actions authorized. We will not pursue legal action against you or ask law enforcement to investigate you if you act in good faith and follow these guidelines:
* Do not access, modify, or destroy user data that does not belong to you. (Use explicit test accounts for PoCs).
* Do not degrade the performance of the system (e.g., no volumetric DDoS or destructive stress testing).
* Do not execute social engineering or physical attacks against our personnel or data centers.

---

## 🧩 Security Practices & Supply Chain

We strictly adhere to the **OWASP Top 10 (2025)** and deeply respect the supply chain.

* **Zero Trust & Edge Limits**: All health-check requests originate in isolated V8 isolates (Cloudflare Workers) preventing lateral network movement.
* **Least Privilege Database**: Connection poolers enforce Row-Level Security (RLS) policies by default.
* **MFA Enforced**: Multi-factor authentication is mandatory for all core repositories and production infrastructure access. 
* **Dependency Auditing**: We heavily rely on automated `bun` lockfile scanning and dependency tracking to detect immediate zero-day vulnerabilities in upstream libraries (NPM/GitHub).

*For systemic and architectural detail, consult [ARCHITECTURE.md](./ARCHITECTURE.md).*
