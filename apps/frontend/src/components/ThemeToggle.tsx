import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import useThemeStore from "../store/ThemeStore";

const ThemeToggle = () => {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      title={isDark ? "Alternar para modo claro" : "Alternar para modo escuro"}
      className="apple-chrome apple-press inline-flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-medium text-[var(--text-primary)] select-none"
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="sun"
              initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
              transition={{ type: "spring", bounce: 0, duration: 0.28 }}
              className="flex items-center justify-center"
            >
              <Sun className="h-4 w-4 text-amber-400" strokeWidth={2} />
            </motion.span>
          ) : (
            <motion.span
              key="moon"
              initial={{ opacity: 0, rotate: 45, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -45, scale: 0.7 }}
              transition={{ type: "spring", bounce: 0, duration: 0.28 }}
              className="flex items-center justify-center"
            >
              <Moon className="h-4 w-4 text-[var(--text-secondary)]" strokeWidth={2} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span className="apple-label">{isDark ? "Modo claro" : "Modo escuro"}</span>
    </button>
  );
};

export default ThemeToggle;
