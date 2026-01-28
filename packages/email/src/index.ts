import { Resend } from 'resend';

let resendClient: Resend | null = null;

export function getResendClient(apiKey?: string): Resend {
  if (!resendClient) {
    const key = apiKey || process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error('RESEND_API_KEY is not set');
    }
    resendClient = new Resend(key);
  }
  return resendClient;
}

export interface MonitorAlertData {
  monitorId: string;
  monitorName: string;
  url: string;
  status: 'UP' | 'DOWN';
  previousStatus: 'UP' | 'DOWN';
  timestamp: string;
  reason?: string;
  downtimeDuration?: string;
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
  apiKey?: string
): Promise<{ id: string } | { error: string }> {
  try {
    const resend = getResendClient(apiKey);
    const { renderMonitorAlert } = await import('./templates/monitor-alert');
    
    const subject = data.status === 'DOWN' 
      ? `🔴 [CRITICAL] ${data.monitorName} is DOWN`
      : `✅ [RESOLVED] ${data.monitorName} is UP`;

    const html = await renderMonitorAlert(data);

    const result = await resend.emails.send({
      from: 'PulseGuard <onboarding@resend.dev>',
      to,
      subject,
      html,
    });

    if (result.data && 'id' in result.data) {
      return { id: result.data.id };
    }
    return { error: result.error?.message || 'Failed to send email' };
  } catch (error) {
    console.error('Error sending monitor alert:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function sendWelcomeEmail(
  to: string,
  data: WelcomeEmailData,
  apiKey?: string
): Promise<{ id: string } | { error: string }> {
  try {
    const resend = getResendClient(apiKey);
    const { renderWelcome } = await import('./templates/welcome');

    const html = await renderWelcome(data);

    const result = await resend.emails.send({
      from: 'PulseGuard <hello@pulseguard.com>',
      to,
      subject: 'Welcome to PulseGuard - Your Monitors Await',
      html,
    });

    if (result.data && 'id' in result.data) {
      return { id: result.data.id };
    }
    return { error: result.error?.message || 'Failed to send email' };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function sendVerificationEmail(
  to: string,
  data: VerificationEmailData,
  apiKey?: string
): Promise<{ id: string } | { error: string }> {
  try {
    const resend = getResendClient(apiKey);
    const { renderVerification } = await import('./templates/verification');

    const html = await renderVerification(data);

    const result = await resend.emails.send({
      from: 'PulseGuard <verify@pulseguard.com>',
      to,
      subject: 'Verify Your Email - PulseGuard',
      html,
    });

    if (result.data && 'id' in result.data) {
      return { id: result.data.id };
    }
    return { error: result.error?.message || 'Failed to send email' };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function sendWeeklyDigest(
  to: string,
  data: WeeklyDigestData,
  apiKey?: string
): Promise<{ id: string } | { error: string }> {
  try {
    const resend = getResendClient(apiKey);
    const { renderWeeklyDigest } = await import('./templates/weekly-digest');

    const html = await renderWeeklyDigest(data);

    const result = await resend.emails.send({
      from: 'PulseGuard <reports@pulseguard.com>',
      to,
      subject: `📊 Weekly Uptime Report - ${data.weekRange}`,
      html,
    });

    if (result.data && 'id' in result.data) {
      return { id: result.data.id };
    }
    return { error: result.error?.message || 'Failed to send email' };
  } catch (error) {
    console.error('Error sending weekly digest:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export * from './styles/theme';
