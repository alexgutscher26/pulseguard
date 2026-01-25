"use client";

import { MessageSquare, Mail, Terminal, Settings } from "lucide-react";

const channels = [
  {
    name: "Slack",
    detail: "#ops-alerts",
    icon: MessageSquare,
    color: "text-[#E01E5A]", // Slack colorish, but maybe override for style
    status: "Active",
  },
  {
    name: "Discord",
    detail: "Uptime Webhook",
    icon: MessageSquare, // Or use a specific discord icon if available, generic for now
    color: "text-[#5865F2]",
    status: "Active",
  },
  {
    name: "Email",
    detail: "admin@pulseguard.io",
    icon: Mail,
    color: "text-primary",
    status: "Active",
  },
];

export function NotificationChannels() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-foreground font-mono uppercase tracking-tight">Notification Channels</h3>
          <p className="text-xs text-primary/60 font-mono">Configure dispatch protocols</p>
        </div>
        <button className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/50 hover:border-primary text-xs font-bold px-4 py-2 flex items-center gap-2 transition-all font-mono uppercase tracking-wider relative group overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
                <Terminal className="size-3" /> Add Channel
            </span>
            <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((channel) => (
          <div key={channel.name} className="bg-black/40 border border-primary/20 p-5 flex flex-col gap-4 relative group hover:border-primary/50 transition-all backdrop-blur-sm">
            {/* Corner accents */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/0 group-hover:border-primary/100 transition-colors"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/0 group-hover:border-primary/100 transition-colors"></div>

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <channel.icon className={`size-5 ${channel.color}`} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground font-mono uppercase">{channel.name}</span>
                  <span className="text-[10px] text-primary/50 font-mono">{channel.detail}</span>
                </div>
              </div>
              <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                {channel.status}
              </span>
            </div>

            <div className="flex gap-2 mt-2">
              <button className="flex-1 bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 hover:border-primary/40 text-[10px] font-bold py-2 uppercase tracking-wider transition-all font-mono">
                Edit Protocol
              </button>
              <button className="flex-1 border border-primary/20 hover:border-primary/40 text-primary/50 hover:text-primary text-[10px] font-bold py-2 uppercase tracking-wider transition-all font-mono">
                Test Signal
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
