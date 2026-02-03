import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NotificationChannels } from "@/components/alerts/notification-channels";
import { AlertHistory } from "@/components/alerts/alert-history";
import { AlertRules } from "@/components/alerts/alert-rules";
import {
  getNotificationChannels,
  getAlertHistory,
  getAlertRules,
} from "@/actions/notifications";
import { getMonitors } from "@/actions/monitors";

/**
 * Renders the Alerts page component.
 *
 * This function retrieves the user session using the auth.api.getSession method. If no user session is found, it redirects the user to the login page. It then fetches notification channels, alert rules, monitors, and alert history based on the current page and page size. Finally, it returns a JSX element containing NotificationChannels, AlertRules, and AlertHistory components.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Promise<{ page?: string }>} params.searchParams - A promise that resolves to an object containing the page number.
 */
export default async function AlertsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 10;

  const [channels, alertRules, monitors, { events, totalCount, totalPages }] =
    await Promise.all([
      getNotificationChannels(),
      getAlertRules(),
      getMonitors(),
      getAlertHistory(currentPage, pageSize),
    ]);

  return (
    <div className="flex flex-col gap-10">
      <NotificationChannels
        channels={channels}
        slackClientId={process.env.SLACK_CLIENT_ID}
        discordClientId={process.env.DISCORD_CLIENT_ID}
      />
      <AlertRules rules={alertRules} monitors={monitors} channels={channels} />
      <AlertHistory
        history={events}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
      />
    </div>
  );
}
