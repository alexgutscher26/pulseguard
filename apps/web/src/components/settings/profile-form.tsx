"use client";

import { Camera, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useUploadThing } from "@/lib/uploadthing";
import { useRef, useState } from "react";
import { toast } from "sonner";

export function ProfileForm() {
  const { data: session } = authClient.useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [optimisticImage, setOptimisticImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Sync name from session
  if (session?.user?.name && !name) {
    setName(session.user.name);
  }

  const handleSave = async () => {
    setIsPending(true);
    try {
      await authClient.updateUser({
        name: name,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!session?.user?.image && !optimisticImage) return;

    setIsRemoving(true);
    try {
      await authClient.updateUser({
        image: "", // Clear the image
      });
      setOptimisticImage(null);
      toast.success("Profile image removed");
    } catch (error) {
      toast.error("Failed to remove profile image");
      console.error(error);
    } finally {
      setIsRemoving(false);
    }
  };

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (res) => {
      if (res && res[0]) {
        const newImageUrl = res[0].url;
        setOptimisticImage(newImageUrl);
        try {
          await authClient.updateUser({
            image: newImageUrl,
          });
          toast.success("Profile image updated successfully");
        } catch (error) {
          toast.error("Failed to update profile image");
          console.error(error);
        }
      }
    },
    onUploadError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      toast.error("File size must be less than 4MB");
      return;
    }

    await startUpload([file]);
  };

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
                  optimisticImage ||
                  session?.user?.image ||
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuDxSYTgfX2U4lnnYl1yKNWL9eNJG3Lj1p_plRCe12llLiayEVV3biVu6yC0OGWk3Mti3J0YGrFtTWUwGNJvt6Y4-8l_L8i_N-MjEaZ6JAC8uPa9FJ-Cl8tbFv41OFaIu_4duPeo7UcdgXPXxnHSgArtMEkKZddUpSqnWuI5wzbxkFCrGBvWmTatIm8JIm2KhGv0gNieFcvCO3LdXUbrmfdrMyCTSSXZAR1GeVA5__te0JJ80IJkzNCgXrwfGbJ_gcu_4pyoVHeN6oI7"
                }
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                  <Loader2 className="animate-spin text-primary size-8" />
                </div>
              )}
              {/* Crosshairs */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-2 bg-primary/50"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-2 bg-primary/50"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-px w-2 bg-primary/50"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-px w-2 bg-primary/50"></div>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity border border-primary/50 disabled:cursor-not-allowed"
            >
              <Camera className="text-primary size-6" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider border border-primary/20 hover:border-primary/50 transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload New
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg, image/gif"
                onChange={handleFileSelect}
              />
              <button
                onClick={handleRemoveImage}
                disabled={isRemoving || (!session?.user?.image && !optimisticImage)}
                className="text-red-500 hover:bg-red-500/10 text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider border border-transparent hover:border-red-500/20 transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRemoving ? "Removing..." : "Remove"}
              </button>
            </div>
            <p className="text-[10px] text-primary/40 font-mono">
              ACCEPTED: JPG, GIF, PNG. MAX: 4MB
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Operator Name"
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

        <div className="flex justify-end pt-4 border-t border-primary/10">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="bg-primary hover:bg-primary/90 text-black font-bold text-xs px-6 py-2.5 uppercase tracking-widest transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </section>
  );
}
