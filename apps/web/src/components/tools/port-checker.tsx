"use client"; // active audit modification

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, Loader2, Lock, CheckCircle2, XCircle, AlertTriangle, Play } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || "http://localhost:8787";

interface PortResult {
  host: string;
  port: number;
  isOpen: boolean;
  status: "OPEN" | "CLOSED" | "TIMEOUT" | "BLOCKED";
  latency?: number;
}

const PRESETS = [
  { name: "Minecraft", port: 25565 },
  { name: "HTTP", port: 80 },
  { name: "HTTPS", port: 443 },
  { name: "SSH", port: 22 },
  { name: "Plex", port: 32400 },
  { name: "FTP", port: 21 },
];

export function PortChecker() {
  const [host, setHost] = useState("");
  const [port, setPort] = useState("25565");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PortResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const [unlocked, setUnlocked] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);

  // Load unlock state
  useEffect(() => {
    const token = localStorage.getItem("pulseguard_tools_unlocked");
    if (token) setUnlocked(true);
    addLog("System initialized. Ready for scan.");
  }, []);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev.slice(-4), `> ${msg}`]);
  };

  const handleCheck = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!host || !port) {
      toast.error("Please enter specific host and port");
      return;
    }

    setLoading(true);
    setResult(null);
    addLog(`Initiating connection to ${host}:${port}...`);

    try {
      const res = await fetch(`${WORKER_URL}/api/port-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host, port }),
      });

      if (!res.ok) throw new Error("Connection failed");

      const data: PortResult = await res.json();
      setResult(data);

      if (data.isOpen) {
        addLog(`SUCCESS: Port ${port} is OPEN (${data.latency}ms)`);
        toast.success(`Port ${port} is OPEN!`);
      } else {
        addLog(`FAILURE: Port ${port} is ${data.status}`);
        toast.error(`Port ${port} is closed.`);
      }
    } catch (err: any) {
      addLog(`ERROR: ${err.message}`);
      toast.error("Scan failed");
    } finally {
      setLoading(false);
    }
  };

  const runBatchScan = async () => {
    if (!unlocked) {
      setGateOpen(true);
      return;
    }

    if (!host) {
      toast.error("Please enter a target host first");
      return;
    }

    setLoading(true);
    addLog("=== INITIATING BATCH DIAGNOSTIC ===");
    addLog(`TARGET: ${host}`);

    const BATCH_PORTS = [80, 443, 22, 21, 25, 53, 3306, 5432, 8080, 25565, 32400];

    let openCount = 0;

    for (const p of BATCH_PORTS) {
      try {
        addLog(`[Scanning] Port ${p}...`);
        await new Promise((r) => setTimeout(r, 200));

        const res = await fetch(`${WORKER_URL}/api/port-check`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ host, port: p }),
        });

        const data = (await res.json()) as PortResult;
        if (data.isOpen) {
          addLog(`[!] OPEN: Port ${p} is accessible.`);
          openCount++;
        } else {
          addLog(`[-] CLOSED: Port ${p} (${data.status})`);
        }
      } catch (e) {
        addLog(`[ERROR] Failed to scan ${p}`);
      }
    }

    addLog("=== DIAGNOSTIC COMPLETE ===");
    addLog(`SUMMARY: ${openCount} open ports found.`);
    setLoading(false);
  };

  const handleUnlock = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Invalid email");
      return;
    }
    setIsEmailSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    localStorage.setItem("pulseguard_tools_unlocked", "true");
    setUnlocked(true);
    setGateOpen(false);
    setIsEmailSubmitting(false);
    toast.success("Batch Scanner Unlocked!");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Main Scanner */}
        <Card className="border-primary/20 bg-background/50 backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 font-mono">
              <Terminal className="h-5 w-5 text-primary" />
              TCP_CONNECTION_PROBE
            </CardTitle>
            <CardDescription>Test outbound connectivity to your services.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleCheck} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
                <div className="space-y-2">
                  <Label htmlFor="host" className="font-mono text-xs uppercase">
                    Target Host (IP/Domain)
                  </Label>
                  <Input
                    id="host"
                    placeholder="e.g. 203.0.113.1 or my.server.com"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    className="font-mono bg-background/50 border-primary/20 focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port" className="font-mono text-xs uppercase">
                    Port
                  </Label>
                  <Input
                    id="port"
                    placeholder="80"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    className="font-mono bg-background/50 border-primary/20 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {PRESETS.map((preset) => (
                  <Badge
                    key={preset.name}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors font-mono"
                    onClick={() => setPort(preset.port.toString())}
                  >
                    {preset.name}::{preset.port}
                  </Badge>
                ))}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full font-mono font-bold tracking-wider"
                size="lg"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Play className="mr-2 h-4 w-4 fill-current" />
                )}
                EXECUTE_SCAN
              </Button>
            </form>

            {/* Result Display */}
            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={cn(
                    "rounded-md p-4 border-l-4 font-mono text-sm",
                    result.isOpen
                      ? "bg-green-500/10 border-green-500"
                      : "bg-red-500/10 border-red-500",
                  )}
                >
                  <div className="flex items-center gap-3">
                    {result.isOpen ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500" />
                    )}
                    <div>
                      <div className="font-bold">
                        PORT {result.port} {result.status}
                      </div>
                      <div className="text-muted-foreground text-xs mt-1">
                        {result.isOpen
                          ? `Connection established in ${result.latency}ms.`
                          : result.status === "TIMEOUT"
                            ? "Connection timed out (Firewall?)"
                            : "Connection refused or unavailable."}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Batch Scanner (Gated) */}
        <Card className="border-border/50 bg-muted/20 relative overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle className="font-mono flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              BATCH_OPERATION
            </CardTitle>
            <CardDescription>Scan common vulnerability points simultaneously.</CardDescription>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col relative">
            <div
              className={cn(
                "flex-1 bg-zinc-950/90 rounded-md p-4 font-mono text-xs text-primary/80 mb-4 overflow-hidden min-h-[150px]",
                "shadow-inner border border-primary/20",
              )}
            >
              {logs.map((log, i) => (
                <div key={i} className="mb-1 animate-in slide-in-from-left-2 fade-in duration-300">
                  {log}
                </div>
              ))}
              <div className="animate-pulse">_</div>
            </div>

            <Button
              variant={unlocked ? "secondary" : "outline"}
              className="w-full font-mono"
              onClick={runBatchScan}
            >
              {unlocked ? "RUN BATCH DIAGNOSTIC" : "UNLOCK_BATCH_MODE"}
              {!unlocked && <Lock className="ml-2 h-4 w-4" />}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Unlock Dialog */}
      <Dialog open={gateOpen} onOpenChange={setGateOpen}>
        <DialogContent className="sm:max-w-md bg-background/95 border-primary/20 text-foreground font-mono backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-primary font-mono tracking-wider">
              AUTHENTICATION_REQUIRED
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Please identify yourself to access advanced scanning tools.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="uppercase text-xs text-muted-foreground">
                Operator Email
              </Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@system.com"
                className="font-mono bg-background/50 border-primary/20 focus-visible:ring-primary"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={handleUnlock}
              disabled={isEmailSubmitting}
              className="w-full font-mono font-bold tracking-wider"
            >
              {isEmailSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              AUTHORIZE_ACCESS
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
