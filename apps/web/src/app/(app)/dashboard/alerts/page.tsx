import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NotificationChannels } from "@/components/alerts/notification-channels";
import { AlertHistory } from "@/components/alerts/alert-history";
import {
  getNotificationChannels,
  getAlertHistory,
} from "@/actions/notifications";

/**
 * Renders the alerts page with notification channels and alert history.
 *
 * This function retrieves the user session and checks for authentication.
 * It then fetches the current page number from search parameters, retrieves
 * notification channels, and fetches alert history based on the current page
 * and a fixed page size. Finally, it returns a JSX element containing the
 * notification channels and alert history components.
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

  const channels = await getNotificationChannels();
  const { events, totalCount, totalPages } = await getAlertHistory(
    currentPage,
    pageSize,
  );

  return (
    <div className="flex flex-col gap-10">
      <NotificationChannels channels={channels} />
      <AlertHistory
        history={events}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
      />
    </div>
  );
}
