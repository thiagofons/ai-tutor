import { Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useOutlet } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

const SPRING_TRANSITION = {
  type: "spring" as const,
  bounce: 0,
  duration: 0.36,
};

const panelVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction * 20,
    filter: "blur(4px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -20,
    filter: "blur(4px)",
  }),
};

const AuthLayout = () => {
  const { pathname } = useLocation();
  const outlet = useOutlet();
  const mode = pathname.startsWith("/cadastro") ? "cadastro" : "login";

  // Direção espacial consistente (Apple Design §7):
  // Entrar (esquerda) -> Criar conta (direita) = +1
  // Criar conta (direita) -> Entrar (esquerda) = -1
  const direction = mode === "cadastro" ? 1 : -1;

  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | "auto">("auto");

  // Mede a altura real do formulário ativo sempre que ele muda (troca de aba, mensagens de erro, validação inline)
  useLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const updateHeight = () => {
      const nextHeight = node.getBoundingClientRect().height;
      if (nextHeight > 0) {
        setContentHeight(nextHeight);
      }
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);

    return () => observer.disconnect();
  }, [mode]);

  // Evita animação de altura na primeira renderização da página
  const [enableHeightAnimation, setEnableHeightAnimation] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setEnableHeightAnimation(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="apple-canvas relative flex min-h-screen flex-col justify-between px-4 py-6 sm:px-6">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] text-white shadow-sm transition-colors duration-200">
            <Sparkles className="h-4 w-4" strokeWidth={2.2} />
          </div>
          <div className="flex flex-col">
            <span className="apple-heading text-[15px] font-semibold text-[var(--text-primary)]">
              Tutor IA
            </span>
            <span className="apple-label text-[11px] font-medium text-[var(--text-secondary)]">
              Ciência da Computação
            </span>
          </div>
        </div>

        <ThemeToggle />
      </header>

      <main className="mx-auto my-8 flex w-full max-w-[420px] flex-1 flex-col justify-center">
        <section className="apple-glass rounded-[28px] p-7 sm:p-8">
          {/* Segmented Control estilo iOS */}
          <nav
            aria-label="Alternar entre entrar e criar conta"
            className="apple-segment mb-7 grid grid-cols-2 rounded-xl p-1"
          >
            <Link
              to="/login"
              className={`apple-press relative z-10 flex items-center justify-center rounded-[10px] py-2 text-[13.5px] font-semibold ${
                mode === "login"
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {mode === "login" && (
                <motion.span
                  layoutId="auth-segment-pill"
                  transition={SPRING_TRANSITION}
                  className="apple-segment-pill absolute inset-0 -z-10 rounded-[10px]"
                />
              )}
              Entrar
            </Link>

            <Link
              to="/cadastro"
              className={`apple-press relative z-10 flex items-center justify-center rounded-[10px] py-2 text-[13.5px] font-semibold ${
                mode === "cadastro"
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {mode === "cadastro" && (
                <motion.span
                  layoutId="auth-segment-pill"
                  transition={SPRING_TRANSITION}
                  className="apple-segment-pill absolute inset-0 -z-10 rounded-[10px]"
                />
              )}
              Criar conta
            </Link>
          </nav>

          {/* Container com altura animada via spring + crossfade simultâneo (mode="popLayout") */}
          <motion.div
            animate={{ height: contentHeight }}
            transition={
              enableHeightAnimation && typeof contentHeight === "number"
                ? SPRING_TRANSITION
                : { duration: 0 }
            }
            className="relative -mx-1.5 -my-1 overflow-hidden"
          >
            <div ref={contentRef} className="relative px-1.5 py-1">
              <AnimatePresence
                mode="popLayout"
                initial={false}
                custom={direction}
              >
                <motion.div
                  key={mode}
                  custom={direction}
                  variants={panelVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={SPRING_TRANSITION}
                  className="w-full"
                >
                  {outlet}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-5xl text-center text-[12px] text-[var(--text-tertiary)]">
        Sistema de Tutoria Assíncrono com IA · Desenvolvimento Web
      </footer>
    </div>
  );
};

export default AuthLayout;
