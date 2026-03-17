import { create } from "zustand";
import { UserType } from "@/app/lib/definitions";

interface AppStore {
  // Auth
  user: UserType | null;
  setUser: (user: UserType) => void;

  // UI State
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Table Filters
  tableFilters: Record<string, any>;
  setTableFilter: (key: string, value: any) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  theme: "light",
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),

  tableFilters: {},
  setTableFilter: (key, value) =>
    set((state) => ({
      tableFilters: { ...state.tableFilters, [key]: value },
    })),
}));
