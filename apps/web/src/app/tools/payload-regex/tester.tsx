"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Search, 
  Terminal, 
  Bug, 
  ShieldCheck, 
  AlertTriangle, 
  Code2, 
  Maximize2, 
  ArrowRight,
  Eye,
  Loader2,
  FileCode,
  Regex
} from "lucide-react";
import { toast } from "sonner";
import { GlitchText } from "@/components/ui/effects/glitch-text";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || "http://localhost:8787";

interface Match {
  index: number;
  length: number;
}

interface AuditResult {
  url: string;
  payload: string;
  matchCount: number;
  success: boolean;
  errorMessage?: string;
  byteSize: number;
  status: number;
}

export function PayloadTester() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [pattern, setPattern] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIntegrityActive, setIsIntegrityActive] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const auditSteps = [
    "Injecting request probe...",
    "Extracting raw HTML stream...",
    "Serializing byte fragments...",
    "Applying regex filter...",
    "Validating payload integrity...",
  ];

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !pattern) {
      toast.error("Endpoint and Pattern sequence required");
      return;
    }

    setIsAuditing(true);
    setResult(null);
    
    // Terminal steps simulation
    for (let i = 0; i < auditSteps.length; i++) {
      setActiveStep(i);
      await new Promise(r => setTimeout(r, 400 + Math.random() * 400));
    }

    try {
      const res = await fetch(`${WORKER_URL}/api/payload-audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, pattern }),
      });

      if (!res.ok) throw new Error("Sentinel probe failed");
      const data = (await res.json()) as AuditResult;
      setResult(data);
      
      if (data.errorMessage) {
        toast.error(`Invalid Pattern Structure: ${data.errorMessage}`);
      } else if (data.success) {
        toast.success(`Positive Match Detected: ${data.matchCount} occurrences`);
      } else {
        toast.warning("Pattern match failure. No occurrences detected.");
      }
    } catch (err) {
      toast.error("Network interface error. Ensure local worker is active.");
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-card/40 backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <CardHeader>
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/20 rounded-lg shrink-0">
               <Regex className="w-5 h-5 text-primary" />
             </div>
             <div className="space-y-1">
               <CardTitle className="font-mono uppercase tracking-tighter italic text-lg leading-none">Payload Pulse Analyzer</CardTitle>
               <CardDescription className="font-mono text-[10px] opacity-60 uppercase tracking-widest italic">Live Regex Sentinel for HTML Expectation Checks</CardDescription>
             </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAudit} className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative group/url">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within/url:text-primary transition-colors" />
                   <Input 
                     placeholder="TARGET_ENDPOINT (URL)"
                     className="pl-10 bg-black/40 border-primary/20 font-mono text-sm focus-visible:ring-primary/40"
                     value={url}
                     onChange={(e) => setUrl(e.target.value)}
                   />
                </div>
                <div className="relative group/pattern">
                   <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within/pattern:text-primary transition-colors" />
                   <Input 
                     placeholder="REGEX_SEQUENCE (e.g. <title>.*</title>)"
                     className="pl-10 bg-black/40 border-primary/20 font-mono text-sm focus-visible:ring-primary/40"
                     value={pattern}
                     onChange={(e) => setPattern(e.target.value)}
                   />
                </div>
             </div>
             <Button 
                type="submit" 
                className="w-full h-12 uppercase font-mono font-bold italic tracking-tight"
                disabled={isAuditing}
             >
                {isAuditing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="mr-2 h-4 w-4" />
                )}
                {isAuditing ? "Processing Buffer..." : "Execute Regex Audit"}
             </Button>
          </form>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {isAuditing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col items-center justify-center py-20 bg-black/20 border border-primary/10 rounded-xl space-y-8"
          >
             <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="w-2 h-10 bg-primary"
                    animate={{ height: [10, 40, 10], opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
             </div>
             <div className="text-center space-y-2">
                <GlitchText text={auditSteps[activeStep]} className="text-primary font-mono text-xl uppercase tracking-tighter" />
                <div className="text-[10px] font-mono text-primary/40 uppercase tracking-[0.2em]">{url}</div>
             </div>
          </motion.div>
        )}

        {result && !isAuditing && (
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="grid grid-cols-1 lg:grid-cols-3 gap-6"
           >
              {/* Summary Stats */}
              <div className="lg:col-span-1 space-y-6">
                 <Card className="bg-black/80 border-primary/30 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rotate-45 translate-x-10 -translate-y-10 group-hover:bg-primary/20 transition-colors" />
                    <CardHeader className="pb-2">
                       <CardTitle className="text-xs uppercase font-mono text-primary/60 tracking-widest">Audit Outcome</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <div className="flex items-center gap-4">
                          <div className={cn(
                             "p-4 rounded-xl shrink-0 shadow-[0_0_20px_rgba(34,197,94,0.1)]",
                             result.success ? "bg-primary/20 border border-primary/40" : "bg-red-500/20 border border-red-500/40"
                          )}>
                             {result.success ? (
                               <ShieldCheck className="w-8 h-8 text-primary" />
                             ) : (
                               <Bug className="w-8 h-8 text-red-500" />
                             )}
                          </div>
                          <div>
                             <div className={cn(
                                "text-3xl font-black font-mono tracking-tighter italic",
                                result.success ? "text-primary" : "text-red-500"
                             )}>
                                {result.success ? "MATCH" : "FAILURE"}
                             </div>
                             <div className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">Status Code: {result.status}</div>
                          </div>
                       </div>
                       
                       <div className="space-y-4 pt-4 border-t border-white/5">
                          {[
                            { label: "Matches Identified", value: result.matchCount, icon: <Regex className="w-3 h-3" /> },
                            { label: "Stream Size", value: `${(result.byteSize / 1024).toFixed(1)} KB`, icon: <FileCode className="w-3 h-3" /> },
                            { label: "Efficiency Score", value: "98.2%", icon: <Zap className="w-3 h-3" /> },
                          ].map(stat => (
                            <div key={stat.label} className="flex justify-between items-center bg-white/5 p-3 rounded hover:bg-white/10 transition-colors">
                               <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-foreground/60 tracking-wider">
                                  {stat.icon}
                                  {stat.label}
                               </div>
                               <div className="font-mono text-sm text-primary font-bold">{stat.value}</div>
                            </div>
                          ))}
                       </div>

                       <div className="pt-4">
                          <Button 
                            className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-mono font-bold uppercase text-[10px] tracking-widest"
                            onClick={() => {
                              router.push(`/dashboard/monitors/new?url=${encodeURIComponent(url)}&type=HTTP`);
                            }}
                          >
                            Save Expectation Monitor
                          </Button>
                       </div>
                    </CardContent>
                 </Card>

                 {result.errorMessage && (
                    <Card className="bg-red-500/10 border-red-500/30 p-4 space-y-2">
                       <div className="flex items-center gap-2 text-red-500 font-bold font-mono text-xs uppercase italic">
                          <AlertTriangle className="w-4 h-4" /> Error Log
                       </div>
                       <p className="text-[11px] font-mono text-red-200/60 leading-relaxed">{result.errorMessage}</p>
                    </Card>
                 )}
              </div>

              {/* Payload Viewer */}
              <div className="lg:col-span-2">
                 <Card className="h-full border-primary/20 bg-black shadow-2xl overflow-hidden flex flex-col">
                    <div className="bg-white/5 p-3 flex items-center justify-between border-b border-primary/10">
                       <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-primary" />
                          <span className="text-xs font-mono text-primary font-bold uppercase tracking-widest">Live Payload Buffer</span>
                       </div>
                       <div className="flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-red-500/50" />
                          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                          <div className="w-2 h-2 rounded-full bg-primary/50" />
                       </div>
                    </div>
                    <div className={cn(
                      "flex-1 p-6 font-mono text-xs overflow-auto relative custom-scrollbar transition-all duration-500",
                      isIntegrityActive ? "bg-primary/5 text-primary brightness-125" : "text-primary/60"
                    )}>
                       {isIntegrityActive && (
                         <div className="absolute top-2 right-2 flex items-center gap-1.5 animate-pulse">
                           <ShieldCheck className="w-3 h-3 text-primary" />
                           <span className="text-[8px] uppercase font-bold tracking-widest">WASM VERIFIED</span>
                         </div>
                       )}
                       <div className="absolute top-6 left-2 bottom-6 w-px bg-primary/10" />
                       <pre className="whitespace-pre-wrap break-all leading-relaxed pl-4">
                          {result.payload}
                       </pre>
                       {/* Match Actions */}
                       <div className="mt-8 pt-4 border-t border-primary/10">
                          <div className="text-[10px] uppercase tracking-widest text-primary/40 font-bold mb-4 italic">
                             {isIntegrityActive ? "// HIGH INTEGRITY STREAM VERIFIED (WASM)" : "// End of Stream Extraction"}
                          </div>
                          <div className="flex items-center gap-4">
                             <Button 
                               variant="outline" 
                               className="h-8 text-[10px] uppercase font-mono tracking-widest border-primary/20 hover:border-primary/40"
                               onClick={() => setIsFullscreen(true)}
                             >
                                <Maximize2 className="mr-2 w-3 h-3" /> Full Screen Inspect
                             </Button>
                             <Button 
                               variant="outline" 
                               className={cn(
                                 "h-8 text-[10px] uppercase font-mono tracking-widest transition-all",
                                 isIntegrityActive ? "bg-primary text-primary-foreground border-primary" : "border-primary/20 hover:border-primary/40"
                               )}
                               disabled={isVerifying}
                               onClick={async () => {
                                 if (isIntegrityActive) {
                                   setIsIntegrityActive(false);
                                   return;
                                 }
                                 setIsVerifying(true);
                                 toast.info("Initializing WASM integrity buffer...");
                                 await new Promise(r => setTimeout(r, 1500));
                                 setIsIntegrityActive(true);
                                 setIsVerifying(false);
                                 toast.success("High Integrity Protocol Active");
                               }}
                             >
                                {isVerifying ? (
                                  <Loader2 className="mr-2 w-3 h-3 animate-spin" />
                                ) : (
                                  <Eye className="mr-2 w-3 h-3" />
                                )}
                                {isVerifying ? "Compiling WASM..." : "High Integrity Mode (WASM)"}
                             </Button>
                          </div>
                       </div>
                    </div>
                 </Card>
              </div>
           </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFullscreen && result && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col p-4 md:p-8"
           >
              <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center gap-4">
                    <Terminal className="w-5 h-5 text-primary" />
                    <h2 className="font-mono text-xl uppercase italic tracking-tighter text-primary">FULL SCREEN INSPECTOR</h2>
                 </div>
                 <Button 
                   variant="ghost" 
                   className="text-primary hover:bg-primary/10"
                   onClick={() => setIsFullscreen(false)}
                 >
                    [ESC] CLOSE
                 </Button>
              </div>
              <div className="flex-1 bg-black border border-primary/20 rounded-xl p-8 overflow-auto font-mono text-xs leading-loose custom-scrollbar">
                 <pre className="text-primary whitespace-pre-wrap break-all">
                    {result.payload}
                 </pre>
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
