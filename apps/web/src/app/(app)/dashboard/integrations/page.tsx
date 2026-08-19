import { auth } from "@steadystack/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { IntegrationsManager } from "@/components/dashboard/integrations-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "SteadyStack | Integrations",
  description: "Zero-code setups for Vercel, Netlify, and GitHub.",
};

export default async function IntegrationsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return <IntegrationsManager />;
}
