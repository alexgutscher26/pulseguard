import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Dashboard from "./dashboard";

import { getMonitors, getDashboardStats } from "@/actions/monitors";

/**
 * Renders the dashboard page after validating user session.
 *
 * This function retrieves the user session using the auth.api.getSession method. If the user is not authenticated, it redirects to the login page. It then fetches monitors and dashboard statistics concurrently using Promise.all, and finally returns the Dashboard component populated with the retrieved data.
 */
export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const [monitors, stats] = await Promise.all([
    getMonitors(),
    getDashboardStats(),
  ]);

  return <Dashboard monitors={monitors} stats={stats} />;
}
