import { create } from "zustand";

export type AppUser = {
  name: string;
  lastname: string;
  role: string;
  delegationName: string;
};

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt?: string;
};

type AppStore = {
  user: AppUser | null;
  setUser: (user: AppUser) => void;
  clearUser: () => void;

  notifications: AppNotification[];
  setNotifications: (notifications: AppNotification[]) => void;
  markNotificationAsRead: (id: string) => void;

  theme: "light" | "dark";
  toggleTheme: () => void;

  tableFilters: Record<string, any>;
  setTableFilter: (key: string, value: any) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null, notifications: [] }),

  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  markNotificationAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    })),

  theme: "light",
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),

  tableFilters: {},
  setTableFilter: (key, value) =>
    set((state) => ({
      tableFilters: { ...state.tableFilters, [key]: value },
    })),
}));
