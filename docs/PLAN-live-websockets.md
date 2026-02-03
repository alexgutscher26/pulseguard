# Plan: Live WebSocket Feeds (Durable Objects)

> **Goal**: Replace `useQuery` polling with real-time WebSockets using Cloudflare Durable Objects to stream Event/Check logs to the generic monitor details page. Future-proofed for Public Status Pages.

## 1. Architecture & Design

### Components

1.  **MonitorChannel (Durable Object)**:
    - Acts as a Pub/Sub broker for a specific Monitor ID.
    - Manages active WebSocket connections.
    - Broadcasts new check results to all connected clients.
2.  **Monitor Runner (Worker)**:
    - Existing worker that runs checks.
    - **Change**: After writing to DB, it will `fetch` or `stub.call` the `MonitorChannel` DO to publish the result.
3.  **Next.js API Route (WebSocket Gateway)**:
    - Endpoint: `/api/live/monitors/[monitorId]/ws`
    - Handles Authentication (BetterAuth).
    - Upgrades HTTP -> WebSocket.
    - Passes socket to the Durable Object.
4.  **Frontend Client**:
    - `useMonitorSocket` hook.
    - Reconciles initial server-fetched data with incoming streaming events.

### Security Model (Phase 1)

- **Authentication**: Strictly required. Verify session cookies in the Upgrade request.
- **Authorization**: Ensure user belongs to the workspace that owns the monitor.
- **Future Compat**: Structure the DO to accept "anonymous" connections later for Status Pages (managed via a separate public logic branch).

---

## 2. Implementation Steps

### Phase 1: Durable Object Infrastructure

- [ ] **Define `MonitorChannel` Class**:
  - Create `apps/worker/src/objects/MonitorChannel.ts`.
  - Implement `fetch` handler for WebSocket upgrades.
  - Implement `broadcast` method.
  - Store sessions in `this.ctx.getWebSockets()`.
- [ ] **Update Configuration**:
  - Update `apps/worker/wrangler.toml` with `[durable_objects]` binding.
  - Run migration to enable the namespace.

### Phase 2: Producer Integration (The Runner)

- [ ] **Connect Runner to DO**:
  - In `apps/worker/src/index.ts` (or wherever check logic resides):
  - Get the `MonitorChannel` ID using `monitorId`.
  - Send the `CheckResult` payload to the DO via an internal fetch request (e.g., `POST /broadcast`).

### Phase 3: Consumer API (The Gateway)

- [ ] **Create WebSocket Route**:
  - NOTE: Next.js on Vercel/Node doesn't support DO WebSockets directly easily if hosted separately.
  - **Strategy**: Since we are using Cloudflare, exposing the Worker directly for WS is best.
  - Add a route to the _Worker_ `router` (e.g., `GET /ws/monitors/:id`).
  - The Next.js app will connect to the _Worker URL_, not the Next.js backend, for the socket.
- [ ] **Implement Auth Check in Worker**:
  - Since the Worker is standalone, it needs to validate the session.
  - Share/Validate the session token (cookie) sent during the WS handshake.

### Phase 4: Frontend Implementation

- [ ] **Create `useLiveEvents` Hook**:
  - Accepts `monitorId`.
  - Connects to `wss://<worker-url>/ws/monitors/<id>`.
  - Handles automatic reconnection.
- [ ] **Update Monitor Detail View**:
  - Integrate hook into `apps/web/app/(dashboard)/monitors/[id]/page.tsx` (or client component).
  - Merge streaming events into the existing `events` list state.
  - Add visual indicator (e.g., "Live" green dot).

---

## 3. Verification Checklist

- [ ] **Connection**: Can a client establish a WS connection?
- [ ] **Auth**: Does it reject unauthenticated requests?
- [ ] **Broadcasting**: When a check runs, does the client receive the JSON payload immediately?
- [ ] **Scale**: Do multiple tabs for the same monitor all receive updates?
- [ ] **Resilience**: Does it reconnect after network blip?
