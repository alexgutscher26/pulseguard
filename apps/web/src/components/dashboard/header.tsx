"use client";

import { Search, Plus, Terminal, LogOut, User, Settings, Menu } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { useMobile } from "@/hooks/use-mobile";
import { useHaptic } from "@/hooks/use-haptic";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Renders the dashboard header component.
 *
 * The DashboardHeader function utilizes the authClient to retrieve the current session data. It constructs a header with a sticky position that includes a scanline effect, a title, a search input, an "Add Monitor" button, and user information. The user profile image is displayed if available, otherwise a default image is used. The layout is responsive and adapts to different screen sizes.
 */
export function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void } = {}) {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMobile();
  const { trigger } = useHaptic();

  const getTitle = () => {
    if (pathname.includes("/dashboard/monitors"))
      return (
        <>
          SYSTEM<span className="text-foreground mx-2">//</span>MONITORS
        </>
      );
    if (pathname.includes("/dashboard/alerts"))
      return (
        <>
          SYSTEM<span className="text-foreground mx-2">//</span>ALERTS
        </>
      );
    if (pathname.includes("/dashboard/settings"))
      return (
        <>
          SYSTEM<span className="text-foreground mx-2">//</span>SETTINGS
        </>
      );
    return (
      <>
        SYSTEM<span className="text-foreground mx-2">//</span>OVERVIEW
      </>
    );
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/20 bg-[#050505]/90 backdrop-blur-md px-3 md:px-8 py-3 md:py-4 relative overflow-hidden">
      {/* Scanline effect on border */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-primary/20">
        <div className="absolute top-0 left-0 h-full w-1/3 bg-primary/50 blur-[2px] animate-scan-fast"></div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 relative z-20 min-w-0 flex-1 md:flex-none">
        {/* Hamburger Menu - Mobile Only */}
        {isMobile && onMenuClick && (
          <button
            onClick={() => {
              trigger("light");
              onMenuClick();
            }}
            className="flex items-center justify-center size-11 border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors shrink-0 active:scale-95"
            aria-label="Open navigation menu"
          >
            <Menu className="size-5 text-primary" />
          </button>
        )}

        <div className="hidden xs:block p-1.5 bg-primary/10 border border-primary/20 rounded-sm shrink-0">
          <Terminal className="size-4 text-primary" />
        </div>
        <h2 className="text-sm md:text-lg font-bold tracking-tighter uppercase font-mono text-primary/90 text-glow-sm truncate min-w-0 pr-2">
          {getTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-2 md:gap-6 relative z-20 shrink-0">
        {/* Search - Desktop Only */}
        <button
          onClick={() => {
            const event = new KeyboardEvent("keydown", {
              key: "k",
              metaKey: true,
              ctrlKey: true,
            });
            document.dispatchEvent(event);
          }}
          className="relative hidden md:flex items-center gap-3 bg-black/50 text-primary font-mono rounded-sm border border-primary/20 hover:border-primary/60 focus:border-primary/60 focus:ring-1 focus:ring-primary/20 w-80 px-4 py-2 transition-all group cursor-pointer"
        >
          <Search className="text-primary/50 size-4 group-hover:text-primary transition-colors" />
          <span className="flex-1 text-left text-sm text-primary/30 group-hover:text-primary/50 transition-colors">
            SEARCH_TARGETS...
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono bg-primary/10 text-primary/60 rounded border border-primary/20">
            <span>⌘</span>
            <span>K</span>
          </kbd>
        </button>

        {/* Add Monitor Button - Hidden on Mobile */}
        <Link
          href="/dashboard/monitors/new"
          className="hidden md:flex items-center justify-center h-9 px-4 bg-primary/10 text-primary text-xs font-mono font-bold uppercase tracking-wider hover:bg-primary/20 transition-all border border-primary/50 hover:border-primary gap-2 group cursor-pointer relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <Plus className="size-4 relative z-10" />
          <span className="relative z-10">Add Monitor</span>
        </Link>

        {/* Mode Toggle - Hidden on Small Mobile */}
        <div className="hidden sm:block">
          <ModeToggle />
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-3 border-l border-primary/20 pl-2 md:pl-6 h-8">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 outline-none group cursor-pointer">
              {/* User Name - Desktop Only */}
              <div className="text-right hidden lg:block">
                <p className="text-xs text-foreground font-mono font-bold uppercase tracking-tight">
                  {session?.user?.name || "OPERATOR"}
                </p>
                <p className="text-[10px] text-primary/60 font-mono tracking-widest text-right">
                  ADMIN_ACCESS
                </p>
              </div>
              {/* Avatar */}
              <div className="size-9 rounded-sm border border-primary/50 p-0.5 relative hover:border-primary transition-colors shrink-0">
                {/* Corner markers for avatar */}
                <div className="absolute -top-px -left-px w-1 h-1 bg-primary"></div>
                <div className="absolute -bottom-px -right-px w-1 h-1 bg-primary"></div>
                <div className="absolute -top-px -right-px w-1 h-1 bg-primary transition-opacity opacity-0 group-hover:opacity-100"></div>
                <div className="absolute -bottom-px -left-px w-1 h-1 bg-primary transition-opacity opacity-0 group-hover:opacity-100"></div>

                <img // eslint-disable-next-line @next/next/no-img-element
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  alt="User profile"
                  src={
                    session?.user?.image ||
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuDxSYTgfX2U4lnnYl1yKNWL9eNJG3Lj1p_plRCe12llLiayEVV3biVu6yC0OGWk3Mti3J0YGrFtTWUwGNJvt6Y4-8l_L8i_N-MjEaZ6JAC8uPa9FJ-Cl8tbFv41OFaIu_4duPeo7UcdgXPXxnHSgArtMEkKZddUpSqnWuI5wzbxkFCrGBvWmTatIm8JIm2KhGv0gNieFcvCO3LdXUbrmfdrMyCTSSXZAR1GeVA5__te0JJ80IJkzNCgXrwfGbJ_gcu_4pyoVHeN6oI7"
                  }
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-[#050505] border border-primary/20 text-foreground font-mono"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs uppercase tracking-widest text-primary/50">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-primary/20" />
                <DropdownMenuItem
                  className="text-xs uppercase tracking-wider focus:bg-primary/10 focus:text-primary cursor-pointer"
                  onClick={() => router.push("/dashboard/settings?tab=general")}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Protocol</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-xs uppercase tracking-wider focus:bg-primary/10 focus:text-primary cursor-pointer"
                  onClick={() => router.push("/dashboard/settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>System Config</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-primary/20" />
              <DropdownMenuItem
                className="text-xs uppercase tracking-wider text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer"
                onClick={async () => {
                  await authClient.signOut();
                  window.location.href = "/login";
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Terminate Session</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
