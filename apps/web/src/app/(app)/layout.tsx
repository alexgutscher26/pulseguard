"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-foreground font-mono selection:bg-primary/20">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <DashboardHeader />
        <div className="p-8 max-w-[1400px] mx-auto w-full relative">
          {/* Dashboard Background FX */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none -z-10"></div>
          
          {children}
        </div>
      </main>
    </div>
  );
}
