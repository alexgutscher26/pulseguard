"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { toast } from "@/components/ui/sonner";
import z from "zod";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";

import AuthLayout from "@/components/auth-layout";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordClient() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      const redirectTo = `${window.location.origin}/reset-password`;
      await authClient.requestPasswordReset(
        {
          email: value.email,
          redirectTo,
        },
        {
          onSuccess: () => {
            setSubmittedEmail(value.email);
            setSubmitted(true);
            toast.success("Password reset request sent");
          },
          onError: (error: { error: { message?: string } }) => {
            toast.error(error.error.message || "Failed to send reset link");
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Please enter a valid email address"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email to receive password reset instructions"
    >
      {submitted ? (
        <div className="space-y-6 text-center py-4">
          <div className="flex justify-center">
            <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(57,255,20,0.15)]">
              <CheckCircle2 className="size-7" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">Check your inbox</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We sent a password reset link to{" "}
              <span className="font-semibold text-foreground">{submittedEmail}</span>. Please check
              your email and follow the instructions.
            </p>
          </div>
          <div className="pt-4">
            <Link href={"/login" as any}>
              <Button
                variant="outline"
                className="w-full rounded-full border-white/10 text-foreground hover:bg-white/5 h-11 font-medium"
              >
                <ArrowLeft className="size-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field name="email">
              {(field) => (
                <div className="space-y-2">
                  <Label
                    htmlFor={field.name}
                    className="text-[13px] font-semibold text-foreground/80"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      placeholder="name@company.com"
                      className="bg-white/5 border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary h-12 px-4 shadow-sm pl-11"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <Mail className="size-5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {field.state.meta.errors.map((error) => (
                    <p key={error?.message} className="text-red-500 font-medium text-xs mt-1">
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Subscribe>
              {(state) => (
                <Button
                  type="submit"
                  className="w-full bg-primary text-black font-semibold rounded-full hover:bg-primary/90 transition-all border border-transparent h-12 mt-6 shadow-[0_0_15px_rgba(57,255,20,0.2)] hover:shadow-[0_0_20px_rgba(57,255,20,0.3)]"
                  disabled={!state.canSubmit || state.isSubmitting}
                >
                  {state.isSubmitting ? "Sending Link..." : "Send Reset Link"}
                </Button>
              )}
            </form.Subscribe>
          </form>

          <div className="text-center pt-2">
            <Link
              href={"/login" as any}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              <ArrowLeft className="size-4 mr-1.5" />
              Back to Sign In
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
