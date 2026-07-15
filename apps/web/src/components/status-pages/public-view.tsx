"use client";

import { useState } from "react";
import { CheckCircle, AlertTriangle, Clock, Zap, WifiOff, Mail, Sliders, X } from "lucide-react";
import { StatusPageMonitorRow } from "./status-page-monitor-row";
import { AnalyticsTracker } from "./analytics-tracker";
import { useTranslations, useFormatter } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";
import { SubscribeModal } from "./subscribe-modal";
import { StatusPageSettings } from "./status-page-settings";

export function PublicView({
  page,
  isAdmin,
  initialIncidents = [],
}: {
  page: any;
  isAdmin?: boolean;
  initialIncidents?: any[];
}) {
  const tStatus = useTranslations("status");
  const tHeadings = useTranslations("headings");
  const tActions = useTranslations("actions");
  const tCommon = useTranslations("common");
  const format = useFormatter();

  const activeIncidents = initialIncidents.filter((inc) => !inc.resolvedAt);
  const resolvedIncidents = initialIncidents.filter((inc) => inc.resolvedAt);

  // Filter monitors based on visibility settings
  const visibleMonitors = page.monitors.filter((m: any) => {
    if (!page.showPaused && m.monitor.status === "PAUSED") return false;
    return true;
  });

  const allUp = visibleMonitors.every((m: any) => m.monitor.status === "UP");

  // Subscribe modal state
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false);

  // Dynamic Theme Colors
  const theme = (page.theme as any) || {
    value: "cyberpunk",
    colors: {
      bg: "#050505",
      text: "#e2e8f0",
      primary: "#22c55e",
      degraded: "#f59e0b",
      error: "#ef4444",
    },
  };
  const customStyle = {
    "--bg-page": theme.colors.bg,
    "--text-page": theme.colors.text,
    "--primary-page": theme.colors.primary,
    "--degraded-page": theme.colors.degraded || "#f59e0b",
    "--error-page": theme.colors.error || "#ef4444",
  } as React.CSSProperties;

  return (
    <div
      style={customStyle}
      className="min-h-screen bg-(--bg-page) text-(--text-page) font-mono selection:bg-(--primary-page)/20 relative overflow-hidden transition-colors duration-500"
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
            
            .text-red-500 { color: var(--error-page) !important; }
            .bg-red-500 { background-color: var(--error-page) !important; }
            .border-red-500\/20 { border-color: color-mix(in srgb, var(--error-page) 20%, transparent) !important; }
            .border-red-500\/40 { border-color: color-mix(in srgb, var(--error-page) 40%, transparent) !important; }
            .bg-red-500\/10 { background-color: color-mix(in srgb, var(--error-page) 10%, transparent) !important; }
            .bg-red-500\/5 { background-color: color-mix(in srgb, var(--error-page) 5%, transparent) !important; }

            .text-yellow-500 { color: var(--degraded-page) !important; }
            .bg-yellow-500 { background-color: var(--degraded-page) !important; }
            .border-yellow-500\/20 { border-color: color-mix(in srgb, var(--degraded-page) 20%, transparent) !important; }
            .border-yellow-500\/40 { border-color: color-mix(in srgb, var(--degraded-page) 40%, transparent) !important; }
            .bg-yellow-500\/10 { background-color: color-mix(in srgb, var(--degraded-page) 10%, transparent) !important; }
            .bg-yellow-500\/5 { background-color: color-mix(in srgb, var(--degraded-page) 5%, transparent) !important; }

            .text-amber-500 { color: var(--degraded-page) !important; }
            .bg-amber-500 { background-color: var(--degraded-page) !important; }
            .border-amber-500\/20 { border-color: color-mix(in srgb, var(--degraded-page) 20%, transparent) !important; }
            .border-amber-500\/40 { border-color: color-mix(in srgb, var(--degraded-page) 40%, transparent) !important; }
            .bg-amber-500\/10 { background-color: color-mix(in srgb, var(--degraded-page) 10%, transparent) !important; }
            .bg-amber-500\/5 { background-color: color-mix(in srgb, var(--degraded-page) 5%, transparent) !important; }

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
          {/* Logo & Title */}
          {page.homepageUrl ? (
            <a
              href={page.homepageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
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
              <span className="font-bold tracking-tight hidden md:block">{page.title}</span>
            </a>
          ) : (
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
              <span className="font-bold tracking-tight hidden md:block">{page.title}</span>
            </div>
          )}

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
          <div className="flex items-center gap-2">
            {page.contactUrl && (
              <a
                href={page.contactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md border border-primary/20 hover:bg-primary/10 hover:border-primary/40 text-primary transition-all flex items-center justify-center shadow-[0_4px_10px_-4px_rgba(0,0,0,0.5)] active:translate-y-0.5"
                title="Contact Support"
              >
                <Mail className="size-4" />
              </a>
            )}

            <button
              onClick={() => setIsSubscribeModalOpen(true)}
              className="px-4 py-2 rounded-md border border-primary/20 hover:bg-primary/10 hover:border-primary/40 text-xs font-bold uppercase tracking-wider transition-all shadow-[0_4px_10px_-4px_rgba(0,0,0,0.5)] active:translate-y-0.5"
            >
              {tActions("get_updates")}
            </button>
          </div>

          {/* Subscribe Modal */}
          <SubscribeModal
            isOpen={isSubscribeModalOpen}
            onClose={() => setIsSubscribeModalOpen(false)}
            pageId={page.id}
            pageSlug={page.slug}
            pageTitle={page.title}
            monitors={page.monitors}
          />
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
                  {allUp ? tStatus("system_integrity_100") : tStatus("critical_failures")}
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

        {/* Active Incidents Container */}
        {activeIncidents.length > 0 && (
          <div className="mb-12 space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-red-500/20">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <h3 className="text-xs font-bold text-red-500 uppercase tracking-[0.2em] font-mono">
                Active Outages & Incidents
              </h3>
            </div>

            <div className="space-y-4">
              {activeIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="relative overflow-hidden rounded-sm border border-red-500/30 bg-red-500/[0.02] p-6 hover:bg-red-500/[0.04] transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 w-[3px] h-full bg-red-500"></div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 className="text-base font-bold text-red-500 tracking-tight">{inc.title}</h4>
                      <p className="text-[11px] text-red-500/60 mt-0.5 uppercase tracking-wider font-semibold">
                        Affected System: {inc.monitor?.name}
                      </p>
                    </div>
                    <span className="self-start md:self-auto px-2.5 py-0.5 rounded border border-red-500/40 text-red-500 bg-red-500/10 text-[9px] uppercase tracking-widest font-bold font-mono animate-pulse">
                      {inc.status}
                    </span>
                  </div>

                  {inc.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4 border-l border-primary/10 pl-3">
                      {inc.description}
                    </p>
                  )}

                  {/* Timeline updates */}
                  {inc.events && inc.events.length > 0 && (
                    <div className="space-y-3 pt-2 border-t border-red-500/10">
                      <p className="text-[10px] font-bold text-red-500/70 uppercase tracking-widest">
                        Timeline Updates
                      </p>
                      <div className="relative pl-4 border-l border-red-500/20 space-y-3">
                        {inc.events.map((evt: any) => (
                          <div key={evt.id} className="relative text-xs">
                            <span className="absolute -left-[20.5px] top-1.5 size-2 rounded-full bg-red-500/40 border border-red-500"></span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[10px] text-red-500/80 uppercase">
                                {evt.type.replace("_", " ")}
                              </span>
                              <span className="text-[10px] text-muted-foreground opacity-60">
                                {new Date(evt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-muted-foreground text-[11px] mt-0.5 leading-relaxed">
                              {evt.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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
              barType={page.barType || "absolute"}
              cardType={page.cardType || "duration"}
              overrides={page.overrides || []}
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

        {/* Incident History Timeline */}
        <div className="mt-20 space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-primary/20">
            <Clock className="size-4 text-primary/60" />
            <h3 className="text-xs font-bold text-primary/60 uppercase tracking-[0.2em] font-mono">
              Incident History (Last 7 Days)
            </h3>
          </div>

          {resolvedIncidents.length === 0 ? (
            <div className="p-8 border border-dashed border-primary/10 rounded-sm bg-primary/[0.01] text-center">
              <p className="text-[11px] text-primary/50 uppercase tracking-widest font-mono">
                No incidents reported in the last 7 days. All systems operational.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {resolvedIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="relative overflow-hidden rounded-sm border border-primary/10 bg-primary/[0.01] p-5 hover:border-primary/20 transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 w-[3px] h-full bg-primary/40"></div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                    <div>
                      <h4 className="text-sm font-bold text-foreground tracking-tight">{inc.title}</h4>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5 uppercase tracking-wider font-mono">
                        Affected System: {inc.monitor?.name} &middot; Resolved on {new Date(inc.resolvedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="self-start md:self-auto px-2 py-0.5 rounded border border-primary/20 text-primary bg-primary/5 text-[9px] uppercase tracking-widest font-semibold font-mono">
                      RESOLVED
                    </span>
                  </div>

                  {inc.events && inc.events.length > 0 && (
                    <div className="pl-3 border-l border-primary/10 space-y-2.5 mt-3 pt-2 border-t border-primary/5">
                      {inc.events.map((evt: any) => (
                        <div key={evt.id} className="text-[11px] leading-relaxed text-muted-foreground">
                          <span className="font-bold text-[9px] text-primary/70 uppercase mr-2 tracking-wider">
                            {evt.type.replace("_", " ")}
                          </span>
                          <span className="text-[9px] opacity-55 mr-2 font-mono">
                            {new Date(evt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          &mdash; {evt.message}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-24 pt-8 border-t border-primary/10 flex flex-col items-center gap-4 text-center">
          {page.footerLinks && Array.isArray(page.footerLinks) && page.footerLinks.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-primary/60 mb-2">
              {page.footerLinks.map((link: any, idx: number) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors hover:underline decoration-dotted underline-offset-4"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          <LanguageSwitcher />

          <div className="flex flex-col items-center gap-1">
            <p className="text-[10px] text-primary/30 uppercase tracking-[0.2em]">
              {tCommon("system_status")}
            </p>
            {(!page.user || page.user.tier === "INITIATE") && (
              <p className="text-xs text-primary/50">
                {tCommon("powered_by")}{" "}
                <a
                  href="https://pulseguard.com"
                  className="text-primary font-bold hover:underline decoration-dotted underline-offset-4"
                >
                  PulseGuard
                </a>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Floating Admin Edit Button */}
      {isAdmin && (
        <button
          onClick={() => setIsEditSidebarOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-primary/20 hover:bg-primary/30 backdrop-blur-md border border-primary/30 text-primary font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-105 active:scale-95 animate-fade-in"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <Sliders className="size-4" />
          <span>Edit Design</span>
        </button>
      )}

      {/* Real-time Config Sidebar Overlay */}
      {isAdmin && (
        <>
          {/* Backdrop Blur Overlay */}
          <div
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-45 transition-opacity duration-300 ${
              isEditSidebarOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsEditSidebarOpen(false)}
          />

          {/* Sidebar Drawer */}
          <div
            className={`fixed right-0 top-0 bottom-0 w-full max-w-lg bg-black/95 backdrop-blur-lg border-l border-primary/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-50 transition-transform duration-500 ease-out transform ${
              isEditSidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b border-primary/10 bg-black/40">
              <div className="space-y-1">
                <h3 className="text-md font-bold font-mono tracking-tight text-primary uppercase">
                  Configure Status Page
                </h3>
                <p className="text-[10px] text-primary/50 uppercase tracking-widest font-mono">
                  Real-time design & branding preview
                </p>
              </div>
              <button
                onClick={() => setIsEditSidebarOpen(false)}
                className="p-1.5 rounded-sm border border-primary/10 hover:border-primary/30 hover:bg-primary/5 text-primary/60 hover:text-primary transition-all"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Sidebar Body */}
            <div className="p-6 overflow-y-auto h-[calc(100vh-80px)] custom-scrollbar">
              <StatusPageSettings page={page} />
            </div>
          </div>
        </>
      )}
      {page.customJs && (
        <script
          dangerouslySetInnerHTML={{
            __html: page.customJs,
          }}
        />
      )}
    </div>
  );
}
