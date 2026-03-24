"use client";

import {
  Search,
  Plus,
  LogOut,
  User,
  Settings,
  Menu,
} from "lucide-react";
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

export function DashboardHeader({
  onMenuClick,
}: { onMenuClick?: () => void } = {}) {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMobile();
  const { trigger } = useHaptic();

  const getTitle = () => {
    if (pathname.includes("/dashboard/monitors")) return "Monitors";
    if (pathname.includes("/dashboard/alerts")) return "Alerts";
    if (pathname.includes("/dashboard/settings")) return "Settings";
    return "Overview";
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md px-4 md:px-8 py-4 overflow-hidden">
      <div className="flex items-center gap-2 md:gap-4 relative z-20 min-w-0 flex-1 md:flex-none">
        {/* Hamburger Menu - Mobile Only */}
        {isMobile && onMenuClick && (
          <button
            onClick={() => {
              trigger("light");
              onMenuClick();
            }}
            className="flex items-center justify-center size-10 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors shrink-0 active:scale-95"
            aria-label="Open navigation menu"
          >
            <Menu className="size-5 text-foreground" />
          </button>
        )}

        <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground truncate min-w-0 pr-2">
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
          className="relative hidden md:flex items-center gap-3 bg-white/5 text-foreground rounded-full border border-white/5 hover:border-white/10 focus:border-white/20 focus:ring-1 focus:ring-primary/20 w-72 px-4 py-2 transition-all group cursor-pointer"
        >
          <Search className="text-muted-foreground size-4 group-hover:text-foreground transition-colors" />
          <span className="flex-1 text-left text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            Search...
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-white/10 text-muted-foreground rounded-full">
            <span>⌘</span>
            <span>K</span>
          </kbd>
        </button>

        {/* Add Monitor Button - Hidden on Mobile */}
        <Link
          href="/dashboard/monitors/new"
          className="hidden md:flex items-center justify-center h-9 px-4 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:bg-primary/90 transition-colors gap-2 cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Add Monitor</span>
        </Link>

        {/* Mode Toggle - Hidden on Small Mobile */}
        <div className="hidden sm:block text-muted-foreground hover:text-foreground">
          <ModeToggle />
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-3 border-l border-white/10 pl-2 md:pl-6 h-8">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 outline-none group cursor-pointer">
              {/* User Name - Desktop Only */}
              <div className="text-right hidden lg:block">
                <p className="text-sm text-foreground font-semibold">
                  {session?.user?.name || "Operator"}
                </p>
                <p className="text-xs text-muted-foreground">
                   {session?.user?.email || "admin@pulseguard.io"}
                </p>
              </div>
              {/* Avatar */}
              <div className="size-9 rounded-full overflow-hidden border border-white/10 relative hover:border-white/20 transition-colors shrink-0">
                <img // eslint-disable-next-line @next/next/no-img-element
                  className="w-full h-full object-cover transition-opacity"
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
              className="w-56 bg-[#0a0a0a] border border-white/5 text-foreground rounded-2xl p-1"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem
                  className="text-sm font-medium focus:bg-white/5 focus:text-foreground cursor-pointer rounded-xl"
                  onClick={() => router.push("/dashboard/settings?tab=general")}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-sm font-medium focus:bg-white/5 focus:text-foreground cursor-pointer rounded-xl"
                  onClick={() => router.push("/dashboard/settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem
                className="text-sm font-medium text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer rounded-xl"
                onClick={async () => {
                  await authClient.signOut();
                  window.location.href = "/login";
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
