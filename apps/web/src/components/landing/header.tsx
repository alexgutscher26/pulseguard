"use client";

import Link from "next/link";
import { Activity } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function LandingHeader() {
  const session = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6 md:px-12 border-b border-border/50">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity group"
          >
            <div className="relative flex items-center justify-center size-8 border border-primary bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Activity className="size-5" />
              {/* Corner markers */}
              <div className="absolute top-0 left-0 w-1 h-1 bg-primary"></div>
              <div className="absolute top-0 right-0 w-1 h-1 bg-primary"></div>
              <div className="absolute bottom-0 left-0 w-1 h-1 bg-primary"></div>
              <div className="absolute bottom-0 right-0 w-1 h-1 bg-primary"></div>
            </div>
            <span className="font-mono text-lg font-bold tracking-tighter uppercase text-foreground">
              Pulse<span className="text-primary">Guard</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-border/50 text-xs font-mono text-muted-foreground uppercase opacity-70">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            System Online
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {["Features", "Protocol", "Pricing", "Docs"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {session.data ? (
            <Link
              href="/dashboard"
              className="flex items-center justify-center h-9 px-6 bg-primary text-black text-xs font-mono font-bold uppercase tracking-widest hover:bg-primary/90 transition-all border border-primary relative overflow-hidden group"
            >
              <span className="relative z-10">Access Dashboard</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:flex items-center justify-center h-9 px-4 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted transition-all border border-transparent hover:border-border"
              >
                [ Login ]
              </Link>
              <Link
                href="/signup"
                className="flex items-center justify-center h-9 px-6 bg-primary text-black text-xs font-mono font-bold uppercase tracking-widest hover:bg-primary/90 transition-all border border-primary relative overflow-hidden group"
              >
                <span className="relative z-10">Initialize</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
            </>
          )}
        </div>
      </div>
      {/* HUD line */}
      <div className="w-full h-px bg-primary/20">
        <div className="w-1/3 h-full bg-primary/50"></div>
      </div>
    </header>
  );
}
