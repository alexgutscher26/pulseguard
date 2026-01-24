"use client";

import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth-layout";
import SignUpForm from "@/components/sign-up-form";

export default function SignupPage() {
  const router = useRouter();

  return (
    <AuthLayout title="New User Registration">
      <SignUpForm onSwitchToSignIn={() => router.push("/login")} />
    </AuthLayout>
  );
}
