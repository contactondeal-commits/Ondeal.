"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchHistoryState {
  history: string[];
  addSearch: (query: string) => void;
  clearHistory: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set, get) => ({
      history: [],
      addSearch: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        const withoutDupe = get().history.filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
        set({ history: [trimmed, ...withoutDupe].slice(0, 8) });
      },
      clearHistory: () => set({ history: [] }),
    }),
    { name: "ondeal-search-history" }
  )
);
