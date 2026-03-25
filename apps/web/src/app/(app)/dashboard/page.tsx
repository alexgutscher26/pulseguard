import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getDashboardStats, getMonitors, getMonitorInsights } from "@/actions/monitors";
import Dashboard from "./dashboard";

/**
 * Renders the Dashboard page after validating the user session.
 *
 * This function retrieves the user session using the auth.api.getSession method,
 * passing the necessary headers. If the session does not contain a user, it redirects
 * the user to the login page. If the session is valid, it returns the Dashboard component.
 */
export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const [monitors, stats, insights] = await Promise.all([
    getMonitors(),
    getDashboardStats(),
    getMonitorInsights(),
  ]);

  return <Dashboard monitors={monitors} stats={stats} insights={insights} />;
}
