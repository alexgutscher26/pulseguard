import { auth } from "@steadystack/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignupClient from "./signup-client";

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect("/dashboard");
  }

  return <SignupClient />;
}
