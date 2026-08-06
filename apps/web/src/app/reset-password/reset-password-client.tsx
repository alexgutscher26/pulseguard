"use client";

import { Suspense, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "@/components/ui/sonner";
import z from "zod";
import { AlertTriangle, ArrowLeft, CheckCircle2, Lock } from "lucide-react";

import AuthLayout from "@/components/auth-layout";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [success, setSuccess] = useState(false);

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      if (!token) {
        toast.error("Missing password reset token");
        return;
      }

      await authClient.resetPassword(
        {
          newPassword: value.password,
          token,
        },
        {
          onSuccess: () => {
            setSuccess(true);
            toast.success("Password updated successfully");
            setTimeout(() => {
              router.push("/login");
            }, 1500);
          },
          onError: (error: { error: { message?: string } }) => {
            toast.error(error.error.message || "Failed to reset password. Link may be expired.");
          },
        },
      );
    },
    validators: {
      onSubmit: z
        .object({
          password: z.string().min(8, "Password must be at least 8 characters"),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
        }),
    },
  });

  if (!token) {
    return (
      <div className="space-y-6 text-center py-4">
        <div className="flex justify-center">
          <div className="size-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20">
            <AlertTriangle className="size-7" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Invalid Reset Link</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This password reset link is missing a valid security token or has expired.
          </p>
        </div>
        <div className="pt-4">
          <Link href={"/forgot-password" as any}>
            <Button className="w-full bg-primary text-black font-semibold rounded-full hover:bg-primary/90 h-11">
              Request New Link
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-6 text-center py-4">
        <div className="flex justify-center">
          <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(57,255,20,0.15)]">
            <CheckCircle2 className="size-7" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Password Reset Complete</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your password has been updated successfully. Redirecting you to sign in...
          </p>
        </div>
        <div className="pt-4">
          <Link href={"/login" as any}>
            <Button className="w-full bg-primary text-black font-semibold rounded-full hover:bg-primary/90 h-11">
              Sign In Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field name="password">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name} className="text-[13px] font-semibold text-foreground/80">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  placeholder="••••••••"
                  className="bg-white/5 border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary h-12 px-4 shadow-sm pl-11"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <Lock className="size-5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {field.state.meta.errors.map((error) => (
                <p key={error?.message} className="text-red-500 font-medium text-xs mt-1">
                  {error?.message}
                </p>
              ))}
            </div>
          )}
        </form.Field>

        <form.Field name="confirmPassword">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name} className="text-[13px] font-semibold text-foreground/80">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  placeholder="••••••••"
                  className="bg-white/5 border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary h-12 px-4 shadow-sm pl-11"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <Lock className="size-5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
              {state.isSubmitting ? "Updating Password..." : "Set New Password"}
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
  );
}

export default function ResetPasswordClient() {
  const { isPending } = authClient.useSession();

  if (isPending) {
    return <Loader />;
  }

  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Enter a new password for your PulseGuard account"
    >
      <Suspense fallback={<Loader />}>
        <ResetPasswordFormContent />
      </Suspense>
    </AuthLayout>
  );
}
