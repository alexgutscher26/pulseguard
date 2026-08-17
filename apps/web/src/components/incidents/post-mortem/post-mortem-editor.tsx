"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wand2,
  Save,
  FileDown,
  Loader2,
  History,
  Terminal,
  Activity,
  ShieldCheck,
  Info,
  Sparkles,
  Database,
  BrainCircuit,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import {
  upsertPostMortem,
  generatePostMortemSummary,
  generateFullPostMortemAI,
  getMonitorEventsDuringIncident,
  getSimilarIncidentsForIncident,
  syncAllIncidentsToPinecone,
  checkPineconeStatus,
} from "@/actions/post-mortem";
import { toast } from "@/components/ui/sonner";
import { motion, AnimatePresence } from "framer-motion";

interface PostMortemData {
  summary: string;
  rootCause: string;
  impactScope: string;
  detectionMethod: string;
  timeline: string;
  actionItems: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

interface PostMortemEditorProps {
  incidentId: string;
  incidentTitle: string;
  initialData?: PostMortemData | null;
}

export function PostMortemEditor({
  incidentId,
  incidentTitle,
  initialData,
}: PostMortemEditorProps) {
  const [formData, setFormData] = useState<PostMortemData>(
    initialData || {
      summary: "",
      rootCause: "",
      impactScope: "",
      detectionMethod: "",
      timeline: "",
      actionItems: "",
      status: "DRAFT",
    },
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingFull, setIsGeneratingFull] = useState(false);
  const [isPopulatingTimeline, setIsPopulatingTimeline] = useState(false);
  const [isSyncingPinecone, setIsSyncingPinecone] = useState(false);

  const [pineconeInfo, setPineconeInfo] = useState<{
    isConfigured: boolean;
    indexName: string;
    namespace?: string;
    totalRecords?: number;
    namespaceRecords?: number;
  }>({
    isConfigured: false,
    indexName: "pulseguard-incidents",
    namespace: "workspace_default",
    totalRecords: 0,
    namespaceRecords: 0,
  });

  const [similarIncidents, setSimilarIncidents] = useState<any[]>([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);

  useEffect(() => {
    async function loadPineconeContext() {
      setIsLoadingSimilar(true);
      try {
        const [status, similarRes] = await Promise.all([
          checkPineconeStatus(),
          getSimilarIncidentsForIncident(incidentId),
        ]);
        setPineconeInfo(status);
        if (similarRes && "matches" in similarRes) {
          setSimilarIncidents(similarRes.matches || []);
        }
      } catch (err) {
        console.warn("Failed to load Pinecone context:", err);
      } finally {
        setIsLoadingSimilar(false);
      }
    }

    loadPineconeContext();
  }, [incidentId]);

  const handleInputChange = (field: keyof PostMortemData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await upsertPostMortem(incidentId, formData);
      if (result.success) {
        toast.success(
          formData.status === "PUBLISHED"
            ? "Post-mortem saved and synchronized with Pinecone vector memory"
            : "Post-mortem draft saved successfully",
        );
      } else {
        toast.error(result.error || "Failed to save post-mortem");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      const result = await generatePostMortemSummary(incidentId);
      if (result.success && result.summary) {
        setFormData((prev) => ({ ...prev, summary: result.summary }));
        if (result.similarIncidents && result.similarIncidents.length > 0) {
          setSimilarIncidents(result.similarIncidents);
          toast.success(
            `Executive summary generated using ${result.similarIncidents.length} past incident vectors from Pinecone`,
          );
        } else {
          toast.success("Executive summary generated successfully");
        }
      } else {
        toast.error(result.error || "Failed to generate summary");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFullAISynthesis = async () => {
    setIsGeneratingFull(true);
    try {
      const result = await generateFullPostMortemAI(incidentId);
      if (result.success && result.data) {
        setFormData((prev) => ({
          ...prev,
          summary: result.data.summary || prev.summary,
          rootCause: result.data.rootCause || prev.rootCause,
          impactScope: result.data.impactScope || prev.impactScope,
          detectionMethod: result.data.detectionMethod || prev.detectionMethod,
          actionItems: result.data.actionItems || prev.actionItems,
        }));

        if (result.similarIncidents && result.similarIncidents.length > 0) {
          setSimilarIncidents(result.similarIncidents);
          toast.success(
            `Full Post-Mortem synthesized with ${result.similarIncidents.length} Pinecone historical outage memories!`,
          );
        } else {
          toast.success("Full SRE Post-Mortem synthesized across all sections");
        }
      } else {
        toast.error(result.error || "Failed to synthesize post-mortem");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during AI synthesis");
    } finally {
      setIsGeneratingFull(false);
    }
  };

  const handleSyncDatabaseToPinecone = async () => {
    setIsSyncingPinecone(true);
    try {
      const res = await syncAllIncidentsToPinecone({ seedSamplePlaybooks: true });
      if (res.success) {
        toast.success(
          `Indexed ${res.count} incidents & historical SRE playbooks into Pinecone vector memory!`,
        );
        // Refresh similar incidents for this view
        const similarRes = await getSimilarIncidentsForIncident(incidentId);
        if (similarRes && "matches" in similarRes) {
          setSimilarIncidents(similarRes.matches || []);
        }
      } else {
        toast.error(res.error || "Failed to sync incidents to Pinecone");
      }
    } catch (error) {
      toast.error("Failed to vectorize historical incidents");
    } finally {
      setIsSyncingPinecone(false);
    }
  };

  const handleApplyPastIncident = (match: any) => {
    const meta = match.metadata;
    if (!meta) return;

    setFormData((prev) => ({
      ...prev,
      rootCause: prev.rootCause
        ? `${prev.rootCause}\n\n[From Similar Outage: ${meta.title}]\n${meta.rootCause}`
        : meta.rootCause,
      actionItems: prev.actionItems
        ? `${prev.actionItems}\n${meta.actionItems || ""}`
        : meta.actionItems || prev.actionItems,
    }));

    toast.success(`Injected historical insights from "${meta.title}"`);
  };

  const handlePopulateTimeline = async () => {
    setIsPopulatingTimeline(true);
    try {
      const logs = await getMonitorEventsDuringIncident(incidentId);
      if (logs.length > 0) {
        const timelineEntries = logs
          .map((log: any) => {
            const time = new Date(log.timestamp).toLocaleTimeString();
            const statusStr = log.status === "DOWN" ? "❌ DOWN" : "✅ UP";
            const latencyStr = log.latency ? `${log.latency}ms` : "N/A";
            const regionStr = log.region || "Global";
            return `| ${time} | ${regionStr} | ${statusStr} | ${latencyStr} | ${log.errorReason || "-"} |`;
          })
          .join("\n");

        const header =
          "| Time | Region | Status | Latency | Detail |\n| :--- | :--- | :--- | :--- | :--- |\n";
        setFormData((prev) => ({
          ...prev,
          timeline: header + timelineEntries,
        }));
        toast.success(`Populated ${logs.length} events from system logs`);
      } else {
        toast.info("No recorded system logs found for this window");
      }
    } catch (error) {
      toast.error("Failed to fetch logs");
    } finally {
      setIsPopulatingTimeline(false);
    }
  };

  const handleExportMarkdown = () => {
    const markdown = `
# Post-Mortem: ${incidentTitle}
**Date:** ${new Date().toLocaleDateString()}
**Status:** ${formData.status}

## 1. Executive Summary
${formData.summary || "(No summary provided)"}

## 2. Root Cause Analysis
${formData.rootCause || "(No root cause provided)"}

## 3. Impact & Scope
${formData.impactScope || "(No impact details provided)"}

## 4. Timeline
${formData.timeline || "(No timeline provided)"}

## 5. Detection
${formData.detectionMethod || "(No detection method provided)"}

## 6. Action Items
${formData.actionItems || "(No action items provided)"}

---
*Generated by PulseGuard SRE Toolchain & Pinecone Vector Memory*
    `.trim();

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `post-mortem-${incidentId}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Markdown report downloaded");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/50 p-6 rounded-lg border border-primary/20 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-primary/10 rounded border border-primary/20">
              <Terminal className="size-4 text-primary" />
            </span>
            <h2 className="text-xl font-bold font-mono tracking-tight uppercase">
              SRE Post-Mortem Editor
            </h2>
          </div>
          <p className="text-sm text-muted-foreground font-mono">
            Incident: <span className="text-primary">{incidentTitle}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Incident Memory Status Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-muted/40 border border-primary/20 font-mono text-[11px]">
            <BrainCircuit className="size-3 text-primary" />
            <span>AI Memory:</span>
            {pineconeInfo.isConfigured ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active ({similarIncidents.length} matches)
              </span>
            ) : (
              <span className="text-muted-foreground">Disabled</span>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportMarkdown}
            className="font-mono text-xs uppercase"
          >
            <FileDown className="mr-2 size-4 text-primary" />
            Export MD
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="font-mono text-xs uppercase bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(var(--primary),0.3)]"
          >
            {isSaving ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Save className="mr-2 size-4" />
            )}
            Transmit Record
          </Button>
        </div>
      </div>

      {/* Pinecone Incident Memory & RAG Intelligence Panel */}
      <Card className="bg-gradient-to-r from-primary/5 via-card/50 to-primary/5 border-primary/20 backdrop-blur-md">
        <CardHeader className="pb-3 border-b border-primary/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm font-mono flex items-center gap-2">
                <BrainCircuit className="size-4 text-primary" />
                INCIDENT MEMORY &amp; HISTORICAL INSIGHTS
              </CardTitle>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                AI semantic search matches telemetry against similar past outages and verified fixes
              </p>
            </div>
            <div className="flex items-center gap-2">
              {pineconeInfo.isConfigured && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSyncDatabaseToPinecone}
                  disabled={isSyncingPinecone}
                  className="h-7 text-[10px] font-mono uppercase bg-primary/10 hover:bg-primary/20 border border-primary/20"
                >
                  {isSyncingPinecone ? (
                    <Loader2 className="mr-1.5 size-3 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-1.5 size-3 text-primary" />
                  )}
                  Index Historical Incidents
                </Button>
              )}
              <Button
                variant="default"
                size="sm"
                onClick={handleFullAISynthesis}
                disabled={isGeneratingFull}
                className="h-7 text-[10px] font-mono uppercase bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_10px_rgba(var(--primary),0.2)]"
              >
                {isGeneratingFull ? (
                  <Loader2 className="mr-1.5 size-3 animate-spin" />
                ) : (
                  <Sparkles className="mr-1.5 size-3" />
                )}
                Full AI Synthesis (All Sections)
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {isLoadingSimilar ? (
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground py-2">
              <Loader2 className="size-3 animate-spin text-primary" />
              Searching incident memory for similar historical outages...
            </div>
          ) : similarIncidents.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-mono text-muted-foreground">
                Found <span className="text-primary font-bold">{similarIncidents.length}</span>{" "}
                relevant historical incident matches:
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {similarIncidents.map((match, idx) => {
                  const meta = match.metadata;
                  const similarityPct = Math.round((match.score || 0) * 100);
                  return (
                    <div
                      key={match.incidentId || idx}
                      className="p-3.5 rounded bg-background/60 border border-primary/20 space-y-2 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="font-mono text-xs font-semibold text-foreground truncate"
                          title={meta?.title}
                        >
                          {meta?.title || "Historical Incident"}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold shrink-0">
                          {similarityPct}% Match
                        </span>
                      </div>
                      {meta?.rootCause && (
                        <p className="text-[11px] text-muted-foreground font-mono line-clamp-2">
                          <strong className="text-primary/90">Root Cause:</strong> {meta.rootCause}
                        </p>
                      )}
                      {meta?.actionItems && (
                        <p className="text-[11px] text-muted-foreground font-mono line-clamp-2">
                          <strong className="text-emerald-400/90">Fix:</strong> {meta.actionItems}
                        </p>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApplyPastIncident(match)}
                        className="w-full h-6 text-[10px] font-mono uppercase bg-primary/5 hover:bg-primary/15 border border-primary/10 mt-1"
                      >
                        Apply Historical Insight
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-muted-foreground py-1">
              <div>
                {pineconeInfo.isConfigured ? (
                  <span>
                    No previous incidents found matching this error signature in Pinecone. Save this
                    post-mortem as <strong>LEVEL_1_PUBLIC</strong> or click{" "}
                    <strong>Index DB into Pinecone</strong> to prime vector memory.
                  </span>
                ) : (
                  <span>
                    Pinecone is running in standalone mode. To enable semantic RAG incident
                    retrieval, configure <code className="text-primary">PINECONE_API_KEY</code> in
                    your environment.
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Post-Mortem Form Tabs */}
      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="bg-muted/30 border border-primary/10 p-1 w-full md:w-auto grid grid-cols-2 md:inline-flex h-auto">
          <TabsTrigger
            value="analysis"
            className="font-mono text-xs uppercase py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            <Info className="size-3 mr-2" />
            I. Analysis
          </TabsTrigger>
          <TabsTrigger
            value="timeline"
            className="font-mono text-xs uppercase py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            <History className="size-3 mr-2" />
            II. Timeline
          </TabsTrigger>
          <TabsTrigger
            value="corrective"
            className="font-mono text-xs uppercase py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            <ShieldCheck className="size-3 mr-2" />
            III. Corrective
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="font-mono text-xs uppercase py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            <Activity className="size-3 mr-2" />
            IV. Full Review
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="analysis" className="space-y-6 focus-visible:outline-none">
            <div className="grid gap-6">
              <Card className="bg-card/40 border-primary/10 backdrop-blur-sm">
                <CardHeader className="pb-3 border-b border-primary/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-mono flex items-center gap-2">
                      <Sparkles className="size-4 text-primary" />
                      EXECUTIVE SUMMARY
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[10px] font-mono uppercase bg-primary/10 hover:bg-primary/20 border border-primary/10"
                      onClick={handleGenerateSummary}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <Loader2 className="mr-2 size-3 animate-spin" />
                      ) : (
                        <Wand2 className="mr-2 size-3 text-primary" />
                      )}
                      Sync Summary with AI
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <Textarea
                    placeholder="Executive narrative describing the high-level impact and core issue..."
                    className="min-h-[150px] bg-background/50 border-primary/20 font-mono text-sm leading-relaxed focus-visible:ring-primary/30"
                    value={formData.summary}
                    onChange={(e) => handleInputChange("summary", e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground mt-2 font-mono uppercase tracking-widest italic">
                    AI generated summaries synthesize event telemetry and Pinecone incident memory.
                  </p>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-card/40 border-primary/10">
                  <CardHeader className="pb-3 border-b border-primary/5">
                    <CardTitle className="text-sm font-mono">ROOT CAUSE ANALYSIS</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <Textarea
                      placeholder="Why did this happen? Technical breakdown of the primary failure vector."
                      className="min-h-[120px] bg-background/50 border-primary/20 font-mono text-sm"
                      value={formData.rootCause}
                      onChange={(e) => handleInputChange("rootCause", e.target.value)}
                    />
                  </CardContent>
                </Card>

                <Card className="bg-card/40 border-primary/10">
                  <CardHeader className="pb-3 border-b border-primary/5">
                    <CardTitle className="text-sm font-mono">IMPACT & SCOPE</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <Textarea
                      placeholder="Quantify the blast radius: affected users, regions, and duration."
                      className="min-h-[120px] bg-background/50 border-primary/20 font-mono text-sm"
                      value={formData.impactScope}
                      onChange={(e) => handleInputChange("impactScope", e.target.value)}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6 focus-visible:outline-none">
            <Card className="bg-card/40 border-primary/10">
              <CardHeader className="pb-3 border-b border-primary/5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-mono flex items-center gap-2">
                    <Activity className="size-4 text-primary" />
                    SYSTEM PING LOGS (AUTO-TIMELINE)
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[10px] font-mono uppercase bg-primary/10 hover:bg-primary/20 border border-primary/10"
                    onClick={handlePopulateTimeline}
                    disabled={isPopulatingTimeline}
                  >
                    {isPopulatingTimeline ? (
                      <Loader2 className="mr-2 size-3 animate-spin" />
                    ) : (
                      <History className="mr-2 size-3 text-primary" />
                    )}
                    Pull Ping Logs
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <Textarea
                  placeholder="Chronological sequence of events. Use the 'Pull Ping Logs' button to auto-fill based on system health checks."
                  className="min-h-[300px] bg-background/50 border-primary/20 font-mono text-sm leading-relaxed"
                  value={formData.timeline}
                  onChange={(e) => handleInputChange("timeline", e.target.value)}
                />
                <div className="mt-4 p-4 bg-muted/20 border border-dashed border-primary/20 rounded font-mono text-xs text-muted-foreground">
                  TIP: You can manually format this as a table for better readability. The
                  auto-populate tool uses downtime window metrics (StartedAt &rarr; ResolvedAt).
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="corrective" className="space-y-6 focus-visible:outline-none">
            <div className="grid gap-6">
              <Card className="bg-card/40 border-primary/10">
                <CardHeader className="pb-3 border-b border-primary/5">
                  <CardTitle className="text-sm font-mono">
                    ACTION ITEMS & PREVENTIVE MEASURES
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <Textarea
                    placeholder="- [ ] Implement automatic failover&#10;- [ ] Increase monitoring granularity for Region X"
                    className="min-h-[200px] bg-background/50 border-primary/20 font-mono text-sm leading-8"
                    value={formData.actionItems}
                    onChange={(e) => handleInputChange("actionItems", e.target.value)}
                  />
                </CardContent>
              </Card>

              <Card className="bg-card/40 border-primary/10">
                <CardHeader className="pb-3 border-b border-primary/5">
                  <CardTitle className="text-sm font-mono">DETECTION STRATEGY</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <Textarea
                    placeholder="How was this caught? How can we detect it faster next time?"
                    className="min-h-[100px] bg-background/50 border-primary/20 font-mono text-sm"
                    value={formData.detectionMethod}
                    onChange={(e) => handleInputChange("detectionMethod", e.target.value)}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="focus-visible:outline-none">
            <div className="max-w-4xl mx-auto space-y-8 bg-background border border-primary/10 p-10 rounded shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Terminal className="size-64" />
              </div>

              <div className="border-b border-primary/30 pb-6 mb-10">
                <h1 className="text-4xl font-black font-mono tracking-tighter uppercase mb-2">
                  POS-MOR_REP://{incidentId.slice(0, 8)}
                </h1>
                <div className="flex gap-10 font-mono text-[10px] text-primary uppercase tracking-[0.2em]">
                  <div>SUBJECT: {incidentTitle}</div>
                  <div>STATUS: {formData.status}</div>
                  <div>DATED: {new Date().toISOString()}</div>
                </div>
              </div>

              <section className="space-y-4">
                <h2 className="text-lg font-bold font-mono border-l-4 border-primary pl-4 uppercase tracking-tighter">
                  01. Summary
                </h2>
                <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap pl-5">
                  {formData.summary || "Pending input..."}
                </div>
              </section>

              <div className="grid md:grid-cols-2 gap-10">
                <section className="space-y-4">
                  <h2 className="text-lg font-bold font-mono border-l-4 border-primary pl-4 uppercase tracking-tighter">
                    02. Root Cause
                  </h2>
                  <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap pl-5">
                    {formData.rootCause || "Pending analysis..."}
                  </div>
                </section>
                <section className="space-y-4">
                  <h2 className="text-lg font-bold font-mono border-l-4 border-primary pl-4 uppercase tracking-tighter">
                    03. Impact Scope
                  </h2>
                  <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap pl-5">
                    {formData.impactScope || "Pending assessment..."}
                  </div>
                </section>
              </div>

              <section className="space-y-4">
                <h2 className="text-lg font-bold font-mono border-l-4 border-primary pl-4 uppercase tracking-tighter">
                  04. Timeline Analysis
                </h2>
                <div className="bg-muted/30 p-6 rounded-sm border border-primary/10 font-mono text-xs overflow-x-auto">
                  <pre className="whitespace-pre-wrap text-muted-foreground">
                    {formData.timeline || "No timeline data recorded."}
                  </pre>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-lg font-bold font-mono border-l-4 border-primary pl-4 uppercase tracking-tighter">
                  05. Preventive Action
                </h2>
                <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap pl-5 font-mono">
                  {formData.actionItems || "No actions defined."}
                </div>
              </section>

              <div className="mt-20 pt-10 border-t border-primary/10 flex justify-between items-center opacity-30 font-mono text-[8px] uppercase tracking-widest">
                <div>&copy; PULSEGUARD QUANTUM SYSTEMS INC</div>
                <div>SECURE DATA PACKET // ENCRYPTED_SRE_AUTH</div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <CardFooter className="flex items-center justify-between border-t bg-muted/20 px-6 py-4 rounded-b-lg">
        <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          <span>Record Hash: {incidentId.slice(0, 8)}...</span>
          <span>Last Sync: {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Label
            htmlFor="status-select"
            className="text-[10px] font-mono uppercase text-muted-foreground"
          >
            Classification:
          </Label>
          <select
            id="status-select"
            className="bg-background border border-primary/20 text-[10px] font-mono px-2 py-1 rounded cursor-pointer hover:border-primary/50 transition-colors uppercase"
            value={formData.status}
            onChange={(e) => handleInputChange("status", e.target.value as any)}
          >
            <option value="DRAFT">DRAFT_CLEARANCE</option>
            <option value="PUBLISHED">LEVEL_1_PUBLIC (INDEX TO PINECONE)</option>
            <option value="ARCHIVED">LEVEL_5_ARCHIVE</option>
          </select>
        </div>
      </CardFooter>
    </motion.div>
  );
}
