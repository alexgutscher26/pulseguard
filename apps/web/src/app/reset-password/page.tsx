import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ResetPasswordClient from "@/app/reset-password/reset-password-client";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect("/dashboard");
  }

  return <ResetPasswordClient />;
}
