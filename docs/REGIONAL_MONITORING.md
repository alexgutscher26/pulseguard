# Multi-Region Monitoring Implementation

## Overview

This implementation adds multi-region monitoring capabilities to PulseGuard **without requiring a paid Cloudflare plan**. Users can select which regions they want to monitor their services from, and the system will perform checks from those locations.

## How It Works

### 1. **Cloudflare's Global Edge Network**

Cloudflare Workers automatically run on Cloudflare's edge network (300+ locations worldwide). Even on the free tier, your Worker code executes from the nearest edge location to where the request originates.

### 2. **Regional Check Strategy**

Since we can't force a Worker to execute from a specific region on the free tier, we use a **sequential check approach**:

- When a monitor has `checkRegions` configured, the Worker performs multiple checks in sequence
- Each check is tagged with the intended region code
- The Worker executes from the nearest edge location (which may vary)
- Results are stored with region metadata for tracking

### 3. **Future Enhancement Options**

For true multi-region monitoring, you can:

1. **Use Cloudflare Durable Objects** (Free tier available):
   - Create a Durable Object per region
   - Cloudflare automatically places DOs in the optimal location
   - Each DO performs checks from its location

2. **Use Third-Party Proxies**:
   - Integrate free proxy services for specific regions
   - Route checks through region-specific proxies
   - More complex but works on free tier

3. **Upgrade to Cloudflare Paid Plan**:
   - Use Smart Placement with explicit region hints
   - Use Cloudflare Load Balancer with regional health checks
   - Access advanced routing features

## Database Schema Changes

### Monitor Table

```prisma
model Monitor {
  // ... existing fields
  checkRegions String? // JSON array of region codes: ["us-east", "eu-west", "ap-south"]
}
```

### MonitorEvent Table

```prisma
model MonitorEvent {
  // ... existing fields
  region String? // Region code where check was performed

  @@index([region])
}
```

## Available Regions

The system supports 12 regions across 5 continents:

**North America:**

- `us-east` - US East (Virginia) 🇺🇸
- `us-west` - US West (California) 🇺🇸
- `ca-central` - Canada (Toronto) 🇨🇦

**Europe:**

- `eu-west` - Europe West (Ireland) 🇮🇪
- `eu-central` - Europe Central (Frankfurt) 🇩🇪
- `eu-north` - Europe North (Stockholm) 🇸🇪

**Asia Pacific:**

- `ap-south` - Asia Pacific (Mumbai) 🇮🇳
- `ap-southeast` - Asia Pacific (Singapore) 🇸🇬
- `ap-northeast` - Asia Pacific (Tokyo) 🇯🇵
- `ap-east` - Asia Pacific (Sydney) 🇦🇺

**South America:**

- `sa-east` - South America (São Paulo) 🇧🇷

**Africa:**

- `af-south` - Africa (Cape Town) 🇿🇦

## Files Created/Modified

### New Files

1. **`packages/shared/src/regions.ts`**
   - Region configuration and metadata
   - Helper functions for region lookup

2. **`apps/worker/src/services/regional-monitor.ts`**
   - Regional check execution logic
   - Status aggregation functions

3. **`apps/web/src/components/monitors/region-selector.tsx`**
   - UI component for selecting regions
   - Grouped by continent with select-all functionality

4. **`apps/web/src/components/monitors/regional-uptime.tsx`**
   - Display regional performance statistics
   - Visual indicators for uptime and latency per region

### Modified Files

1. **`packages/db/prisma/schema/schema.prisma`**
   - Added `checkRegions` to Monitor model
   - Added `region` to MonitorEvent model

2. **`apps/web/src/actions/monitors.ts`**
   - Updated validation schema to include `checkRegions`
   - Modified create/update actions to handle region selection

3. **`apps/worker/src/index.ts`**
   - Integrated regional monitoring service
   - Store regional check results separately
   - Calculate overall status from regional results

4. **`apps/web/src/components/monitors/monitor-form.tsx`**
   - Added RegionSelector component
   - State management for selected regions

## Usage

### Creating a Monitor with Regional Checks

1. Navigate to "New Monitor" in the dashboard
2. Fill in monitor details (name, URL, type, etc.)
3. Expand the "Monitoring Regions" section
4. Select regions by continent or individually
5. Save the monitor

### Viewing Regional Performance

On the monitor detail page, the `RegionalUptime` component displays:

- Uptime percentage per region
- Average latency per region
- Total checks performed from each region
- Visual indicators (green/yellow/red) based on performance

### How Checks Work

1. **Single Region (Default)**:
   - If no regions selected, performs standard single check
   - Executes from nearest Cloudflare edge location

2. **Multi-Region**:
   - Performs sequential checks for each selected region
   - Each check is tagged with region code
   - Results stored separately in database
   - Overall status = DOWN if ANY region is down
   - Average latency calculated across all UP regions

## Cost Considerations

### Free Tier Limits

- ✅ **No additional cost** for basic regional monitoring
- ✅ Uses standard Cloudflare Workers free tier (100,000 requests/day)
- ✅ Database storage for regional events

### Optimization Tips

1. **Limit regions**: Select only critical regions to reduce check volume
2. **Adjust intervals**: Use longer intervals for multi-region monitors
3. **Monitor quota**: Track Worker request usage in Cloudflare dashboard

## Future Enhancements

1. **Regional Incident Tracking**:
   - Create incidents per region
   - Alert only when multiple regions fail

2. **Latency Heatmap**:
   - Visual map showing latency by region
   - Historical trends per region

3. **Smart Region Selection**:
   - Auto-suggest regions based on user's traffic
   - Recommend regions based on target service location

4. **Regional SLA Reports**:
   - Generate uptime reports per region
   - Export regional performance data

5. **True Multi-Region (Paid)**:
   - Implement Durable Objects for guaranteed regional execution
   - Use Cloudflare Load Balancer for advanced routing

## Testing

To test regional monitoring:

1. Create a monitor with multiple regions selected
2. Wait for scheduled checks to run (or trigger manual check)
3. View monitor detail page to see regional statistics
4. Check database for `MonitorEvent` records with `region` field populated

## Troubleshooting

### No Regional Data Showing

- Verify `checkRegions` is saved in database (JSON string)
- Check Worker logs for regional check execution
- Ensure database migration completed successfully

### All Checks from Same Region

- This is expected on free tier - Worker executes from nearest edge
- Consider upgrading to Durable Objects for true regional placement

### High Latency in Specific Region

- May indicate network issues in that region
- Check if target service has presence in that region
- Consider removing region if consistently poor performance

## Migration Guide

Existing monitors will continue to work without changes:

- `checkRegions` is optional (nullable)
- Default behavior (single check) unchanged
- No action required for existing monitors

To enable regional monitoring on existing monitors:

1. Edit the monitor
2. Select desired regions
3. Save changes
4. Regional checks will start on next scheduled run
