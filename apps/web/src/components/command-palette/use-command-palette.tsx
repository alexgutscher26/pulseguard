"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface RecentCommand {
  id: string;
  label: string;
}

interface CommandPaletteStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;

  // Recent commands history
  recentCommands: RecentCommand[];
  addCommandToHistory: (id: string, label: string) => void;

  // Confirmation state for destructive actions
  pendingAction: (() => Promise<void>) | null;
  confirmationMessage: string | null;
  setPendingAction: (
    action: (() => Promise<void>) | null,
    message?: string,
  ) => void;
  executePendingAction: () => Promise<void>;
  cancelPendingAction: () => void;
}

export const useCommandPalette = create<CommandPaletteStore>()(
  persist(
    (set, get) => ({
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () =>
        set({ isOpen: false, pendingAction: null, confirmationMessage: null }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),

      // History management
      recentCommands: [],
      addCommandToHistory: (id, label) => {
        const { recentCommands } = get();
        // Remove if existing to move it to top
        const filtered = recentCommands.filter((cmd) => cmd.id !== id);
        // Keep last 10
        const updated = [{ id, label }, ...filtered].slice(0, 10);
        set({ recentCommands: updated });
      },

      pendingAction: null,
      confirmationMessage: null,

      setPendingAction: (
        action,
        message = "Are you sure you want to perform this action?",
      ) => {
        set({ pendingAction: action, confirmationMessage: message });
      },

      executePendingAction: async () => {
        const { pendingAction } = get();
        if (pendingAction) {
          await pendingAction();
          set({ pendingAction: null, confirmationMessage: null });
        }
      },

      cancelPendingAction: () => {
        set({ pendingAction: null, confirmationMessage: null });
      },
    }),
    {
      name: "pulseguard-command-palette-history",
      storage: createJSONStorage(() => localStorage),
      // Only persist history, not UI state
      partialize: (state) => ({
        recentCommands: state.recentCommands,
      }) as any,
    },
  ),
);

// Hook for keyboard shortcut
export function useCommandPaletteKeyboard() {
  const { toggle } = useCommandPalette();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (typeof window === "undefined") return;
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      toggle();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }
}
