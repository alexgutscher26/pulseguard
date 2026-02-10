"use client";

import { useState } from "react";
import { X, Mail, Rss, Check, Loader2 } from "lucide-react";
import { initiateSubscription } from "@/actions/subscriptions";
import { FeedLinks } from "./feed-links";
import { MonitorSelector } from "./monitor-selector";
import { useTranslations } from "next-intl";

interface Monitor {
  id: string;
  monitorId: string;
  displayName: string | null;
  monitor: {
    id: string;
    name: string;
  };
}

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageId: string;
  pageSlug: string;
  pageTitle: string;
  monitors: Monitor[];
}

export function SubscribeModal({
  isOpen,
  onClose,
  pageId,
  pageSlug,
  pageTitle,
  monitors,
}: SubscribeModalProps) {
  const [email, setEmail] = useState("");
  const [selectedMonitorIds, setSelectedMonitorIds] = useState<string[]>(
    monitors.map((m) => m.monitorId),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"email" | "feeds">("email");

  const t = useTranslations("subscribe");
  const tCommon = useTranslations("common");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    const response = await initiateSubscription(pageId, email, selectedMonitorIds);
    setResult(response);
    setIsLoading(false);

    if (response.success) {
      setEmail("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-[#0a0a0f] border border-primary/30 rounded-lg shadow-[0_0_50px_rgba(34,197,94,0.1)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary/20">
          <h2 className="text-lg font-bold text-primary font-mono tracking-tight">{t("title")}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-primary/10 text-primary/60 hover:text-primary transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-primary/20">
          <button
            onClick={() => setActiveTab("email")}
            className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === "email"
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-primary/50 hover:text-primary hover:bg-primary/5"
            }`}
          >
            <Mail className="size-4" />
            {t("email_tab")}
          </button>
          <button
            onClick={() => setActiveTab("feeds")}
            className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === "feeds"
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-primary/50 hover:text-primary hover:bg-primary/5"
            }`}
          >
            <Rss className="size-4" />
            {t("feed_tab")}
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === "email" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold text-primary/60 uppercase tracking-wider mb-2"
                >
                  {t("email_label")}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("email_placeholder")}
                  required
                  className="w-full px-4 py-3 bg-black/50 border border-primary/30 rounded-md text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 font-mono"
                />
              </div>

              {/* Monitor Selection */}
              <div>
                <label className="block text-xs font-bold text-primary/60 uppercase tracking-wider mb-2">
                  {t("monitors_label")}
                </label>
                <MonitorSelector
                  monitors={monitors}
                  selectedIds={selectedMonitorIds}
                  onChange={setSelectedMonitorIds}
                />
              </div>

              {/* Info */}
              <p className="text-xs text-primary/40">{t("info_text")}</p>

              {/* Result Message */}
              {result && (
                <div
                  className={`p-3 rounded-md text-sm ${
                    result.success
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "bg-red-500/10 text-red-400 border border-red-500/30"
                  }`}
                >
                  {result.success && <Check className="inline size-4 mr-2" />}
                  {result.message}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full py-3 px-4 bg-primary/20 hover:bg-primary/30 disabled:bg-primary/10 disabled:cursor-not-allowed border border-primary/30 rounded-md text-primary font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {t("subscribing")}
                  </>
                ) : (
                  <>
                    <Mail className="size-4" />
                    {t("button")}
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-primary/60">{t("feed_info")}</p>
              <FeedLinks pageSlug={pageSlug} pageTitle={pageTitle} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-primary/10 bg-primary/5">
          <p className="text-xs text-primary/30 text-center font-mono">
            {tCommon("powered_by")} • GDPR Compliant
          </p>
        </div>
      </div>
    </div>
  );
}
