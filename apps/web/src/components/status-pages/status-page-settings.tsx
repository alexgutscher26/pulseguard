"use client";

import { useActionState, useEffect, useState } from "react";
import { updateStatusPage } from "@/actions/status-pages";
import { toast } from "@/components/ui/sonner";
import {
  Loader2,
  Palette,
  Globe,
  Shield,
  Search,
  Eye,
  FileCode,
  Mail,
  Link,
  Trash,
  Code2,
} from "lucide-react";
import { StatusPageI18n } from "./status-page-i18n";

interface StatusPageSettingsProps {
  page: any;
  onLiveChange?: (updates: any) => void;
}

const initialState = { success: false, error: "" };
const themes = [
  {
    name: "Sentry Dark",
    value: "cyberpunk",
    colors: {
      bg: "#0f0e13",
      text: "#edeef0",
      primary: "#e15639",
      degraded: "#f59e0b",
      error: "#f87171",
    },
  },
  {
    name: "Loops Dark",
    value: "midnight",
    colors: {
      bg: "#0b0b0c",
      text: "#f4f4f5",
      primary: "#ff5a1f",
      degraded: "#eab308",
      error: "#ef4444",
    },
  },
  {
    name: "Loops Light",
    value: "dracula",
    colors: {
      bg: "#f9f9fb",
      text: "#09090b",
      primary: "#ff5a1f",
      degraded: "#eab308",
      error: "#ef4444",
    },
  },
  {
    name: "Monochrome",
    value: "monochrome",
    colors: {
      bg: "#ffffff",
      text: "#09090b",
      primary: "#09090b",
      degraded: "#78716c",
      error: "#ef4444",
    },
  },
];

export function StatusPageSettings({
  page,
  onLiveChange,
}: StatusPageSettingsProps) {
  const updateWithId = updateStatusPage.bind(null, page.id);
  const [state, formAction, isPending] = useActionState(
    updateWithId,
    initialState,
  );

  // Parse existing theme
  const currentTheme = (page.theme as any)?.value || "cyberpunk";
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);

  // Parse custom colors state
  const [customColors, setCustomColors] = useState({
    bg: (page.theme as any)?.colors?.bg || "#0f0e13",
    text: (page.theme as any)?.colors?.text || "#edeef0",
    primary: (page.theme as any)?.colors?.primary || "#e15639",
    degraded: (page.theme as any)?.colors?.degraded || "#f59e0b",
    error: (page.theme as any)?.colors?.error || "#f87171",
  });

  // Parse custom footer links
  const [footerLinks, setFooterLinks] = useState<
    { label: string; url: string }[]
  >(() => {
    try {
      return Array.isArray(page.footerLinks) ? page.footerLinks : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (state.success) toast.success("Status page settings updated!");
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
                  onChange={(e) => onLiveChange?.({ title: e.target.value })}
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
                  onChange={(e) => onLiveChange?.({ slug: e.target.value })}
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
                  onChange={(e) =>
                    onLiveChange?.({ description: e.target.value })
                  }
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
                  onChange={(e) =>
                    onLiveChange?.({ customDomain: e.target.value })
                  }
                  placeholder="status.example.com"
                  className="w-full bg-black/50 border border-white/10 p-2 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
                />
                <p className="text-[10px] text-muted-foreground">
                  Add CNAME to cname.vercel-dns.com
                </p>
              </div>
            </div>
          </div>

          {/* SEO & Social Sharing */}
          <div className="bg-card/20 border border-primary/10 p-6 rounded-sm space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase text-muted-foreground flex items-center gap-2">
              <Search className="size-4" /> SEO & Social Sharing
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-black/30 p-3 rounded-sm border border-white/5">
                <input
                  type="checkbox"
                  name="seoIndex"
                  defaultChecked={page.seoIndex !== false}
                  onChange={(e) =>
                    onLiveChange?.({ seoIndex: e.target.checked })
                  }
                  id="seoIndex"
                  className="accent-primary size-4"
                />
                <label
                  htmlFor="seoIndex"
                  className="text-sm font-bold text-foreground"
                >
                  Allow Indexing by Search Engines
                </label>
              </div>

              <div className="flex items-center gap-3 bg-black/30 p-3 rounded-sm border border-white/5">
                <input
                  type="checkbox"
                  name="showInShowcase"
                  defaultChecked={page.showInShowcase === true}
                  onChange={(e) =>
                    onLiveChange?.({ showInShowcase: e.target.checked })
                  }
                  id="showInShowcase"
                  className="accent-primary size-4"
                />
                <div>
                  <label
                    htmlFor="showInShowcase"
                    className="text-sm font-bold text-foreground block"
                  >
                    Feature in Community Showcase
                  </label>
                  <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    Display this page in the public{" "}
                    <a
                      href="/showcase"
                      className="text-primary hover:underline"
                    >
                      showcase gallery
                    </a>
                    . Only available for public (non-password-protected) pages.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                  Meta Title
                </label>
                <input
                  name="metaTitle"
                  defaultValue={page.metaTitle || ""}
                  onChange={(e) =>
                    onLiveChange?.({ metaTitle: e.target.value })
                  }
                  placeholder="Custom title tag for search engines"
                  className="w-full bg-black/50 border border-white/10 p-2 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                  Meta Description
                </label>
                <textarea
                  name="metaDescription"
                  defaultValue={page.metaDescription || ""}
                  onChange={(e) =>
                    onLiveChange?.({ metaDescription: e.target.value })
                  }
                  rows={2}
                  placeholder="Custom meta description summary"
                  className="w-full bg-black/50 border border-white/10 p-2 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                  OG Image URL (Social Share Preview)
                </label>
                <input
                  name="ogImageUrl"
                  defaultValue={page.ogImageUrl || ""}
                  onChange={(e) =>
                    onLiveChange?.({ ogImageUrl: e.target.value })
                  }
                  placeholder="https://example.com/social-card.png"
                  className="w-full bg-black/50 border border-white/10 p-2 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
                />
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
                onChange={(e) =>
                  onLiveChange?.({ isPrivate: e.target.checked })
                }
                id="isPrivate"
                className="accent-primary size-4"
              />
              <label
                htmlFor="isPrivate"
                className="text-sm font-bold text-foreground"
              >
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
                onChange={(e) =>
                  onLiveChange?.({ ipWhitelist: e.target.value })
                }
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
              value={JSON.stringify({
                name:
                  selectedTheme === "custom"
                    ? "Custom"
                    : themes.find((t) => t.value === selectedTheme)?.name ||
                      "Custom",
                value: selectedTheme,
                colors: customColors,
              })}
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {themes.map((theme) => (
                <button
                  key={theme.value}
                  type="button"
                  onClick={() => {
                    setSelectedTheme(theme.value);
                    const newColors = {
                      bg: theme.colors.bg,
                      text: theme.colors.text,
                      primary: theme.colors.primary,
                      degraded: theme.colors.degraded || "#f59e0b",
                      error: theme.colors.error || "#ef4444",
                    };
                    setCustomColors(newColors);
                    onLiveChange?.({
                      theme: {
                        name: theme.name,
                        value: theme.value,
                        colors: newColors,
                      },
                    });
                  }}
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
                    <span className="font-mono text-[10px] font-bold uppercase">
                      {theme.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Theme Colors Picker */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                Custom Brand Colors
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <div className="text-[9px] font-mono text-muted-foreground uppercase">
                    Background
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customColors.bg}
                      onChange={(e) => {
                        setSelectedTheme("custom");
                        const newColors = {
                          ...customColors,
                          bg: e.target.value,
                        };
                        setCustomColors(newColors);
                        onLiveChange?.({
                          theme: {
                            name: "Custom",
                            value: "custom",
                            colors: newColors,
                          },
                        });
                      }}
                      className="bg-transparent border border-white/10 rounded-sm size-8 cursor-pointer outline-none"
                    />
                    <span className="text-xs font-mono uppercase">
                      {customColors.bg}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[9px] font-mono text-muted-foreground uppercase">
                    Text
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customColors.text}
                      onChange={(e) => {
                        setSelectedTheme("custom");
                        const newColors = {
                          ...customColors,
                          text: e.target.value,
                        };
                        setCustomColors(newColors);
                        onLiveChange?.({
                          theme: {
                            name: "Custom",
                            value: "custom",
                            colors: newColors,
                          },
                        });
                      }}
                      className="bg-transparent border border-white/10 rounded-sm size-8 cursor-pointer outline-none"
                    />
                    <span className="text-xs font-mono uppercase">
                      {customColors.text}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[9px] font-mono text-muted-foreground uppercase">
                    Operational
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customColors.primary}
                      onChange={(e) => {
                        setSelectedTheme("custom");
                        const newColors = {
                          ...customColors,
                          primary: e.target.value,
                        };
                        setCustomColors(newColors);
                        onLiveChange?.({
                          theme: {
                            name: "Custom",
                            value: "custom",
                            colors: newColors,
                          },
                        });
                      }}
                      className="bg-transparent border border-white/10 rounded-sm size-8 cursor-pointer outline-none"
                    />
                    <span className="text-xs font-mono uppercase">
                      {customColors.primary}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[9px] font-mono text-muted-foreground uppercase">
                    Degraded
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customColors.degraded}
                      onChange={(e) => {
                        setSelectedTheme("custom");
                        const newColors = {
                          ...customColors,
                          degraded: e.target.value,
                        };
                        setCustomColors(newColors);
                        onLiveChange?.({
                          theme: {
                            name: "Custom",
                            value: "custom",
                            colors: newColors,
                          },
                        });
                      }}
                      className="bg-transparent border border-white/10 rounded-sm size-8 cursor-pointer outline-none"
                    />
                    <span className="text-xs font-mono uppercase">
                      {customColors.degraded}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[9px] font-mono text-muted-foreground uppercase">
                    Outage
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customColors.error}
                      onChange={(e) => {
                        setSelectedTheme("custom");
                        const newColors = {
                          ...customColors,
                          error: e.target.value,
                        };
                        setCustomColors(newColors);
                        onLiveChange?.({
                          theme: {
                            name: "Custom",
                            value: "custom",
                            colors: newColors,
                          },
                        });
                      }}
                      className="bg-transparent border border-white/10 rounded-sm size-8 cursor-pointer outline-none"
                    />
                    <span className="text-xs font-mono uppercase">
                      {customColors.error}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Branding */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <input
                type="hidden"
                name="footerLinks"
                value={JSON.stringify(footerLinks)}
              />

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                  Logo URL
                </label>
                <input
                  name="logo"
                  defaultValue={page.logo || ""}
                  onChange={(e) => onLiveChange?.({ logo: e.target.value })}
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
                  onChange={(e) => onLiveChange?.({ favicon: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-black/50 border border-white/10 p-2 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
                />
              </div>

              {/* Homepage Link */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <Link className="size-3" /> Logo Link (Homepage URL)
                </label>
                <input
                  name="homepageUrl"
                  defaultValue={page.homepageUrl || ""}
                  onChange={(e) =>
                    onLiveChange?.({ homepageUrl: e.target.value })
                  }
                  placeholder="https://yourcompany.com"
                  className="w-full bg-black/50 border border-white/10 p-2 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
                />
              </div>

              {/* Support URL */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <Mail className="size-3" /> Contact Support URL
                </label>
                <input
                  name="contactUrl"
                  defaultValue={page.contactUrl || ""}
                  onChange={(e) =>
                    onLiveChange?.({ contactUrl: e.target.value })
                  }
                  placeholder="https://support.yourcompany.com or mailto:support@company.com"
                  className="w-full bg-black/50 border border-white/10 p-2 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
                />
              </div>

              {/* Footer Links Manager */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  Custom Footer Links
                </label>
                <div className="space-y-2">
                  {footerLinks.map((link, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        placeholder="Label (e.g. Terms)"
                        value={link.label}
                        onChange={(e) => {
                          const updated = [...footerLinks];
                          updated[idx].label = e.target.value;
                          setFooterLinks(updated);
                          onLiveChange?.({ footerLinks: updated });
                        }}
                        className="w-1/3 bg-black/50 border border-white/10 p-1.5 rounded-sm text-xs font-mono focus:border-primary/50 outline-none transition-colors"
                      />
                      <input
                        placeholder="URL (https://...)"
                        value={link.url}
                        onChange={(e) => {
                          const updated = [...footerLinks];
                          updated[idx].url = e.target.value;
                          setFooterLinks(updated);
                          onLiveChange?.({ footerLinks: updated });
                        }}
                        className="flex-1 bg-black/50 border border-white/10 p-1.5 rounded-sm text-xs font-mono focus:border-primary/50 outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = footerLinks.filter(
                            (_, i) => i !== idx,
                          );
                          setFooterLinks(updated);
                          onLiveChange?.({ footerLinks: updated });
                        }}
                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-sm border border-red-500/20 transition-all flex items-center justify-center"
                        title="Remove link"
                      >
                        <Trash className="size-3.5" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...footerLinks, { label: "", url: "" }];
                      setFooterLinks(updated);
                      onLiveChange?.({ footerLinks: updated });
                    }}
                    className="w-full py-1.5 border border-dashed border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-[10px] font-mono font-bold text-primary uppercase rounded-sm transition-all"
                  >
                    + Add Footer Link
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono flex items-center gap-2">
                  <FileCode className="size-3" /> Custom CSS
                </label>
                <textarea
                  name="customCss"
                  defaultValue={page.customCss || ""}
                  onChange={(e) =>
                    onLiveChange?.({ customCss: e.target.value })
                  }
                  rows={3}
                  placeholder=".body { ... }"
                  className="w-full bg-black/50 border border-white/10 p-2 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono flex items-center gap-2">
                  <Code2 className="size-3" /> Custom Javascript (JS)
                </label>
                <textarea
                  name="customJs"
                  defaultValue={page.customJs || ""}
                  onChange={(e) => onLiveChange?.({ customJs: e.target.value })}
                  rows={3}
                  placeholder="console.log('Custom JS Loaded');"
                  className="w-full bg-black/50 border border-white/10 p-2 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
                />
                <p className="text-[9px] text-muted-foreground font-mono">
                  Injected before the closing body tag. Do not include
                  &lt;script&gt; tags.
                </p>
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
                  onChange={(e) => onLiveChange?.({ barType: e.target.value })}
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
                  onChange={(e) => onLiveChange?.({ cardType: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 p-2 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
                >
                  <option value="duration">Duration (Percent Uptime)</option>
                  <option value="requests">Requests (Check Counts)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Visibility Settings */}
          <div className="bg-card/20 border border-primary/10 p-6 rounded-sm space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase text-muted-foreground flex items-center gap-2">
              <Eye className="size-4" /> Visibility Settings
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="showUptime"
                  className="text-sm font-mono text-muted-foreground"
                >
                  Show Uptime Percentage
                </label>
                <input
                  type="checkbox"
                  name="showUptime"
                  id="showUptime"
                  defaultChecked={page.showUptime ?? true}
                  onChange={(e) =>
                    onLiveChange?.({ showUptime: e.target.checked })
                  }
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
                  onChange={(e) =>
                    onLiveChange?.({ showResponseTime: e.target.checked })
                  }
                  className="accent-primary size-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="showPaused"
                  className="text-sm font-mono text-muted-foreground"
                >
                  Show Paused Monitors
                </label>
                <input
                  type="checkbox"
                  name="showPaused"
                  id="showPaused"
                  defaultChecked={page.showPaused ?? false}
                  onChange={(e) =>
                    onLiveChange?.({ showPaused: e.target.checked })
                  }
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
