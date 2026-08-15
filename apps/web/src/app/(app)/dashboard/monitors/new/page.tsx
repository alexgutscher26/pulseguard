import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MonitorForm } from "@/components/monitors/monitor-form";
import { getUserUsageSummary } from "@/lib/billing-server";

export const dynamic = "force-dynamic";

export default async function NewMonitorPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const usageSummary = await getUserUsageSummary(session.user.id);

  return (
    <div className="flex justify-center p-6">
      <MonitorForm usageSummary={usageSummary} />
    </div>
  );
}
