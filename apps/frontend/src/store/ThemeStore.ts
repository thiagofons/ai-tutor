import { create } from "zustand";

export type Theme = "light" | "dark";

const STORAGE_KEY = "ai-tutor-theme";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") {
      return saved;
    }
  } catch {
    // Ignore storage access errors
  }
  return getSystemTheme();
}

function applyThemeToDocument(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const initialTheme = getInitialTheme();
applyThemeToDocument(initialTheme);

const useThemeStore = create<ThemeStore>((set) => ({
  theme: initialTheme,
  toggleTheme: () =>
    set((state) => {
      const next: Theme = state.theme === "dark" ? "light" : "dark";
      applyThemeToDocument(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Ignore storage errors
      }
      return { theme: next };
    }),
  setTheme: (theme) => {
    applyThemeToDocument(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors
    }
    set(() => ({ theme }));
  },
}));

// Continua acompanhando mudanças do sistema enquanto o usuário não escolher manualmente
if (typeof window !== "undefined") {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", (event) => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // Ignore storage errors
    }
    const next: Theme = event.matches ? "dark" : "light";
    applyThemeToDocument(next);
    useThemeStore.setState({ theme: next });
  });
}

export default useThemeStore;
