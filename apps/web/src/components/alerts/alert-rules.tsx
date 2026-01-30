"use client";

import {
  Bell,
  Plus,
  Trash2,
  Loader2,
  AlertTriangle,
  Clock,
  Shield,
  Power,
  PowerOff,
} from "lucide-react";
import { useState, useTransition } from "react";
import {
  createAlertRule,
  deleteAlertRule,
  toggleAlertRule,
} from "@/actions/notifications";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AlertRule {
  id: string;
  trigger: string;
  threshold?: number | null;
  comparison?: string | null;
  targetStatus?: string | null;
  enabled: boolean;
  monitor: {
    id: string;
    name: string;
  };
  channels: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

interface Monitor {
  id: string;
  name: string;
}

interface Channel {
  id: string;
  name: string;
  type: string;
}

export function AlertRules({
  rules,
  monitors,
  channels,
}: {
  rules: AlertRule[];
  monitors: Monitor[];
  channels: Channel[];
}) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonitor, setSelectedMonitor] = useState("");
  const [selectedTrigger, setSelectedTrigger] = useState("STATUS_CHANGE");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);

  async function handleDelete(id: string) {
    toast("Delete this alert rule?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => {
          startTransition(async () => {
            const res = await deleteAlertRule(id);
            if (res.success) {
              toast.success("Alert rule deleted");
            } else {
              toast.error(res.error);
            }
          });
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  }

  async function handleToggle(id: string, enabled: boolean) {
    startTransition(async () => {
      const res = await toggleAlertRule(id, enabled);
      if (res.success) {
        toast.success(enabled ? "Alert rule enabled" : "Alert rule disabled");
      } else {
        toast.error(res.error);
      }
    });
  }

  async function handleSubmit(formData: FormData) {
    if (selectedChannels.length === 0) {
      toast.error("Please select at least one notification channel");
      return;
    }

    formData.set("channelIds", JSON.stringify(selectedChannels));

    startTransition(async () => {
      const res = await createAlertRule(null, formData);
      if (res.success) {
        toast.success("Alert rule created");
        setIsOpen(false);
        setSelectedMonitor("");
        setSelectedTrigger("STATUS_CHANGE");
        setSelectedChannels([]);
      } else {
        toast.error(res.error);
      }
    });
  }

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case "STATUS_CHANGE":
        return AlertTriangle;
      case "LATENCY":
        return Clock;
      case "SSL_EXPIRY":
        return Shield;
      default:
        return Bell;
    }
  };

  const getTriggerLabel = (rule: AlertRule) => {
    if (rule.trigger === "STATUS_CHANGE") {
      return rule.targetStatus
        ? `Status → ${rule.targetStatus}`
        : "Any Status Change";
    }
    if (rule.trigger === "LATENCY") {
      const comp = rule.comparison === "GT" ? ">" : "<";
      return `Latency ${comp} ${rule.threshold}ms`;
    }
    if (rule.trigger === "SSL_EXPIRY") {
      return `SSL expires in < ${rule.threshold} days`;
    }
    return rule.trigger;
  };

  const toggleChannel = (channelId: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId)
        ? prev.filter((id) => id !== channelId)
        : [...prev, channelId],
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-foreground font-mono uppercase tracking-tight">
            Alert Rules
          </h3>
          <p className="text-xs text-primary/60 font-mono">
            Configure when to trigger notifications
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              disabled={channels.length === 0 || monitors.length === 0}
              variant="outline"
              className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/50 hover:border-primary font-mono uppercase tracking-wider gap-2"
            >
              <Plus className="size-4" /> Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] border-primary/20 bg-black/90 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="font-mono uppercase tracking-wider text-primary">
                New Alert Rule
              </DialogTitle>
              <DialogDescription>
                Define conditions for triggering notifications.
              </DialogDescription>
            </DialogHeader>

            <form action={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="monitorId">Monitor</Label>
                <select
                  id="monitorId"
                  name="monitorId"
                  required
                  className="flex h-10 w-full rounded-md border border-primary/20 bg-black px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedMonitor}
                  onChange={(e) => setSelectedMonitor(e.target.value)}
                >
                  <option value="">Select a monitor...</option>
                  {monitors.map((monitor) => (
                    <option key={monitor.id} value={monitor.id}>
                      {monitor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="trigger">Trigger</Label>
                <select
                  id="trigger"
                  name="trigger"
                  required
                  className="flex h-10 w-full rounded-md border border-primary/20 bg-black px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedTrigger}
                  onChange={(e) => setSelectedTrigger(e.target.value)}
                >
                  <option value="STATUS_CHANGE">Status Change</option>
                  <option value="LATENCY">High Latency</option>
                  <option value="SSL_EXPIRY">SSL Certificate Expiry</option>
                </select>
              </div>

              {selectedTrigger === "STATUS_CHANGE" && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="targetStatus">Target Status (Optional)</Label>
                  <select
                    id="targetStatus"
                    name="targetStatus"
                    className="flex h-10 w-full rounded-md border border-primary/20 bg-black px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Any Status Change</option>
                    <option value="DOWN">DOWN</option>
                    <option value="UP">UP</option>
                  </select>
                </div>
              )}

              {selectedTrigger === "LATENCY" && (
                <>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="comparison">Comparison</Label>
                    <select
                      id="comparison"
                      name="comparison"
                      required
                      className="flex h-10 w-full rounded-md border border-primary/20 bg-black px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="GT">Greater Than (&gt;)</option>
                      <option value="LT">Less Than (&lt;)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="threshold">Threshold (ms)</Label>
                    <Input
                      id="threshold"
                      name="threshold"
                      type="number"
                      required
                      placeholder="2000"
                      className="bg-primary/5 border-primary/20"
                    />
                  </div>
                </>
              )}

              {selectedTrigger === "SSL_EXPIRY" && (
                <>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="threshold">Days Before Expiry</Label>
                    <Input
                      id="threshold"
                      name="threshold"
                      type="number"
                      required
                      placeholder="7"
                      className="bg-primary/5 border-primary/20"
                    />
                  </div>
                  <input type="hidden" name="comparison" value="LT" />
                </>
              )}

              <div className="flex flex-col gap-2">
                <Label>Notification Channels</Label>
                <div className="border border-primary/20 rounded-md p-3 bg-primary/5 max-h-[200px] overflow-y-auto">
                  {channels.length === 0 ? (
                    <p className="text-xs text-primary/50">
                      No channels available. Create one first.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {channels.map((channel) => (
                        <label
                          key={channel.id}
                          className="flex items-center gap-2 cursor-pointer hover:bg-primary/10 p-2 rounded transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedChannels.includes(channel.id)}
                            onChange={() => toggleChannel(channel.id)}
                            className="rounded border-primary/20"
                          />
                          <span className="text-sm font-mono">
                            {channel.name}
                          </span>
                          <span className="text-[10px] text-primary/50 ml-auto">
                            {channel.type}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isPending || selectedChannels.length === 0}
                  className="font-mono uppercase"
                >
                  {isPending ? (
                    <Loader2 className="animate-spin size-4 mr-2" />
                  ) : null}
                  Create Rule
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {channels.length === 0 && (
        <div className="border border-dashed border-yellow-500/30 bg-yellow-500/5 p-4 rounded flex items-start gap-3">
          <AlertTriangle className="size-5 text-yellow-500 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-mono text-yellow-500">
              No Notification Channels
            </p>
            <p className="text-xs text-yellow-500/70">
              Create at least one notification channel above to start receiving
              alerts.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {rules.map((rule) => {
          const Icon = getTriggerIcon(rule.trigger);
          return (
            <div
              key={rule.id}
              className="bg-black/40 border border-primary/20 p-5 flex flex-col gap-4 relative group hover:border-primary/50 transition-all backdrop-blur-sm"
            >
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/0 group-hover:border-primary transition-colors"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/0 group-hover:border-primary transition-colors"></div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 overflow-hidden">
                  <div className="size-10 shrink-0 bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <div className="flex flex-col gap-1 overflow-hidden flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground font-mono uppercase truncate">
                        {rule.monitor.name}
                      </span>
                      {!rule.enabled && (
                        <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                          DISABLED
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-primary/70 font-mono">
                      {getTriggerLabel(rule)}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rule.channels.map((channel) => (
                        <span
                          key={channel.id}
                          className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider"
                        >
                          {channel.type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(rule.id, !rule.enabled)}
                    disabled={isPending}
                    className="p-2 hover:bg-primary/10 rounded transition-colors"
                    title={rule.enabled ? "Disable" : "Enable"}
                  >
                    {rule.enabled ? (
                      <Power className="size-4 text-green-500" />
                    ) : (
                      <PowerOff className="size-4 text-red-500" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  disabled={isPending}
                  onClick={() => handleDelete(rule.id)}
                  variant="ghost"
                  className="flex-1 border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 text-red-500/50 hover:text-red-500 text-[10px] font-bold py-2 uppercase tracking-wider transition-all font-mono h-auto"
                >
                  <Trash2 className="size-3 mr-2" /> Delete
                </Button>
              </div>
            </div>
          );
        })}

        {rules.length === 0 && channels.length > 0 && (
          <div className="col-span-full border border-dashed border-primary/20 p-8 flex flex-col items-center justify-center text-center gap-2 text-primary/50">
            <Bell className="size-8 mb-2 opacity-50" />
            <p className="font-mono text-sm">No alert rules configured</p>
            <p className="text-xs">
              Alert rules are automatically created when you add a monitor
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
