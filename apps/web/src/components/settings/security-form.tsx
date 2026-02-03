"use client";

import { Smartphone, Lock, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function SecurityForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleUpdatePassword = async () => {
    setMessage(null);

    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "All fields are required" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        setMessage({
          type: "error",
          text: error.message || "Failed to update password",
        });
        toast.error(error.message || "Failed to update password");
      } else {
        setMessage({ type: "success", text: "Password updated successfully" });
        toast.success("Password updated successfully");
        // Reset form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setMessage({ type: "error", text: "An unexpected error occurred" });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 2FA Section */}
      <section className="bg-black/40 border border-primary/20 relative overflow-hidden backdrop-blur-sm group hover:border-primary/40 transition-all">
        <div className="p-6 border-b border-primary/20 bg-primary/5">
          <h3 className="text-lg font-bold text-foreground font-mono uppercase tracking-tight">
            Two-Factor Authentication
          </h3>
          <p className="text-xs text-primary/60 font-mono">Enhance account security protocols</p>
        </div>
        <div className="p-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-sm">
              <Smartphone className="size-6 text-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-foreground font-mono uppercase">
                Authenticator App
              </h4>
              <p className="text-xs text-primary/60 font-mono max-w-sm">
                Use an authenticator app like Google Authenticator or Authy to generate one-time
                codes.
              </p>
            </div>
          </div>
          <button
            disabled
            className="bg-primary/5 text-primary/50 border border-primary/10 text-xs font-bold px-4 py-2 uppercase tracking-wider font-mono cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>
      </section>

      {/* Password Change */}
      <section className="bg-black/40 border border-primary/20 relative overflow-hidden backdrop-blur-sm group hover:border-primary/40 transition-all">
        <div className="p-6 border-b border-primary/20 bg-primary/5">
          <h3 className="text-lg font-bold text-foreground font-mono uppercase tracking-tight">
            Password Management
          </h3>
          <p className="text-xs text-primary/60 font-mono">Update access credentials</p>
        </div>
        <div className="p-6 grid grid-cols-1 gap-4 max-w-xl">
          {message && (
            <div
              className={`p-3 rounded-sm border text-xs font-mono flex items-center gap-2 ${
                message.type === "success"
                  ? "bg-green-500/10 border-green-500/20 text-green-500"
                  : "bg-red-500/10 border-red-500/20 text-red-500"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="size-3" />
              ) : (
                <AlertCircle className="size-3" />
              )}
              {message.text}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 size-4 text-primary/40" />
              <input
                className="w-full bg-black/50 border border-primary/20 focus:border-primary/60 text-primary text-sm rounded-sm pl-10 pr-4 py-2.5 font-mono placeholder:text-primary/20 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                type="password"
                placeholder="••••••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 size-4 text-primary/40" />
              <input
                className="w-full bg-black/50 border border-primary/20 focus:border-primary/60 text-primary text-sm rounded-sm pl-10 pr-4 py-2.5 font-mono placeholder:text-primary/20 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                type="password"
                placeholder="••••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 size-4 text-primary/40" />
              <input
                className="w-full bg-black/50 border border-primary/20 focus:border-primary/60 text-primary text-sm rounded-sm pl-10 pr-4 py-2.5 font-mono placeholder:text-primary/20 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                type="password"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-2">
            <button
              onClick={handleUpdatePassword}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-black text-xs font-bold px-6 py-2.5 uppercase tracking-wider transition-all font-mono flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="size-3 animate-spin" />}
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
