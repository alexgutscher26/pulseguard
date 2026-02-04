# Plan: Data Export (Compliance)

> **Goal**: specific functionality to export raw monitor logs (`MonitorEvent`) in CSV or JSON formats for audit compliance and external analysis.

## 1. Requirements

### User Requirements

- **Granularity**: Export data on a **per-monitor** basis.
- **Formats**: Support **CSV** (for convenient Excel/Sheets analysis) and **JSON** (for machine parsing).
- **Time Range**: Allow users to select ranges (e.g., Last 7 Days, Last 30 Days, Custom Range).
- **Data**: Include timestamp, status, latency, error details, and region.

### Technical Constraints

- **Performance**: Prevent memory overflows when exporting large datasets (e.g., 1 month @ 1-min intervals ≈ 43,000 records).
- **Method**: Use **Streaming Responses** to deliver files efficiently without buffering the entire dataset server-side.
- **Security**: Strict checking that the authenticated user owns the monitor being exported.

## 2. Architecture

### Database Access

- **Source**: `MonitorEvent` table.
- **Fields**: `timestamp`, `status`, `latency`, `region`, `errorReason`.
- **Query Strategy**: Fetch in batches or stream directly from Prisma if using an adapter that supports it, otherwise plain pagination to feed the stream.

### API Design

- **Endpoint**: `GET /api/monitors/[monitorId]/export`
- **Query Params**:
  - `start`: ISO Date
  - `end`: ISO Date
  - `format`: `csv` | `json`

### UI Flow

1.  **Entry Point**: "Export Data" button in the `MonitorSettings` tab or near the `MonitorStats`.
2.  **Interaction**: Opens a simplified dialog/popover.
3.  **Input**: Select Date Range (DatePicker) + Format (Radio).
4.  **Action**: "Download Export" triggers the browser download.

## 3. Implementation Steps

### Phase 1: Backend (The Streaming Engine)

- [ ] **Create Export Service**:
  - Implement `getMonitorEventsForExport(monitorId, range)` in `packages/db` or a server util.
  - Ensure it selects _only_ necessary fields to minimize payload.
- [ ] **Build CSV Transformer**:
  - Utility to transform an array of objects/stream chunks into CSV rows.
  - Headers: `Timestamp (UTC)`, `Status`, `Latency (ms)`, `Region`, `Error Details`.
- [ ] **Create Route Handler**:
  - `apps/web/src/app/api/monitors/[id]/export/route.ts`
  - Validate session & ownership.
  - Set headers:
    - `Content-Type: text/csv` or `application/json`
    - `Content-Disposition: attachment; filename="monitor-{name}-{date}.csv"`
  - Stream the response.

### Phase 2: Frontend (The Export UI)

- [ ] **Export Component**:
  - Create `MonitorExportModal` or `ExportCard` in the simplified "Settings" or "Logs" view.
  - Use `DateRangePicker` component (if available in UI kit) or simple Select (24h, 7d, 30d).
- [ ] **Client Logic**:
  - `window.open` or hidden `<a>` tag download trigger with constructed query params.

### Phase 3: Validation

- [ ] **Ownership Test**: Verify user cannot export another user's monitor.
- [ ] **Volume Test**: Test exporting ~50k rows (approx 1 month of minute-by-minute data) to ensure no timeouts.
- [ ] **Format Test**: Verify CSV opens correctly in Excel/Numbers.

## 4. Work Breakdown

| Task   | Description                              | Est. Complexity |
| :----- | :--------------------------------------- | :-------------- |
| **B1** | API Route with Streaming & Query parsing | Medium          |
| **B2** | CSV Generation Logic                     | Low             |
| **F1** | Export Modal UI Component                | Low             |
| **Q1** | Performance & Security Check             | Low             |

## 5. Verification Checklist

- [ ] Clicking "Export CSV" downloads a valid `.csv` file.
- [ ] JSON export contains valid strictly typed array.
- [ ] Exporting a range with no data returns an empty file (with headers) or a 204.
- [ ] Large export starts downloading immediately (TTFB < 500ms).
