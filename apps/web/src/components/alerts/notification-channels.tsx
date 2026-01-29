"use client";

import {
  MessageSquare,
  Mail,
  Terminal,
  Trash2,
  Plus,
  Loader2,
} from "lucide-react";
import { useState, useTransition } from "react";
import {
  createNotificationChannel,
  deleteNotificationChannel,
  sendTestNotification,
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

interface Channel {
  id: string;
  name: string;
  type: string;
  config: any;
  createdAt: Date;
}

export function NotificationChannels({
  channels,
  slackClientId,
  discordClientId,
}: {
  channels: Channel[];
  slackClientId?: string;
  discordClientId?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("EMAIL");

  async function handleDelete(id: string) {
    toast("Delete this notification channel?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => {
          startTransition(async () => {
            const res = await deleteNotificationChannel(id);
            if (res.success) {
              toast.success("Channel deleted");
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

  async function handleTest(id: string) {
    toast.promise(
      async () => {
        const res = await sendTestNotification(id);
        if (!res.success) throw new Error(res.error);
        return res;
      },
      {
        loading: "Dispatching test signal...",
        success: "Test signal sent successfully",
        error: (err) => `Signal failed: ${err.message}`,
      },
    );
  }

  async function handleSubmit(formData: FormData) {
    const config: Record<string, string> = {};
    const value = formData.get("value") as string;

    // Type checking handled in render/state
    if (selectedType === "EMAIL") config.email = value;
    else if (selectedType === "SMS") config.phoneNumber = value;
    else config.url = value;

    formData.set("config", JSON.stringify(config));

    startTransition(async () => {
      const res = await createNotificationChannel(null, formData);
      if (res.success) {
        toast.success("Channel created");
        setIsOpen(false);
      } else {
        toast.error(res.error);
      }
    });
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "EMAIL":
        return Mail;
      case "SLACK":
        return MessageSquare;
      case "DISCORD":
        return MessageSquare;
      case "SMS":
        return MessageSquare;
      default:
        return Terminal;
    }
  };

  const getDetail = (channel: Channel) => {
    const config = channel.config as any;
    if (config?.email) return config.email;
    if (config?.url) return config.url;
    if (config?.phoneNumber) return config.phoneNumber;
    return "Configured";
  };

  const getColor = (type: string) => {
    switch (type) {
      case "SLACK":
        return "text-[#E01E5A]";
      case "DISCORD":
        return "text-[#5865F2]";
      case "EMAIL":
        return "text-primary";
      default:
        return "text-foreground";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-foreground font-mono uppercase tracking-tight">
            Notification Channels
          </h3>
          <p className="text-xs text-primary/60 font-mono">
            Configure dispatch protocols
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/50 hover:border-primary font-mono uppercase tracking-wider gap-2"
            >
              <Plus className="size-4" /> Add Channel
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] border-primary/20 bg-black/90 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="font-mono uppercase tracking-wider text-primary">
                New Channel
              </DialogTitle>
              <DialogDescription>
                Configure a new destination for your alerts.
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-2 mb-4">
              <Button
                variant="outline"
                className="flex-1 border-[#5865F2]/50 text-[#5865F2] hover:bg-[#5865F2]/10"
                onClick={() => {
                  if (!discordClientId) {
                    toast.error("Discord Client ID is not configured");
                    return;
                  }
                  const baseUrl =
                    process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
                  const redirect = encodeURIComponent(
                    `${baseUrl}/api/integrations/discord/callback`,
                  );
                  window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${redirect}&response_type=code&scope=bot+webhook.incoming`;
                }}
              >
                <div className="size-4 mr-2 bg-[#5865F2] rounded-full" />
                Discord
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-[#E01E5A]/50 text-[#E01E5A] hover:bg-[#E01E5A]/10"
                onClick={() => {
                  if (!slackClientId) {
                    toast.error("Slack Client ID is not configured");
                    return;
                  }
                  const baseUrl =
                    process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
                  const redirect = encodeURIComponent(
                    `${baseUrl}/api/integrations/slack/callback`,
                  );
                  // Scopes: incoming-webhook (legacy), chat:write (bot messages), commands (slash commands)
                  window.location.href = `https://slack.com/oauth/v2/authorize?client_id=${slackClientId}&scope=incoming-webhook,chat:write,commands&redirect_uri=${redirect}`;
                }}
              >
                <div className="size-4 mr-2 bg-[#E01E5A] rounded-full" />
                Slack
              </Button>
            </div>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-primary/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/90 px-2 text-primary/50 font-mono">
                  Or Manual Config
                </span>
              </div>
            </div>

            <form action={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="My Alert Channel"
                  className="bg-primary/5 border-primary/20"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  name="type"
                  className="flex h-10 w-full rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="EMAIL">Email</option>
                  <option value="SLACK">Slack Webhook</option>
                  <option value="DISCORD">Discord Webhook</option>
                  <option value="TELEGRAM">Telegram</option>
                  <option value="SMS">SMS</option>
                  <option value="WEBHOOK">Generic Webhook</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="value">
                  {selectedType === "EMAIL"
                    ? "Email Address"
                    : selectedType === "SMS"
                      ? "Phone Number"
                      : "Webhook URL"}
                </Label>
                <Input
                  id="value"
                  name="value"
                  required
                  type={selectedType === "EMAIL" ? "email" : "text"}
                  placeholder={
                    selectedType === "EMAIL"
                      ? "user@example.com"
                      : selectedType === "SMS"
                        ? "+1234567890"
                        : "https://hooks.slack.com/..."
                  }
                  className="bg-primary/5 border-primary/20"
                />
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="font-mono uppercase"
                >
                  {isPending ? (
                    <Loader2 className="animate-spin size-4 mr-2" />
                  ) : null}
                  Save Channel
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((channel) => {
          const Icon = getIcon(channel.type);
          return (
            <div
              key={channel.id}
              className="bg-black/40 border border-primary/20 p-5 flex flex-col gap-4 relative group hover:border-primary/50 transition-all backdrop-blur-sm"
            >
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/0 group-hover:border-primary transition-colors"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/0 group-hover:border-primary transition-colors"></div>

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="size-10 shrink-0 bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Icon className={`size-5 ${getColor(channel.type)}`} />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-bold text-foreground font-mono uppercase truncate">
                      {channel.name}
                    </span>
                    <span
                      className="text-[10px] text-primary/50 font-mono truncate"
                      title={getDetail(channel)}
                    >
                      {getDetail(channel)}
                    </span>
                  </div>
                </div>
                <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                  {channel.type}
                </span>
              </div>

              <div className="flex gap-2 mt-2">
                <Button
                  disabled={isPending}
                  onClick={() => handleTest(channel.id)}
                  variant="ghost"
                  className="flex-1 border border-primary/20 hover:bg-primary/10 hover:border-primary/40 text-primary/50 hover:text-primary text-[10px] font-bold py-2 uppercase tracking-wider transition-all font-mono h-auto"
                >
                  <Terminal className="size-3 mr-2" /> Test
                </Button>
                <Button
                  disabled={isPending}
                  onClick={() => handleDelete(channel.id)}
                  variant="ghost"
                  className="flex-1 border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 text-red-500/50 hover:text-red-500 text-[10px] font-bold py-2 uppercase tracking-wider transition-all font-mono h-auto"
                >
                  <Trash2 className="size-3 mr-2" /> Delete
                </Button>
              </div>
            </div>
          );
        })}

        {channels.length === 0 && (
          <div className="col-span-full border border-dashed border-primary/20 p-8 flex flex-col items-center justify-center text-center gap-2 text-primary/50">
            <Terminal className="size-8 mb-2 opacity-50" />
            <p className="font-mono text-sm">
              No notification channels initialized
            </p>
            <p className="text-xs">Add a channel to receive system alerts</p>
          </div>
        )}
      </div>
    </div>
  );
}
