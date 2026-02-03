import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getStatusPages } from "@/actions/status-pages";
import { StatusPageList } from "@/components/status-pages/status-page-list";

export default async function StatusPagesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const pages = await getStatusPages();

  return <StatusPageList initialPages={pages} />;
}
