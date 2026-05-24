"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { CommandPalette } from "@/components/command-palette/command-palette";
import { TerminalView } from "@/components/dashboard/terminal-view";
import { useMobile } from "@/hooks/use-mobile";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMobile();

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans">
      {/* Desktop Sidebar - Hidden on Mobile */}
      {!isMobile && <Sidebar />}

      {/* Mobile Sidebar Drawer */}
      {isMobile && (
        <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      )}

      <main className="flex-1 flex flex-col overflow-y-auto">
        <DashboardHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
        <div className="p-8 max-w-[1400px] mx-auto w-full relative">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.02] blur-[120px] rounded-full pointer-events-none -z-10"></div>
          {children}
        </div>
      </main>

      {/* Global Command Palette */}
      <CommandPalette />

      {/* Immersive Fullscreen Terminal Overlay */}
      <TerminalView />
    </div>
  );
}
