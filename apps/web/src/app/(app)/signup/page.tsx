"use client";

import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8">Sign Up</h1>
        <div className="flex flex-col gap-4">
            <p>Registration protocol initiated...</p>
            <Link href="/" className="text-primary hover:underline">
                &lt; Return to Terminal
            </Link>
        </div>
      </div>
    </div>
  );
}
