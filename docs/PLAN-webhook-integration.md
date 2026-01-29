# PLAN-webhook-integration

> **Goal**: Implement rich, interactive Notification integrations for Slack and Discord using OAuth flows, ensuring a premium "Cyberpunk" experience with actionable alerts.

---

## 1. 🧠 Context & Requirements

- **Type**: Full OAuth Apps (PulseGuard manages tokens).
- **Platforms**: Slack & Discord.
- **Experience**:
  - "Add to Slack" / "Add to Discord" flow.
  - Rich Embeds (Red/Green/Yellow states).
  - Metadata: Latency, Downtime Duration, Graph Links.
  - Interactive: "Acknowledge" button directly in chat.
- **Scope**: Specialized adapters only (Generic Webhook deferred).

---

## 2. 🏗️ Architecture Design

### A. Database Schema Updates

We need to store OAuth tokens instead of just Webhook URLs for these provider types.

```prisma
// Update NotificationChannel config handling
// Config JSON structure changes:
{
  "provider": "SLACK",
  "accessToken": "xoxb-...",
  "channelId": "C12345",
  "channelName": "#ops-alerts",
  "incomingWebhookUrl": "..." // Slack often provides this with OAuth
}
```

### B. OAuth Flow (Web)

1.  **User clicks "Add to Slack"** -> Redirects to Slack Authorize URL.
2.  **Redirect URI** (`/api/integrations/slack/callback`) handles the code exchange.
3.  **Token Storage**: access key stored encrypted in `NotificationChannel`.

### C. Worker Dispatcher (The "Voice")

The Worker needs platform-specific adapters:

- `SlackAdapter`: Uses Block Kit for layout.
- `DiscordAdapter`: Uses Embed Objects.

### D. Interactivity Handler (API)

- **Slack**: Requires a dedicated endpoint for `interactive_message` payloads.
- **Discord**: Interaction Endpoint URL (requires validation logic).
- **Action**: When user clicks "Acknowledge", updates `MonitorStatus` or logs acknowledgment.

---

## 3. 📋 Implementation Phases

### Phase 1: Foundations & Schema

- [ ] **Schema Update**: Review `NotificationChannel` flexibility for OAuth tokens.
- [ ] **Env Vars**: Add `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`, `DISCORD_CLIENT_ID`, etc.
- [ ] **Encryption**: Ensure tokens in DB are encrypted (or utilize secure storage strategy).

### Phase 2: OAuth Handling (Web)

- [ ] **Slack Route**: `GET /api/oauth/slack` & `GET /api/oauth/slack/callback`.
- [ ] **Discord Route**: `GET /api/oauth/discord` & `GET /api/oauth/discord/callback`.
- [ ] **UI Update**: Replace "Webhook URL" input with "Connect" buttons in `notification-channels.tsx`.

### Phase 3: The Adapters (Worker/Email Package)

_Refactor `@pulseguard/email` -> `@pulseguard/notifications` or add new package? For now, keep logic in Worker or shared utils._

- [ ] **Slack Blocks**: Create layouts for UP (Green), DOWN (Red), LATENCY (Yellow).
- [ ] **Discord Embeds**: Map colors and fields (Latency, Duration).
- [ ] **Images**: Generate dynamic graph images? (Deferred: Use static links for now).

### Phase 4: Interactivity (The "Click")

- [ ] **API Endpoint**: `POST /api/webhooks/interactions/slack`.
- [ ] **Logic**:
  - Parse payload.
  - Verify signature (security).
  - Log "Acknowledged by <User>" in Monitor Events.
  - Update message to show "Acknowledged ✅".

### Phase 5: Testing & Polishing

- [ ] **E2E Test**: Full flow from "Connect" to "Receive Alert" to "Acknowledge".
- [ ] **Rate Limits**: Ensure we respect Slack/Discord API limits.

---

## 4. 📝 Tech Stack Details

- **Slack API**: `@slack/web-api` (maybe too heavy for Worker? Use raw fetch).
- **Discord API**: Raw Fetch (Discord.js is too heavy).
- **Auth**: Custom OIDC/OAuth implementation in Next.js API Routes.

---

## 5. ✅ Verification Checklist

- [ ] Can connect a Slack channel via OAuth button.
- [ ] Can connect a Discord channel via OAuth button.
- [ ] "Down" alert appears red with "Acknowledge" button.
- [ ] Clicking "Acknowledge" updates the dashboard state/event log.
