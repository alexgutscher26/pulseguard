"use client";

import { useState } from "react";
import AuthLayout from "@/components/auth-layout";
import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

export default function LoginPage() {
  const [showSignIn, setShowSignIn] = useState(true);

  return (
    <AuthLayout title={showSignIn ? "System Login" : "New User Registration"}>
       {showSignIn ? (
        <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
      ) : (
        <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
      )}
    </AuthLayout>
  );
}
