"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  Activity,
  Bell,
  Globe,
  Rocket,
  RotateCcw,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OnboardingStatus } from "@/actions/onboarding";

interface OnboardingChecklistProps {
  status: OnboardingStatus;
}

export function OnboardingChecklist({ status }: OnboardingChecklistProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const dismissed = localStorage.getItem("pulseguard_onboarding_dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
    }
    const collapsed = localStorage.getItem("pulseguard_onboarding_collapsed");
    if (collapsed === "true") {
      setIsCollapsed(true);
    }
  }, []);

  if (!mounted) {
    return null;
  }

  if (isDismissed) {
    return (
      <div className="flex justify-end mb-2">
        <button
          onClick={() => {
            setIsDismissed(false);
            localStorage.removeItem("pulseguard_onboarding_dismissed");
          }}
          className="text-[10px] font-mono text-zinc-500 hover:text-emerald-400 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="size-3" />
          Show Setup Checklist
        </button>
      </div>
    );
  }

  const {
    hasCreatedMonitor,
    hasConfiguredAlert,
    hasSharedStatusPage,
    completedCount,
    totalCount,
    isComplete,
  } = status;

  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("pulseguard_onboarding_dismissed", "true");
  };

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("pulseguard_onboarding_collapsed", String(next));
      return next;
    });
  };

  const steps = [
    {
      id: "monitor",
      title: "1. Create your first monitor",
      description: "Track HTTP endpoints, Ping latency, or Port availability across global nodes.",
      href: "/dashboard/monitors",
      isDone: hasCreatedMonitor,
      icon: Activity,
      actionText: "New Monitor",
    },
    {
      id: "alert",
      title: "2. Set up an alert channel",
      description: "Connect Slack, Discord, Webhooks, or Email for instantaneous downtime alerts.",
      href: "/dashboard/alerts",
      isDone: hasConfiguredAlert,
      icon: Bell,
      actionText: "Add Alert",
    },
    {
      id: "status-page",
      title: "3. Create & share a status page",
      description: "Publish custom status pages for your users, teams, and customers.",
      href: "/dashboard/pages",
      isDone: hasSharedStatusPage,
      icon: Globe,
      actionText: "Build Page",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className={`relative overflow-hidden border transition-all duration-300 rounded-xl ${
        isComplete
          ? "border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-zinc-950/80 to-zinc-950/80 shadow-[0_0_25px_rgba(16,185,129,0.15)]"
          : "border-emerald-500/20 bg-zinc-950/80 backdrop-blur-md shadow-lg"
      }`}
    >
      {/* Top Accent Line */}
      <div
        className="h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-400 transition-all duration-500"
        style={{ width: `${progressPercentage}%` }}
      />

      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg border transition-all ${
                isComplete
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
              }`}
            >
              {isComplete ? (
                <Rocket className="size-5 text-emerald-400 animate-pulse" />
              ) : (
                <Sparkles className="size-5 text-emerald-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold font-mono text-foreground uppercase tracking-wider">
                  {isComplete ? "Setup Protocol Complete" : "Interactive Onboarding Protocol"}
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                  {completedCount}/{totalCount} Completed ({progressPercentage}%)
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                {isComplete
                  ? "All core monitoring modules initialized. Your pulse network is active."
                  : "Complete these 3 essential steps to initialize full edge monitoring coverage."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleCollapse}
              className="size-7 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
              title={isCollapsed ? "Expand Checklist" : "Collapse Checklist"}
            >
              {isCollapsed ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="size-7 text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
              title="Dismiss Checklist"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Expandable Step Items */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 pt-4 border-t border-zinc-900 flex flex-col gap-3"
            >
              {/* Step Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-1">
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.id}
                      className={`group relative p-3.5 rounded-lg border transition-all duration-200 flex flex-col justify-between ${
                        step.isDone
                          ? "bg-zinc-900/40 border-emerald-500/30 text-zinc-300"
                          : "bg-zinc-950 border-zinc-800 hover:border-emerald-500/40 hover:bg-zinc-900/60"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon
                              className={`size-4 ${
                                step.isDone
                                  ? "text-emerald-400"
                                  : "text-zinc-500 group-hover:text-zinc-300"
                              }`}
                            />
                            <span className="text-xs font-mono font-bold text-foreground">
                              {step.title}
                            </span>
                          </div>
                          {step.isDone ? (
                            <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="size-4 text-zinc-600 shrink-0 group-hover:text-emerald-400/60 transition-colors" />
                          )}
                        </div>

                        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans mb-3">
                          {step.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-zinc-900 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-zinc-500">
                          {step.isDone ? "Status: Active" : "Status: Pending"}
                        </span>
                        <Link
                          href={step.href as any}
                          className={cn(
                            buttonVariants({
                              variant: step.isDone ? "outline" : "default",
                              size: "sm",
                            }),
                            `h-7 px-2.5 text-[10px] font-mono uppercase tracking-wider ${
                              step.isDone
                                ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10"
                                : "bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold"
                            }`,
                          )}
                        >
                          {step.isDone ? "View" : step.actionText}
                          <ArrowRight className="size-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Completion CTA */}
              {isComplete && (
                <div className="mt-2 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-300">
                    <Sparkles className="size-4 text-emerald-400 animate-spin" />
                    <span>
                      Congratulations! Your monitoring cluster is operating at full capacity.
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleDismiss}
                    className="h-7 text-[10px] font-mono uppercase bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold"
                  >
                    Got It!
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
