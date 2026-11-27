import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import useEfetuarLogin, { ApiError } from "../hooks/useEfetuarLogin";
import type { TokenResponse } from "../interfaces/TokenResponse";
import useLoginStore from "../store/LoginStore";
import useTokenStore from "../store/TokenStore";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .pipe(z.email("Informe um e-mail válido.")),
  password: z.string().min(1, "Informe sua senha."),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LocationState {
  destino?: string;
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const setTokenResponse = useTokenStore((s) => s.setTokenResponse);
  const clearTokenResponse = useTokenStore((s) => s.clearTokenResponse);
  const msg = useLoginStore((s) => s.msg);
  const msgType = useLoginStore((s) => s.msgType);
  const setMsg = useLoginStore((s) => s.setMsg);
  const clearMsg = useLoginStore((s) => s.clearMsg);

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  useEffect(() => {
    clearTokenResponse();
    return () => {
      clearMsg();
    };
  }, [clearTokenResponse, clearMsg]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const { mutate: efetuarLogin, isPending } = useEfetuarLogin();

  const onSubmit = ({ email, password }: LoginForm) => {
    clearMsg();
    efetuarLogin(
      { email, password },
      {
        onSuccess(tokenResponse: TokenResponse) {
          setTokenResponse(tokenResponse);
          navigate(state?.destino || "/tutor", { replace: true });
        },
        onError(error: unknown) {
          if (error instanceof ApiError) {
            setMsg(error.message, "error");
          } else {
            setMsg(
              "Não foi possível efetuar o login. Tente novamente em instantes.",
              "error",
            );
          }
        },
      },
    );
  };

  const feedbackStyle =
    msgType === "success"
      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : "border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300";

  return (
    <div>
      <div className="mb-6">
        <h1 className="apple-heading text-[26px] font-semibold text-[var(--text-primary)]">
          Bem-vindo de volta
        </h1>
        <p className="mt-1.5 text-[14.5px] text-[var(--text-secondary)]">
          Entre com sua conta para conversar com o Tutor de IA.
        </p>
      </div>

      <AnimatePresence initial={false}>
        {msg && (
          <motion.div
            key={msg}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            role="alert"
            className={`mb-5 flex items-start gap-2.5 rounded-2xl border px-3.5 py-3 text-[13.5px] font-medium ${feedbackStyle}`}
          >
            {msgType === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span>{msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="login-email"
            className="apple-label mb-1.5 block text-[13px] font-medium text-[var(--text-secondary)]"
          >
            E-mail
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="nome@id.uff.br"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
            className="apple-input w-full rounded-xl px-3.5 py-2.5 text-[15px]"
          />
          {errors.email && (
            <p className="mt-1.5 text-[12.5px] font-medium text-[#d70015] dark:text-[#ff453a]">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="apple-label mb-1.5 block text-[13px] font-medium text-[var(--text-secondary)]"
          >
            Senha
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Sua senha"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
              className="apple-input w-full rounded-xl py-2.5 pr-11 pl-3.5 text-[15px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="apple-press absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-[12.5px] font-medium text-[#d70015] dark:text-[#ff453a]">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="apple-press mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--accent)] py-2.5 text-[15px] font-semibold text-white hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-65"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Entrando...</span>
            </>
          ) : (
            <span>Entrar</span>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-[13.5px] text-[var(--text-secondary)]">
        Ainda não tem uma conta?{" "}
        <Link
          to="/cadastro"
          className="font-semibold text-[var(--accent)] hover:underline"
        >
          Criar conta
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
