# Project Plan: Global Latency Checker

## 1. Executive Summary

Build a high-performance "Free Tool" that allows users to ping a target URL from 10+ global locations instantly. This serves as a marketing lead magnet, showcasing the speed and global reach of PulseGuard.

**Key Features:**

- **Visuals:** Interactive World Map + Detailed Data Table.
- **Speed:** Parallel execution using Edge/Workers.
- **Growth:** Gated results (Teaser vs. Full) to capture emails.
- **Limits:** Strict rate limiting to prevent abuse.

## 2. Architecture & Tech Stack

### Frontend (Next.js)

- **Framework:** Next.js 14 (App Router)
- **Path:** `/tools/global-latency`
- **Visualization:** `react-simple-maps` or `framer-motion` SVG map for pins.
- **State Management:** React Query (for polling/fetching results).

### Backend (Cloudflare Workers)

- **Fan-out Architecture:**
  - Main Request Handler -> Spawns 10+ sub-requests to regional nodes (or uses `fetch` with specific Cloudflare `cf` location properties if applicable, or parallel calls to regional worker instances).
  - _Note:_ Cloudflare Workers are globally distributed by default, but ensuring _source_ location often requires either multiple worker deployments or specific routing logic. Alternatively, we can use a "fan-out" pattern where the central worker calls other regional endpoints.

### Data & Limits

- **Rate Limiting:** Upstash Redis or Cloudflare KV (IP-based, 5 req/hour).
- **Gating:**
  - **Public:** Shows 3 regions (e.g., US-East, EU-Central, Asia-East).
  - **Unlocked (Email Verified):** Shows all 10+ regions.
- **Lead Capture:** Simple API `POST /api/marketing/capture-email` -> Database `Leads` table.

## 3. Task Breakdown

### Phase 1: Core Logic (Backend)

- [ ] **Research:** Confirm best method to force-route requests from specific Cloudflare regions (e.g., specific subdomains or passing `cf` context).
- [ ] **Worker Implementation:**
  - Create `GlobalLatencyWorker` that accepts `targetUrl`.
  - Implement concurrent fetching (Promise.all).
  - Return JSON: `{ region: "LHR", latency: 45, status: 200 }[]`.
- [ ] **Rate Limiting:** Implement strict IP-based headers/checks.

### Phase 2: Frontend & Visualization

- [ ] **Page Layout:** Create `/tools/latency-checker` layout (Cyberpunk aesthetic).
- [ ] **Input Component:** URL bar with "Check Now" button.
- [ ] **Map Component:**
  - Render simplified world map.
  - Add pulses/pins based on active regions.
  - Color code: Green (<200ms), Yellow (<500ms), Red (>500ms/Down).
- [ ] **Results Table:** Sortable list of regions and latencies.

### Phase 3: Marketing & Gating Loop

- [ ] **Teaser Logic:**
  - If no "marketing_token" in local storage, slice results array to top 3.
  - Blur/Lock remaining rows.
- [ ] **Lead Capture Modal:**
  - "Unlock full global report" popup.
  - Email input.
  - API route to save email.
  - Return distinct "unlock" token.
- [ ] **Navigation:** Add "Free Tools" item to main `Navbar` and `Footer`.

### Phase 4: SEO & Polish

- [ ] **SEO:** Set metadata (Title: "Global Website Speed Test - Check Latency from 10 Cities").
- [ ] **Schema:** Add `SoftwareApplication` JSON-LD.
- [ ] **Performance:** Ensure the tool itself is fast (score >90 on Lighthouse).

## 4. Verification Checklist

- [ ] Can successfully ping `google.com` from 3 distinct continents?
- [ ] Does rate limiting block the 6th check from the same IP?
- [ ] Does the map visual align with the tabular data?
- [ ] Does the email capture unlock the hidden rows?
- [ ] Is SEO metadata present and correct?

## 5. Agent Assignments

- **Architecture/Backend:** `backend-specialist` (API & Workers)
- **Frontend/UI:** `frontend-specialist` (Map, Animations, Gating)
- **Marketing:** `seo-specialist` (Copy, Meta tags)
