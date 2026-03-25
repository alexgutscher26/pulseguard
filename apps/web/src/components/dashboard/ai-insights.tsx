"use client";

import { useTransition, useState } from "react";
import { 
  Sparkles, 
  Brain, 
  Activity, 
  X, 
  AlertTriangle, 
  Info,
  ChevronRight,
  TrendingUp,
  Cpu,
  BarChart3,
  Clock,
  Globe
} from "lucide-react";
import { dismissInsight } from "@/actions/monitors";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export interface MonitorInsight {
  id: string;
  monitorId: string;
  type: "ANOMALY" | "ADVICE" | "PREDICTION";
  severity: "INFO" | "WARNING" | "CRITICAL";
  message: string;
  metadata?: any;
  createdAt: Date;
  monitor: {
    name: string;
  };
}

interface AIInsightsProps {
  insights: MonitorInsight[];
}

export function AIInsights({ insights }: AIInsightsProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedInsight, setSelectedInsight] = useState<MonitorInsight | null>(null);

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(async () => {
      const result = await dismissInsight(id);
      if (result.success) {
        toast.success("Insight dismissed");
      } else {
        toast.error("Failed to dismiss insight");
      }
    });
  };

  if (insights.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Brain className="size-4 text-primary animate-pulse" />
          </div>
          <h2 className="text-lg font-bold text-foreground tracking-tight">AI Insights</h2>
        </div>
        <span className="text-[10px] font-mono text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
          INVISIBLE LAYER ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            onClick={() => setSelectedInsight(insight)}
            className={cn(
              "group relative bg-[#0a0a0a] border border-white/5 p-5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/20 cursor-pointer",
              insight.severity === "CRITICAL" && "border-red-500/20 bg-red-500/5",
              insight.severity === "WARNING" && "border-amber-500/20 bg-amber-500/5"
            )}
          >
            {/* Background scanner effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            
            <button
              onClick={(e) => handleDismiss(insight.id, e)}
              disabled={isPending}
              className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-all z-20"
            >
              <X className="size-3.5" />
            </button>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                  "p-2 rounded-xl",
                  insight.type === "ANOMALY" && "bg-amber-500/10 text-amber-500",
                  insight.type === "ADVICE" && "bg-primary/10 text-primary",
                  insight.type === "PREDICTION" && "bg-purple-500/10 text-purple-500"
                )}>
                  {insight.type === "ANOMALY" && <Activity className="size-4" />}
                  {insight.type === "ADVICE" && <Sparkles className="size-4" />}
                  {insight.type === "PREDICTION" && <TrendingUp className="size-4" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    {insight.type} • {insight.monitor.name}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground/40">
                    {new Date(insight.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <p className="text-sm font-medium text-foreground/90 leading-relaxed mb-4">
                {insight.message}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {insight.severity === "CRITICAL" && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-red-500">
                      <AlertTriangle className="size-3" /> CRITICAL
                    </div>
                  )}
                  {insight.severity === "WARNING" && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                      <AlertTriangle className="size-3" /> WARNING
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-[10px] font-bold text-primary group/btn pointer-events-none">
                  VIEW FULL ANALYSIS <ChevronRight className="size-3 group-hover/btn:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedInsight} onOpenChange={() => setSelectedInsight(null)}>
        <DialogContent className="max-w-2xl bg-[#050505] border-white/5 text-foreground rounded-3xl overflow-hidden">
          {selectedInsight && (
            <div className="relative">
              {/* Terminal scanline effect */}
              <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
              
              <DialogHeader className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="size-4 text-primary" />
                  <span className="text-[10px] font-mono text-primary tracking-tighter uppercase">
                    Quantum Intelligence • Insight Analysis
                  </span>
                </div>
                <DialogTitle className="text-2xl font-bold tracking-tight">
                  {selectedInsight.type === "ANOMALY" ? "Anomaly Detection" : "Diagnostic Advice"} Report
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Monitor: <span className="text-foreground font-medium">{selectedInsight.monitor.name}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                    <BarChart3 className="size-4" />
                    <span className="text-[10px] font-bold uppercase">Technical Metrics</span>
                  </div>
                  <div className="space-y-3">
                    {selectedInsight.metadata?.score && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground/60">Z-Score Significance:</span>
                        <span className="font-mono text-amber-500 font-bold">{selectedInsight.metadata.score.toFixed(2)}</span>
                      </div>
                    )}
                    {selectedInsight.metadata?.latency && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground/60">Observed Latency:</span>
                        <span className="font-mono text-primary">{selectedInsight.metadata.latency}ms</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground/60">Detection Timestamp:</span>
                      <span className="font-mono text-xs text-foreground/70">
                        {new Date(selectedInsight.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                    <Cpu className="size-4" />
                    <span className="text-[10px] font-bold uppercase">Heuristic Analysis</span>
                  </div>
                  <div className="text-sm text-foreground/80 leading-relaxed font-mono">
                    <div className="text-xs mb-2">RUNNING ANALYSIS...</div>
                    <div className="text-primary/70">
                      {selectedInsight.type === "ANOMALY" 
                        ? "> Significant deviation from historical baseline detected. Source appears to be server-side processing delay."
                        : "> Performance trends indicate upcoming degradation. Correlation with high traffic baseline is 82%."
                      }
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 mb-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles className="size-12 text-primary" />
                </div>
                <div className="relative z-10">
                  <div className="text-xs font-bold text-primary mb-2 flex items-center gap-2 underline underline-offset-4 decoration-primary/30">
                    <Info className="size-3" /> ACTIONABLE GUIDANCE
                  </div>
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    Based on your monitor's history, {selectedInsight.type === "ANOMALY" 
                      ? "this incident is likely related to cold-starts or external API timeouts. We recommend reviewing your server logs for 5xx errors during this timestamp."
                      : "this slow-down is consistent with peak-usage patterns. Consider adding more regional check nodes or upgrading your proxy mesh tier."}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setSelectedInsight(null)}
                  className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-sm font-bold rounded-xl transition-all"
                >
                  CLOSE REPORT
                </button>
                <button
                  onClick={(e) => { handleDismiss(selectedInsight.id, e); setSelectedInsight(null); }}
                  className="px-6 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold rounded-xl transition-all"
                >
                  MARK AS RESOLVED
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
