import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function BillingAliasPage() {
  redirect("/dashboard/settings?tab=billing");
}
