import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MonitorManager } from "@/components/monitors/monitor-manager";
import { getMonitors } from "@/actions/monitors";

/**
 * Renders the Monitors page after validating user authentication.
 *
 * This function retrieves the user session and checks if the user is authenticated.
 * If the user is not authenticated, it redirects to the login page.
 * Upon successful authentication, it fetches the list of monitors and renders
 * the MonitorManager component with the initial monitors data.
 */
export default async function MonitorsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const monitors = await getMonitors();

  return <MonitorManager initialMonitors={monitors} />;
}
