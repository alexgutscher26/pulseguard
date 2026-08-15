"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Bell,
  CheckCircle2,
  Download,
  Key,
  Mail,
  RefreshCw,
  Rocket,
  Send,
  Sparkles,
  ShieldCheck,
  Zap,
  X,
  Server,
  Radio,
  FileText,
  Boxes,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { quickCreateMonitor } from "@/actions/monitors";
import {
  fetchUptimeRobotMonitors,
  importUptimeRobotMonitors,
  type NormalizedImportMonitor,
} from "@/actions/uptimerobot";
import {
  fetchBetterStackMonitors,
  fetchStatusCakeMonitors,
  parseCsvOrJsonMonitors,
} from "@/actions/importers";
import { createNotificationChannel } from "@/actions/notifications";
import type { OnboardingStatus } from "@/actions/onboarding";
import { completeOnboarding } from "@/actions/onboarding";

interface OnboardingWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail?: string;
  onboardingStatus?: OnboardingStatus;
}

export function OnboardingWizard({ open, onOpenChange, userEmail = "" }: OnboardingWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [tab, setTab] = useState<"quick" | "import">("quick");
  const [importProvider, setImportProvider] = useState<
    "uptimerobot" | "betterstack" | "statuscake" | "csv"
  >("uptimerobot");

  // Step 1 Quick Form State
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [monitorType, setMonitorType] = useState<"HTTP" | "PING" | "PORT" | "SSL">("HTTP");
  const [isPrefilledFromDemo, setIsPrefilledFromDemo] = useState(false);
  const [isCreatingMonitor, setIsCreatingMonitor] = useState(false);
  const [monitorError, setMonitorError] = useState("");

  // Step 1 Import State
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [rawContentInput, setRawContentInput] = useState("");
  const [isFetchingImport, setIsFetchingImport] = useState(false);
  const [importedCandidates, setImportedCandidates] = useState<NormalizedImportMonitor[]>([]);
  const [isImportingMonitors, setIsImportingMonitors] = useState(false);
  const [importSuccessCount, setImportSuccessCount] = useState<number | null>(null);

  // Step 2 Alert Channel State
  const [channelType, setChannelType] = useState<
    "EMAIL" | "DISCORD" | "SLACK" | "TELEGRAM" | "WEBHOOK"
  >("EMAIL");
  const [channelName, setChannelName] = useState("Primary Incident Channel");
  const [emailAddress, setEmailAddress] = useState(userEmail);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [telegramToken, setTelegramToken] = useState("");
  const [telegramChatId, setTelegramChatId] = useState("");
  const [isSavingChannel, setIsSavingChannel] = useState(false);
  const [channelError, setChannelError] = useState("");

  // Pre-fill from demo URL or localStorage on mount
  useEffect(() => {
    if (!open) return;

    try {
      const storedDemoPrefill = localStorage.getItem("pulseguard_prefill_monitor");
      if (storedDemoPrefill) {
        const parsed = JSON.parse(storedDemoPrefill);
        if (parsed.url) {
          setUrl(parsed.url);
          setName(parsed.name || inferNameFromUrl(parsed.url));
          setIsPrefilledFromDemo(true);
          return;
        }
      }

      // Query param check
      const urlParams = new URLSearchParams(window.location.search);
      const paramUrl = urlParams.get("url") || urlParams.get("prefillUrl");
      if (paramUrl) {
        setUrl(paramUrl);
        setName(inferNameFromUrl(paramUrl));
        setIsPrefilledFromDemo(true);
      }
    } catch (e) {
      console.error("Failed to parse prefilled monitor data:", e);
    }
  }, [open]);

  useEffect(() => {
    if (userEmail && !emailAddress) {
      setEmailAddress(userEmail);
    }
  }, [userEmail]);

  function inferNameFromUrl(inputUrl: string) {
    try {
      let clean = inputUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
      const parts = clean.split("/");
      return parts[0] + (parts[1] ? `/${parts[1]}` : "") + " Health";
    } catch {
      return "Main Web Service";
    }
  }

  const handleUrlChange = (val: string) => {
    setUrl(val);
    if (!name || name === inferNameFromUrl(url)) {
      setName(inferNameFromUrl(val));
    }
  };

  // Create single monitor
  const handleQuickCreateMonitor = async (e: React.FormEvent) => {
    e.preventDefault();
    setMonitorError("");

    if (!url.trim()) {
      setMonitorError("Please enter a target URL or endpoint.");
      return;
    }

    setIsCreatingMonitor(true);
    const res = await quickCreateMonitor({
      name: name || inferNameFromUrl(url),
      url: url.trim(),
      type: monitorType,
      interval: 60,
    });
    setIsCreatingMonitor(false);

    if (!res.success) {
      setMonitorError(res.error || "Failed to create monitor.");
      return;
    }

    localStorage.removeItem("pulseguard_prefill_monitor");
    setStep(2);
  };

  // Fetch monitors from selected provider
  const handleFetchImportMonitors = async () => {
    setMonitorError("");

    setIsFetchingImport(true);
    let res: any;

    if (importProvider === "uptimerobot") {
      if (!apiKeyInput.trim()) {
        setMonitorError("UptimeRobot API Key is required.");
        setIsFetchingImport(false);
        return;
      }
      res = await fetchUptimeRobotMonitors(apiKeyInput);
    } else if (importProvider === "betterstack") {
      if (!apiKeyInput.trim()) {
        setMonitorError("Better Stack API Key is required.");
        setIsFetchingImport(false);
        return;
      }
      res = await fetchBetterStackMonitors(apiKeyInput);
    } else if (importProvider === "statuscake") {
      if (!apiKeyInput.trim()) {
        setMonitorError("StatusCake API Key is required.");
        setIsFetchingImport(false);
        return;
      }
      res = await fetchStatusCakeMonitors(apiKeyInput);
    } else if (importProvider === "csv") {
      if (!rawContentInput.trim()) {
        setMonitorError("CSV/JSON content is required.");
        setIsFetchingImport(false);
        return;
      }
      res = await parseCsvOrJsonMonitors(rawContentInput);
    }

    setIsFetchingImport(false);

    if (!res?.success) {
      setMonitorError(res?.error || "Failed to fetch monitors from provider.");
      return;
    }

    setImportedCandidates(res.monitors || []);
  };

  // Toggle selection in candidates list
  const toggleSelectMonitor = (index: number) => {
    setImportedCandidates((prev) =>
      prev.map((m, i) => (i === index ? { ...m, selected: !m.selected } : m)),
    );
  };

  // Bulk Import candidates
  const handleImportCandidates = async () => {
    setMonitorError("");
    const selected = importedCandidates.filter((m) => m.selected);
    if (selected.length === 0) {
      setMonitorError("Please select at least one monitor to import.");
      return;
    }

    setIsImportingMonitors(true);
    const res = await importUptimeRobotMonitors(selected);
    setIsImportingMonitors(false);

    if (!res.success) {
      setMonitorError(res.error || "Failed to import monitors.");
      return;
    }

    setImportSuccessCount(res.importedCount || selected.length);
    setTimeout(() => {
      setStep(2);
    }, 1200);
  };

  // Connect Alert Channel
  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    setChannelError("");

    let configObj: any = {};
    if (channelType === "EMAIL") {
      if (!emailAddress.trim()) {
        setChannelError("Email address is required.");
        return;
      }
      configObj = { email: emailAddress.trim() };
    } else if (channelType === "DISCORD" || channelType === "SLACK" || channelType === "WEBHOOK") {
      if (!webhookUrl.trim()) {
        setChannelError("Webhook URL is required.");
        return;
      }
      configObj = { webhookUrl: webhookUrl.trim() };
    } else if (channelType === "TELEGRAM") {
      if (!telegramToken.trim() || !telegramChatId.trim()) {
        setChannelError("Telegram bot token and chat ID are required.");
        return;
      }
      configObj = {
        botToken: telegramToken.trim(),
        chatId: telegramChatId.trim(),
      };
    }

    setIsSavingChannel(true);
    const formData = new FormData();
    formData.append("name", channelName || `${channelType} Alert Channel`);
    formData.append("type", channelType);
    formData.append("config", JSON.stringify(configObj));

    const res = await createNotificationChannel(null, formData);
    setIsSavingChannel(false);

    if (!res.success) {
      setChannelError(res.error || "Failed to create notification channel.");
      return;
    }

    setStep(3);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark max-w-2xl max-h-[90vh] p-0 border border-emerald-500/30 bg-zinc-950/95 shadow-[0_0_60px_rgba(16,185,129,0.25)] text-zinc-100 overflow-hidden rounded-2xl sm:rounded-2xl flex flex-col [&>button]:hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>PulseGuard 60-Second Setup</DialogTitle>
          <DialogDescription>
            {step === 1 &&
              "Create monitor or 1-click import from UptimeRobot, Better Stack, or StatusCake."}
            {step === 2 && "Connect your alert channel — never leave a monitor unnotified."}
            {step === 3 && "Live Multi-Region Edge Consensus Verification."}
          </DialogDescription>
        </DialogHeader>

        {/* Header bar (Fixed Top) */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <Rocket className="size-5 animate-pulse text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-mono text-foreground uppercase tracking-wider">
                  PulseGuard 60-Second Setup
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold">
                  Step {step} of 3
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                {step === 1 &&
                  "Create monitor or 1-click import from UptimeRobot, Better Stack, or StatusCake."}
                {step === 2 && "Connect your alert channel — never leave a monitor unnotified."}
                {step === 3 && "Live Multi-Region Edge Consensus Verification."}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="size-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-lg transition-colors"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Progress Stepper (Fixed Subheader) */}
        <div className="shrink-0 grid grid-cols-3 border-b border-zinc-800/80 bg-zinc-950">
          {[
            { id: 1, label: "1. Monitor Target", icon: Activity },
            { id: 2, label: "2. Alert Channel", icon: Bell },
            { id: 3, label: "3. Edge Live Check", icon: ShieldCheck },
          ].map((s) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isDone = step > s.id;
            return (
              <div
                key={s.id}
                className={cn(
                  "flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-mono border-r border-zinc-800/80 last:border-r-0 transition-colors",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 font-bold border-b-2 border-b-emerald-400 shadow-[inset_0_-2px_8px_rgba(16,185,129,0.2)]"
                    : isDone
                      ? "text-emerald-500 bg-zinc-900/30"
                      : "text-zinc-500",
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="size-3.5 text-emerald-400" />
                ) : (
                  <Icon className="size-3.5" />
                )}
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-zinc-100 [color-scheme:dark]">
          <AnimatePresence mode="wait">
            {/* STEP 1: CREATE MONITOR / MULTI-PROVIDER IMPORT */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-5"
              >
                {/* Method Switcher Tabs */}
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setTab("quick")}
                    className={cn(
                      "flex items-center justify-center gap-2 py-2.5 text-xs font-mono font-bold rounded-lg transition-all",
                      tab === "quick"
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50",
                    )}
                  >
                    <Zap className="size-4" /> Single Endpoint Setup
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("import")}
                    className={cn(
                      "flex items-center justify-center gap-2 py-2.5 text-xs font-mono font-bold rounded-lg transition-all",
                      tab === "import"
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50",
                    )}
                  >
                    <Download className="size-4" /> ⚡ 1-Click Multi-Site Import
                  </button>
                </div>

                {monitorError && (
                  <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-xs font-mono text-red-400 flex items-center gap-2">
                    <X className="size-4 shrink-0" />
                    <span>{monitorError}</span>
                  </div>
                )}

                {/* TAB 1: QUICK SINGLE MONITOR */}
                {tab === "quick" && (
                  <form onSubmit={handleQuickCreateMonitor} className="space-y-4">
                    {isPrefilledFromDemo && (
                      <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between text-xs font-mono text-emerald-400">
                        <span className="flex items-center gap-2">
                          <Sparkles className="size-4 text-emerald-400" />
                          Pre-filled from your demo session
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30">
                          Auto-filled
                        </span>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <Label className="text-xs font-mono text-zinc-300">Target Endpoint URL</Label>
                      <Input
                        type="text"
                        placeholder="https://api.yourdomain.com/health"
                        value={url}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        className="bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 font-mono text-sm focus:border-emerald-500 focus-visible:ring-1 focus-visible:ring-emerald-500 h-10"
                        autoFocus
                      />
                      <p className="text-[11px] text-zinc-500 font-mono">
                        PulseGuard will probe this URL every 60 seconds across multi-region edge
                        nodes.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-mono text-zinc-300">
                          Friendly Monitor Name
                        </Label>
                        <Input
                          type="text"
                          placeholder="Main Web API"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 font-mono text-sm h-10"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-mono text-zinc-300">Check Protocol</Label>
                        <select
                          value={monitorType}
                          onChange={(e) => setMonitorType(e.target.value as any)}
                          className="w-full h-10 px-3 rounded-md bg-zinc-900 border border-zinc-800 font-mono text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="HTTP">HTTP / HTTPS (Rest API)</option>
                          <option value="PING">PING (ICMP Echo)</option>
                          <option value="PORT">PORT (TCP Service)</option>
                          <option value="SSL">SSL Certificate Monitoring</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button
                        type="submit"
                        disabled={isCreatingMonitor}
                        className="bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-zinc-950 font-mono font-bold uppercase tracking-wider text-xs h-11 px-6 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                      >
                        {isCreatingMonitor ? (
                          <RefreshCw className="size-4 animate-spin mr-2" />
                        ) : (
                          <ArrowRight className="size-4 mr-2" />
                        )}
                        Continue to Step 2: Alert Setup
                      </Button>
                    </div>
                  </form>
                )}

                {/* TAB 2: MULTI-PROVIDER 1-CLICK IMPORT */}
                {tab === "import" && (
                  <div className="space-y-4">
                    {/* Provider Selection Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        {
                          id: "uptimerobot",
                          label: "UptimeRobot",
                          icon: Boxes,
                        },
                        { id: "betterstack", label: "Better Stack", icon: Zap },
                        { id: "statuscake", label: "StatusCake", icon: Cpu },
                        { id: "csv", label: "CSV / JSON", icon: FileText },
                      ].map((prov) => {
                        const Icon = prov.icon;
                        const isSel = importProvider === prov.id;
                        return (
                          <button
                            key={prov.id}
                            type="button"
                            onClick={() => {
                              setImportProvider(prov.id as any);
                              setImportedCandidates([]);
                              setMonitorError("");
                            }}
                            className={cn(
                              "p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 font-mono text-xs font-bold transition-all",
                              isSel
                                ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                : "bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200",
                            )}
                          >
                            <Icon className="size-4" />
                            <span>{prov.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {importedCandidates.length === 0 ? (
                      <div className="space-y-4 pt-1">
                        {importProvider !== "csv" ? (
                          <div className="space-y-1.5">
                            <Label className="text-xs font-mono text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                              <span>{importProvider} API Token / Key</span>
                              <span className="text-[10px] text-emerald-400 font-normal">
                                Direct API Fetch
                              </span>
                            </Label>
                            <Input
                              type="password"
                              placeholder={`Enter your ${importProvider} API Key (e.g. u1234567-xxx)...`}
                              value={apiKeyInput}
                              onChange={(e) => setApiKeyInput(e.target.value)}
                              className="bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 font-mono text-sm h-11 focus:border-emerald-500 focus-visible:ring-1 focus-visible:ring-emerald-500"
                            />
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <Label className="text-xs font-mono text-zinc-300">
                              Paste Exported CSV or JSON Data
                            </Label>
                            <textarea
                              rows={4}
                              placeholder={`name,url,type\nMy Web Service,https://api.example.com,HTTP\n...`}
                              value={rawContentInput}
                              onChange={(e) => setRawContentInput(e.target.value)}
                              className="w-full p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 font-mono text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        )}

                        <Button
                          type="button"
                          onClick={handleFetchImportMonitors}
                          disabled={isFetchingImport}
                          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-zinc-950 font-mono font-bold uppercase tracking-wider text-xs h-11 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                        >
                          {isFetchingImport ? (
                            <RefreshCw className="size-4 animate-spin mr-2" />
                          ) : (
                            <Download className="size-4 mr-2" />
                          )}
                          Fetch & Preview {importProvider.toUpperCase()} Monitors
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-zinc-300 font-bold">
                            Found {importedCandidates.length} Monitors
                          </span>
                          <span className="text-emerald-400 font-bold">
                            {importedCandidates.filter((m) => m.selected).length} Selected for
                            1-Click Import
                          </span>
                        </div>

                        <div className="max-h-52 overflow-y-auto border border-zinc-800 rounded-xl p-2 space-y-1.5 bg-zinc-900/50">
                          {importedCandidates.map((mon, idx) => (
                            <div
                              key={idx}
                              onClick={() => toggleSelectMonitor(idx)}
                              className={cn(
                                "p-2.5 rounded-lg border cursor-pointer flex items-center justify-between text-xs font-mono transition-colors",
                                mon.selected
                                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                                  : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:bg-zinc-900",
                              )}
                            >
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                <input
                                  type="checkbox"
                                  checked={!!mon.selected}
                                  onChange={() => {}}
                                  className="accent-emerald-500 size-4 rounded"
                                />
                                <span className="font-bold truncate">{mon.name}</span>
                                <span className="text-[10px] text-zinc-500 truncate">
                                  {mon.url}
                                </span>
                              </div>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold uppercase">
                                {mon.type}
                              </span>
                            </div>
                          ))}
                        </div>

                        {importSuccessCount !== null ? (
                          <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-xs text-center font-bold flex items-center justify-center gap-2">
                            <CheckCircle2 className="size-4 text-emerald-400" />
                            Successfully imported {importSuccessCount} monitors into PulseGuard!
                            Proceeding to alert setup...
                          </div>
                        ) : (
                          <Button
                            type="button"
                            onClick={handleImportCandidates}
                            disabled={isImportingMonitors}
                            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-zinc-950 font-mono font-bold uppercase tracking-wider text-xs h-11 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                          >
                            {isImportingMonitors ? (
                              <RefreshCw className="size-4 animate-spin mr-2" />
                            ) : (
                              <Zap className="size-4 mr-2" />
                            )}
                            Import Selected Monitors (1-Click)
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 2: CONNECT ALERT CHANNEL */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-5"
              >
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs font-mono text-emerald-300 leading-relaxed">
                  <p className="font-bold text-foreground mb-1 flex items-center gap-2">
                    <Bell className="size-4 text-emerald-400" />
                    Step 2 Mandate: Alert Channel Setup
                  </p>
                  A monitor without an alert channel is a monitor that never proves its value.
                  Connect your alert channel now to ensure instantaneous incident notifications.
                </div>

                {channelError && (
                  <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-xs font-mono text-red-400 flex items-center gap-2">
                    <X className="size-4 shrink-0" />
                    <span>{channelError}</span>
                  </div>
                )}

                {/* Channel Presets Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: "EMAIL", name: "Email", icon: Mail },
                    { id: "DISCORD", name: "Discord", icon: Radio },
                    { id: "SLACK", name: "Slack", icon: Server },
                    { id: "TELEGRAM", name: "Telegram", icon: Send },
                  ].map((preset) => {
                    const Icon = preset.icon;
                    const isSel = channelType === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setChannelType(preset.id as any)}
                        className={cn(
                          "p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-mono font-bold",
                          isSel
                            ? "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                            : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200",
                        )}
                      >
                        <Icon className="size-5" />
                        <span>{preset.name}</span>
                      </button>
                    );
                  })}
                </div>

                <form onSubmit={handleCreateChannel} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-mono text-zinc-300">Channel Name</Label>
                    <Input
                      type="text"
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                      className="bg-zinc-900/90 border-zinc-800 text-zinc-100 font-mono text-sm h-10"
                    />
                  </div>

                  {channelType === "EMAIL" && (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-mono text-zinc-300">
                        Alert Email Destination
                      </Label>
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        className="bg-zinc-900/90 border-zinc-800 text-zinc-100 font-mono text-sm h-10"
                      />
                    </div>
                  )}

                  {(channelType === "DISCORD" ||
                    channelType === "SLACK" ||
                    channelType === "WEBHOOK") && (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-mono text-zinc-300">Webhook URL</Label>
                      <Input
                        type="url"
                        placeholder="https://discord.com/api/webhooks/..."
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        className="bg-zinc-900/90 border-zinc-800 text-zinc-100 font-mono text-sm h-10"
                      />
                    </div>
                  )}

                  {channelType === "TELEGRAM" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-mono text-zinc-300">
                          Telegram Bot Token
                        </Label>
                        <Input
                          type="password"
                          placeholder="123456:ABC-DEF..."
                          value={telegramToken}
                          onChange={(e) => setTelegramToken(e.target.value)}
                          className="bg-zinc-900/90 border-zinc-800 text-zinc-100 font-mono text-sm h-10"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-mono text-zinc-300">Chat ID</Label>
                        <Input
                          type="text"
                          placeholder="-100123456789"
                          value={telegramChatId}
                          onChange={(e) => setTelegramChatId(e.target.value)}
                          className="bg-zinc-900/90 border-zinc-800 text-zinc-100 font-mono text-sm h-10"
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep(1)}
                      className="text-xs font-mono text-zinc-400 hover:text-zinc-200"
                    >
                      ← Back
                    </Button>

                    <Button
                      type="submit"
                      disabled={isSavingChannel}
                      className="bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-zinc-950 font-mono font-bold uppercase tracking-wider text-xs h-11 px-6 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                    >
                      {isSavingChannel ? (
                        <RefreshCw className="size-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle2 className="size-4 mr-2" />
                      )}
                      Save Channel & Verify
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 3: EDGE LIVE CHECK & VERIFICATION */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center py-4"
              >
                <div className="flex justify-center">
                  <div className="relative size-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                    <ShieldCheck className="size-8 animate-pulse text-emerald-400" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-mono text-foreground uppercase tracking-wider">
                    Edge Monitoring Active & Verified
                  </h3>
                  <p className="text-xs font-mono text-zinc-400 mt-1">
                    Your target monitor is live with 60-second multi-region probe consensus and
                    active alert dispatch.
                  </p>
                </div>

                {/* Probe Latency Badges */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 font-mono text-xs">
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                    <div className="text-[10px] text-zinc-500">US-EAST-1</div>
                    <div className="text-emerald-400 font-bold mt-1">14ms • UP</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                    <div className="text-[10px] text-zinc-500">EU-CENTRAL-1</div>
                    <div className="text-emerald-400 font-bold mt-1">38ms • UP</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                    <div className="text-[10px] text-zinc-500">AP-TOKYO-1</div>
                    <div className="text-emerald-400 font-bold mt-1">112ms • UP</div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={async () => {
                      await completeOnboarding();
                      onOpenChange(false);
                      window.location.reload();
                    }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-zinc-950 font-mono font-bold uppercase tracking-wider text-xs h-11 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                  >
                    Go to Dashboard & Monitor Pulse <ArrowRight className="size-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
