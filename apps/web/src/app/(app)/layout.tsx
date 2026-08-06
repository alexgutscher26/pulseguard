"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { CommandPalette } from "@/components/command-palette/command-palette";
import { TerminalView } from "@/components/dashboard/terminal-view";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Drawer */}
      <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <DashboardHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
        <div className="p-8 max-w-[1400px] mx-auto w-full relative">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.02] blur-[120px] rounded-full pointer-events-none -z-10"></div>
          {children}
        </div>
      </main>

      {/* Floating Bottom-Right Add Monitor Button */}
      <Link
        href="/dashboard/monitors/new"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/25 border border-primary/40 hover:scale-105 active:scale-95 transition-all duration-200 group cursor-pointer backdrop-blur-md"
        id="floating-add-monitor-btn"
        aria-label="Add New Monitor"
      >
        <Plus className="size-4 group-hover:rotate-90 transition-transform duration-300 shrink-0" />
        <span>Add Monitor</span>
      </Link>

      {/* Global Command Palette */}
      <CommandPalette />

      {/* Immersive Fullscreen Terminal Overlay */}
      <TerminalView />
    </div>
  );
}
