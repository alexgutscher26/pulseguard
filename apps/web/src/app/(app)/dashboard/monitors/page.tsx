import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { MonitorStats } from "@/components/monitors/monitor-stats";
import { MonitorFilters } from "@/components/monitors/monitor-filters";
import { MonitorList } from "@/components/monitors/monitor-list";

/**
 * Renders the Monitors page after validating user authentication.
 *
 * This function retrieves the user session using the auth.api.getSession method.
 * If the user is not authenticated, it redirects to the login page.
 * Upon successful authentication, it returns a JSX element containing
 * MonitorStats, MonitorFilters, and MonitorList components.
 */
export default async function MonitorsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-6">
      <MonitorStats />
      <MonitorFilters />
      <MonitorList />
    </div>
  );
}
