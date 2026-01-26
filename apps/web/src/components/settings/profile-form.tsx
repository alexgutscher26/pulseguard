"use client";

import { Camera } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function ProfileForm() {
  const { data: session } = authClient.useSession();

  return (
    <section className="bg-black/40 border border-primary/20 relative overflow-hidden backdrop-blur-sm group hover:border-primary/40 transition-all">
      {/* Corner Decor */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/30 group-hover:border-primary/60 transition-colors"></div>

      <div className="p-6 border-b border-primary/20 bg-primary/5">
        <h3 className="text-lg font-bold text-foreground font-mono uppercase tracking-tight">
          Profile Information
        </h3>
        <p className="text-xs text-primary/60 font-mono">
          Update operator identity and credentials
        </p>
      </div>

      <div className="p-6 flex flex-col gap-6">
        <div className="flex items-center gap-6">
          <div className="relative group/avatar cursor-pointer">
            <div className="size-20 bg-black border-2 border-primary/20 p-1 relative">
              <img
                alt="Avatar"
                className="w-full h-full object-cover opacity-80 group-hover/avatar:opacity-100 transition-opacity"
                src={
                  session?.user?.image ||
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuDxSYTgfX2U4lnnYl1yKNWL9eNJG3Lj1p_plRCe12llLiayEVV3biVu6yC0OGWk3Mti3J0YGrFtTWUwGNJvt6Y4-8l_L8i_N-MjEaZ6JAC8uPa9FJ-Cl8tbFv41OFaIu_4duPeo7UcdgXPXxnHSgArtMEkKZddUpSqnWuI5wzbxkFCrGBvWmTatIm8JIm2KhGv0gNieFcvCO3LdXUbrmfdrMyCTSSXZAR1GeVA5__te0JJ80IJkzNCgXrwfGbJ_gcu_4pyoVHeN6oI7"
                }
              />
              {/* Crosshairs */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-primary/50"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-primary/50"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] w-2 bg-primary/50"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[1px] w-2 bg-primary/50"></div>
            </div>

            <button className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity border border-primary/50">
              <Camera className="text-primary size-6" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <button className="bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider border border-primary/20 hover:border-primary/50 transition-all font-mono">
                Upload New
              </button>
              <button className="text-red-500 hover:bg-red-500/10 text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider border border-transparent hover:border-red-500/20 transition-all font-mono">
                Remove
              </button>
            </div>
            <p className="text-[10px] text-primary/40 font-mono">
              ACCEPTED: JPG, GIF, PNG. MAX: 800KB
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
              Full Name
            </label>
            <input
              className="bg-black/50 border border-primary/20 focus:border-primary/60 text-primary text-sm rounded-sm p-2.5 font-mono placeholder:text-primary/20 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
              type="text"
              defaultValue={session?.user?.name || "Alex Mitchell"}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
              Email Protocol
            </label>
            <input
              className="bg-black/50 border border-primary/20 focus:border-primary/60 text-primary text-sm rounded-sm p-2.5 font-mono placeholder:text-primary/20 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
              type="email"
              defaultValue={session?.user?.email || "alex@pulseguard.io"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
