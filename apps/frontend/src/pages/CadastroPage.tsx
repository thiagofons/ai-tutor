import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import useCadastrarUsuario from "../hooks/useCadastrarUsuario";
import { ApiError } from "../hooks/useEfetuarLogin";
import useLoginStore from "../store/LoginStore";

const cadastroSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Informe seu nome (mínimo de 2 caracteres)."),
    email: z
      .string()
      .trim()
      .min(1, "Informe seu e-mail.")
      .pipe(z.email("Informe um e-mail válido.")),
    password: z
      .string()
      .min(6, "A senha deve ter pelo menos 6 caracteres."),
    confirmPassword: z.string().min(1, "Confirme sua senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

type CadastroForm = z.infer<typeof cadastroSchema>;

const CadastroPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const setMsg = useLoginStore((s) => s.setMsg);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroForm>({
    resolver: zodResolver(cadastroSchema),
    mode: "onTouched",
  });

  const { mutate: cadastrarUsuario, isPending } = useCadastrarUsuario();

  const onSubmit = ({ name, email, password }: CadastroForm) => {
    setErrorMsg("");
    cadastrarUsuario(
      { name, email, password },
      {
        onSuccess() {
          setMsg(
            "Conta criada com sucesso! Agora faça login para continuar.",
            "success",
          );
          navigate("/login");
        },
        onError(error: unknown) {
          if (error instanceof ApiError) {
            setErrorMsg(error.message);
          } else {
            setErrorMsg("Não foi possível criar sua conta. Tente novamente.");
          }
        },
      },
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="apple-heading text-[26px] font-semibold text-[var(--text-primary)]">
          Criar sua conta
        </h1>
        <p className="mt-1.5 text-[14.5px] text-[var(--text-secondary)]">
          Cadastre-se para enviar dúvidas e receber respostas em tempo real.
        </p>
      </div>

      <AnimatePresence initial={false}>
        {errorMsg && (
          <motion.div
            key={errorMsg}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            role="alert"
            className="mb-5 flex items-start gap-2.5 rounded-2xl border border-red-500/25 bg-red-500/10 px-3.5 py-3 text-[13.5px] font-medium text-red-700 dark:text-red-300"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="cadastro-name"
            className="apple-label mb-1.5 block text-[13px] font-medium text-[var(--text-secondary)]"
          >
            Nome completo
          </label>
          <input
            id="cadastro-name"
            type="text"
            autoComplete="name"
            placeholder="Ex.: Rafaela Fiuza"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
            className="apple-input w-full rounded-xl px-3.5 py-2.5 text-[15px]"
          />
          {errors.name && (
            <p className="mt-1.5 text-[12.5px] font-medium text-[#d70015] dark:text-[#ff453a]">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="cadastro-email"
            className="apple-label mb-1.5 block text-[13px] font-medium text-[var(--text-secondary)]"
          >
            E-mail
          </label>
          <input
            id="cadastro-email"
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
            htmlFor="cadastro-password"
            className="apple-label mb-1.5 block text-[13px] font-medium text-[var(--text-secondary)]"
          >
            Senha
          </label>
          <div className="relative">
            <input
              id="cadastro-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Mínimo de 6 caracteres"
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

        <div>
          <label
            htmlFor="cadastro-confirm"
            className="apple-label mb-1.5 block text-[13px] font-medium text-[var(--text-secondary)]"
          >
            Confirmar senha
          </label>
          <input
            id="cadastro-confirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repita sua senha"
            aria-invalid={Boolean(errors.confirmPassword)}
            {...register("confirmPassword")}
            className="apple-input w-full rounded-xl px-3.5 py-2.5 text-[15px]"
          />
          {errors.confirmPassword && (
            <p className="mt-1.5 text-[12.5px] font-medium text-[#d70015] dark:text-[#ff453a]">
              {errors.confirmPassword.message}
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
              <span>Criando conta...</span>
            </>
          ) : (
            <span>Criar conta</span>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-[13.5px] text-[var(--text-secondary)]">
        Já possui uma conta?{" "}
        <Link
          to="/login"
          className="font-semibold text-[var(--accent)] hover:underline"
        >
          Fazer login
        </Link>
      </p>
    </div>
  );
};

export default CadastroPage;
