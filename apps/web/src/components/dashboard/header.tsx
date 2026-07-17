"use client";

import { Search, Plus, LogOut, User, Settings, Menu, Terminal } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { useHaptic } from "@/hooks/use-haptic";
import { useTerminalStore } from "@/hooks/use-terminal-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void } = {}) {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { trigger } = useHaptic();
  const { isTerminalMode, toggleTerminalMode } = useTerminalStore();

  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    if (paths.length === 0) {
      return [{ label: "Dashboard", url: "/dashboard", isLast: true }];
    }

    const mapSegment = (segment: string) => {
      if (segment === "dashboard") return "Dashboard";
      if (segment === "monitors") return "Monitors";
      if (segment === "pages") return "Status Pages";
      if (segment === "incidents") return "Incidents";
      if (segment === "alerts") return "Alerts";
      if (segment === "settings") return "Settings";
      if (segment === "new") return "New";
      if (segment === "edit") return "Edit";

      if (segment.length > 15) return `${segment.slice(0, 8)}...`;
      return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    };

    return paths.map((segment, index) => {
      const url = `/${paths.slice(0, index + 1).join("/")}`;
      const isLast = index === paths.length - 1;
      const label = mapSegment(segment);

      return { label, url, isLast };
    });
  };

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "OP";

  return (
    <header className="sticky top-0 z-30 flex h-20 min-h-[80px] items-center justify-between border-b border-border/60 bg-background/70 backdrop-blur-xl px-6 md:px-8 overflow-hidden transition-all">
      <div className="flex items-center gap-4 relative z-20 min-w-0 flex-1 md:flex-none">
        {/* Hamburger Menu - Mobile Only */}
        {onMenuClick && (
          <button
            onClick={() => {
              trigger("light");
              onMenuClick();
            }}
            className="md:hidden flex items-center justify-center size-9 rounded-lg border border-border bg-card hover:bg-accent transition-colors shrink-0 active:scale-95 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="size-4.5 text-foreground" />
          </button>
        )}

        {/* Breadcrumbs Navigation */}
        <div className="flex items-center gap-4 min-w-0">
          <nav className="flex items-center gap-1.5 text-sm font-semibold tracking-tight text-muted-foreground select-none min-w-0">
            {getBreadcrumbs().map((crumb, index) => (
              <div key={crumb.url} className="flex items-center gap-1.5 min-w-0">
                {index > 0 && (
                  <span className="text-muted-foreground/30 text-xs font-normal">/</span>
                )}
                {crumb.isLast ? (
                  <span className="text-foreground font-bold tracking-tight text-sm md:text-base truncate max-w-[120px] sm:max-w-[180px] md:max-w-[240px]">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.url as any}
                    className="hover:text-foreground transition-colors text-xs font-medium md:text-sm shrink-0"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Active Health Status Badge */}
          <a
            href="http://localhost:3000/status-page/f34f34f"
            className="hidden sm:block shrink-0 active:scale-95 transition-transform"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="http://localhost:3000/api/badge/f34f34f.svg?style=flat&theme=dark&size=sm"
              alt="PulseGuard Status"
            />
          </a>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5 relative z-20 shrink-0">
        {/* Search - Icon on mobile, full width simulation on desktop */}
        <button
          onClick={() => {
            const event = new KeyboardEvent("keydown", {
              key: "k",
              metaKey: true,
              ctrlKey: true,
            });
            document.dispatchEvent(event);
          }}
          className="relative flex items-center justify-center size-9 md:h-10 md:w-60 lg:w-68 md:justify-start gap-2.5 bg-accent/30 hover:bg-accent/40 text-muted-foreground hover:text-foreground rounded-lg border border-border hover:border-border/80 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-200 cursor-pointer active:scale-95 shrink-0 px-0 md:px-3.5 group"
          aria-label="Search"
          id="global-search-trigger"
        >
          <Search className="size-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
          <span className="hidden md:inline flex-1 text-left text-xs font-semibold">Search...</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[8px] font-bold bg-accent border border-border/40 text-muted-foreground rounded font-mono">
            <span>⌘</span>
            <span>K</span>
          </kbd>
        </button>

        {/* Add Monitor Button - Plus Icon on mobile, full text on desktop */}
        <Link
          href="/dashboard/monitors/new"
          className="flex items-center justify-center size-9 md:h-10 md:w-auto md:px-4 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 gap-1.5 cursor-pointer shadow-sm shadow-primary/20 shrink-0"
          aria-label="Add Monitor"
          id="add-monitor-header-btn"
        >
          <Plus className="size-4 shrink-0" />
          <span className="hidden md:inline">Add Monitor</span>
        </Link>

        {/* Terminal Toggle Button */}
        <button
          onClick={() => {
            trigger("medium");
            toggleTerminalMode();
          }}
          className={`flex items-center justify-center size-9 md:size-10 rounded-lg border hover:bg-accent hover:text-foreground transition-all duration-200 cursor-pointer active:scale-95 shrink-0 ${
            isTerminalMode
              ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/25 animate-pulse"
              : "border-border bg-card text-muted-foreground"
          }`}
          title="Terminal-Only Mode"
          aria-label="Toggle Terminal-Only Mode"
          id="terminal-mode-toggle"
        >
          <Terminal className="size-4" />
        </button>

        {/* Mode Toggle - Hidden on Mobile */}
        <div className="hidden sm:block text-muted-foreground hover:text-foreground">
          <ModeToggle />
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-3 border-l border-border/80 pl-4 md:pl-6 h-9 shrink-0 ml-2 md:ml-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              id="user-menu-trigger"
              className="flex items-center gap-3 outline-none group cursor-pointer"
            >
              {/* User Name - Desktop Only */}
              <div className="text-right hidden lg:block">
                <p className="text-xs text-foreground font-bold leading-tight group-hover:text-primary transition-colors">
                  {session?.user?.name || "Operator"}
                </p>
                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
                  {session?.user?.email || "admin@pulseguard.io"}
                </p>
              </div>
              {/* Avatar */}
              <div className="size-9 rounded-full overflow-hidden border border-border bg-gradient-to-br from-primary/10 to-primary/5 hover:border-primary/30 hover:scale-105 active:scale-95 transition-all shrink-0 flex items-center justify-center shadow-sm">
                {session?.user?.image ? (
                  <img
                    className="w-full h-full object-cover transition-opacity duration-300"
                    alt="User profile"
                    src={session.user.image}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-[11px] font-bold text-primary font-mono tracking-wider">
                    {initials}
                  </span>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-popover/95 backdrop-blur-md border border-border/80 text-foreground rounded-xl p-1.5 shadow-[0_12px_38px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_38px_rgba(0,0,0,0.35)] animate-in fade-in-50 zoom-in-95 duration-100"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2.5 py-2">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/60" />
                <DropdownMenuItem
                  className="text-xs font-semibold focus:bg-accent focus:text-foreground cursor-pointer rounded-lg px-2.5 py-2 transition-colors"
                  onClick={() => router.push("/dashboard/settings?tab=general")}
                >
                  <User className="mr-2 h-3.5 w-3.5" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-xs font-semibold focus:bg-accent focus:text-foreground cursor-pointer rounded-lg px-2.5 py-2 transition-colors"
                  onClick={() => router.push("/dashboard/settings")}
                >
                  <Settings className="mr-2 h-3.5 w-3.5" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-border/60" />
              <DropdownMenuItem
                className="text-xs font-semibold text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer rounded-lg px-2.5 py-2 transition-colors"
                onClick={async () => {
                  await authClient.signOut();
                  window.location.href = "/login";
                }}
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
