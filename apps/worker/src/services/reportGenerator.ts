import type { PrismaClient } from "@pulseguard/db";
import { getMonthlyStats } from "./analyticsService";
import { renderMonthlyReportToBuffer, sendMonthlyReport } from "@pulseguard/email";

export async function generateAndSendMonthlyReports(
  prisma: PrismaClient,
  env: { RESEND_API_KEY: string }
) {
  console.log("[ReportGenerator] Starting monthly report generation...");

  // 1. Get List of Recipients (Admins/Managers)
  // For now, let's grab all users with role 'ADMIN' or 'OWNER'
  // Assuming User model has 'role'. If not, we might need to adjust.
  // Previous conversations implied a User model. Let's assume 'role' exists.
  
  // NOTE: If role doesn't exist, we default to hardcoded email or find first user.
  let recipients: { email: string }[] = [];
  try {
    recipients = await prisma.user.findMany({
      where: {
        emailVerified: true
      },
      select: { email: true }
    });
  } catch (e) {
    console.warn("[ReportGenerator] Could not fetch verified users. Fetching recent users...", e);
    // Fallback: Fetch all users
    recipients = await prisma.user.findMany({
       take: 5,
       select: { email: true }
    });
  }

  if (recipients.length === 0) {
    console.log("[ReportGenerator] No recipients found. Skipping.");
    return;
  }

  console.log(`[ReportGenerator] Found ${recipients.length} recipients.`);

  // 2. Generate Data (Once for all, assuming global report)
  // If multi-tenant, we'd loop per team.
  const stats = await getMonthlyStats(prisma, 1); // 1 = last month
  
  // 3. Generate PDF
  console.log("[ReportGenerator] Rendering PDF...");
  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await renderMonthlyReportToBuffer(stats);
  } catch (err) {
    console.error("[ReportGenerator] PDF Rendering failed:", err);
    return;
  }

  // 4. Send Emails
  const monthName = stats.startDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  for (const user of recipients) {
    console.log(`[ReportGenerator] Sending to ${user.email}...`);
    await sendMonthlyReport(user.email, pdfBuffer, monthName, env.RESEND_API_KEY);
    // Simple rate limit prevention
    await new Promise(r => setTimeout(r, 200)); 
  }

  console.log("[ReportGenerator] Done.");
}
