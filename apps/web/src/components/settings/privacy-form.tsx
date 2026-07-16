"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Eye,
  Shield,
  Database,
  Clock,
  Download,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  FileJson,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";
import type { PrivacyReport } from "@/actions/privacy";

export function PrivacyForm() {
  const [report, setReport] = useState<PrivacyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [anonymizing, setAnonymizing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardBio, setLeaderboardBio] = useState("");
  const [savingLeaderboard, setSavingLeaderboard] = useState(false);

  const fetchReport = useCallback(async () => {
    try {
      const { getPrivacyReport } = await import("@/actions/privacy");
      const data = await getPrivacyReport();
      setReport(data);
      setShowLeaderboard(data.showOnLeaderboard);
      setLeaderboardBio(data.leaderboardBio);
    } catch {
      toast.error("Failed to load privacy report");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSaveLeaderboard = async () => {
    setSavingLeaderboard(true);
    try {
      const { updateLeaderboardPrivacy } = await import("@/actions/privacy");
      const result = await updateLeaderboardPrivacy(showLeaderboard, leaderboardBio);
      if (result.success) {
        toast.success("Leaderboard privacy settings saved");
      }
    } catch {
      toast.error("Failed to save leaderboard settings");
    } finally {
      setSavingLeaderboard(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleToggleAnonymization = async () => {
    if (!report) return;
    setAnonymizing(true);
    try {
      const { updateAnalyticsAnonymization } = await import("@/actions/privacy");
      const result = await updateAnalyticsAnonymization(!report.anonymizeAnalytics);
      if (result.success) {
        setReport({ ...report, anonymizeAnalytics: result.anonymized });
        toast.success(
          result.anonymized
            ? "Status page analytics anonymization enabled"
            : "Status page analytics anonymization disabled",
        );
      }
    } catch {
      toast.error("Failed to update privacy setting");
    } finally {
      setAnonymizing(false);
    }
  };

  const handleExportPersonalData = async () => {
    setExporting(true);
    try {
      const { exportPersonalData } = await import("@/actions/privacy");
      const data = await exportPersonalData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pulseguard-personal-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Personal data exported successfully");
    } catch {
      toast.error("Failed to export personal data");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-black/40 border border-primary/20 relative overflow-hidden backdrop-blur-sm">
        <div className="p-6 flex items-center justify-center gap-3">
          <Loader2 className="size-5 animate-spin text-primary" />
          <span className="text-xs font-mono text-primary/60">Loading intelligence report...</span>
        </div>
      </section>
    );
  }

  if (!report) {
    return (
      <section className="bg-black/40 border border-red-500/30 relative overflow-hidden backdrop-blur-sm">
        <div className="p-6 flex items-center gap-3">
          <AlertTriangle className="size-5 text-red-500" />
          <span className="text-xs font-mono text-red-500/80">Failed to load privacy report</span>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold font-mono text-foreground uppercase tracking-wider">
          Privacy Intelligence
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Full transparency on what data PulseGuard collects, how it is used, and how long it is
          retained. Your uptime metrics belong to you.
        </p>
      </div>

      {/* Account Summary */}
      <section className="bg-black/40 border border-primary/20 relative overflow-hidden backdrop-blur-sm hover:border-primary/40 transition-all">
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/30"></div>
        <div className="p-6 border-b border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-primary" />
            <h3 className="text-lg font-bold text-foreground font-mono uppercase tracking-tight">
              Data Subject Overview
            </h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-primary/10 bg-black/30 p-3">
              <span className="text-[10px] font-mono text-primary/50 uppercase tracking-wider">
                Account
              </span>
              <p className="text-sm font-mono text-foreground mt-1 truncate">{report.userName}</p>
            </div>
            <div className="border border-primary/10 bg-black/30 p-3">
              <span className="text-[10px] font-mono text-primary/50 uppercase tracking-wider">
                Email
              </span>
              <p className="text-sm font-mono text-foreground mt-1 truncate">{report.userEmail}</p>
            </div>
            <div className="border border-primary/10 bg-black/30 p-3">
              <span className="text-[10px] font-mono text-primary/50 uppercase tracking-wider">
                Tier
              </span>
              <p className="text-sm font-mono text-foreground mt-1">{report.tier}</p>
            </div>
            <div className="border border-primary/10 bg-black/30 p-3">
              <span className="text-[10px] font-mono text-primary/50 uppercase tracking-wider">
                Created
              </span>
              <p className="text-sm font-mono text-foreground mt-1">
                {new Date(report.accountCreated).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Inventory */}
      <section className="bg-black/40 border border-primary/20 relative overflow-hidden backdrop-blur-sm hover:border-primary/40 transition-all">
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/30"></div>
        <div className="p-6 border-b border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2">
            <Database className="size-4 text-primary" />
            <h3 className="text-lg font-bold text-foreground font-mono uppercase tracking-tight">
              Data Inventory
            </h3>
          </div>
          <p className="text-xs text-primary/60 font-mono mt-1">
            {report.totalMonitors} monitors &bull; {report.totalEvents.toLocaleString()} events
            &bull; {report.totalIncidents} incidents &bull; {report.totalStatusPages} status pages
          </p>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-primary/10">
                  <th className="text-left py-2 px-2 text-primary/50 uppercase tracking-wider font-bold text-[10px]">
                    Category
                  </th>
                  <th className="text-left py-2 px-2 text-primary/50 uppercase tracking-wider font-bold text-[10px]">
                    Description
                  </th>
                  <th className="text-left py-2 px-2 text-primary/50 uppercase tracking-wider font-bold text-[10px]">
                    Retention
                  </th>
                  <th className="text-left py-2 px-2 text-primary/50 uppercase tracking-wider font-bold text-[10px]">
                    Purpose
                  </th>
                  <th className="text-center py-2 px-2 text-primary/50 uppercase tracking-wider font-bold text-[10px]">
                    Control
                  </th>
                </tr>
              </thead>
              <tbody>
                {report.dataInventory.map((item) => (
                  <tr
                    key={item.category}
                    className="border-b border-primary/5 hover:bg-primary/[0.02] transition-colors"
                  >
                    <td className="py-2.5 px-2 text-foreground font-bold text-[11px]">
                      {item.category}
                    </td>
                    <td className="py-2.5 px-2 text-primary/70 text-[10px] max-w-[200px] leading-relaxed">
                      {item.description}
                    </td>
                    <td className="py-2.5 px-2 text-primary/70 text-[10px]">{item.retention}</td>
                    <td className="py-2.5 px-2 text-primary/70 text-[10px] max-w-[160px] leading-relaxed">
                      {item.purpose}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {item.canAnonymize ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary border border-primary/20">
                          {item.anonymized ? "ANONYMIZED" : "RAW"}
                        </span>
                      ) : (
                        <span className="text-[10px] text-primary/30">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Privacy Controls */}
      <section className="bg-black/40 border border-primary/20 relative overflow-hidden backdrop-blur-sm hover:border-primary/40 transition-all">
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/30"></div>
        <div className="p-6 border-b border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2">
            <Eye className="size-4 text-primary" />
            <h3 className="text-lg font-bold text-foreground font-mono uppercase tracking-tight">
              Privacy Controls
            </h3>
          </div>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border border-primary/10 p-4 bg-black/30">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold font-mono text-foreground">
                Status Page Analytics Anonymization
              </span>
              <span className="text-[10px] text-primary/60 font-mono leading-relaxed max-w-lg">
                When enabled, visitor IP addresses are hashed with a salt before storage. No raw IPs
                are retained in analytics. Recommended for GDPR compliance.
              </span>
            </div>
            <button
              onClick={handleToggleAnonymization}
              disabled={anonymizing}
              className={`relative inline-flex h-6 w-11 items-center rounded-sm transition-colors ${
                report.anonymizeAnalytics ? "bg-primary" : "bg-primary/20"
              } disabled:opacity-50`}
            >
              <span
                className={`inline-block size-5 rounded-sm bg-black border border-primary/30 transition-transform ${
                  report.anonymizeAnalytics ? "translate-x-[22px]" : "translate-x-[2px]"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between border border-primary/10 p-4 bg-black/30">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold font-mono text-foreground">
                Export Personal Data
              </span>
              <span className="text-[10px] text-primary/60 font-mono leading-relaxed max-w-lg">
                Download a complete archive of all personal data associated with your account,
                formatted as JSON. Includes account details, monitors, events, incidents, and
                notification configurations.
              </span>
            </div>
            <button
              onClick={handleExportPersonalData}
              disabled={exporting}
              className="bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold px-4 py-2 uppercase tracking-wider border border-primary/20 hover:border-primary/50 transition-all font-mono flex items-center gap-1.5 disabled:opacity-50"
            >
              {exporting ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <FileJson className="size-3" />
              )}
              {exporting ? "Exporting..." : "Export JSON"}
            </button>
          </div>
        </div>
      </section>

      {/* Data Handling Principles */}
      <section className="bg-black/40 border border-primary/20 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/30"></div>
        <div className="p-6 border-b border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            <h3 className="text-lg font-bold text-foreground font-mono uppercase tracking-tight">
              Data Processing Principles
            </h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-primary/10 bg-black/30 p-4 flex gap-3">
              <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold font-mono text-foreground block">
                  Data Minimization
                </span>
                <span className="text-[10px] text-primary/60 font-mono leading-relaxed">
                  PulseGuard collects only the data necessary to perform monitoring and alerting. No
                  superfluous tracking, telemetry, or behavioral analytics.
                </span>
              </div>
            </div>
            <div className="border border-primary/10 bg-black/30 p-4 flex gap-3">
              <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold font-mono text-foreground block">
                  Purpose Limitation
                </span>
                <span className="text-[10px] text-primary/60 font-mono leading-relaxed">
                  Data is used exclusively for the purpose it was collected: monitoring your
                  services. Your uptime metrics are never sold, shared, or used for advertising.
                </span>
              </div>
            </div>
            <div className="border border-primary/10 bg-black/30 p-4 flex gap-3">
              <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold font-mono text-foreground block">
                  Data Portability
                </span>
                <span className="text-[10px] text-primary/60 font-mono leading-relaxed">
                  Export your data at any time in open JSON format. We provide zero-vendor-lock-in
                  guarantees with multi-format migration tools.
                </span>
              </div>
            </div>
            <div className="border border-primary/10 bg-black/30 p-4 flex gap-3">
              <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold font-mono text-foreground block">
                  Right to Deletion
                </span>
                <span className="text-[10px] text-primary/60 font-mono leading-relaxed">
                  Delete your account and all associated data at any time from the General settings
                  tab. Data is permanently purged with no residual copies.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LeaderboardSection
        show={showLeaderboard}
        onChangeShow={setShowLeaderboard}
        bio={leaderboardBio}
        onChangeBio={setLeaderboardBio}
        onSave={handleSaveLeaderboard}
        saving={savingLeaderboard}
      />
    </div>
  );
}

function LeaderboardSection({
  show,
  onChangeShow,
  bio,
  onChangeBio,
  onSave,
  saving,
}: {
  show: boolean;
  onChangeShow: (val: boolean) => void;
  bio: string;
  onChangeBio: (val: string) => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <section className="bg-black/40 border border-primary/20 relative overflow-hidden backdrop-blur-sm hover:border-primary/40 transition-all">
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/30"></div>
      <div className="p-6 border-b border-primary/20 bg-primary/5">
        <div className="flex items-center gap-2">
          <Trophy className="size-4 text-yellow-500" />
          <h3 className="text-lg font-bold text-foreground font-mono uppercase tracking-tight">
            Community Leaderboard
          </h3>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {/* Toggle Switch */}
        <div className="flex items-center justify-between border border-primary/10 p-4 bg-black/30">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold font-mono text-foreground">
              Show on Leaderboard (Opt-In)
            </span>
            <span className="text-[10px] text-primary/60 font-mono leading-relaxed max-w-lg">
              Toggle this setting to feature your name, avatar, and monitor uptime percentage on the
              public Hall of Fame. Enabling this is required to participate.
            </span>
          </div>
          <button
            type="button"
            onClick={() => onChangeShow(!show)}
            className={`relative inline-flex h-6 w-11 items-center rounded-sm transition-colors ${
              show ? "bg-primary" : "bg-primary/20"
            }`}
          >
            <span
              className={`inline-block size-5 rounded-sm bg-black border border-primary/30 transition-transform ${
                show ? "translate-x-[22px]" : "translate-x-[2px]"
              }`}
            />
          </button>
        </div>

        {/* Bio Text Input */}
        {show && (
          <div className="border border-primary/10 p-4 bg-black/30 space-y-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold font-mono text-foreground uppercase tracking-wide">
                Leaderboard Biography
              </label>
              <span className="text-[9px] text-primary/40 font-mono">
                A brief description about you or your stack. Shown next to your ranking on the Hall
                of Fame.
              </span>
            </div>
            <textarea
              placeholder="e.g. Indie developer monitoring 10 side-projects with PulseGuard..."
              rows={2}
              maxLength={150}
              className="w-full p-3 rounded-lg bg-background/50 border border-primary/20 font-mono text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground placeholder:text-muted-foreground/30"
              value={bio}
              onChange={(e) => onChangeBio(e.target.value)}
            />
            <div className="text-[9px] font-mono text-right text-muted-foreground/40">
              {bio.length}/150 characters
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="h-9 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-mono font-bold uppercase text-[10px] tracking-widest transition-colors flex items-center justify-center rounded cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="size-3 animate-spin mr-2" />
            ) : (
              <CheckCircle2 className="size-3 mr-2" />
            )}
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </section>
  );
}
