import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NotificationChannels } from "@/components/alerts/notification-channels";
import { AlertHistory } from "@/components/alerts/alert-history";

/**
 * Renders the Alerts page component.
 *
 * This function retrieves the user session using the auth.api.getSession method. If no user session is found, it redirects the user to the login page. Upon successful retrieval of the session, it returns a JSX element containing NotificationChannels and AlertHistory components.
 */
export default async function AlertsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-10">
      <NotificationChannels />
      <AlertHistory />
    </div>
  );
}
