"use client";

import { Activity, Globe, Server, Clock, Save, X } from "lucide-react";
import Link from "next/link";

export function MonitorForm() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-foreground font-mono uppercase tracking-tight flex items-center gap-2">
            <Activity className="size-5 text-primary" />
            New Monitor Protocol
        </h3>
        <p className="text-sm text-primary/60 font-mono">Configure a new endpoint for continuous tracking</p>
      </div>

      <form className="bg-black/40 border border-primary/20 p-8 backdrop-blur-sm relative group">
          {/* Decor */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/30 group-hover:border-primary/60 transition-colors pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-primary/30 group-hover:border-primary/60 transition-colors pointer-events-none"></div>

          <div className="flex flex-col gap-6">
            
            {/* Monitor Type */}
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">Monitor Type</label>
                <div className="grid grid-cols-3 gap-4">
                    <label className="flex flex-col items-center justify-center gap-2 p-4 border border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-all group/type relative overflow-hidden">
                        <input type="radio" name="type" value="http" className="sr-only peer" defaultChecked />
                        <div className="absolute inset-0 border-2 border-primary opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                        <Globe className="size-6 text-primary mb-1" />
                        <span className="text-xs font-bold text-foreground font-mono uppercase">HTTP/HTTPS</span>
                    </label>
                    <label className="flex flex-col items-center justify-center gap-2 p-4 border border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-all group/type relative overflow-hidden">
                        <input type="radio" name="type" value="ping" className="sr-only peer" />
                        <div className="absolute inset-0 border-2 border-primary opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                        <Activity className="size-6 text-primary mb-1" />
                        <span className="text-xs font-bold text-foreground font-mono uppercase">Ping</span>
                    </label>
                    <label className="flex flex-col items-center justify-center gap-2 p-4 border border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-all group/type relative overflow-hidden">
                        <input type="radio" name="type" value="port" className="sr-only peer" />
                        <div className="absolute inset-0 border-2 border-primary opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                        <Server className="size-6 text-primary mb-1" />
                        <span className="text-xs font-bold text-foreground font-mono uppercase">Port</span>
                    </label>
                </div>
            </div>

            {/* Basic Info */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">Friendly Name</label>
                <input
                    className="bg-black/50 border border-primary/20 focus:border-primary/60 text-primary text-sm rounded-sm p-3 font-mono placeholder:text-primary/20 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all w-full"
                    type="text"
                    placeholder="e.g. Production API"
                />
            </div>

             <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">Target URL / IP</label>
                <input
                    className="bg-black/50 border border-primary/20 focus:border-primary/60 text-primary text-sm rounded-sm p-3 font-mono placeholder:text-primary/20 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all w-full"
                    type="text"
                    placeholder="https://api.example.com/health"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">Check Interval</label>
                    <div className="relative">
                        <Clock className="absolute top-3 left-3 size-4 text-primary/40" />
                        <select className="bg-black/50 border border-primary/20 focus:border-primary/60 text-primary text-sm rounded-sm p-3 pl-10 font-mono focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all w-full appearance-none">
                            <option value="30">30 Seconds</option>
                            <option value="60">1 Minute</option>
                            <option value="300">5 Minutes</option>
                            <option value="600">10 Minutes</option>
                        </select>
                    </div>
                </div>
                 <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">Request Timeout</label>
                     <div className="relative">
                        <Clock className="absolute top-3 left-3 size-4 text-primary/40" />
                        <select className="bg-black/50 border border-primary/20 focus:border-primary/60 text-primary text-sm rounded-sm p-3 pl-10 font-mono focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all w-full appearance-none">
                            <option value="5">5 Seconds</option>
                            <option value="10">10 Seconds</option>
                            <option value="30">30 Seconds</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="h-px bg-primary/20 my-2"></div>

            <div className="flex items-center justify-end gap-3">
                <Link href="/dashboard/monitors" className="px-6 py-2.5 border border-primary/20 text-primary/60 hover:text-primary hover:border-primary/50 text-xs font-bold uppercase tracking-wider font-mono transition-all flex items-center gap-2">
                    <X className="size-4" /> Cancel
                </Link>
                <button type="submit" className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-black text-xs font-bold uppercase tracking-wider font-mono transition-all flex items-center gap-2">
                    <Save className="size-4" /> Create Monitor
                </button>
            </div>

          </div>
      </form>
    </div>
  );
}
