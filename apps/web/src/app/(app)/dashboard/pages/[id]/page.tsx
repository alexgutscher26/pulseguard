import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { getStatusPage } from "@/actions/status-pages";
import { getMonitors } from "@/actions/monitors";
import { StatusPageEditor } from "@/components/status-pages/status-page-editor";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditStatusPage({ params }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const page = await getStatusPage(id);
  if (!page) notFound();

  const allMonitors = await getMonitors();

  return <StatusPageEditor page={page} allMonitors={allMonitors} />;
}
