"use client";

import { useState } from "react";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Check,
  X,
  Copy,
  Loader2,
  Award,
  Filter,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  approveDesignPartnerApplication,
  rejectDesignPartnerApplication,
} from "@/actions/design-partners";
import type { DesignPartnerRecord } from "@/actions/design-partners";
import { grantSelfAdminAccess } from "@/actions/admin";

export default function AdminDesignPartnersClient({
  initialApplications,
  isAdmin: initialIsAdmin = false,
}: {
  initialApplications: DesignPartnerRecord[];
  isAdmin?: boolean;
}) {
  const [isAdminState, setIsAdminState] = useState(initialIsAdmin);
  const [grantingAdmin, setGrantingAdmin] = useState(false);
  const [applications, setApplications] = useState<DesignPartnerRecord[]>(initialApplications);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleGrantAdmin = async () => {
    setGrantingAdmin(true);
    const res = await grantSelfAdminAccess();
    setGrantingAdmin(false);

    if (res.success) {
      setIsAdminState(true);
      toast.success(
        "ADMIN tier granted to your account! You can now review and approve partnerships.",
      );
    } else {
      toast.error(res.error || "Failed to grant admin access");
    }
  };

  const pendingCount = applications.filter((a) => a.status === "PENDING").length;
  const approvedCount = applications.filter((a) => a.status === "APPROVED").length;
  const rejectedCount = applications.filter((a) => a.status === "REJECTED").length;
  const remainingSpots = Math.max(1, 15 - approvedCount);

  const filteredApplications = applications.filter((a) => {
    if (filter === "ALL") return true;
    return a.status === filter;
  });

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    const res = await approveDesignPartnerApplication(id);
    setProcessingId(null);

    if (res.success) {
      toast.success(`Partnership APPROVED! Generated VIP Code: ${res.vipCode}`);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "APPROVED", vipCode: res.vipCode } : app,
        ),
      );
    } else {
      toast.error(res.error || "Failed to approve application");
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    const res = await rejectDesignPartnerApplication(id);
    setProcessingId(null);

    if (res.success) {
      toast.info("Application set to REJECTED");
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: "REJECTED" } : app)),
      );
    } else {
      toast.error(res.error || "Failed to reject application");
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("VIP Code copied!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="flex flex-col gap-8 py-8 px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
            <Award className="size-3" />
            Admin Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Design Partner Applications
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Review, approve, or reject applicants for the 1-Year Free Netrunner Pro partnership.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-foreground font-bold">{remainingSpots} of 15 spots remaining</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-4 rounded-xl flex flex-col gap-1">
          <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">
            Total Received
          </span>
          <span className="text-2xl font-bold text-foreground">{applications.length}</span>
        </div>
        <div className="bg-card border border-amber-500/30 bg-amber-500/5 p-4 rounded-xl flex flex-col gap-1">
          <span className="text-[10px] font-mono font-bold uppercase text-amber-400">
            Needs Review
          </span>
          <span className="text-2xl font-bold text-amber-400">{pendingCount}</span>
        </div>
        <div className="bg-card border border-emerald-500/30 bg-emerald-500/5 p-4 rounded-xl flex flex-col gap-1">
          <span className="text-[10px] font-mono font-bold uppercase text-emerald-400">
            Approved Partners
          </span>
          <span className="text-2xl font-bold text-emerald-400">{approvedCount}</span>
        </div>
        <div className="bg-card border border-red-500/30 bg-red-500/5 p-4 rounded-xl flex flex-col gap-1">
          <span className="text-[10px] font-mono font-bold uppercase text-red-400">Rejected</span>
          <span className="text-2xl font-bold text-red-400">{rejectedCount}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Filter className="size-4 text-muted-foreground mr-1" />
        {(["PENDING", "APPROVED", "REJECTED", "ALL"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              filter === tab
                ? "bg-primary text-primary-foreground"
                : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {tab === "PENDING" && `Pending (${pendingCount})`}
            {tab === "APPROVED" && `Approved (${approvedCount})`}
            {tab === "REJECTED" && `Rejected (${rejectedCount})`}
            {tab === "ALL" && `All (${applications.length})`}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl flex flex-col items-center gap-3">
          <Users className="size-10 text-muted-foreground/40" />
          <h3 className="text-sm font-bold text-foreground">No applications found</h3>
          <p className="text-xs text-muted-foreground max-w-xs">
            {filter === "PENDING"
              ? "All submitted design partner applications have been reviewed."
              : `No applications matching filter "${filter}".`}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className={`bg-card border rounded-2xl p-6 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                app.status === "PENDING"
                  ? "border-amber-500/40 shadow-sm"
                  : app.status === "APPROVED"
                    ? "border-emerald-500/30"
                    : "border-border opacity-70"
              }`}
            >
              {/* Info Column */}
              <div className="flex flex-col gap-2 max-w-xl">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-foreground text-sm">{app.name}</span>
                  <span className="text-xs text-muted-foreground font-mono">({app.email})</span>

                  {/* Status Badge */}
                  {app.status === "PENDING" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold">
                      <Clock className="size-3 animate-pulse" /> PENDING REVIEW
                    </span>
                  )}
                  {app.status === "APPROVED" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                      <CheckCircle2 className="size-3" /> APPROVED PARTNER
                    </span>
                  )}
                  {app.status === "REJECTED" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold">
                      <XCircle className="size-3" /> REJECTED
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <span>
                    Company: <strong className="text-foreground">{app.company}</strong>
                  </span>
                  <span>
                    Endpoints:{" "}
                    <strong className="text-foreground font-mono">{app.monitorsCount}</strong>
                  </span>
                  <span>
                    Current Tool: <strong className="text-foreground">{app.currentTool}</strong>
                  </span>
                </div>

                {app.website && (
                  <a
                    href={app.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-mono w-fit mt-0.5"
                  >
                    {app.website} <ExternalLink className="size-3" />
                  </a>
                )}

                {app.status === "APPROVED" && app.vipCode && (
                  <div className="mt-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg inline-flex items-center gap-3 w-fit">
                    <span className="text-[10px] font-mono text-muted-foreground">VIP CODE:</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {app.vipCode}
                    </span>
                    <button
                      onClick={() => handleCopyCode(app.vipCode!)}
                      className="p-1 text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer"
                    >
                      {copiedCode === app.vipCode ? (
                        <Check className="size-3.5" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {app.status !== "APPROVED" && (
                  <button
                    onClick={() => handleApprove(app.id)}
                    disabled={processingId === app.id}
                    className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {processingId === app.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <>
                        <Check className="size-3.5" /> Approve Partnership
                      </>
                    )}
                  </button>
                )}

                {app.status !== "REJECTED" && (
                  <button
                    onClick={() => handleReject(app.id)}
                    disabled={processingId === app.id}
                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border text-muted-foreground font-bold text-xs hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <X className="size-3.5" /> Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
