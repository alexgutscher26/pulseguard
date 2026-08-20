import { auth } from "@steadystack/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getMonitors } from "@/actions/monitors";
import { getStatusPages } from "@/actions/status-pages";
import { getComprehensiveSlaReport } from "@/actions/sla-reports";
import { getUserPlan } from "@/lib/billing-server";
import { ReportsClient } from "./reports-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "SLA & Performance Reports | SteadyStack",
  description:
    "Generate executive uptime compliance deliverables for client billing and service level agreements.",
};

export default async function ReportsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const [monitors, statusPages, userPlan, initialReport] = await Promise.all([
    getMonitors().catch(() => []),
    getStatusPages().catch(() => []),
    getUserPlan(session.user.id).catch(() => "INITIATE" as const),
    getComprehensiveSlaReport({ range: "30d", targetSla: 99.9 }).catch(
      () => null,
    ),
  ]);

  return (
    <ReportsClient
      initialMonitors={monitors}
      initialStatusPages={statusPages}
      initialReport={initialReport}
      userPlan={userPlan}
    />
  );
}
