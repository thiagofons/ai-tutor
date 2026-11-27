import { AlertTriangle, ArrowLeft } from "lucide-react";
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

const ErrorPage = () => {
  const error = useRouteError();

  let title = "Algo saiu do esperado";
  let description = "Ocorreu um erro inesperado ao carregar esta página.";

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? "Página não encontrada" : `Erro ${error.status}`;
    description =
      error.status === 404
        ? "O endereço acessado não existe nesta aplicação."
        : error.statusText || description;
  } else if (error instanceof Error) {
    description = error.message;
  }

  return (
    <div className="apple-canvas flex min-h-screen flex-col justify-between px-4 py-6 sm:px-6">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-end">
        <ThemeToggle />
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <section className="apple-glass rounded-[28px] p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/12 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h1 className="apple-heading text-[24px] font-semibold text-[var(--text-primary)]">
            {title}
          </h1>
          <p className="mt-2 text-[14.5px] text-[var(--text-secondary)]">
            {description}
          </p>
          <Link
            to="/login"
            className="apple-press mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-[14.5px] font-semibold text-white hover:bg-[var(--accent-hover)]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para o login</span>
          </Link>
        </section>
      </main>

      <div />
    </div>
  );
};

export default ErrorPage;
