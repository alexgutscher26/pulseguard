# 🔔 PulseGuard Notification Setup Guide

## Quick Start: Get Notifications Working in 3 Steps

### Step 1: Create a Notification Channel

1. Navigate to **Dashboard → Alerts**
2. Click **"Add Channel"** button
3. Choose your preferred method:

#### Option A: Discord (Recommended)

1. Go to your Discord server
2. Right-click on a channel → **Edit Channel**
3. Go to **Integrations** → **Webhooks** → **New Webhook**
4. Copy the webhook URL
5. In PulseGuard:
   - Name: "Discord Alerts"
   - Type: Discord Webhook
   - Webhook URL: Paste your Discord webhook URL
6. Click **"Save Channel"**
7. Click **"Test"** to verify it works

#### Option B: Slack

1. Go to https://api.slack.com/apps
2. Create a new app → From scratch
3. Enable **Incoming Webhooks**
4. Add webhook to workspace
5. Copy the webhook URL
6. In PulseGuard:
   - Name: "Slack Alerts"
   - Type: Slack Webhook
   - Webhook URL: Paste your Slack webhook URL
7. Click **"Save Channel"**
8. Click **"Test"** to verify it works

#### Option C: Email

1. In PulseGuard:
   - Name: "Email Alerts"
   - Type: Email
   - Email Address: your@email.com
2. Click **"Save Channel"**

---

### Step 2: Create Alert Rules (Optional - Auto-created for new monitors)

Alert rules are **automatically created** when you add a new monitor if you have notification channels configured.

To manually create an alert rule:

1. In the **Alert Rules** section, click **"Add Rule"**
2. Select your monitor
3. Choose trigger type:
   - **Status Change**: Alert when monitor goes DOWN/UP
   - **High Latency**: Alert when response time exceeds threshold
   - **SSL Expiry**: Alert when SSL certificate is about to expire
4. Select which notification channels to use
5. Click **"Create Rule"**

---

### Step 3: Test Your Setup

1. Create a test monitor with a URL that will fail (e.g., `https://this-will-definitely-fail-12345.com`)
2. Wait 1-2 minutes for the worker to check it
3. You should receive a notification on your configured channel(s)!

---

## For Existing Monitors (Migration)

If you have monitors created **before** setting up notification channels, run this script to add default alert rules:

```bash
cd c:\Users\gutsc\OneDrive\Desktop\pulseguard
bun run scripts/add-default-alert-rules.ts
```

This will:

- ✅ Create default alert rules for monitors without any
- ✅ Connect all your notification channels to each monitor
- ✅ Enable notifications for status changes to DOWN

---

## Troubleshooting

### "No notifications are being sent"

**Check 1: Do you have notification channels?**

- Go to Dashboard → Alerts
- Verify you have at least one channel listed
- Click "Test" to verify it works

**Check 2: Do your monitors have alert rules?**

- In the Alert Rules section, verify each monitor has at least one rule
- Rules should show as "ENABLED" (not "DISABLED")

**Check 3: Check worker logs**

```bash
# In the worker terminal, look for:
[Notification] Queueing incident ALERT for <monitor-name>
[Notification] Processing X notification(s)...
[Notification] Sent X alerts for <monitor-name>
```

**Check 4: Verify webhook URLs**

- Discord webhooks should start with: `https://discord.com/api/webhooks/...`
- Slack webhooks should start with: `https://hooks.slack.com/services/...`

### "Test button works but real alerts don't"

This means:

- ✅ Your notification channel is configured correctly
- ❌ Your monitor doesn't have an alert rule

**Solution:**

1. Go to Alert Rules section
2. Click "Add Rule"
3. Select your monitor
4. Choose "Status Change" → "DOWN"
5. Select your notification channel
6. Click "Create Rule"

### "Monitor shows DOWN but no alert"

**Possible causes:**

1. **Flapping protection**: If monitor goes UP/DOWN rapidly (>3 times in 5 mins), alerts are suppressed
2. **No alert rule**: Monitor doesn't have an alert rule configured
3. **Disabled rule**: Alert rule exists but is disabled (toggle it back on)

---

## Advanced Configuration

### Multiple Channels per Monitor

You can send alerts to multiple destinations:

1. Create multiple notification channels (Discord + Slack + Email)
2. When creating an alert rule, select all channels you want
3. Alerts will be sent to all selected channels simultaneously

### Different Rules for Different Conditions

Example setup:

- **Rule 1**: Status → DOWN → Send to Discord + PagerDuty (Critical)
- **Rule 2**: Latency > 2000ms → Send to Slack (Warning)
- **Rule 3**: SSL expires < 7 days → Send to Email (Info)

### Disable Notifications Temporarily

1. Go to Alert Rules
2. Click the power icon next to a rule to disable it
3. Click again to re-enable

---

## Current Status Check

Run this to see your current setup:

```sql
-- Check notification channels
SELECT id, name, type FROM "NotificationChannel";

-- Check alert rules
SELECT
  ar.id,
  m.name as monitor_name,
  ar.trigger,
  ar.enabled,
  COUNT(c.id) as channel_count
FROM "AlertRule" ar
JOIN "Monitor" m ON ar."monitorId" = m.id
LEFT JOIN "_AlertRuleToNotificationChannel" arc ON ar.id = arc."A"
LEFT JOIN "NotificationChannel" c ON arc."B" = c.id
GROUP BY ar.id, m.name, ar.trigger, ar.enabled;
```

---

## Need Help?

If notifications still aren't working after following this guide:

1. Check the worker logs for errors
2. Verify your monitor is actually going DOWN (check events in monitor detail page)
3. Test your webhook URL manually using curl:

```bash
# Discord
curl -X POST "YOUR_DISCORD_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test from PulseGuard"}'

# Slack
curl -X POST "YOUR_SLACK_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"text": "Test from PulseGuard"}'
```

If the curl test works but PulseGuard doesn't send alerts, there's an issue with the alert rule configuration.
