"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Network,
  Settings,
  Terminal,
  Globe,
  Layers,
  Hash,
  ShieldCheck,
  Info,
  ChevronRight,
  Monitor,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { calculateSubnet } from "@/lib/network-utils";
import { cn } from "@/lib/utils";

export function SubnetCalculator() {
  const [ip, setIp] = useState("192.168.1.1");
  const [cidr, setCidr] = useState(24);

  const result = useMemo(() => {
    try {
      if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) return null;
      return calculateSubnet(ip, cidr);
    } catch (e) {
      return null;
    }
  }, [ip, cidr]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-primary/20 bg-card/40 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-mono uppercase tracking-tighter italic text-lg leading-none">
                    Net Configuration
                  </CardTitle>
                  <CardDescription className="font-mono text-[10px] opacity-60 uppercase tracking-widest mt-1">
                    Configure your endpoint address
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-primary/60 uppercase tracking-widest pl-1">
                  IP ADDRESS
                </label>
                <Input
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  className="h-12 bg-black/60 border-primary/20 font-mono text-xl tracking-widest text-primary focus-visible:ring-primary/40 truncate"
                  placeholder="192.168.1.1"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-mono text-primary/60 uppercase tracking-widest pl-1 italic">
                  SUBNET MASK (CIDR)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[32, 30, 24, 16, 8].map((c) => (
                    <Button
                      key={c}
                      variant="outline"
                      className={cn(
                        "h-10 text-[10px] uppercase font-mono tracking-widest border-primary/10",
                        cidr === c
                          ? "bg-primary/20 border-primary/40 text-primary"
                          : "hover:border-primary/30",
                      )}
                      onClick={() => setCidr(c)}
                    >
                      /{c}
                    </Button>
                  ))}
                </div>
                <input
                  type="range"
                  min="0"
                  max="32"
                  value={cidr}
                  onChange={(e) => setCidr(Number(e.target.value))}
                  className="w-full h-1 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-primary mt-4"
                />
              </div>

              <div className="mt-8 p-4 bg-primary/5 border-l-2 border-primary rounded-sm space-y-1">
                <div className="text-[9px] font-mono text-primary uppercase font-bold tracking-[0.2em]">
                  Network Type
                </div>
                <p className="font-mono text-xs text-foreground/80 italic">
                  {cidr === 32
                    ? "Single Host Node"
                    : cidr >= 24
                      ? "Class C (Small Network)"
                      : cidr >= 16
                        ? "Class B (Medium-Large)"
                        : "Class A (Enterprise Hub)"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results / Binary Panel */}
        <div className="lg:col-span-8 space-y-6">
          {result ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <Card className="bg-black/60 border-primary/20 p-6 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Network className="w-4 h-4" />
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest">
                    Network Geometry
                  </span>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "IP ADDRESS", val: result.ip + "/" + result.cidr },
                    { label: "NETWORK ADDR", val: result.network },
                    { label: "BROADCAST ADDR", val: result.broadcast },
                    { label: "HOST RANGE", val: `${result.firstHost} — ${result.lastHost}` },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-center border-b border-white/5 pb-2"
                    >
                      <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
                        {item.label}
                      </div>
                      <div className="text-sm font-mono text-primary italic font-bold tracking-tight">
                        {item.val}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-black/60 border-primary/20 p-6 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Layers className="w-4 h-4" />
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest">
                    Asset Statistics
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center py-4 space-y-2">
                  <div className="text-5xl font-mono font-black italic text-primary tracking-tighter">
                    {result.numHosts.toLocaleString()}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">
                    Allocatable Host nodes
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono p-3 bg-white/5 rounded-lg border border-white/5">
                  <div className="text-foreground/40 uppercase">Wildcard Mask</div>
                  <div className="text-primary italic font-bold">{result.wildcard}</div>
                </div>
              </Card>

              {/* Binary matrix */}
              <Card className="md:col-span-2 bg-black border border-primary/20 overflow-hidden relative group">
                {/* Scanning Line Animation */}
                <motion.div
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute h-px w-full left-0 bg-primary/20 shadow-[0_0_10px_rgba(34,197,94,0.5)] z-20"
                />
                <div className="bg-white/5 p-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-primary" />
                    <span className="text-[10px] uppercase font-mono font-bold tracking-[0.2em] text-primary">
                      Binary Decomposition matrix
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[8px] font-mono border-primary/20 uppercase tracking-widest"
                  >
                    Bitset Extraction
                  </Badge>
                </div>
                <div className="p-8 space-y-6 font-mono relative">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-[8px] text-white/30 uppercase tracking-[0.3em] font-bold">
                        Network bitset
                      </div>
                      <div className="text-primary tracking-[0.4em] font-black text-xs md:text-lg break-all">
                        {result.binary.mask}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-[8px] text-white/30 uppercase tracking-[0.3em] font-bold">
                        Address bitset
                      </div>
                      <div className="text-primary/60 tracking-[0.4em] font-black text-xs md:text-lg break-all">
                        {result.binary.ip}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-primary/5 rounded border border-primary/10 mt-6">
                    <div className="flex items-start gap-3">
                      <Info className="w-4 h-4 text-primary mt-1 shrink-0" />
                      <p className="text-[10px] text-foreground/60 leading-relaxed uppercase tracking-tighter italic">
                        The leading bits represent your network prefix. Host addresses are allocated
                        within the zero-bit space.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center border border-primary/10 border-dashed rounded-xl py-40">
              <div className="text-center space-y-4">
                <Monitor className="w-12 h-12 text-primary/20 mx-auto animate-pulse" />
                <p className="font-mono text-[10px] uppercase tracking-widest text-primary/40 italic">
                  Waiting for valid IP node resolution...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
