import { redirect } from "next/navigation";

export default function BillingAliasPage() {
  redirect("/dashboard/settings?tab=billing");
}
