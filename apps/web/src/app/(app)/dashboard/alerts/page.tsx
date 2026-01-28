import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NotificationChannels } from "@/components/alerts/notification-channels";
import { AlertHistory } from "@/components/alerts/alert-history";
import {
  getNotificationChannels,
  getAlertHistory,
} from "@/actions/notifications";

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
