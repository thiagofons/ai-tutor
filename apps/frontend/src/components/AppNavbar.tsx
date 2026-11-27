import { LogOut, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useLoginStore from "../store/LoginStore";
import useTokenStore from "../store/TokenStore";
import ThemeToggle from "./ThemeToggle";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

const AppNavbar = () => {
  const tokenResponse = useTokenStore((s) => s.tokenResponse);
  const clearTokenResponse = useTokenStore((s) => s.clearTokenResponse);
  const setMsg = useLoginStore((s) => s.setMsg);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearTokenResponse();
    setMsg("Você saiu da sua conta com segurança.", "success");
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6">
      <div className="apple-chrome mx-auto flex w-full max-w-5xl items-center justify-between rounded-2xl px-4 py-2.5 sm:px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] text-white shadow-sm">
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

        <div className="flex items-center gap-2 sm:gap-3">
          {tokenResponse.name && (
            <div className="hidden items-center gap-2.5 rounded-full bg-[var(--surface-segment)] py-1 pr-3.5 pl-1.5 sm:flex">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-[11.5px] font-semibold text-white">
                {getInitials(tokenResponse.name)}
              </span>
              <span className="max-w-[160px] truncate text-[13px] font-medium text-[var(--text-primary)]">
                {tokenResponse.name}
              </span>
            </div>
          )}

          <ThemeToggle />

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Sair da conta"
            className="apple-press inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--surface-hairline)] bg-[var(--surface-input)] px-3.5 py-2 text-[13px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-input-hover)]"
          >
            <LogOut className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;
