import { Resend } from "resend";
import { renderToStream } from "@react-pdf/renderer";
import React from "react";
import { MonthlyReportDocument } from "./templates/MonthlyReport";

let resendClient: Resend | null = null;

export function getResendClient(apiKey?: string): Resend {
  if (!resendClient) {
    const key = apiKey || process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error("RESEND_API_KEY is not set");
    }
    resendClient = new Resend(key);
  }
  return resendClient;
}

export interface MonitorAlertData {
  monitorId: string;
  monitorName: string;
  url: string;
  status: "UP" | "DOWN";
  previousStatus: "UP" | "DOWN";
  timestamp: string;
  reason?: string;
  downtimeDuration?: string;
  failedRegions?: string[];
}

export interface WelcomeEmailData {
  userName: string;
  dashboardUrl: string;
}

export interface VerificationEmailData {
  userName: string;
  verificationUrl: string;
}

export interface WeeklyDigestData {
  userName: string;
  weekRange: string;
  totalMonitors: number;
  uptimePercentage: number;
  totalIncidents: number;
  topPerformers: Array<{ name: string; uptime: number }>;
}

export async function sendMonitorAlert(
  to: string,
  data: MonitorAlertData,
  apiKey?: string,
): Promise<{ id: string } | { error: string }> {
  try {
    const resend = getResendClient(apiKey);
    const { renderMonitorAlert } = await import("./templates/monitor-alert");

    const subject =
      data.status === "DOWN"
        ? `🔴 [CRITICAL] ${data.monitorName} is DOWN`
        : `✅ [RESOLVED] ${data.monitorName} is UP`;

    const html = await renderMonitorAlert(data);

    const result = await resend.emails.send({
      from: "PulseGuard <alerts@pulseguard.com>",
      to,
      subject,
      html,
    });

    if (result.data && "id" in result.data) {
      return { id: result.data.id };
    }
    return { error: result.error?.message || "Failed to send email" };
  } catch (error) {
    console.error("Error sending monitor alert:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function sendWelcomeEmail(
  to: string,
  data: WelcomeEmailData,
  apiKey?: string,
): Promise<{ id: string } | { error: string }> {
  try {
    const resend = getResendClient(apiKey);
    const { renderWelcome } = await import("./templates/welcome");

    const html = await renderWelcome(data);

    const result = await resend.emails.send({
      from: "PulseGuard <hello@pulseguard.com>",
      to,
      subject: "Welcome to PulseGuard - Your Monitors Await",
      html,
    });

    if (result.data && "id" in result.data) {
      return { id: result.data.id };
    }
    return { error: result.error?.message || "Failed to send email" };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function sendVerificationEmail(
  to: string,
  data: VerificationEmailData,
  apiKey?: string,
): Promise<{ id: string } | { error: string }> {
  try {
    const resend = getResendClient(apiKey);
    const { renderVerification } = await import("./templates/verification");

    const html = await renderVerification(data);

    const result = await resend.emails.send({
      from: "PulseGuard <verify@pulseguard.com>",
      to,
      subject: "Verify Your Email - PulseGuard",
      html,
    });

    if (result.data && "id" in result.data) {
      return { id: result.data.id };
    }
    return { error: result.error?.message || "Failed to send email" };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function sendWeeklyDigest(
  to: string,
  data: WeeklyDigestData,
  apiKey?: string,
): Promise<{ id: string } | { error: string }> {
  try {
    const resend = getResendClient(apiKey);
    const { renderWeeklyDigest } = await import("./templates/weekly-digest");

    const html = await renderWeeklyDigest(data);

    const result = await resend.emails.send({
      from: "PulseGuard <reports@pulseguard.com>",
      to,
      subject: `📊 Weekly Uptime Report - ${data.weekRange}`,
      html,
    });

    if (result.data && "id" in result.data) {
      return { id: result.data.id };
    }
    return { error: result.error?.message || "Failed to send email" };
  } catch (error) {
    console.error("Error sending weekly digest:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export * from "./styles/theme";
export type { SubscriptionConfirmData } from "./templates/subscription-confirm";
export type { StatusUpdateData } from "./templates/status-update";

export async function sendSubscriptionConfirm(
  to: string,
  data: import("./templates/subscription-confirm").SubscriptionConfirmData,
  apiKey?: string,
): Promise<{ id: string } | { error: string }> {
  try {
    const resend = getResendClient(apiKey);
    const { renderSubscriptionConfirm } = await import("./templates/subscription-confirm");

    const html = await renderSubscriptionConfirm(data);

    const result = await resend.emails.send({
      from: "PulseGuard <updates@pulseguard.com>",
      to,
      subject: `Confirm subscription to ${data.pageTitle}`,
      html,
    });

    if (result.data && "id" in result.data) {
      return { id: result.data.id };
    }
    return { error: result.error?.message || "Failed to send email" };
  } catch (error) {
    console.error("Error sending subscription confirmation:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function sendStatusUpdate(
  to: string,
  data: import("./templates/status-update").StatusUpdateData,
  apiKey?: string,
): Promise<{ id: string } | { error: string }> {
  try {
    const resend = getResendClient(apiKey);
    const { renderStatusUpdate } = await import("./templates/status-update");

    let subjectPrefix = "";
    switch (data.incidentStatus) {
      case "INVESTIGATING":
        subjectPrefix = "⚠️ [Investigating]";
        break;
      case "IDENTIFIED":
        subjectPrefix = "🔍 [Identified]";
        break;
      case "MONITORING":
        subjectPrefix = "👀 [Monitoring]";
        break;
      case "RESOLVED":
        subjectPrefix = "✅ [Resolved]";
        break;
      case "SCHEDULED":
        subjectPrefix = "📅 [Maintenance]";
        break;
      case "IN_PROGRESS":
        subjectPrefix = "🔨 [In Progress]";
        break;
      case "COMPLETED":
        subjectPrefix = "✨ [Completed]";
        break;
    }

    const html = await renderStatusUpdate(data);

    const result = await resend.emails.send({
      from: "PulseGuard <status@pulseguard.com>",
      to,
      subject: `${subjectPrefix} ${data.incidentTitle} - ${data.pageTitle}`,
      html,
    });

    if (result.data && "id" in result.data) {
      return { id: result.data.id };
    }
    return { error: result.error?.message || "Failed to send email" };
  } catch (error) {
    console.error("Error sending status update:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export { MonthlyReportDocument } from "./templates/MonthlyReport";


export async function renderMonthlyReportToBuffer(stats: any): Promise<Buffer> {
  const stream = await renderToStream(React.createElement(MonthlyReportDocument, { stats }) as any);
  const chunks: Uint8Array[] = [];
  // @ts-ignore - ReadableStream iteration
  for await (const chunk of stream) {
    chunks.push(chunk as Uint8Array);
  }
  return Buffer.concat(chunks);
}

export async function sendMonthlyReport(
  to: string,
  pdfBuffer: Buffer,
  monthName: string,
  apiKey?: string,
): Promise<{ id: string } | { error: string }> {
  try {
    const resend = getResendClient(apiKey);

    const result = await resend.emails.send({
      from: "PulseGuard <reports@pulseguard.com>",
      to,
      subject: `📊 Monthly Performance Report - ${monthName}`,
      html: `<p>Please find attached your monthly performance report for <strong>${monthName}</strong>.</p>`,
      attachments: [
        {
          filename: `PulseGuard-Report-${monthName}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    if (result.data && "id" in result.data) {
      return { id: result.data.id };
    }
    return { error: result.error?.message || "Failed to send email" };
  } catch (error) {
    console.error("Error sending monthly report:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

