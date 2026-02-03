# PLAN - Email Integration

**Task:** Integrate Resend for transactional emails with cyberpunk-styled HTML templates.

---

## Phase 0: Context & Decisions

### Provider

- **Resend** (Modern, Next.js-friendly, React Email support)

### Email Types

1. **Monitor Alerts**
   - Monitor DOWN (Critical)
   - Monitor UP (Resolved)
   - Maintenance Window Started
   - Maintenance Window Ended
2. **Account Management**
   - Welcome Email
   - Email Verification
   - Password Reset
3. **Digest/Reports**
   - Weekly Uptime Summary
   - Monthly Performance Report

### Design System

- **Colors:** Neon Green (`#39ff14`), Black (`#050505`), Dark Gray (`#0a0a0a`)
- **Typography:** Monospace (Geist Mono fallback to Courier)
- **Style:** Brutalist, Retro-Futurism, Scanlines, Glowing accents
- **Dark Mode:** Default (email clients that support `prefers-color-scheme`)

---

## Phase 1: Architecture

### Package Structure

```
packages/
  email/
    package.json
    tsconfig.json
    src/
      index.ts              # Resend client + send helpers
      templates/
        monitor-down.tsx    # React Email template
        monitor-up.tsx
        welcome.tsx
        verification.tsx
        weekly-digest.tsx
      styles/
        theme.ts            # Shared color/font constants
```

### Dependencies

- `resend` - Email API client
- `@react-email/components` - Email-safe React components
- `@react-email/render` - Convert React to HTML

### Integration Points

1. **Worker** (`apps/worker`) - Consumes `NOTIFICATION_QUEUE`, sends alerts
2. **Web API** (`apps/web`) - Sends verification/welcome emails via tRPC
3. **Shared Package** (`packages/email`) - Reusable templates + client

---

## Phase 2: Implementation Tasks

### 2.1 Create `packages/email`

- [ ] Initialize package with `package.json`
- [ ] Install dependencies: `resend`, `@react-email/components`, `@react-email/render`
- [ ] Create `src/index.ts` with Resend client singleton
- [ ] Create `src/styles/theme.ts` with design tokens

### 2.2 Design Email Templates (React Email)

- [ ] **monitor-down.tsx**
  - Subject: `🔴 [CRITICAL] {monitorName} is DOWN`
  - Content: Monitor name, URL, timestamp, error reason, CTA ("View Dashboard")
  - Style: Red destructive accent, neon green CTA button
- [ ] **monitor-up.tsx**
  - Subject: `✅ [RESOLVED] {monitorName} is UP`
  - Content: Monitor name, downtime duration, CTA
  - Style: Neon green success accent
- [ ] **welcome.tsx**
  - Subject: `Welcome to PulseGuard - Your Monitors Await`
  - Content: Getting started guide, CTA ("Create First Monitor")
- [ ] **verification.tsx**
  - Subject: `Verify Your Email - PulseGuard`
  - Content: Verification link (magic link or code)
- [ ] **weekly-digest.tsx**
  - Subject: `📊 Weekly Uptime Report - {weekRange}`
  - Content: Total monitors, uptime %, incidents, top performers

### 2.3 Email Client Helpers

- [ ] `sendMonitorAlert(to, monitor, status, reason)`
- [ ] `sendWelcomeEmail(to, userName)`
- [ ] `sendVerificationEmail(to, verificationUrl)`
- [ ] `sendWeeklyDigest(to, stats)`

### 2.4 Worker Integration

- [ ] Update `apps/worker/wrangler.jsonc` to add `RESEND_API_KEY` secret
- [ ] Create `apps/worker/src/notification-handler.ts`
- [ ] Implement Queue consumer for `notifications` queue
- [ ] Fetch `AlertRule` → `NotificationChannel` relations
- [ ] Filter channels by type `EMAIL`
- [ ] Call `packages/email` helpers

### 2.5 Web API Integration

- [ ] Add tRPC mutation `sendVerificationEmail`
- [ ] Hook into BetterAuth registration flow
- [ ] Add tRPC query `getWeeklyDigest` (cron-triggered or manual)

---

## Phase 3: Template Design Specifications

### Common Structure

```tsx
<Html>
  <Head>
    <style>{inlineCss}</style>
  </Head>
  <Body
    style={{ background: "#050505", color: "#e0e0e0", fontFamily: "monospace" }}
  >
    <Container style={{ maxWidth: "600px", border: "2px solid #333" }}>
      <Header>
        <Text style={{ color: "#39ff14", fontSize: "24px" }}>PULSEGUARD</Text>
      </Header>
      <Section>{/* Content */}</Section>
      <Footer>
        <Text style={{ color: "#666", fontSize: "12px" }}>
          Sent by PulseGuard | Unsubscribe
        </Text>
      </Footer>
    </Container>
  </Body>
</Html>
```

### Design Tokens (`theme.ts`)

```ts
export const emailTheme = {
  colors: {
    background: "#050505",
    foreground: "#e0e0e0",
    primary: "#39ff14",
    destructive: "#ff3333",
    border: "#333333",
    muted: "#666666",
  },
  fonts: {
    mono: '"Courier New", Courier, monospace',
  },
  spacing: {
    sm: "8px",
    md: "16px",
    lg: "24px",
  },
};
```

### Inline Styles (Email Client Compatibility)

- **No Tailwind** in emails (limited support)
- **Inline all styles** via `style={{ ... }}`
- **Table-based layouts** for Outlook compatibility
- **Dark mode:** Use `@media (prefers-color-scheme: dark)` where supported

---

## Phase 4: Verification

### Automated Tests

- [ ] Unit test: Render each template to HTML
- [ ] Verify no broken links in CTAs
- [ ] Test Resend API with sandbox mode

### Manual Tests

- [ ] Send test email to Gmail, Outlook, Apple Mail
- [ ] Verify dark mode rendering
- [ ] Check mobile responsiveness
- [ ] Validate CTA button clicks

### Security Checks

- [ ] Ensure `RESEND_API_KEY` is in secrets (not committed)
- [ ] Validate email addresses before sending
- [ ] Rate limit email sends (prevent abuse)

---

## Phase 5: Deployment

### Environment Variables

```bash
# Worker
RESEND_API_KEY=re_xxxxx

# Web (if needed for verification emails)
RESEND_API_KEY=re_xxxxx
```

### Resend Setup

1. Create account at resend.com
2. Verify domain (e.g., `pulseguard.com`)
3. Generate API key
4. Add to Cloudflare Workers secrets: `wrangler secret put RESEND_API_KEY`

---

## Dependencies

### New Packages

```json
// packages/email/package.json
{
  "dependencies": {
    "resend": "^4.0.0",
    "@react-email/components": "^0.0.25",
    "@react-email/render": "^1.0.1",
    "react": "^19.2.3"
  }
}
```

### Workspace Updates

```json
// Root package.json catalog
{
  "resend": "^4.0.0",
  "@react-email/components": "^0.0.25"
}
```

---

## Success Criteria

- [ ] All 5 email templates render correctly in major clients
- [ ] Worker sends alert emails on monitor DOWN/UP
- [ ] Web sends verification emails on signup
- [ ] No PII leaks in email logs
- [ ] Dark mode supported in Gmail/Apple Mail
- [ ] Cyberpunk aesthetic matches web app

---

## Timeline Estimate

| Phase              | Tasks   | Est. Time    |
| ------------------ | ------- | ------------ |
| Package Setup      | 2.1     | 30 min       |
| Templates          | 2.2     | 2 hours      |
| Helpers            | 2.3     | 1 hour       |
| Worker Integration | 2.4     | 1.5 hours    |
| Web Integration    | 2.5     | 1 hour       |
| Testing            | Phase 4 | 1 hour       |
| **Total**          |         | **~7 hours** |

---

## Next Steps

1. Review this plan
2. Run `/create` or start with Phase 1
3. Set up Resend account and verify domain
