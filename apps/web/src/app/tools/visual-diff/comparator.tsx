"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Loader2,
  Maximize2,
  Search,
  Layers,
  History,
  ArrowRight,
  ShieldCheck,
  Eye,
  Camera,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { GlitchText } from "@/components/ui/effects/glitch-text";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Mock data for demo URLs
const MOCK_ASSETS = {
  "google.com": {
    before:
      "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?q=80&w=1200&auto=format&fit=crop",
    after:
      "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1200&auto=format&fit=crop",
  },
  "pulseguard.ai": {
    before:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    after:
      "https://images.unsplash.com/photo-1558494949-ef010ca66221?q=80&w=1200&auto=format&fit=crop",
  },
};

export function VisualDiffComparator() {
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const [viewMode, setViewMode] = useState<"slider" | "heatmap" | "side">("slider");

  // Ref for the slider container
  const containerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const startAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url1) {
      toast.error("Point A URL is required");
      return;
    }

    setIsScanning(true);
    setProgress(0);
    setShowResult(false);

    // Simulate scanning progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            setShowResult(true);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(100, Math.max(0, position)));
  };

  // Mock URLs (Demo)
  const imgA = url1.includes("google")
    ? MOCK_ASSETS["google.com"].before
    : MOCK_ASSETS["pulseguard.ai"].before;
  const imgB =
    url2 || url1.includes("google")
      ? MOCK_ASSETS["google.com"].after
      : MOCK_ASSETS["pulseguard.ai"].after;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <AnimatePresence mode="wait">
        {!showResult && !isScanning && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-primary/20 bg-card/50 backdrop-blur-md border-[1px]">
              <CardHeader className="border-b border-border/10 pb-4">
                <CardTitle className="text-xl flex items-center gap-2 font-mono uppercase italic tracking-wider">
                  <Zap className="h-5 w-5 text-primary animate-pulse" />
                  Mutation Parameters
                </CardTitle>
                <CardDescription className="font-mono text-[10px] uppercase opacity-50">
                  Select targets for visual consistency audit
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={startAnalysis} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label className="text-[10px] uppercase font-bold tracking-[2px] text-primary/70">
                        Point A (Reference)
                      </Label>
                      <div className="relative group/input">
                        <Input
                          placeholder="https://example.com"
                          value={url1}
                          onChange={(e) => setUrl1(e.target.value)}
                          className="bg-background border-primary/20 focus:border-primary transition-all duration-300 rounded-none h-12 pl-10"
                        />
                        <History className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[10px] uppercase font-bold tracking-[2px] text-primary/70">
                        Point B (Target Mutation)
                      </Label>
                      <div className="relative group/input">
                        <Input
                          placeholder="Leave empty for history compare"
                          value={url2}
                          onChange={(e) => setUrl2(e.target.value)}
                          className="bg-background border-primary/20 focus:border-primary transition-all duration-300 rounded-none h-12 pl-10"
                        />
                        <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-center">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full md:w-auto px-12 group/btn relative overflow-hidden"
                    >
                      <span className="relative z-10 uppercase italic tracking-widest flex items-center gap-2">
                        Execute Visual Probe
                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-linear-to-r from-primary to-emerald-600 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {isScanning && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[400px] border border-primary/20 bg-card/30 backdrop-blur-sm relative overflow-hidden p-12 text-center space-y-8"
          >
            {/* Background Animation */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(57,255,20,0.1)_50%,transparent)] animate-scan h-full w-full" />
            </div>

            <div className="relative">
              <div className="h-24 w-24 border-2 border-primary border-t-transparent animate-spin p-2">
                <div className="h-full w-full border-2 border-primary/50 animate-pulse bg-primary/10 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>

            <div className="space-y-4 max-w-md">
              <GlitchText
                text="CAPTURING GRID DATA"
                className="text-2xl font-black uppercase italic tracking-tighter"
              />
              <div className="w-full bg-background/50 h-1 border border-primary/20 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-primary"
                />
              </div>
              <p className="font-mono text-xs text-primary/60 uppercase tracking-[2px]">
                Detecting visual anomalies... {progress}%
              </p>
            </div>
          </motion.div>
        )}

        {showResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <Badge
                  variant="outline"
                  className="text-primary border-primary bg-primary/10 rounded-none px-3 py-1 font-mono uppercase italic"
                >
                  Mutation Detected
                </Badge>
                <div className="text-xs font-mono text-muted-foreground uppercase">
                  Confidence Score: <span className="text-primary italic">99.2%</span>
                </div>
              </div>

              <div className="flex bg-card/80 backdrop-blur-sm border border-border/50 p-1">
                <Button
                  variant={viewMode === "slider" ? "default" : "ghost"}
                  size="xs"
                  onClick={() => setViewMode("slider")}
                >
                  <Maximize2 className="h-3 w-3 mr-1" /> Slider
                </Button>
                <Button
                  variant={viewMode === "heatmap" ? "default" : "ghost"}
                  size="xs"
                  onClick={() => setViewMode("heatmap")}
                >
                  <Layers className="h-3 w-3 mr-1" /> Heatmap
                </Button>
                <Button
                  variant={viewMode === "side" ? "default" : "ghost"}
                  size="xs"
                  onClick={() => setViewMode("side")}
                >
                  <Eye className="h-3 w-3 mr-1" /> Side-Side
                </Button>
              </div>
            </div>

            <Card className="rounded-none border-primary/30 overflow-hidden relative">
              <CardContent className="p-0 select-none">
                {viewMode === "slider" && (
                  <div
                    ref={containerRef}
                    className="relative aspect-video w-full overflow-hidden cursor-ew-resize group"
                    onMouseMove={handleMouseMove}
                    onTouchMove={handleMouseMove}
                  >
                    {/* After Image */}
                    <img
                      src={imgB}
                      alt="Point B"
                      className="absolute inset-0 h-full w-full object-cover"
                    />

                    {/* Before Image (Clipped) */}
                    <div
                      className="absolute inset-0 h-full w-full overflow-hidden border-r-2 border-primary z-10"
                      style={{ width: `${sliderPos}%` }}
                    >
                      <img
                        src={imgA}
                        alt="Point A"
                        className="absolute inset-0 h-full w-full object-cover"
                        style={{ width: `${100 / (sliderPos / 100)}%` }} // Keeps aspect
                      />
                      <div className="absolute top-4 left-4 z-20">
                        <Badge className="bg-primary/80 backdrop-blur-sm italic uppercase tracking-tighter">
                          Reference
                        </Badge>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 z-20">
                      <Badge className="bg-emerald-600/90 dark:bg-emerald-500/90 text-white backdrop-blur-sm italic uppercase tracking-tighter">
                        Mutation
                      </Badge>
                    </div>

                    {/* Draggable Bar */}
                    <div
                      className="absolute top-0 bottom-0 z-30 pointer-events-none hidden group-hover:block"
                      style={{ left: `calc(${sliderPos}% - 1px)` }}
                    >
                      <div className="h-full w-0.5 bg-primary shadow-[0_0_15px_rgba(57,255,20,0.8)]" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 border-2 border-primary bg-background flex items-center justify-center rounded-none shadow-lg">
                        <Zap className="h-5 w-5 text-primary fill-current" />
                      </div>
                    </div>
                  </div>
                )}

                {viewMode === "heatmap" && (
                  <div className="relative aspect-video w-full bg-black group overflow-hidden">
                    <img
                      src={imgA}
                      alt="Reference snapshot preview"
                      className="absolute inset-0 h-full w-full object-cover opacity-30 grayscale"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Simulated Heatmap Mask */}
                      <div className="absolute inset-0 mix-blend-screen overflow-hidden">
                        <img
                          src={imgB}
                          alt="Mutation target preview"
                          className="h-full w-full object-cover opacity-50 sepia-[1] hue-rotate-[320deg] animate-pulse"
                        />
                      </div>
                    </div>
                    <div className="absolute inset-4 pointer-events-none">
                      <div className="h-full w-full border border-destructive/30 border-dashed animate-pulse" />
                    </div>
                    <div className="absolute top-4 left-4 z-20">
                      <Badge
                        variant="destructive"
                        className="italic uppercase tracking-tighter animate-bounce flex gap-1"
                      >
                        <Zap className="h-3 w-3 fill-current" /> Anomaly Map Active
                      </Badge>
                    </div>
                  </div>
                )}

                {viewMode === "side" && (
                  <div className="grid grid-cols-2 gap-px bg-primary/20 aspect-video">
                    <div className="relative overflow-hidden group">
                      <img
                        src={imgA}
                        alt="Reference snapshot comparison side-by-side"
                        className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        title="Reference"
                      />
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-background/80 backdrop-blur-xs border border-primary/20 text-primary italic uppercase text-[8px]">
                          09:00 AM - REF_SNAPSHOT
                        </Badge>
                      </div>
                    </div>
                    <div className="relative overflow-hidden group">
                      <img
                        src={imgB}
                        alt="Mutation target comparison side-by-side"
                        className="h-full w-full object-cover border-l border-primary/30"
                        title="Mutation"
                      />
                      <div className="absolute bottom-4 left-4">
                        <Badge
                          variant="destructive"
                          className="bg-destructive/80 backdrop-blur-xs italic uppercase text-[8px]"
                        >
                          10:45 AM - DETECTED_DIFF
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 uppercase font-mono italic tracking-tight"
                onClick={() => setShowResult(false)}
              >
                <ArrowRight className="mr-2 h-4 w-4 rotate-180" /> Reset Probe
              </Button>
              <Button
                className="flex-1 uppercase font-mono italic tracking-tight"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = imgB;
                  link.download = `pulseguard-evidence-${new Date().getTime()}.jpg`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  toast.success("Evidence downloaded successfully");
                }}
              >
                <Download className="mr-2 h-4 w-4" /> Download Evidence
              </Button>
              <Button
                variant="secondary"
                className="px-8 uppercase font-mono italic tracking-tight"
                onClick={() => {
                  router.push(`/dashboard/monitors/new?url=${encodeURIComponent(url1)}&type=HTTP`);
                }}
              >
                <ShieldCheck className="mr-2 h-4 w-4" /> Save to Monitor
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-border/20">
        <div className="space-y-2">
          <CardTitle className="text-sm font-mono flex items-center gap-2 text-primary">
            <Layers className="h-4 w-4" /> Pixel-Perfect
          </CardTitle>
          <p className="text-xs text-muted-foreground font-mono">
            Our proprietary detection engine identifies anomalies down to the individual pixel
            coordinate.
          </p>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-sm font-mono flex items-center gap-2 text-primary">
            <Zap className="h-4 w-4" /> Zero False Alarms
          </CardTitle>
          <p className="text-xs text-muted-foreground font-mono">
            Intelligent noise filtering ignores dynamic content like ads or varying timestamps.
          </p>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-sm font-mono flex items-center gap-2 text-primary">
            <Maximize2 className="h-4 w-4" /> Full Page Scope
          </CardTitle>
          <p className="text-xs text-muted-foreground font-mono">
            Captures full-height scrolls ensuring footer shifts and layout breaks are always caught.
          </p>
        </div>
      </div>
    </div>
  );
}
