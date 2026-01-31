import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NotificationChannels } from "@/components/alerts/notification-channels";
import { AlertHistory } from "@/components/alerts/alert-history";
import { AlertRules } from "@/components/alerts/alert-rules";
import { getNotificationChannels, getAlertHistory, getAlertRules } from "@/actions/notifications";
import { getMonitors } from "@/actions/monitors";

/**
 * Renders the Alerts page with notification channels, alert rules, and alert history.
 *
 * This function retrieves the user session and checks for authentication. It then fetches
 * the current page number from the search parameters and retrieves notification channels,
 * alert rules, monitors, and alert history using Promise.all for concurrent execution.
 * Finally, it returns a structured JSX element containing the relevant components.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Promise<{ [key: string]: string | string[] | undefined }>} params.searchParams - A promise that resolves to an object containing search parameters.
 */
export default async function AlertsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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

  const [channels, alertRules, monitors, { events, totalCount, totalPages }] = await Promise.all([
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
