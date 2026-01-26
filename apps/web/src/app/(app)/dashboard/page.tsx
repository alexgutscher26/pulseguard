import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Dashboard from "./dashboard";

import { getMonitors, getDashboardStats } from "@/actions/monitors";

/**
 * Renders the dashboard page after validating user session.
 *
 * This function retrieves the current user session using the auth.api.getSession method.
 * If no user is found, it redirects to the login page. It then fetches the monitors and
 * dashboard statistics using the getMonitors and getDashboardStats functions, respectively,
 * before rendering the Dashboard component with the retrieved data.
 */
export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const monitors = await getMonitors();
  const stats = await getDashboardStats();

  return <Dashboard monitors={monitors} stats={stats} />;
}
