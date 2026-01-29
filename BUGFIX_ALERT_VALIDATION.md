# 🐛 Bug Fix: Alert Rule Validation Error

## Issue

When trying to create an alert rule through the UI, users encountered the error:

```
Invalid option: expected one of "UP"|"DOWN"|"PAUSED"|"MAINTENANCE"
```

## Root Cause

The form was sending an empty string `""` for the `targetStatus` field when "Any Status Change" was selected, but the Zod validation schema expected either:

- A valid enum value (`"UP"`, `"DOWN"`, `"PAUSED"`, `"MAINTENANCE"`)
- `undefined` (for optional field)

Empty strings were not handled properly.

## Fix Applied

Modified both `createAlertRule()` and `updateAlertRule()` functions in `apps/web/src/actions/notifications.ts` to:

1. Extract form values explicitly
2. Convert empty strings to `undefined` before validation
3. Apply this to all optional fields: `targetStatus`, `comparison`, `threshold`

### Code Change

```typescript
// Before
const rawData = {
  targetStatus: formData.get("targetStatus") as any, // ❌ Could be ""
  // ...
};

// After
const targetStatusRaw = formData.get("targetStatus") as string;
const rawData = {
  targetStatus:
    targetStatusRaw && targetStatusRaw !== ""
      ? (targetStatusRaw as any)
      : undefined, // ✅ Converts "" to undefined
  // ...
};
```

## Status

✅ **Fixed** - Alert rules can now be created successfully with "Any Status Change" option

## Testing

After this fix, you should be able to:

1. Go to `/dashboard/alerts`
2. Click "Add Rule"
3. Select a monitor
4. Choose "Status Change" trigger
5. Leave "Target Status" as "Any Status Change" (empty)
6. Select notification channels
7. Click "Create Rule" → Should work without errors! ✅

---

**Next Step**: Follow the setup guide in `NOTIFICATION_IMPLEMENTATION.md` to create your first notification channel and alert rule!
