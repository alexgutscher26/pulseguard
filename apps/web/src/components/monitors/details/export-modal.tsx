"use client";

import { useState } from "react";
import { Download, FileJson, FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface MonitorExportModalProps {
  monitorId: string;
  trigger?: React.ReactNode;
}

export function MonitorExportModal({ monitorId, trigger }: MonitorExportModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState("7d");
  const [format, setFormat] = useState("csv");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);

      const now = new Date();
      let startDate = new Date();

      // Calculate start date based on range
      switch (range) {
        case "24h":
          startDate.setTime(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "7d":
          startDate.setTime(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          startDate.setTime(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "90d":
          startDate.setTime(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default: // 7d default
          startDate.setTime(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      const query = new URLSearchParams({
        start: startDate.toISOString(),
        end: now.toISOString(),
        format,
      });

      const url = `/api/monitors/${monitorId}/export?${query.toString()}`;

      // Trigger download
      window.location.href = url;

      toast.success("Export started", {
        description: "Your download should begin shortly.",
      });

      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to start export");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="size-4" />
            Export Data
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Monitor Data</DialogTitle>
          <DialogDescription>
            Download raw event logs for compliance and analysis.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="range">Time Range</Label>
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger id="range">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Format</Label>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`cursor-pointer rounded-md border-2 p-4 hover:bg-muted/50 transition-all flex flex-col items-center gap-2 ${
                  format === "csv" ? "border-primary bg-primary/5" : "border-muted"
                }`}
                onClick={() => setFormat("csv")}
              >
                <FileSpreadsheet
                  className={`size-6 ${format === "csv" ? "text-primary" : "text-muted-foreground"}`}
                />
                <span
                  className={`text-sm font-medium ${format === "csv" ? "text-primary" : "text-muted-foreground"}`}
                >
                  CSV
                </span>
              </div>

              <div
                className={`cursor-pointer rounded-md border-2 p-4 hover:bg-muted/50 transition-all flex flex-col items-center gap-2 ${
                  format === "json" ? "border-primary bg-primary/5" : "border-muted"
                }`}
                onClick={() => setFormat("json")}
              >
                <FileJson
                  className={`size-6 ${format === "json" ? "text-primary" : "text-muted-foreground"}`}
                />
                <span
                  className={`text-sm font-medium ${format === "json" ? "text-primary" : "text-muted-foreground"}`}
                >
                  JSON
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : (
              <Download className="size-4 mr-2" />
            )}
            Download {format.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
