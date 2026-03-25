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
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Renders the landing header component with navigation and session management.
 */
export default function LandingHeader() {
  const session = authClient.useSession();
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center justify-between px-6 py-3 bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/5 shadow-2xl rounded-full w-full max-w-5xl">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Activity className="size-5 text-primary" />
            <span className="font-semibold text-lg tracking-tight text-foreground">PulseGuard</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {/* Tools Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsToolsOpen(true)}
            onMouseLeave={() => setIsToolsOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-all cursor-pointer focus:outline-none py-2 group">
              Tools
              <ChevronDown
                className={cn(
                  "h-3 w-3 transition-transform duration-300",
                  isToolsOpen && "rotate-180",
                )}
              />
            </button>

            <AnimatePresence>
              {isToolsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-56 z-[100]"
                >
                  <div className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/5 p-2 rounded-2xl shadow-2xl grid gap-1 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 opacity-50 pointer-events-none" />
                    {[
                      {
                        name: "IP Pulse",
                        href: "/tools/ip-subnet",
                        icon: <Network className="h-4 w-4" />,
                      },
                      {
                        name: "Global Latency",
                        href: "/tools/global-latency",
                        icon: <Globe className="h-4 w-4" />,
                      },
                      {
                        name: "DNS Pulse",
                        href: "/tools/dns-sentinel",
                        icon: <Globe className="h-4 w-4" />,
                      },
                      {
                        name: "Cron Pulse",
                        href: "/tools/cron-sentinel",
                        icon: <Clock className="h-4 w-4" />,
                      },
                      {
                        name: "Payload Pulse",
                        href: "/tools/payload-regex",
                        icon: <Code2 className="h-4 w-4" />,
                      },
                      {
                        name: "HTTP Security",
                        href: "/tools/http-headers",
                        icon: <ShieldCheck className="h-4 w-4" />,
                      },
                      {
                        name: "SSL Checker",
                        href: "/tools/ssl-checker",
                        icon: <ShieldCheck className="h-4 w-4" />,
                      },
                      {
                        name: "Port Checker",
                        href: "/tools/port-checker",
                        icon: <Terminal className="h-4 w-4" />,
                      },
                      {
                        name: "Visual Diff",
                        href: "/tools/visual-diff",
                        icon: <Activity className="h-4 w-4" />,
                      },
                    ].map((tool) => (
                      <Link
                        key={tool.name}
                        href={tool.href as any}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground group/item relative z-10 w-full"
                        onClick={() => setIsToolsOpen(false)}
                      >
                        <div className="text-primary group-hover/item:scale-110 transition-transform">
                          {tool.icon}
                        </div>
                        <span className="text-sm font-medium">{tool.name}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {[
            { name: "Protocol", href: "/#protocol" },
            { name: "Features", href: "/#features" },
            { name: "Pricing", href: "/#pricing" },
            { name: "Docs", href: "/#docs" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href as any}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          {session.data ? (
            <Link
              href="/dashboard"
              className="flex items-center justify-center h-10 px-5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-full transition-colors sm:flex"
            >
              Dashboard <ArrowRight className="ml-2 size-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="flex items-center justify-center h-10 px-5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-full transition-colors"
              >
                Initialize <ArrowRight className="ml-2 size-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
