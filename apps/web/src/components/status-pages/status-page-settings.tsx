"use client";

import { useActionState, useEffect, useState } from "react";
import { updateStatusPage } from "@/actions/status-pages";
import { toast } from "sonner";
import { Loader2, Palette, Globe, Shield, Search, Eye, FileCode } from "lucide-react";
import { StatusPageI18n } from "./status-page-i18n";

interface StatusPageSettingsProps {
  page: any;
}

const initialState = { success: false, error: "" };
const themes = [
  {
    name: "Cyberpunk",
    value: "cyberpunk",
    colors: { bg: "#050505", text: "#e2e8f0", primary: "#22c55e" },
  },
  {
    name: "Midnight",
    value: "midnight",
    colors: { bg: "#0f172a", text: "#f8fafc", primary: "#38bdf8" },
  },
  {
    name: "Dracula",
    value: "dracula",
    colors: { bg: "#282a36", text: "#f8f8f2", primary: "#ff79c6" },
  },
  {
    name: "Monochrome",
    value: "monochrome",
    colors: { bg: "#ffffff", text: "#000000", primary: "#000000" },
  },
];

export function StatusPageSettings({ page }: StatusPageSettingsProps) {
  const updateWithId = updateStatusPage.bind(null, page.id);
  const [state, formAction, isPending] = useActionState(updateWithId, initialState);

  // Parse existing theme
  const currentTheme = (page.theme as any)?.value || "cyberpunk";
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);

  useEffect(() => {
    if (state.success) toast.success("Settings updated");
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* General Settings */}
          <div className="bg-card/20 border border-primary/10 p-6 rounded-sm space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase text-muted-foreground flex items-center gap-2">
              <Globe className="size-4" /> General Configuration
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                  Page Title
                </label>
                <input
                  name="title"
                  defaultValue={page.title}
                  className="w-full bg-black/50 border border-white/10 p-2 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                  Slug (URL)
                </label>
                <input
                  name="slug"
                  defaultValue={page.slug}
                  className="w-full bg-black/50 border border-white/10 p-2 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={page.description || ""}
                  rows={2}
                  className="w-full bg-black/50 border border-white/10 p-2 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                  Custom Domain
                </label>
                <input
                  name="customDomain"
                  defaultValue={page.customDomain || ""}
                  placeholder="status.example.com"
                  className="w-full bg-black/50 border border-white/10 p-2 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
                />
                <p className="text-[10px] text-muted-foreground">
                  Add CNAME to cname.vercel-dns.com
                </p>
              </div>
            </div>
          </div>

          {/* Access Control */}
          <div className="bg-card/20 border border-primary/10 p-6 rounded-sm space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase text-muted-foreground flex items-center gap-2">
              <Shield className="size-4" /> Access Control
            </h3>

            <div className="flex items-center gap-3 bg-black/30 p-3 rounded-sm border border-white/5">
              <input
                type="checkbox"
                name="isPrivate"
                defaultChecked={page.isPrivate}
                id="isPrivate"
                className="accent-primary size-4"
              />
              <label htmlFor="isPrivate" className="text-sm font-bold text-foreground">
                Make Page Private
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                Password Protection
              </label>
              <input
                name="password"
                type="password"
                defaultValue={page.password || ""}
                placeholder="Set a password to restrict access"
                className="w-full bg-black/50 border border-white/10 p-2 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                IP Whitelist (Comma separated)
              </label>
              <input
                name="ipWhitelist"
                defaultValue={page.ipWhitelist || ""}
                placeholder="192.168.1.1, 10.0.0.1"
                className="w-full bg-black/50 border border-white/10 p-2 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Theme Selector */}
          <div className="bg-card/20 border border-primary/10 p-6 rounded-sm space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase text-muted-foreground flex items-center gap-2">
              <Palette className="size-4" /> Appearance Theme
            </h3>

            <input
              type="hidden"
              name="theme"
              value={JSON.stringify(themes.find((t) => t.value === selectedTheme))}
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {themes.map((theme) => (
                <button
                  key={theme.value}
                  type="button"
                  onClick={() => setSelectedTheme(theme.value)}
                  className={`relative p-2 rounded-sm border transition-all text-left group overflow-hidden ${
                    selectedTheme === theme.value
                      ? "border-primary ring-1 ring-primary/50"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{ backgroundColor: theme.colors.bg }}
                  ></div>
                  <div className="relative z-10 flex flex-col gap-1">
                    <div className="flex gap-1">
                      <div
                        className="size-2 rounded-full border border-white/20"
                        style={{ backgroundColor: theme.colors.bg }}
                      />
                      <div
                        className="size-2 rounded-full"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                    </div>
                    <span className="font-mono text-[10px] font-bold uppercase">{theme.name}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Branding */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                  Logo URL
                </label>
                <input
                  name="logo"
                  defaultValue={page.logo || ""}
                  placeholder="https://..."
                  className="w-full bg-black/50 border border-white/10 p-2 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                  Favicon URL
                </label>
                <input
                  name="favicon"
                  defaultValue={page.favicon || ""}
                  placeholder="https://..."
                  className="w-full bg-black/50 border border-white/10 p-2 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono flex items-center gap-2">
                  <FileCode className="size-3" /> Custom CSS
                </label>
                <textarea
                  name="customCss"
                  defaultValue={page.customCss || ""}
                  rows={3}
                  placeholder=".body { ... }"
                  className="w-full bg-black/50 border border-white/10 p-2 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Localization */}
          <StatusPageI18n page={page} />

          {/* Tracker Customization */}
          <div className="bg-card/20 border border-primary/10 p-6 rounded-sm space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase text-muted-foreground flex items-center gap-2">
              <Eye className="size-4" /> Tracker Customization
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                  Bar Type (Status Timeline)
                </label>
                <select
                  name="barType"
                  defaultValue={page.barType || "absolute"}
                  className="w-full bg-black/50 border border-white/10 p-2 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
                >
                  <option value="absolute">Absolute (Real Data)</option>
                  <option value="manual">Manual (Overridden Status)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                  Card Type (Tracker Metrics)
                </label>
                <select
                  name="cardType"
                  defaultValue={page.cardType || "duration"}
                  className="w-full bg-black/50 border border-white/10 p-2 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
                >
                  <option value="duration">Duration (Percent Uptime)</option>
                  <option value="requests">Requests (Check Counts)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Visibility & SEO */}
          <div className="bg-card/20 border border-primary/10 p-6 rounded-sm space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase text-muted-foreground flex items-center gap-2">
              <Eye className="size-4" /> Visibility & SEO
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="seoIndex"
                  className="text-sm font-mono text-muted-foreground flex items-center gap-2"
                >
                  <Search className="size-3" /> Index on Search Engines
                </label>
                <input
                  type="checkbox"
                  name="seoIndex"
                  id="seoIndex"
                  defaultChecked={page.seoIndex ?? true}
                  className="accent-primary size-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="showUptime" className="text-sm font-mono text-muted-foreground">
                  Show Uptime Percentage
                </label>
                <input
                  type="checkbox"
                  name="showUptime"
                  id="showUptime"
                  defaultChecked={page.showUptime ?? true}
                  className="accent-primary size-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="showResponseTime"
                  className="text-sm font-mono text-muted-foreground"
                >
                  Show Response Charts
                </label>
                <input
                  type="checkbox"
                  name="showResponseTime"
                  id="showResponseTime"
                  defaultChecked={page.showResponseTime ?? true}
                  className="accent-primary size-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="showPaused" className="text-sm font-mono text-muted-foreground">
                  Show Paused Monitors
                </label>
                <input
                  type="checkbox"
                  name="showPaused"
                  id="showPaused"
                  defaultChecked={page.showPaused ?? false}
                  className="accent-primary size-4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-white/5 sticky bottom-0 bg-black/80 backdrop-blur-sm p-4">
        <button
          type="submit"
          disabled={isPending}
          className="bg-primary hover:bg-primary/90 text-black font-bold font-mono text-xs uppercase px-6 py-3 rounded-sm flex items-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all"
        >
          {isPending && <Loader2 className="size-3 animate-spin" />}
          Save Changes
        </button>
      </div>
    </form>
  );
}
