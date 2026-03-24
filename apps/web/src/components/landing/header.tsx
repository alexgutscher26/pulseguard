"use client";

import Link from "next/link";
import {
  Activity,
  ChevronDown,
  Globe,
  ShieldCheck,
  Terminal,
  ArrowRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function LandingHeader() {
  const session = authClient.useSession();

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center justify-between px-6 py-3 bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/5 shadow-2xl rounded-full w-full max-w-5xl">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Activity className="size-5 text-primary" />
            <span className="font-semibold text-lg tracking-tight text-foreground">
              PulseGuard
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {/* Tools Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus:outline-none py-2">
              Tools
              <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
            </button>

            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-56 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 ease-out z-[100]">
              <div className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/5 p-2 rounded-2xl shadow-2xl grid gap-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-50" />
                {[
                  {
                    name: "Global Latency",
                    href: "/tools/global-latency",
                    icon: <Globe className="h-4 w-4" />,
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
                ].map((tool) => (
                  <Link
                    key={tool.name}
                    href={tool.href as any}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground group/item relative z-10"
                  >
                    <div className="text-primary group-hover/item:scale-110 transition-transform">
                      {tool.icon}
                    </div>
                    <span className="text-sm font-medium">{tool.name}</span>
                  </Link>
                ))}
              </div>
            </div>
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
