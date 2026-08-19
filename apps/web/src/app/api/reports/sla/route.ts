import { NextRequest, NextResponse } from "next/server";
import { auth } from "@steadystack/auth";
import { headers } from "next/headers";
import { getComprehensiveSlaReport } from "@/actions/sla-reports";
import { assertFeatureFlag } from "@/lib/billing-server";
import { renderSlaReportToBuffer, type SlaReportData } from "@steadystack/email";

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate Request
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. Parse Query Parameters
    const searchParams = req.nextUrl.searchParams;
    const fromParam = searchParams.get("from") || undefined;
    const toParam = searchParams.get("to") || undefined;
    const rangeParam = searchParams.get("range") || (fromParam && toParam ? "custom" : "30d");
    const monitorId = searchParams.get("monitorId") || undefined;
    const statusPageId = searchParams.get("statusPageId") || undefined;
    const targetSlaParam = searchParams.get("targetSla") || "99.9";
    const format = (searchParams.get("format") || "json").toLowerCase();
    const agencyName = searchParams.get("agencyName") || undefined;
    const clientName = searchParams.get("clientName") || undefined;
    const notes = searchParams.get("notes") || undefined;

    const targetSla = parseFloat(targetSlaParam) || 99.9;

    // 3. Generate SLA Analytics
    const slaReport = await getComprehensiveSlaReport({
      monitorId,
      statusPageId,
      range: rangeParam as any,
      startDate: fromParam,
      endDate: toParam,
      targetSla,
      agencyName,
      clientName,
      notes,
    });

    const fileScope = (clientName || slaReport.scopeName).toLowerCase().replace(/[^a-z0-9]/gi, "-");

    // 4. Handle JSON Format
    if (format === "json") {
      return new NextResponse(JSON.stringify(slaReport, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="sla-report-${fileScope}-${slaReport.startDate}.json"`,
        },
      });
    }

    // 5. Handle CSV Format
    if (format === "csv") {
      let csv = "SteadyStack SLA Compliance Report\n";
      csv += `Scope,${slaReport.scopeName}\n`;
      csv += `Client,${clientName || slaReport.scopeName}\n`;
      csv += `Audit Window,${slaReport.startDate} to ${slaReport.endDate}\n`;
      csv += `Target SLA,${slaReport.targetSla}%\n`;
      csv += `Achieved Uptime,${slaReport.aggregate.uptimePct.toFixed(3)}%\n`;
      csv += `SLA Compliance Status,${slaReport.isSlaMet ? "PASS" : "FAIL"}\n`;
      csv += `Total Downtime (Minutes),${slaReport.aggregate.totalDowntimeMinutes}\n`;
      csv += `Allowed Downtime (Minutes),${slaReport.aggregate.allowedDowntimeMinutes.toFixed(1)}\n`;
      csv += `Error Budget Remaining,${slaReport.aggregate.remainingErrorBudgetPct.toFixed(1)}%\n`;
      csv += `Total Checks,${slaReport.aggregate.totalChecks}\n`;
      csv += `Total Incidents,${slaReport.aggregate.totalIncidents}\n`;
      csv += `MTTR (Minutes),${slaReport.aggregate.mttrMinutes.toFixed(1)}\n`;
      csv += `Average Latency (ms),${slaReport.aggregate.avgLatencyMs}\n\n`;

      csv += "--- SERVICES BREAKDOWN ---\n";
      csv += "Service ID,Name,Type,Checks,Uptime %,Downtime (Min),SLA Status\n";
      for (const s of slaReport.services) {
        csv += `"${s.id}","${s.name}","${s.type}",${s.checks},${s.uptimePct.toFixed(3)}%,${s.downtimeMinutes},"${s.status}"\n`;
      }
      csv += "\n";

      csv += "--- DAILY COMPLIANCE BREAKDOWN ---\n";
      csv += "Date,Checks Total,Checks Up,Checks Down,Uptime %,Downtime (Min)\n";
      for (const d of slaReport.dailyBreakdown) {
        csv += `"${d.date.split("T")[0]}",${d.checksTotal},${d.checksUp},${d.checksDown},${d.uptimePct.toFixed(3)}%,${d.downDuration}\n`;
      }
      csv += "\n";

      csv += "--- OUTAGE & INCIDENT AUDIT LOG ---\n";
      csv += "Incident ID,Timestamp (UTC),Service,Duration (Min),Root Cause,Status,Severity\n";
      for (const inc of slaReport.incidents) {
        const cleanReason = (inc.reason || "").replace(/"/g, '""');
        csv += `"${inc.id}","${inc.startedAt}","${inc.serviceName}",${inc.durationMinutes},"${cleanReason}","${inc.status}","${inc.severity}"\n`;
      }

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="sla-report-${fileScope}-${slaReport.startDate}.csv"`,
        },
      });
    }

    // 6. Handle PDF Format (Gated by Plan)
    if (format === "pdf") {
      const { allowed, error } = await assertFeatureFlag(session.user.id, "sla_pdf_export");
      if (!allowed) {
        return new NextResponse(
          JSON.stringify({
            error: error || "Branded SLA PDF exports require a Netrunner or Construct plan.",
            code: "PLAN_UPGRADE_REQUIRED",
          }),
          { status: 403, headers: { "Content-Type": "application/json" } },
        );
      }

      const reportId = `SLA-${new Date().toISOString().split("T")[0]!.replace(/-/g, "")}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const reportData: SlaReportData = {
        reportId,
        generatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
        agencyName,
        clientName,
        scopeName: slaReport.scopeName,
        startDate: slaReport.startDate,
        endDate: slaReport.endDate,
        targetSla: slaReport.targetSla,
        actualUptime: slaReport.aggregate.uptimePct,
        isSlaMet: slaReport.isSlaMet,
        totalMonitoredMinutes: Math.max(
          1,
          Math.round(
            slaReport.aggregate.allowedDowntimeMinutes /
              ((100 - slaReport.targetSla) / 100 || 0.001),
          ),
        ),
        allowedDowntimeMinutes: slaReport.aggregate.allowedDowntimeMinutes,
        consumedDowntimeMinutes: slaReport.aggregate.totalDowntimeMinutes,
        remainingErrorBudgetPct: slaReport.aggregate.remainingErrorBudgetPct,
        totalChecks: slaReport.aggregate.totalChecks,
        totalIncidents: slaReport.aggregate.totalIncidents,
        mttrMinutes: slaReport.aggregate.mttrMinutes,
        mttdSeconds: slaReport.aggregate.mttdSeconds,
        avgLatencyMs: slaReport.aggregate.avgLatencyMs,
        p95LatencyMs: slaReport.aggregate.p95LatencyMs,
        p99LatencyMs: slaReport.aggregate.p99LatencyMs,
        notes,
        services: slaReport.services.map((s) => ({
          id: s.id,
          name: s.name,
          type: s.type,
          checks: s.checks,
          uptimePct: s.uptimePct,
          downtimeMinutes: s.downtimeMinutes,
          status: s.status,
        })),
        incidents: slaReport.incidents.map((inc) => ({
          id: inc.id,
          startedAt: inc.startedAt,
          durationMinutes: inc.durationMinutes,
          serviceName: inc.serviceName,
          reason: inc.reason,
          status: inc.status,
        })),
        dailyBreakdown: slaReport.dailyBreakdown.map((d) => ({
          date: d.date,
          checksTotal: d.checksTotal,
          uptimePct: d.uptimePct,
          downDuration: d.downDuration,
        })),
      };

      const pdfBuffer = await renderSlaReportToBuffer(reportData);

      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="SLA-Report-${fileScope}-${slaReport.startDate}.pdf"`,
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }

    return new NextResponse(
      JSON.stringify({
        error: `Unsupported export format: ${format}. Use 'pdf', 'json', or 'csv'.`,
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    console.error("[SLA-Export-API] Error generating report:", error);
    return new NextResponse(
      JSON.stringify({ error: error?.message || "Internal server error generating SLA report" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
