"use client";

import { CheckCircle, AlertTriangle, Clock, Zap, WifiOff } from "lucide-react";
import { StatusPageMonitorRow } from "./status-page-monitor-row";
import { AnalyticsTracker } from "./analytics-tracker";
import { useTranslations, useFormatter } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";

export function PublicView({ page }: { page: any }) {
  const tStatus = useTranslations("status");
  const tHeadings = useTranslations("headings");
  const tActions = useTranslations("actions");
  const tCommon = useTranslations("common");
  const format = useFormatter();

  // Filter monitors based on visibility settings
  const visibleMonitors = page.monitors.filter((m: any) => {
    if (!page.showPaused && m.monitor.status === "PAUSED") return false;
    return true;
  });

  const allUp = visibleMonitors.every((m: any) => m.monitor.status === "UP");

  // Dynamic Theme Colors
  const theme = (page.theme as any) || {
    value: "cyberpunk",
    colors: { bg: "#050505", text: "#e2e8f0", primary: "#22c55e" },
  };
  const customStyle = {
    "--bg-page": theme.colors.bg,
    "--text-page": theme.colors.text,
    "--primary-page": theme.colors.primary,
  } as React.CSSProperties;

  return (
    <div
      style={customStyle}
      className="min-h-screen bg-[var(--bg-page)] text-[var(--text-page)] font-mono selection:bg-[var(--primary-page)]/20 relative overflow-hidden transition-colors duration-500"
    >
      <AnalyticsTracker pageId={page.id} />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
                --primary: ${theme.colors.primary};
            }
            .text-primary { color: var(--primary-page) !important; }
            .bg-primary { background-color: var(--primary-page) !important; }
            .border-primary { border-color: var(--primary-page) !important; }
            .from-primary { --tw-gradient-from: var(--primary-page) !important; }
            .via-primary { --tw-gradient-via: var(--primary-page) !important; }
            .to-primary { --tw-gradient-to: var(--primary-page) !important; }
            .text-primary\/60 { color: color-mix(in srgb, var(--primary-page) 60%, transparent) !important; }
            .text-primary\/50 { color: color-mix(in srgb, var(--primary-page) 50%, transparent) !important; }
            .text-primary\/40 { color: color-mix(in srgb, var(--primary-page) 40%, transparent) !important; }
            .text-primary\/30 { color: color-mix(in srgb, var(--primary-page) 30%, transparent) !important; }
            .bg-primary\/20 { background-color: color-mix(in srgb, var(--primary-page) 20%, transparent) !important; }
            .bg-primary\/10 { background-color: color-mix(in srgb, var(--primary-page) 10%, transparent) !important; }
            .bg-primary\/5 { background-color: color-mix(in srgb, var(--primary-page) 5%, transparent) !important; }
            .border-primary\/50 { border-color: color-mix(in srgb, var(--primary-page) 50%, transparent) !important; }
            .border-primary\/30 { border-color: color-mix(in srgb, var(--primary-page) 30%, transparent) !important; }
            .border-primary\/20 { border-color: color-mix(in srgb, var(--primary-page) 20%, transparent) !important; }
            .border-primary\/10 { border-color: color-mix(in srgb, var(--primary-page) 10%, transparent) !important; }
            
            ${page.customCss || ""}
        `,
        }}
      />

      {/* Background Grid FX */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0"></div>
      {/* CRT Scanline FX */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%] pointer-events-none z-50 opacity-20"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Navbar */}
        <div className="flex items-center justify-between py-6 mb-8 border-b border-primary/10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {page.logo ? (
              <img
                src={page.logo}
                alt={page.title}
                className="size-10 rounded-md object-cover border border-primary/20 shadow-[0_0_15px_-3px_rgba(34,197,94,0.3)]"
              />
            ) : (
              <div className="size-10 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl shadow-[0_0_15px_-3px_rgba(34,197,94,0.3)]">
                {page.title.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-bold tracking-tight hidden md:block">
              {page.title}
            </span>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-1 md:gap-2">
            <a
              href="#"
              className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium transition-colors border border-primary/20"
            >
              {tHeadings("status")}
            </a>
            <a
              href="#events"
              className="px-4 py-1.5 rounded-full text-primary/60 hover:text-primary hover:bg-primary/5 text-sm font-medium transition-all"
            >
              {tHeadings("events")}
            </a>
            <a
              href="#monitors"
              className="px-4 py-1.5 rounded-full text-primary/60 hover:text-primary hover:bg-primary/5 text-sm font-medium transition-all"
            >
              {tHeadings("monitors")}
            </a>
          </div>

          {/* Actions */}
          <button className="px-4 py-2 rounded-md border border-primary/20 hover:bg-primary/10 hover:border-primary/40 text-xs font-bold uppercase tracking-wider transition-all shadow-[0_4px_10px_-4px_rgba(0,0,0,0.5)] active:translate-y-0.5">
            {tActions("get_updates")}
          </button>
        </div>

        {/* Global Status Banner */}
        <div
          className={`relative overflow-hidden rounded-sm border p-8 md:p-10 mb-16 transition-all duration-500 group ${
            allUp
              ? "bg-[rgba(34,197,94,0.03)] border-primary/20 hover:border-primary/40 hover:bg-[rgba(34,197,94,0.06)]"
              : "bg-[rgba(239,68,68,0.03)] border-red-500/20 hover:border-red-500/40 hover:bg-[rgba(239,68,68,0.06)]"
          }`}
        >
          {/* Scanline overlay for banner specifically */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(0,0,0,0.03),rgba(0,0,0,0.01),rgba(0,0,0,0.03))] bg-size-[100%_3px,3px_100%] pointer-events-none z-10"></div>

          {/* Glow Effect */}
          <div
            className={`absolute -top-24 -left-24 size-48 rounded-full blur-[100px] opacity-20 pointer-events-none ${allUp ? "bg-primary" : "bg-red-500"}`}
          ></div>

          <div className="relative z-20 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            {/* Icon Circle */}
            <div
              className={`size-20 md:size-24 rounded-full flex items-center justify-center border transition-all duration-500 relative group-hover:scale-105 ${
                allUp
                  ? "border-primary/30 text-primary bg-primary/5 shadow-[0_0_40px_-10px_rgba(34,197,94,0.3)]"
                  : "border-red-500/30 text-red-500 bg-red-500/5 shadow-[0_0_40px_-10px_rgba(239,68,68,0.3)] animate-pulse"
              }`}
            >
              {/* Inner Ring */}
              <div
                className={`absolute inset-1 rounded-full border border-dashed opacity-30 ${allUp ? "border-primary" : "border-red-500"}`}
              ></div>

              {allUp ? (
                <CheckCircle className="size-10 md:size-12 stroke-[1.5]" />
              ) : (
                <AlertTriangle className="size-10 md:size-12 stroke-[1.5]" />
              )}
            </div>

            {/* Text Stack */}
            <div className="text-center md:text-left space-y-2">
              <h2
                className={`text-3xl md:text-5xl font-bold font-mono tracking-tighter ${allUp ? "text-primary shadow-primary/20 drop-shadow-lg" : "text-red-500 shadow-red-500/20 drop-shadow-lg"}`}
                style={{
                  textShadow: allUp
                    ? "0 0 20px rgba(34,197,94,0.4)"
                    : "0 0 20px rgba(239,68,68,0.4)",
                }}
              >
                {allUp ? tStatus("operational") : tStatus("issue_detected")}
              </h2>

              <div
                className={`flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 ${allUp ? "text-primary/70" : "text-red-500/70"}`}
              >
                <p className="text-sm font-mono uppercase tracking-[0.2em] font-bold">
                  {allUp
                    ? tStatus("system_integrity_100")
                    : tStatus("critical_failures")}
                </p>

                <span className="hidden md:inline opacity-30">|</span>

                <p className="text-sm font-mono opacity-60">
                  {format.dateTime(new Date(), {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZoneName: "short",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Header - Title & Description */}
        <div className="flex flex-col items-center text-center mb-12">
          {page.description && (
            <p className="text-primary/60 text-sm md:text-base max-w-lg mx-auto uppercase tracking-widest mb-6">
              {page.description}
            </p>
          )}
        </div>

        {/* Monitor List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-primary/20 mb-6">
            <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">
              {tHeadings("system_modules")}
            </span>
            <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">
              {tHeadings("real_time_status")}
            </span>
          </div>

          {visibleMonitors.map((item: any) => (
            <StatusPageMonitorRow
              key={item.id}
              item={item}
              showUptime={page.showUptime}
              showResponseTime={page.showResponseTime}
            />
          ))}

          {visibleMonitors.length === 0 && (
            <div className="text-center py-16 border border-dashed border-primary/20 rounded-sm bg-primary/5">
              <p className="text-primary/40 font-mono text-sm uppercase tracking-widest">
                {tCommon("no_monitors")}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-24 pt-8 border-t border-primary/10 flex flex-col items-center gap-4 text-center">
          <LanguageSwitcher />

          <div className="flex flex-col items-center gap-1">
            <p className="text-[10px] text-primary/30 uppercase tracking-[0.2em]">
              {tCommon("system_status")}
            </p>
            <p className="text-xs text-primary/50">
              {tCommon("powered_by")}{" "}
              <a
                href="https://pulseguard.com"
                className="text-primary font-bold hover:underline decoration-dotted underline-offset-4"
              >
                PulseGuard
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
