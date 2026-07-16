"use client";

import Link from "next/link";
import {
  Activity,
  ChevronDown,
  Globe,
  ShieldCheck,
  Terminal,
  ArrowRight,
  Code2,
  Clock,
  Network,
  Sun,
  Moon,
  Monitor,
  Flame,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export default function LandingHeader() {
  const session = authClient.useSession();
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    const themes = ["dark", "light", "matrix", "cyberpunk", "blade"];
    const currentIdx = themes.indexOf(theme || "dark");
    const nextIdx = (currentIdx + 1) % themes.length;
    setTheme(themes[nextIdx]);
  };

  return (
    <header className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 w-full">
      <div className="flex items-center justify-between px-6 h-14 bg-background/70 backdrop-blur-md border border-border shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-2xl w-full max-w-5xl transition-all duration-300">
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 bg-primary/5 border border-primary/10 rounded-lg group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-300">
              <Activity className="size-4.5 text-primary" />
            </div>
            <span className="font-bold text-foreground text-sm tracking-tight">PulseGuard</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-xs">
          {/* Tools Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsToolsOpen(true)}
            onMouseLeave={() => setIsToolsOpen(false)}
          >
            <button className="flex items-center gap-1 py-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group focus:outline-none">
              Tools
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-300 text-muted-foreground/60 group-hover:text-foreground",
                  isToolsOpen && "rotate-180",
                )}
              />
            </button>

            <AnimatePresence>
              {isToolsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64 z-[100]"
                >
                  <div className="bg-popover border border-border p-2 rounded-xl shadow-[0_12px_38px_rgba(0,0,0,0.125)] dark:shadow-[0_12px_38px_rgba(0,0,0,0.5)] grid grid-cols-1 gap-1 relative overflow-hidden">
                    {[
                      {
                        name: "IP Subnet Analyzer",
                        href: "/tools/ip-subnet",
                        icon: <Network className="h-4 w-4" />,
                      },
                      {
                        name: "Global Ping Latency",
                        href: "/tools/global-latency",
                        icon: <Globe className="h-4 w-4" />,
                      },
                      {
                        name: "DNS Sentinel Verify",
                        href: "/tools/dns-sentinel",
                        icon: <Globe className="h-4 w-4" />,
                      },
                      {
                        name: "Cron Heartbeat Watch",
                        href: "/tools/cron-sentinel",
                        icon: <Clock className="h-4 w-4" />,
                      },
                      {
                        name: "Payload RegEx Parser",
                        href: "/tools/payload-regex",
                        icon: <Code2 className="h-4 w-4" />,
                      },
                      {
                        name: "HTTP Header Audit",
                        href: "/tools/http-headers",
                        icon: <ShieldCheck className="h-4 w-4" />,
                      },
                      {
                        name: "SSL Cryptographic",
                        href: "/tools/ssl-checker",
                        icon: <ShieldCheck className="h-4 w-4" />,
                      },
                      {
                        name: "Network Port Prober",
                        href: "/tools/port-checker",
                        icon: <Terminal className="h-4 w-4" />,
                      },
                      {
                        name: "Visual Monitor Diff",
                        href: "/tools/visual-diff",
                        icon: <Activity className="h-4 w-4" />,
                      },
                      {
                        name: "Roast My Stack",
                        href: "/tools/roast-my-stack",
                        icon: <Flame className="h-4 w-4" />,
                      },
                    ].map((tool) => (
                      <Link
                        key={tool.name}
                        href={tool.href as any}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-all text-muted-foreground hover:text-foreground group/item w-full text-xs font-medium"
                        onClick={() => setIsToolsOpen(false)}
                      >
                        <span className="text-muted-foreground group-hover/item:text-primary transition-colors shrink-0">
                          {tool.icon}
                        </span>
                        <span className="truncate">{tool.name}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {[
            { name: "Features", href: "/#features" },
            { name: "Pricing", href: "/#pricing" },
            { name: "Docs", href: "https://pulse-41cf5b0d.mintlify.site/introduction" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href as any}
              className="text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Action Panel */}
        <div className="flex items-center gap-3.5">
          {/* Theme switcher */}
          {mounted && (
            <button
              onClick={cycleTheme}
              className="flex items-center justify-center size-8 rounded-lg border border-border bg-background/50 hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
              title={`Active Theme: ${theme || "dark"}. Click to change.`}
            >
              {theme === "light" ? (
                <Sun className="size-4" />
              ) : theme === "dark" ? (
                <Moon className="size-4" />
              ) : (
                <Monitor className="size-4 text-primary" />
              )}
            </button>
          )}

          {session.data ? (
            <Link
              href="/dashboard"
              className="flex items-center justify-center h-8.5 px-4 bg-primary text-primary-foreground font-semibold text-xs rounded-lg border border-primary hover:bg-primary/90 transition-all duration-300"
            >
              Dashboard <ArrowRight className="ml-1.5 size-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="flex items-center justify-center h-8.5 px-4 bg-primary text-primary-foreground font-semibold text-xs rounded-lg border border-primary hover:bg-primary/90 transition-all duration-300"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
