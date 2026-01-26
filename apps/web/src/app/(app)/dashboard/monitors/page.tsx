import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MonitorManager } from "@/components/monitors/monitor-manager";
import { getMonitors } from "@/actions/monitors";

export default async function MonitorsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const monitors = await getMonitors();

  return (
    <MonitorManager initialMonitors={monitors} />
  );
}
