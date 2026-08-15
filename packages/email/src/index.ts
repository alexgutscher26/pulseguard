import { Resend } from "resend";
import React from "react";
import { env } from "@pulseguard/env/server";

let resendClient: Resend | null = null;

export function getResendClient(apiKey?: string): Resend {
  if (!resendClient) {
    const key = apiKey ?? env.RESEND_API_KEY;
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
  reason?: string | undefined;
  downtimeDuration?: string | undefined;
  failedRegions?: string[] | undefined;
  runbookUrl?: string | undefined;
}

export interface WelcomeEmailData {
  userName: string;
  dashboardUrl: string;
}

export interface VerificationEmailData {
  userName: string;
  verificationUrl: string;
}

export interface PasswordResetEmailData {
  userName?: string;
  resetUrl: string;
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

    let subject =
      data.status === "DOWN"
        ? `🔴 [CRITICAL] ${data.monitorName} is DOWN`
        : `✅ [RESOLVED] ${data.monitorName} is UP`;

    if (data.reason?.includes("expires in") || data.reason?.includes("SSL certificate expires")) {
      subject = `⚠️ [EXPIRY WARNING] ${data.monitorName} SSL Certificate Expires Soon`;
    }

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

export async function sendPasswordResetEmail(
  to: string,
  data: PasswordResetEmailData,
  apiKey?: string,
): Promise<{ id: string } | { error: string }> {
  try {
    const key = apiKey ?? env.RESEND_API_KEY;
    if (!key && (process.env.NODE_ENV === "development" || !process.env.NODE_ENV)) {
      console.log(`\n==================================================`);
      console.log(`📧 [DEV EMAIL FALLBACK] Password Reset Email to: ${to}`);
      console.log(`🔗 Reset Link: ${data.resetUrl}`);
      console.log(`==================================================\n`);
      return { id: "dev-mock-email-id" };
    }

    const resend = getResendClient(apiKey);
    const { renderPasswordReset } = await import("./templates/password-reset");

    const html = await renderPasswordReset(data);

    const result = await resend.emails.send({
      from: "PulseGuard <auth@pulseguard.com>",
      to,
      subject: "🔑 Reset Your Password - PulseGuard",
      html,
    });

    if (result.data && "id" in result.data) {
      return { id: result.data.id };
    }
    return { error: result.error?.message || "Failed to send email" };
  } catch (error) {
    console.error("Error sending password reset email:", error);
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

export async function renderMonthlyReportToBuffer(stats: any): Promise<Buffer> {
  const { renderToStream } = await import("@react-pdf/renderer");
  const { MonthlyReportDocument } = await import("./templates/monthly-report");
  const stream = await renderToStream(React.createElement(MonthlyReportDocument, { stats }) as any);
  const chunks: Uint8Array[] = [];
  // @ts-ignore - ReadableStream iteration
  for await (const chunk of stream) {
    chunks.push(chunk as Uint8Array);
  }
  return Buffer.concat(chunks);
}

export type { SlaReportData } from "./templates/sla-report";
export { SlaReportDocument } from "./templates/sla-report";

export async function renderSlaReportToBuffer(
  data: import("./templates/sla-report").SlaReportData,
): Promise<Buffer> {
  const { renderToStream } = await import("@react-pdf/renderer");
  const { SlaReportDocument } = await import("./templates/sla-report");
  const stream = await renderToStream(React.createElement(SlaReportDocument, { data }) as any);
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

export interface UsageLimitWarningEmailData {
  userName: string;
  planName: string;
  warnings: Array<{
    resource: string;
    label: string;
    used: number;
    limit: number;
    percentage: number;
  }>;
  upgradeUrl?: string;
}

export async function sendUsageLimitWarning(
  to: string,
  data: UsageLimitWarningEmailData,
  apiKey?: string,
): Promise<{ id: string } | { error: string }> {
  try {
    const resend = getResendClient(apiKey);
    const { renderUsageLimitWarning } = await import("./templates/usage-limit-warning");

    const html = await renderUsageLimitWarning({
      userName: data.userName,
      planName: data.planName,
      warnings: data.warnings,
      upgradeUrl: data.upgradeUrl ?? "https://pulseguard.io/dashboard/settings?tab=billing",
    });

    const result = await resend.emails.send({
      from: "PulseGuard <billing@pulseguard.io>",
      to,
      subject: "⚠️ Workspace Plan Usage Warning",
      html,
    });

    if (result.data && "id" in result.data) {
      return { id: result.data.id };
    }
    return { error: result.error?.message || "Failed to send email" };
  } catch (error) {
    console.error("Error sending usage limit warning email:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export interface DunningNoticeEmailData {
  userName: string;
  planName: string;
  amountDue: string;
  failureReason?: string;
  billingPortalUrl?: string;
}

export async function sendDunningNotice(
  to: string,
  data: DunningNoticeEmailData,
  apiKey?: string,
): Promise<{ id: string } | { error: string }> {
  try {
    const resend = getResendClient(apiKey);
    const { renderDunningNotice } = await import("./templates/dunning-notice");

    const html = await renderDunningNotice({
      userName: data.userName,
      planName: data.planName,
      amountDue: data.amountDue,
      failureReason: data.failureReason ?? "Card declined",
      billingPortalUrl:
        data.billingPortalUrl ?? "https://pulseguard.io/dashboard/settings?tab=billing",
    });

    const result = await resend.emails.send({
      from: "PulseGuard Billing <billing@pulseguard.io>",
      to,
      subject: "⚠️ Payment Failed: Action Required for Your PulseGuard Subscription",
      html,
    });

    if (result.data && "id" in result.data) {
      return { id: result.data.id };
    }
    return { error: result.error?.message || "Failed to send email" };
  } catch (error) {
    console.error("Error sending dunning notice email:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export type { TeamInvitationEmailData } from "./templates/team-invitation";

export async function sendTeamInvitationEmail(
  to: string,
  data: import("./templates/team-invitation").TeamInvitationEmailData,
  apiKey?: string,
): Promise<{ id: string } | { error: string }> {
  try {
    const resend = getResendClient(apiKey);
    const { renderTeamInvitation } = await import("./templates/team-invitation");

    const html = await renderTeamInvitation(data);

    const result = await resend.emails.send({
      from: "PulseGuard Teams <invitations@pulseguard.io>",
      to,
      subject: `👋 You've been invited to join ${data.organizationName} on PulseGuard`,
      html,
    });

    if (result.data && "id" in result.data) {
      return { id: result.data.id };
    }
    return { error: result.error?.message || "Failed to send email" };
  } catch (error) {
    console.error("Error sending team invitation email:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}
