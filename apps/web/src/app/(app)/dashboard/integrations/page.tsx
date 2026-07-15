import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { IntegrationsManager } from "@/components/dashboard/integrations-manager";

export const metadata = {
  title: "PulseGuard | Integrations",
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
