import { verifySubscription } from "@/actions/subscriptions";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface VerifyPageProps {
  params: Promise<{ token: string }>;
}

export default async function VerifySubscriptionPage({
  params,
}: VerifyPageProps) {
  const { token } = await params;

  // Verify the subscription on page load
  const result = await verifySubscription(token);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-md w-full">
        <div className="bg-[#0a0a0f] border border-primary/30 rounded-lg p-8 shadow-[0_0_50px_rgba(34,197,94,0.1)]">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              className={`size-20 rounded-full flex items-center justify-center border ${
                result.success
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-red-500/10 border-red-500/30 text-red-500"
              }`}
            >
              {result.success ? (
                <CheckCircle className="size-10 stroke-[1.5]" />
              ) : (
                <XCircle className="size-10 stroke-[1.5]" />
              )}
            </div>
          </div>

          {/* Title */}
          <h1
            className={`text-2xl font-bold text-center mb-4 font-mono ${
              result.success ? "text-primary" : "text-red-400"
            }`}
          >
            {result.success ? "Subscription Confirmed!" : "Verification Failed"}
          </h1>

          {/* Message */}
          <p className="text-center text-primary/60 mb-6">{result.message}</p>

          {/* Actions */}
          <div className="space-y-3">
            {result.success && (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-md">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="size-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div className="text-sm text-primary/70">
                    <p className="font-medium text-primary mb-1">
                      Save your management link!
                    </p>
                    <p>
                      Check your confirmation email for the link to manage or
                      unsubscribe from this subscription.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Link
              href="/"
              className="block w-full py-3 px-4 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-md text-primary font-bold uppercase tracking-wider text-sm text-center transition-all"
            >
              Go to Homepage
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-primary/30 text-xs mt-6 font-mono">
          Powered by PulseGuard
        </p>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
