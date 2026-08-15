"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Users,
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { acceptInvitation, rejectInvitation, type Role } from "@/actions/team";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InvitationClientProps {
  invitation: {
    id: string;
    email: string;
    role: Role;
    status: string;
    expiresAt: string;
    organization: {
      id: string;
      name: string;
      slug: string;
      logo: string | null;
    };
    inviter: {
      name: string | null;
      email: string;
      image: string | null;
    };
  };
  currentUserEmail?: string;
  isLoggedIn: boolean;
}

export function InvitationClient({
  invitation,
  currentUserEmail,
  isLoggedIn,
}: InvitationClientProps) {
  const router = useRouter();
  const [status, setStatus] = useState<string>(invitation.status);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isEmailMatching =
    !currentUserEmail || currentUserEmail.toLowerCase() === invitation.email.toLowerCase();

  const handleAccept = async () => {
    if (!isLoggedIn) {
      router.push(
        `/signup?redirect=/invitations/${invitation.id}&email=${encodeURIComponent(invitation.email)}`,
      );
      return;
    }

    startTransition(async () => {
      const res = await acceptInvitation(invitation.id);
      if (res.success) {
        setStatus("accepted");
        try {
          await authClient.organization.setActive({
            organizationId: invitation.organization.id,
          });
        } catch {}
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        setError(res.error || "Failed to accept invitation.");
      }
    });
  };

  const handleReject = async () => {
    startTransition(async () => {
      const res = await rejectInvitation(invitation.id);
      if (res.success) {
        setStatus("rejected");
      } else {
        setError(res.error || "Failed to decline invitation.");
      }
    });
  };

  if (status === "accepted") {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-2xl border border-emerald-500/30 bg-card shadow-xl text-center font-mono space-y-4 animate-in fade-in zoom-in-95">
        <div className="size-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
          <CheckCircle2 className="size-6" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Welcome to the Team!</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          You have successfully joined <strong>{invitation.organization.name}</strong>. Redirecting
          to your dashboard...
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-mono text-xs font-bold hover:bg-primary/90 transition-colors"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-2xl border border-border bg-card shadow-xl text-center font-mono space-y-4">
        <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mx-auto">
          <XCircle className="size-6" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Invitation Declined</h2>
        <p className="text-xs text-muted-foreground">
          You have declined the invitation to join {invitation.organization.name}.
        </p>
        <div className="pt-2">
          <Link href="/" className="text-xs text-primary hover:underline">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-2xl border border-amber-500/30 bg-card shadow-xl text-center font-mono space-y-4">
        <div className="size-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
          <Clock className="size-6" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Invitation Expired</h2>
        <p className="text-xs text-muted-foreground">
          This invitation has expired. Ask the workspace admin to send you a new invitation link.
        </p>
        <div className="pt-2">
          <Link href="/" className="text-xs text-primary hover:underline">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto my-12 p-8 rounded-2xl border border-border bg-card shadow-2xl font-mono relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none -z-10" />

      <div className="text-center space-y-3 pb-6 border-b border-border/80">
        <div className="size-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mx-auto shadow-inner">
          <Building2 className="size-7" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            WORKSPACE INVITATION
          </span>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            {invitation.organization.name}
          </h1>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong>{invitation.inviter.name || invitation.inviter.email}</strong> has invited you to
          collaborate on uptime monitors, status pages, and alert escalations.
        </p>
      </div>

      {/* Role & Details Card */}
      <div className="py-6 space-y-3">
        <div className="p-4 rounded-xl border border-border bg-accent/20 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Assigned Role:</span>
            <span className="font-bold uppercase px-2 py-0.5 rounded border bg-primary/10 text-primary border-primary/20 text-[10px]">
              {invitation.role}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Target Email:</span>
            <span className="font-bold text-foreground">{invitation.email}</span>
          </div>
        </div>

        {!isLoggedIn && (
          <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 text-[11px] text-primary flex items-center gap-2">
            <Users className="size-4 shrink-0" />
            <span>
              You will need to sign in or create an account to complete joining this team.
            </span>
          </div>
        )}

        {isLoggedIn && !isEmailMatching && (
          <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 text-[11px] text-amber-400 flex items-start gap-2">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>
              You are logged in as <strong>{currentUserEmail}</strong>, but this invite was sent to{" "}
              <strong>{invitation.email}</strong>. Accepting will link this workspace to your active
              account.
            </span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5 text-[11px] text-destructive flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={handleReject}
          className="flex-1 text-xs font-mono"
        >
          Decline
        </Button>
        <Button
          type="button"
          disabled={isPending}
          onClick={handleAccept}
          className="flex-1 text-xs font-mono bg-primary text-primary-foreground font-bold gap-1.5"
        >
          {isPending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Joining Team...</span>
            </>
          ) : (
            <>
              <span>Accept & Join Team</span>
              <ArrowRight className="size-3.5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
