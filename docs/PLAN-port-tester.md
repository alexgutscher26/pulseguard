# Project Plan: Port Forwarding Tester

## 1. Executive Summary

Develop a "Free Tool" for gamers and home-lab enthusiasts to check if specific ports (e.g., Minecraft 25565, Plex 32400) are open and accessible from the public internet. This tool capitalizes on the "Self-Hosting" niche to drive traffic to PulseGuard.

**Key Features:**

- **Functionality:** Real TCP handshake attempts using Cloudflare Workers `connect()`.
- **UX:** "Gamer/Terminal" aesthetic with quick presets (Minecraft, SSH, FTP).
- **Gating:**
  - **Free:** Check 1 custom port or 1 preset.
  - **Unlocked (Lead Gen):** "Scan Common Ports" (Batch check 10+ ports) + "Save Profile".

## 2. Architecture & Tech Stack

### Frontend (Next.js)

- **Path:** `/tools/port-check`
- **UI:** Terminal-inspired design (Monospace fonts, green/amber status lights).
- **Components:**
  - `PortScanner`: Main input (IP/Hostname + Port).
  - `PresetGrid`: Quick buttons for common services.
  - `BatchScanner`: Gated multi-port results view.

### Backend (Cloudflare Workers)

- **Endpoint:** `POST /api/port-check`
- **Technology:** `cloudflare:sockets` logic.
- **Logic:**
  1.  Validate input (Host + Port).
  2.  Attempt `connect({ hostname, port })`.
  3.  If connection opens -> **OPEN**.
  4.  If timeout/refused -> **CLOSED**.
  5.  _Constraint Handling:_ If Cloudflare blocks the outbound port (e.g. port 25), return specific "BLOCKED_BY_PROVIDER" status to inform user it's not their fault.

## 3. Data & Limits

- **Presets:**
  - Minecraft (25565)
  - HTTP/HTTPS (80/443)
  - SSH (22)
  - FTP (21)
  - Plex (32400)
- **Rate Limiting:** Stricter (3/min) due to potential abuse for port scanning attacks.

## 4. Task Breakdown

### Phase 1: Backend Service

- [ ] **Socket Service:** Create `PortCheckService` using `cloudflare:sockets`.
- [ ] **Implementation:**
  - `checkPort(host, port)`: Boolean result.
  - Timeout logic (max 3s).
- [ ] **API Endpoint:** Register `/api/port-check`.

### Phase 2: Frontend Implementation

- [ ] **Page:** `/tools/port-check` page layout.
- [ ] **Component:** `PortChecker` with:
  - Input fields (Auto-detect user IP if possible).
  - "Scan" button with loading state.
  - Presets (Buttons).
- [ ] **Gating:** "Scan All Common Ports" button triggers email unlock modal.

### Phase 3: Integration & Polish

- [ ] **Nav:** Add to "Free Tools" dropdown.
- [ ] **SEO:** Metadata ("Open Port Checker - Minecraft, SSH, Plex").
- [ ] **IP Detection:** Add "Use My IP" button (requires worker to echo back `CF-Connecting-IP`).

## 5. Verification Checklist

- [ ] Can successfully detect an open port (self-test e.g., google.com:443)?
- [ ] Does it correctly report CLOSED for random closed ports?
- [ ] Does the "Batch Scan" gating work?
- [ ] Is the rate limiter active?

## 6. Agent Assignments

- **Backend:** `backend-specialist` (Sockets)
- **Frontend:** `frontend-specialist` (UI)
