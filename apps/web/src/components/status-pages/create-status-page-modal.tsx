"use client";

import { useActionState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createStatusPage } from "@/actions/status-pages";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Globe, Loader2, Link as LinkIcon, Lock } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const initialState = { success: false, error: "" };

export function CreateStatusPageModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createStatusPage, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success("Status page created!");
      onClose();
      if (state.id) {
        router.push(`/dashboard/pages/${state.id}`);
      } else {
        router.refresh();
      }
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, onClose, router]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#050505] border-primary/20 text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-mono uppercase tracking-widest text-primary">
            <Globe className="size-5" /> New Status Page
          </DialogTitle>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-5 mt-4">
          {/* Slug */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
              Slug (URL)
            </label>
            <div className="flex items-center border border-primary/20 bg-secondary/10 rounded-sm">
              <span className="pl-3 text-xs text-muted-foreground font-mono">/status-page/</span>
              <input
                name="slug"
                required
                placeholder="my-company"
                className="flex-1 bg-transparent border-none text-foreground text-sm p-2 font-mono focus:ring-0 placeholder:text-muted-foreground/30 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">
              Public URL: pulseguard.com/status-page/slug
            </p>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
              Page Title
            </label>
            <input
              name="title"
              required
              placeholder="Acme Inc. Status"
              className="w-full bg-secondary/10 border border-primary/20 focus:border-primary/60 text-foreground text-sm rounded-sm p-2 font-mono focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {/* Custom Domain (Optional) */}
          <div className="space-y-1.5 opacity-80 hover:opacity-100 transition-opacity">
            <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono flex items-center gap-2">
              <LinkIcon className="size-3" /> Custom Domain (Optional)
            </label>
            <input
              name="customDomain"
              placeholder="status.example.com"
              className="w-full bg-secondary/10 border border-primary/20 focus:border-primary/60 text-foreground text-sm rounded-sm p-2 font-mono focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {/* Password (Optional) */}
          <div className="space-y-1.5 opacity-80 hover:opacity-100 transition-opacity">
            <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono flex items-center gap-2">
              <Lock className="size-3" /> Password (Optional)
            </label>
            <input
              name="password"
              type="password"
              placeholder="Leave blank for public"
              className="w-full bg-secondary/10 border border-primary/20 focus:border-primary/60 text-foreground text-sm rounded-sm p-2 font-mono focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-primary/20 text-primary/60 hover:text-primary hover:border-primary/50 text-xs font-bold uppercase tracking-wider font-mono transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-black text-xs font-bold uppercase tracking-wider font-mono transition-colors rounded-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isPending && <Loader2 className="size-3 animate-spin" />}
              Create Page
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
