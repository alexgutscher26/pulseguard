"use client";

import { create } from "zustand";

interface TerminalStore {
  isTerminalMode: boolean;
  toggleTerminalMode: () => void;
  setTerminalMode: (val: boolean) => void;
}

export const useTerminalStore = create<TerminalStore>((set) => ({
  isTerminalMode: false,
  toggleTerminalMode: () => set((state) => ({ isTerminalMode: !state.isTerminalMode })),
  setTerminalMode: (val) => set({ isTerminalMode: val }),
}));
