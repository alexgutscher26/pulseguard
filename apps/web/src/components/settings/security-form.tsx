"use client";

import { Shield, Smartphone, Lock } from "lucide-react";

export function SecurityForm() {
  return (
    <div className="flex flex-col gap-6">
      {/* 2FA Section */}
      <section className="bg-black/40 border border-primary/20 relative overflow-hidden backdrop-blur-sm group hover:border-primary/40 transition-all">
        <div className="p-6 border-b border-primary/20 bg-primary/5">
          <h3 className="text-lg font-bold text-foreground font-mono uppercase tracking-tight">Two-Factor Authentication</h3>
          <p className="text-xs text-primary/60 font-mono">Enhance account security protocols</p>
        </div>
        <div className="p-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-sm">
              <Smartphone className="size-6 text-primary" />
            </div>
            <div className="flex flex-col gap-1">
               <h4 className="text-sm font-bold text-foreground font-mono uppercase">Authenticator App</h4>
               <p className="text-xs text-primary/60 font-mono max-w-sm">Use an authenticator app like Google Authenticator or Authy to generate one-time codes.</p>
            </div>
          </div>
          <button className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/50 text-xs font-bold px-4 py-2 uppercase tracking-wider transition-all font-mono">
            Enable 2FA
          </button>
        </div>
      </section>

      {/* Password Change */}
      <section className="bg-black/40 border border-primary/20 relative overflow-hidden backdrop-blur-sm group hover:border-primary/40 transition-all">
        <div className="p-6 border-b border-primary/20 bg-primary/5">
          <h3 className="text-lg font-bold text-foreground font-mono uppercase tracking-tight">Password Management</h3>
          <p className="text-xs text-primary/60 font-mono">Update access credentials</p>
        </div>
        <div className="p-6 grid grid-cols-1 gap-4 max-w-xl">
           <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">Current Password</label>
            <div className="relative">
                <Lock className="absolute left-3 top-2.5 size-4 text-primary/40" />
                <input
                className="w-full bg-black/50 border border-primary/20 focus:border-primary/60 text-primary text-sm rounded-sm pl-10 pr-4 py-2.5 font-mono placeholder:text-primary/20 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                type="password"
                placeholder="••••••••••••"
                />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">New Password</label>
            <div className="relative">
                <Lock className="absolute left-3 top-2.5 size-4 text-primary/40" />
                <input
                className="w-full bg-black/50 border border-primary/20 focus:border-primary/60 text-primary text-sm rounded-sm pl-10 pr-4 py-2.5 font-mono placeholder:text-primary/20 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                type="password"
                placeholder="••••••••••••"
                />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">Confirm New Password</label>
            <div className="relative">
                <Lock className="absolute left-3 top-2.5 size-4 text-primary/40" />
                <input
                className="w-full bg-black/50 border border-primary/20 focus:border-primary/60 text-primary text-sm rounded-sm pl-10 pr-4 py-2.5 font-mono placeholder:text-primary/20 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                type="password"
                placeholder="••••••••••••"
                />
            </div>
          </div>
          
          <div className="mt-2">
             <button className="bg-primary hover:bg-primary/90 text-black text-xs font-bold px-6 py-2.5 uppercase tracking-wider transition-all font-mono">
                Update Password
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
