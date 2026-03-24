"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Globe, Palette, Type, Save, AlertCircle, Check, Loader2 } from "lucide-react";
import { updateWidgetConfig } from "@/actions/status-pages";
import { StatusBadgePreview } from "@/components/widgets/status-badge-preview";
import { EmbedCodeGenerator } from "@/components/widgets/embed-code-generator";

interface WidgetConfig {
  widgetEnabled: boolean;
  widgetAllowedDomains: string | null;
  widgetBadgeText: {
    operational: string;
    partial: string;
    major: string;
  } | null;
  widgetTheme: {
    bgColor: string;
    textColor: string;
    borderRadius: string;
  } | null;
}

interface WidgetConfiguratorProps {
  pageId: string;
  pageSlug: string;
  initialConfig: WidgetConfig;
}

const DEFAULT_BADGE_TEXT = {
  operational: "All Systems Operational",
  partial: "Partial Outage",
  major: "Major Outage",
};

const DEFAULT_THEME = {
  bgColor: "#1a1a2e",
  textColor: "#00ff88",
  borderRadius: "8px",
};

export function WidgetConfigurator({ pageId, pageSlug, initialConfig }: WidgetConfiguratorProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [enabled, setEnabled] = useState(initialConfig.widgetEnabled);
  const [allowedDomains, setAllowedDomains] = useState(initialConfig.widgetAllowedDomains || "");
  const [badgeText, setBadgeText] = useState({
    operational: initialConfig.widgetBadgeText?.operational || DEFAULT_BADGE_TEXT.operational,
    partial: initialConfig.widgetBadgeText?.partial || DEFAULT_BADGE_TEXT.partial,
    major: initialConfig.widgetBadgeText?.major || DEFAULT_BADGE_TEXT.major,
  });
  const [theme, setTheme] = useState({
    bgColor: initialConfig.widgetTheme?.bgColor || DEFAULT_THEME.bgColor,
    textColor: initialConfig.widgetTheme?.textColor || DEFAULT_THEME.textColor,
    borderRadius: initialConfig.widgetTheme?.borderRadius || DEFAULT_THEME.borderRadius,
  });

  const handleSave = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await updateWidgetConfig(pageId, {
        widgetEnabled: enabled,
        widgetAllowedDomains: allowedDomains || null,
        widgetBadgeText: badgeText,
        widgetTheme: theme,
      });

      if (result.success) {
        setMessage({ type: "success", text: "Widget configuration saved!" });
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to save configuration",
        });
      }

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Enable/Disable Toggle */}
      <div className="rounded-sm border border-primary/20 bg-card/40 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="size-5 text-primary" />
            <div>
              <h3 className="text-sm font-bold font-mono uppercase tracking-tight text-foreground">
                Enable Widget
              </h3>
              <p className="text-xs text-muted-foreground">
                Allow external websites to embed your status badge
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => setEnabled(!enabled)}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
              enabled ? "bg-primary" : "bg-muted",
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition-transform",
                enabled ? "translate-x-5" : "translate-x-0",
              )}
            />
          </button>
        </div>
      </div>

      {enabled && (
        <>
          {/* Allowed Domains */}
          <div className="rounded-sm border border-primary/20 bg-card/40 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="size-5 text-primary" />
              <div>
                <h3 className="text-sm font-bold font-mono uppercase tracking-tight text-foreground">
                  Allowed Domains
                </h3>
                <p className="text-xs text-muted-foreground">
                  Domains that can embed your widget (CORS)
                </p>
              </div>
            </div>
            <textarea
              value={allowedDomains}
              onChange={(e) => setAllowedDomains(e.target.value)}
              placeholder="example.com&#10;*.example.org&#10;subdomain.example.net"
              rows={4}
              className="w-full bg-background/50 border border-primary/20 rounded-sm p-3 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 resize-none"
            />
            <div className="mt-2 text-xs text-muted-foreground/60 font-mono space-y-1">
              <p>• One domain per line, or comma-separated</p>
              <p>
                • Use <code className="text-primary/80">*</code> to allow all domains
              </p>
              <p>
                • Use <code className="text-primary/80">*.example.com</code> for wildcard subdomains
              </p>
              <p>• Leave empty to block all cross-origin requests</p>
            </div>
          </div>

          {/* Badge Text Customization */}
          <div className="rounded-sm border border-primary/20 bg-card/40 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <Type className="size-5 text-primary" />
              <div>
                <h3 className="text-sm font-bold font-mono uppercase tracking-tight text-foreground">
                  Badge Text
                </h3>
                <p className="text-xs text-muted-foreground">Customize the status messages</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-green-500 font-bold mb-1 block">
                  Operational
                </label>
                <input
                  type="text"
                  value={badgeText.operational}
                  onChange={(e) => setBadgeText({ ...badgeText, operational: e.target.value })}
                  className="w-full bg-background/50 border border-green-500/20 rounded-sm p-2 text-sm font-mono text-foreground focus:outline-none focus:border-green-500/50"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-yellow-500 font-bold mb-1 block">
                  Partial Outage
                </label>
                <input
                  type="text"
                  value={badgeText.partial}
                  onChange={(e) => setBadgeText({ ...badgeText, partial: e.target.value })}
                  className="w-full bg-background/50 border border-yellow-500/20 rounded-sm p-2 text-sm font-mono text-foreground focus:outline-none focus:border-yellow-500/50"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-red-500 font-bold mb-1 block">
                  Major Outage
                </label>
                <input
                  type="text"
                  value={badgeText.major}
                  onChange={(e) => setBadgeText({ ...badgeText, major: e.target.value })}
                  className="w-full bg-background/50 border border-red-500/20 rounded-sm p-2 text-sm font-mono text-foreground focus:outline-none focus:border-red-500/50"
                />
              </div>
            </div>
          </div>

          {/* Theme Customization */}
          <div className="rounded-sm border border-primary/20 bg-card/40 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="size-5 text-primary" />
              <div>
                <h3 className="text-sm font-bold font-mono uppercase tracking-tight text-foreground">
                  Widget Theme
                </h3>
                <p className="text-xs text-muted-foreground">Customize colors and style</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold mb-2 block">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.bgColor}
                    onChange={(e) => setTheme({ ...theme, bgColor: e.target.value })}
                    className="w-10 h-10 rounded-sm border border-primary/20 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.bgColor}
                    onChange={(e) => setTheme({ ...theme, bgColor: e.target.value })}
                    className="flex-1 bg-background/50 border border-primary/20 rounded-sm p-2 text-sm font-mono text-foreground focus:outline-none focus:border-primary/50 uppercase"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold mb-2 block">
                  Text Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.textColor}
                    onChange={(e) => setTheme({ ...theme, textColor: e.target.value })}
                    className="w-10 h-10 rounded-sm border border-primary/20 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.textColor}
                    onChange={(e) => setTheme({ ...theme, textColor: e.target.value })}
                    className="flex-1 bg-background/50 border border-primary/20 rounded-sm p-2 text-sm font-mono text-foreground focus:outline-none focus:border-primary/50 uppercase"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold mb-2 block">
                  Border Radius
                </label>
                <select
                  value={theme.borderRadius}
                  onChange={(e) => setTheme({ ...theme, borderRadius: e.target.value })}
                  className="w-full bg-background/50 border border-primary/20 rounded-sm p-2 text-sm font-mono text-foreground focus:outline-none focus:border-primary/50"
                >
                  <option value="0px">Square (0px)</option>
                  <option value="4px">Subtle (4px)</option>
                  <option value="8px">Rounded (8px)</option>
                  <option value="16px">More Rounded (16px)</option>
                  <option value="9999px">Pill (Full)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <StatusBadgePreview theme={theme} badgeText={badgeText} />

          {/* Embed Code */}
          <EmbedCodeGenerator slug={pageSlug} />
        </>
      )}

      {/* Save Button */}
      <div className="flex items-center justify-between">
        {message && (
          <div
            className={cn(
              "flex items-center gap-2 text-sm font-mono",
              message.type === "success" ? "text-green-500" : "text-red-500",
            )}
          >
            {message.type === "success" ? (
              <Check className="size-4" />
            ) : (
              <AlertCircle className="size-4" />
            )}
            {message.text}
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={isPending}
          className={cn(
            "flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-sm font-mono font-bold uppercase tracking-wider text-sm transition-all ml-auto",
            isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90",
          )}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save Widget Settings
        </button>
      </div>
    </div>
  );
}
