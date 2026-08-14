"use client";

import { useState } from "react";
import { Download, Database, Layers, Radio, FileCode, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function MigrationForm() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleExport = async (format: string, filename: string) => {
    setDownloading(format);
    try {
      const response = await fetch(`/api/workspace/export?format=${format}`);
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to export workspace data. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  const exportOptions = [
    {
      id: "json",
      title: "PulseGuard Backup (JSON)",
      description:
        "Complete dataset containing all monitors, alert rules, status pages, and incident templates.",
      icon: Database,
      buttonText: "Export Backup",
      filename: "pulseguard-workspace-export.json",
      badge: "Full Dump",
    },
    {
      id: "openstatus",
      title: "OpenStatus Config Schema",
      description:
        "Exports all active monitors with default status checks formatted for OpenStatus schema templates.",
      icon: Layers,
      buttonText: "Export for OpenStatus",
      filename: "openstatus-import-config.json",
      badge: "Compatible",
    },
    {
      id: "uptime-kuma",
      title: "Uptime Kuma Backup JSON",
      description:
        "JSON file formatted for direct import into Uptime Kuma to migrate checks instantly.",
      icon: Radio,
      buttonText: "Export for Uptime Kuma",
      filename: "uptime-kuma-import.json",
      badge: "Standard",
    },
    {
      id: "prometheus",
      title: "Prometheus Blackbox Config (YAML)",
      description:
        "Generates blackbox.yml and prometheus.yml scrape blocks mapping all HTTP/TCP endpoints.",
      icon: FileCode,
      buttonText: "Export scrape config",
      filename: "prometheus-blackbox.yml",
      badge: "YAML Stack",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold font-mono text-foreground uppercase tracking-wider">
          Migration & Export
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          PulseGuard runs on a zero-vendor-lock-in philosophy. Your configurations belong to you.
          Use the tools below to dump your workspace configuration or instantly migrate to
          self-hosted stacks.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {exportOptions.map((opt) => {
          const Icon = opt.icon;
          const isCurrent = downloading === opt.id;
          return (
            <Card
              key={opt.id}
              className="relative overflow-hidden border-primary/10 bg-primary/[0.01] hover:border-primary/20 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-widest bg-primary/10 text-primary border-l border-b border-primary/10 rounded-bl-sm">
                {opt.badge}
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 rounded-sm bg-primary/5 text-primary border border-primary/10">
                    <Icon className="size-4" />
                  </div>
                  <CardTitle className="text-sm font-bold font-mono tracking-tight">
                    {opt.title}
                  </CardTitle>
                </div>
                <CardDescription className="text-xs leading-relaxed min-h-[40px]">
                  {opt.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleExport(opt.id, opt.filename)}
                  disabled={downloading !== null}
                  variant="outline"
                  className="w-full text-xs font-mono font-bold uppercase tracking-wider py-1.5 h-auto hover:bg-primary hover:text-black hover:border-primary transition-all duration-200"
                >
                  {isCurrent ? (
                    <span className="flex items-center gap-1.5 justify-center">
                      <div className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Exporting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 justify-center">
                      <Download className="size-3.5" />
                      {opt.buttonText}
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-dashed border-primary/20 bg-primary/[0.005]">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="p-2 rounded-sm bg-primary/5 border border-primary/10 text-primary self-start mt-0.5">
              <CheckCircle2 className="size-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-foreground">
                Migration Guarantee
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                All exporter formats generate structural JSON or YAML configurations. PulseGuard
                checks comply with the latest industry monitoring schemas, letting you easily
                self-host a Blackbox exporter daemon or standard container should you choose to
                change platforms.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
