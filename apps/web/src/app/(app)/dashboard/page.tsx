import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getDashboardStats, getMonitors, getMonitorInsights } from "@/actions/monitors";
import DashboardClient from "./dashboard-client";

/**
 * Renders the Dashboard page after validating the user session.
 *
 * This function retrieves the user session using the auth.api.getSession method,
 * passing the necessary headers. If the session does not contain a user, it redirects
 * the user to the login page. If the session is valid, it fetches monitors and
 * dashboard statistics concurrently, then returns the Dashboard component with the
 * retrieved data.
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

  return <DashboardClient monitors={monitors} stats={stats} insights={insights} />;
}


