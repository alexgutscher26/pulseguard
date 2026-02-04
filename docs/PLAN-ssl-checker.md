# Project Plan: SSL/TLS Health Check Tool

## 1. Executive Summary

Build a "Free Tool" marketing magnet that performs a quick SSL/TLS health check. The tool will analyze a target domain's certificate status, expiry, and security grade. It serves as a lead generation funnel by gating advanced details (Protocol support, Full Chain) behind an email capture.

**Key Features:**

- **Visuals:** Huge "Grade" Display (A+, B, F) + Expiry Countdown.
- **Speed:** Fast checks via Cloudflare Workers.
- **Gating:** Basic info (Grade/Expiry) is free; detailed technical diagnostics are gated.
- **Platform:** Cloudflare Workers (accepting limitations: raw protocol handshake inspection might be limited, so we will focus on _Certificate Validation_ and _Public Security Headers_ to deduce grade).

## 2. Architecture & Tech Stack

### Frontend (Next.js)

- **Path:** `/tools/ssl-checker`
- **UI:** Cyberpunk aesthetic.
- **Components:**
  - `SSLGradeCard`: Large, animated grade indicator.
  - `CertVisualizer`: Tree view of the certificate chain (Gated).
  - `ProtocolList`: Checklist of supported TLS versions (Gated).

### Backend (Cloudflare Workers)

- **Endpoint:** `POST /api/ssl-check`
- **Logic:**
  - Fetch target URL with `fetch()`.
  - Extract certificate details via standard Request/Response properties if available, or fetch `well-known` configuration if possible.
  - _Limitation Strategy:_ Since we cannot run `openssl s_client` in Workers, we will simulate the "Health Check" by checking:
    1.  HTTPS Reachability (Is it accessible?)
    2.  Certificate Expiry (via simulated lookup or external lightweight API if needed, otherwise fallback to `fetch` response headers if exposed).
    3.  HSTS Headers (`Strict-Transport-Security`).
    4.  _Note:_ True protocol version (TLS 1.0/1.1) detection is hard in Workers without Node.js `tls`. We will implement a "Basic" check that relies on what the Worker runtime can negotiate, OR we will assume "Modern" if it connects via TLS 1.3.

## 3. Data & Limits

- **Scoring Logic:**
  - **A+**: HTTPS + Valid Cert + HSTS + >6 months expiry.
  - **A**: HTTPS + Valid Cert + >1 month expiry.
  - **B**: HTTPS + Valid Cert + <1 month expiry.
  - **F**: HTTP only / Invalid Cert / Expired.
- **Rate Limiting:** IP-based (5/hour).
- **Leads:** Shares the existing "unlocked" token system.

## 4. Task Breakdown

### Phase 1: Backend (Worker) Service

- [ ] **SSL Service:** Create `SSLCheckService` in `apps/worker`.
- [ ] **Logic:**
  - Implement `checkSSL(url)` function.
  - Check reachability via `https`.
  - Check HSTS headers.
  - _Mock/Simulate_ Chain data for MVP if raw access is impossible, or use a public DNS record check (CAA) to add value.
- [ ] **API Endpoint:** Add route to `worker/src/index.ts`.

### Phase 2: Frontend Implementation

- [ ] **Page:** Create `/tools/ssl-checker/page.tsx` with `LandingHeader`.
- [ ] **Component:** Build `SSLChecker` client component.
- [ ] **Visuals:** "Hacker/Cyberpunk" style certificate analyzing animation.
- [ ] **Results:**
  - **Public:** Grade (A-F), Expiry Date, Issuer.
  - **Locked:** Cert Chain Visualization, Protocol Support, Cipher Suites.

### Phase 3: Gating & Polish

- [ ] **Unlock Integration:** reuse `localStorage` token logic.
- [ ] **SEO:** Add metadata "Free SSL Certificate Checker - PulseGuard".
- [ ] **Nav:** Update `LandingHeader` to include dropdown or list of tools.

## 5. Verification Checklist

- [ ] Does `google.com` return an A+?
- [ ] Does `expired.badssl.com` return an F?
- [ ] Is the lead capture modal working (unlocks hidden data)?
- [ ] Is the page responsive?

## 6. Agent Assignments

- **Backend:** `backend-specialist` (Worker implementation)
- **Frontend:** `frontend-specialist` (UI/UX)
