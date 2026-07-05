import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: true,
      toggle: () => {
        const next = !get().isDark;
        set({ isDark: next });
        document.body.classList.toggle("light-mode", !next);
      },
    }),
    {
      name: "comfort_taxi_theme",
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.body.classList.toggle("light-mode", !state.isDark);
        }
      },
    }
  )
);
