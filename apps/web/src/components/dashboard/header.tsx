"use client";

import { Search, Plus, Terminal, LogOut, User, Settings } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardHeader() {
  const { data: session } = authClient.useSession();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/20 bg-[#050505]/90 backdrop-blur-md px-8 py-4 relative overflow-hidden">
      {/* Scanline effect on border */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-primary/20">
         <div className="absolute top-0 left-0 h-full w-1/3 bg-primary/50 blur-[2px] animate-scan-fast"></div>
      </div>

      <div className="flex items-center gap-4 relative z-20">
        <div className="p-1.5 bg-primary/10 border border-primary/20 rounded-sm">
            <Terminal className="size-4 text-primary" />
        </div>
        <h2 className="text-lg font-bold tracking-tighter uppercase font-mono text-primary/90 text-glow-sm">
            System<span className="text-foreground mx-2">//</span>Overview
        </h2>
      </div>

      <div className="flex items-center gap-6 relative z-20">
        <label className="relative hidden md:block group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="text-primary/50 size-4 group-focus-within:text-primary transition-colors" />
          </span>
          <input
            className="bg-black/50 text-base text-primary font-mono rounded-sm border border-primary/20 focus:border-primary/60 focus:ring-1 focus:ring-primary/20 w-80 pl-10 py-2 placeholder:text-primary/30 outline-none transition-all"
            placeholder="SEARCH_TARGETS..."
            type="text"
            spellCheck={false}
          />
        </label>

        <button className="flex items-center justify-center h-9 px-4 bg-primary/10 text-primary text-xs font-mono font-bold uppercase tracking-wider hover:bg-primary/20 transition-all border border-primary/50 hover:border-primary gap-2 group cursor-pointer relative overflow-hidden">
             <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <Plus className="size-4 relative z-10" />
            <span className="relative z-10">Add Monitor</span>
        </button>

        <div className="flex items-center gap-3 border-l border-primary/20 pl-6 h-8">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 outline-none group cursor-pointer">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-foreground font-mono font-bold uppercase tracking-tight">{session?.user?.name || "OPERATOR"}</p>
                  <p className="text-[10px] text-primary/60 font-mono tracking-widest text-right">ADMIN_ACCESS</p>
                </div>
                <div className="size-9 rounded-sm border border-primary/50 p-0.5 relative hover:border-primary transition-colors">
                  {/* Corner markers for avatar */}
                  <div className="absolute -top-px -left-px w-1 h-1 bg-primary"></div>
                  <div className="absolute -bottom-px -right-px w-1 h-1 bg-primary"></div>
                  <div className="absolute -top-px -right-px w-1 h-1 bg-primary transition-opacity opacity-0 group-hover:opacity-100"></div>
                  <div className="absolute -bottom-px -left-px w-1 h-1 bg-primary transition-opacity opacity-0 group-hover:opacity-100"></div>
                  
                  <img // eslint-disable-next-line @next/next/no-img-element
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    alt="User profile"
                    src={session?.user?.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuDxSYTgfX2U4lnnYl1yKNWL9eNJG3Lj1p_plRCe12llLiayEVV3biVu6yC0OGWk3Mti3J0YGrFtTWUwGNJvt6Y4-8l_L8i_N-MjEaZ6JAC8uPa9FJ-Cl8tbFv41OFaIu_4duPeo7UcdgXPXxnHSgArtMEkKZddUpSqnWuI5wzbxkFCrGBvWmTatIm8JIm2KhGv0gNieFcvCO3LdXUbrmfdrMyCTSSXZAR1GeVA5__te0JJ80IJkzNCgXrwfGbJ_gcu_4pyoVHeN6oI7"}
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#050505] border border-primary/20 text-foreground font-mono">
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs uppercase tracking-widest text-primary/50">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-primary/20" />
                    <DropdownMenuItem className="text-xs uppercase tracking-wider focus:bg-primary/10 focus:text-primary cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Protocol</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs uppercase tracking-wider focus:bg-primary/10 focus:text-primary cursor-pointer">
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
