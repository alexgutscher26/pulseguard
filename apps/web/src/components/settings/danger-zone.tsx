"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * Renders a Danger Zone section for account deletion with confirmation dialog.
 */
export function DangerZone() {
  return (
    <section className="bg-black/40 border border-red-500/30 relative overflow-hidden backdrop-blur-sm hover:border-red-500/60 transition-all">
      <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-sm">
            <AlertTriangle className="size-6 text-red-500" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-red-500 font-mono uppercase tracking-tight">
              Danger Zone
            </h3>
            <p className="text-xs text-red-500/70 font-mono">
              Permanently delete account and all associated data. This action is
              irreversible.
            </p>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <button className="bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 text-xs font-bold px-4 py-2 uppercase tracking-wider border border-red-500/30 hover:border-red-500/60 transition-all font-mono whitespace-nowrap">
              Delete Account
            </button>
          </DialogTrigger>
          <DialogContent className="bg-black/90 border-red-500/30 sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-red-500 font-mono uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="size-5" />
                Confirm Deletion
              </DialogTitle>
              <DialogDescription className="text-primary/70 font-mono text-xs">
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <p className="text-primary/50 text-xs font-mono border-l-2 border-red-500/50 pl-3">
                All monitors, metrics, and incident history will be erased
                immediately.
              </p>
            </div>
            <DialogFooter>
              <DeleteConfirmButton />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

/**
 * Renders a button that confirms the deletion of a user account.
 *
 * The component manages its own state to indicate whether a deletion is in progress.
 * Upon clicking the button, it triggers the handleDelete function, which attempts to
 * delete the user account using the authClient. If successful, it navigates to the
 * login page; if it fails, it displays an error message and resets the deletion state.
 */
function DeleteConfirmButton() {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  /**
   * Handles the deletion of a user account.
   */
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await authClient.deleteUser({
        callbackURL: "/login",
      });
      toast.success("Account deleted successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to delete account");
      console.error(error);
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}
      disabled={isDeleting}
      className="bg-red-500 hover:bg-red-600 font-mono uppercase tracking-widest"
    >
      {isDeleting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Deleting...
        </>
      ) : (
        "Confirm Delete"
      )}
    </Button>
  );
}
