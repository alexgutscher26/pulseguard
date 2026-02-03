import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { getStatusPage } from "@/actions/status-pages";
import { getMonitors } from "@/actions/monitors";
import { StatusPageEditor } from "@/components/status-pages/status-page-editor";

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * Renders the status page editor for a specific page.
 *
 * This function retrieves the user session and checks for authentication. If the user is not authenticated, it redirects to the login page. It then fetches the status page using the provided id from params and checks if the page exists. If the page is not found, it triggers a not found response. Finally, it retrieves all monitors and returns the StatusPageEditor component with the fetched page and monitors.
 *
 * @param {Props} props - The properties object containing the params for the status page.
 */
export default async function EditStatusPage({ params }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const page = await getStatusPage(id);
  if (!page) notFound();

  const allMonitors = await getMonitors();

  return <StatusPageEditor page={page} allMonitors={allMonitors} />;
}
