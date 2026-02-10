"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useCommandPalette } from "./use-command-palette";
import { ConfirmationDialog } from "./confirmation-dialog";
import { cn } from "@/lib/utils";
import { Search, Loader2 } from "lucide-react";

// Import command groups
import { NavigationCommands } from "./command-groups/navigation-commands";
import { MonitorCommands } from "./command-groups/monitor-commands";
import { CreationCommands } from "./command-groups/creation-commands";
import { ActionCommands } from "./command-groups/action-commands";

export function CommandPalette() {
  const {
    isOpen,
    close,
    pendingAction,
    confirmationMessage,
    executePendingAction,
    cancelPendingAction,
  } = useCommandPalette();
  const [search, setSearch] = useState("");

  // Handle keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        useCommandPalette.getState().toggle();
      }

      // ESC to close or cancel confirmation
      if (e.key === "Escape") {
        if (pendingAction) {
          cancelPendingAction();
        } else {
          close();
        }
      }

      // Enter to confirm
      if (e.key === "Enter" && pendingAction) {
        e.preventDefault();
        executePendingAction();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [close, pendingAction, cancelPendingAction, executePendingAction]);

  // Reset search when closing
  useEffect(() => {
    if (!isOpen) {
      setSearch("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={close} />

      {/* Command Palette */}
      <Command
        className={cn(
          "relative w-full max-w-2xl mx-4",
          "bg-background/95 backdrop-blur-xl",
          "border border-border rounded-xl shadow-2xl",
          "overflow-hidden",
          "animate-in fade-in-0 zoom-in-95",
        )}
        shouldFilter={!pendingAction} // Disable filtering during confirmation
      >
        {!pendingAction ? (
          <>
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Command.Input
                value={search}
                onValueChange={setSearch}
                placeholder="Type a command or search..."
                className={cn(
                  "flex-1 bg-transparent outline-none",
                  "text-sm text-foreground placeholder:text-muted-foreground",
                )}
              />
              <kbd className="hidden sm:inline-flex px-2 py-1 text-xs font-mono bg-muted text-muted-foreground rounded border border-border">
                ESC
              </kbd>
            </div>

            {/* Command List */}
            <Command.List className="max-h-[60vh] overflow-y-auto p-2">
              <Command.Empty className="py-12 text-center text-sm text-muted-foreground">
                No results found.
              </Command.Empty>

              {/* Navigation Commands */}
              <NavigationCommands />

              {/* Monitor Commands */}
              <MonitorCommands />

              {/* Creation Commands */}
              <CreationCommands />

              {/* Action Commands */}
              <ActionCommands />
            </Command.List>
          </>
        ) : (
          // Confirmation Dialog
          <ConfirmationDialog
            message={confirmationMessage || "Are you sure?"}
            onConfirm={async () => {
              await executePendingAction();
              close();
            }}
            onCancel={cancelPendingAction}
          />
        )}
      </Command>
    </div>
  );
}
