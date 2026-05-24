import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LoginClient from "./login-client";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If the user has a valid active session, redirect them to the dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return <LoginClient />;
}
