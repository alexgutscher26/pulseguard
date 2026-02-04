"use client";

import { useState, useEffect } from "react";
import { WorldMap } from "@/components/tools/world-map";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Lock,
  Globe,
  Zap,
  ArrowRight,
  XCircle,
  CheckCircle,
} from "lucide-react";
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

// Configuration
const WORKER_URL =
  process.env.NEXT_PUBLIC_WORKER_URL || "http://localhost:8787";

interface LatencyResult {
  region: string;
  city: string;
  latency: number;
  status: "UP" | "DOWN";
  coordinates: [number, number];
}

export function LatencyChecker() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LatencyResult[] | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);

  // Check local storage for unlock token
  useEffect(() => {
    const token = localStorage.getItem("pulseguard_tools_unlocked");
    if (token) setUnlocked(true);
  }, []);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // Basic URL validation
    let target = url;
    if (!target.includes(".")) {
      toast.error("Please enter a valid domain (e.g., google.com)");
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const res = await fetch(`${WORKER_URL}/api/global-latency`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });

      if (!res.ok) throw new Error("Failed to fetch latency data");

      const data = await res.json();
      setResults(data);

      // Auto-open gate if not unlocked
      if (!unlocked) {
        setTimeout(() => setGateOpen(true), 1500);
      }
    } catch (err) {
      toast.error("Error checking latency. Ensure the worker is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    setIsEmailSubmitting(true);

    // Simulate API call to save lead
    // In real app: POST /api/marketing/lead { email, tool: 'latency-checker' }
    await new Promise((r) => setTimeout(r, 1000));

    localStorage.setItem("pulseguard_tools_unlocked", "true");
    setUnlocked(true);
    setGateOpen(false);
    setIsEmailSubmitting(false);
    toast.success("Full report unlocked!");
  };

  // Prepare map points
  const mapPoints =
    results?.map((r) => ({
      ...r,
      status: r.status === "UP" ? "UP" : ("DOWN" as "UP" | "DOWN"),
    })) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Controls */}
      <Card className="border-primary/20 bg-background/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleCheck} className="flex gap-4 items-end">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="url">Target URL</Label>
              <Input
                id="url"
                placeholder="example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="font-mono"
              />
            </div>
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Zap className="mr-2 h-4 w-4" />
              )}
              {loading ? "Pinging..." : "Check"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Map Visualization */}
      {mapPoints.length > 0 && (
        <Card className="overflow-hidden border-none bg-transparent shadow-none">
          <WorldMap points={mapPoints} />
        </Card>
      )}

      {/* Results Table */}
      {results && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Global Performance Report
            </CardTitle>
            <CardDescription>
              Latency measurements from our global edge network.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Region</TableHead>
                    <TableHead>Server Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Latency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.slice(0, unlocked ? undefined : 3).map((res) => (
                    <TableRow key={res.region}>
                      <TableCell className="font-medium">
                        {res.region.toUpperCase()}
                      </TableCell>
                      <TableCell>{res.city}</TableCell>
                      <TableCell>
                        {res.status === "UP" ? (
                          <Badge
                            variant="outline"
                            className="text-green-500 border-green-500/30 bg-green-500/10 gap-1"
                          >
                            <CheckCircle className="h-3 w-3" /> UP
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <XCircle className="h-3 w-3" /> DOWN
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        <span
                          className={
                            res.latency < 200
                              ? "text-green-500"
                              : res.latency < 500
                                ? "text-yellow-500"
                                : "text-red-500"
                          }
                        >
                          {res.latency}ms
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Blurry Rows (Locked State) */}
                  {!unlocked &&
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow
                        key={`blur-${i}`}
                        className="opacity-30 blur-sm select-none pointer-events-none"
                      >
                        <TableCell>LOCKED</TableCell>
                        <TableCell>LOCKED</TableCell>
                        <TableCell>
                          <Badge variant="outline">???</Badge>
                        </TableCell>
                        <TableCell className="text-right">???ms</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              {/* Unlock Overlay */}
              {!unlocked && (
                <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-background via-background/90 to-transparent flex flex-col items-center justify-end pb-8 gap-4">
                  <div className="flex flex-col items-center gap-2 text-center p-4">
                    <Lock className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-bold text-lg">
                      Unlock Full Global Report
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-xs">
                      Get detailed latency data from all 10 regions instantly.
                      No credit card required.
                    </p>
                    <Button onClick={() => setGateOpen(true)} className="mt-2">
                      Unlock Results <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unlock Dialog */}
      <Dialog open={gateOpen} onOpenChange={setGateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Evaluate Global Performance</DialogTitle>
            <DialogDescription>
              Enter your email to view the detailed latency breakdown for all
              regions.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <Input
                id="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              onClick={handleUnlock}
              disabled={isEmailSubmitting}
              className="w-full"
            >
              {isEmailSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Access Full Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
