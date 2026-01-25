import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MonitorForm } from "@/components/monitors/monitor-form";

/**
 * Renders the new monitor page.
 *
 * This function retrieves the user session using the auth.api.getSession method. If no user session is found, it redirects the user to the login page. If a session exists, it returns a JSX element containing the MonitorForm component wrapped in a div for layout purposes.
 */
export default async function NewMonitorPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex justify-center p-6">
      <MonitorForm />
    </div>
  );
}
