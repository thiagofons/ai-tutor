import {
  AlertCircle,
  ArrowUp,
  Check,
  Copy,
  Loader2,
  Radio,
  RotateCcw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import MessageContent from "../components/MessageContent";
import useTutorStream from "../hooks/useTutorStream";
import type { TutorTurn } from "../interfaces/Tutor";
import useTokenStore from "../store/TokenStore";

const SUGGESTED_QUESTIONS = [
  "O que é escopo léxico e qual a diferença para escopo dinâmico?",
  "Qual a diferença entre processos e threads no sistema operacional?",
  "Como funcionam filas assíncronas com RabbitMQ em sistemas distribuídos?",
  "Explique a diferença entre SSE (Server-Sent Events) e WebSocket.",
];

const SPRING_TRANSITION = {
  type: "spring" as const,
  bounce: 0,
  duration: 0.36,
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface TurnCardProps {
  turn: TutorTurn;
  onRetry: (query: string, turnId: string) => void;
}

const TurnCard = ({ turn, onRetry }: TurnCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!turn.answer) return;
    try {
      await navigator.clipboard.writeText(turn.answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={SPRING_TRANSITION}
      className="space-y-3"
    >
      {/* Pergunta do aluno */}
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-[22px] rounded-br-md bg-[var(--accent)] px-4 py-3 text-[15px] leading-relaxed text-white shadow-sm sm:max-w-[75%]">
          <p className="whitespace-pre-wrap">{turn.query}</p>
          <span className="mt-1 block text-right text-[11px] text-white/75">
            {formatTime(turn.createdAt)}
          </span>
        </div>
      </div>

      {/* Resposta do Tutor IA */}
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/12 text-[var(--accent)]">
          <Sparkles className="h-4 w-4" strokeWidth={2.1} />
        </div>

        <div className="apple-glass min-w-0 flex-1 rounded-[22px] rounded-tl-md p-4 sm:p-5">
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="apple-heading text-[13.5px] font-semibold text-[var(--text-primary)]">
                Tutor IA
              </span>

              {turn.status === "enqueuing" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-segment)] px-2.5 py-0.5 text-[11.5px] font-medium text-[var(--text-secondary)]">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Enviando para a fila...
                </span>
              )}

              {turn.status === "streaming" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)]/12 px-2.5 py-0.5 text-[11.5px] font-medium text-[var(--accent)]">
                  <Radio className="h-3 w-3 animate-pulse" />
                  Processando na IA · SSE ativo
                </span>
              )}

              {turn.status === "completed" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2.5 py-0.5 text-[11.5px] font-medium text-emerald-700 dark:text-emerald-300">
                  <Check className="h-3 w-3" />
                  Respondido
                </span>
              )}

              {turn.status === "error" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/12 px-2.5 py-0.5 text-[11.5px] font-medium text-red-700 dark:text-red-300">
                  <AlertCircle className="h-3 w-3" />
                  Falha no envio
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {turn.jobId && (
                <span
                  title={`Job ID: ${turn.jobId}`}
                  className="hidden font-mono text-[11px] text-[var(--text-tertiary)] sm:inline"
                >
                  #{turn.jobId.slice(0, 8)}
                </span>
              )}

              {turn.status === "completed" && turn.answer && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="apple-press inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-[12px] font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-segment)] hover:text-[var(--text-primary)]"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {(turn.status === "enqueuing" || turn.status === "streaming") && (
            <div className="space-y-2.5 py-1">
              <p className="text-[14px] text-[var(--text-secondary)]">
                {turn.status === "enqueuing"
                  ? "Publicando sua dúvida na fila do RabbitMQ..."
                  : "Aguardando o Worker consultar o modelo via Spring AI e devolver pelo canal SSE..."}
              </p>
              <div className="space-y-2 pt-1">
                <div className="h-3 w-5/6 animate-pulse rounded-full bg-[var(--surface-segment)]" />
                <div className="h-3 w-2/3 animate-pulse rounded-full bg-[var(--surface-segment)]" />
              </div>
            </div>
          )}

          {turn.status === "completed" && turn.answer && (
            <MessageContent text={turn.answer} />
          )}

          {turn.status === "error" && (
            <div className="space-y-3">
              <p className="text-[14px] text-red-700 dark:text-red-300">
                {turn.errorMessage ||
                  "Não foi possível concluir sua solicitação."}
              </p>
              <button
                type="button"
                onClick={() => onRetry(turn.query, turn.id)}
                className="apple-press inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[var(--surface-segment)] px-3.5 py-2 text-[13px] font-semibold text-[var(--text-primary)] hover:opacity-85"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Tentar novamente</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
};

const TutorPage = () => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const tokenResponse = useTokenStore((s) => s.tokenResponse);
  const firstName = tokenResponse.name.trim().split(/\s+/)[0] || "estudante";

  const { turns, activeCount, sendQuestion, clearHistory } = useTutorStream();

  // Ajusta a altura do textarea conforme o usuário digita
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [input]);

  // Rola suavemente até a última interação quando chega nova pergunta ou resposta
  useEffect(() => {
    if (turns.length === 0) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns]);

  const handleSubmit = (event?: FormEvent) => {
    event?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");
    void sendQuestion(trimmed);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (question: string) => {
    void sendQuestion(question);
    textareaRef.current?.focus();
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
      {/* Área de conversa com padding inferior confortável para nunca ficar atrás do input */}
      <div className="flex flex-1 flex-col pb-24">
        {turns.length === 0 ? (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING_TRANSITION}
            className="my-auto py-8 text-center"
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent)]/12 text-[var(--accent)]">
              <Sparkles className="h-7 w-7" strokeWidth={1.9} />
            </div>

            <h1 className="apple-heading text-[28px] font-semibold text-[var(--text-primary)] sm:text-[32px]">
              Olá, {firstName}. Qual é a sua dúvida?
            </h1>
            <p className="mx-auto mt-2.5 max-w-lg text-[15px] text-[var(--text-secondary)]">
              Envie qualquer pergunta de Ciência da Computação. O pedido passa
              pela fila RabbitMQ, é respondido pelo Worker com Spring AI e volta
              aqui em tempo real via SSE.
            </p>

            <div className="mt-8 grid gap-2.5 text-left sm:grid-cols-2">
              {SUGGESTED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => handleSuggestionClick(question)}
                  className="apple-glass apple-press cursor-pointer rounded-2xl p-4 text-[13.5px] leading-snug font-medium text-[var(--text-primary)] hover:border-[var(--accent)]/40"
                >
                  {question}
                </button>
              ))}
            </div>
          </motion.section>
        ) : (
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between">
              <span className="apple-label text-[12.5px] font-medium text-[var(--text-secondary)]">
                {activeCount > 0
                  ? `${activeCount} ${activeCount === 1 ? "pergunta em andamento" : "perguntas em andamento"}`
                  : `${turns.length} ${turns.length === 1 ? "interação nesta sessão" : "interações nesta sessão"}`}
              </span>

              <button
                type="button"
                onClick={clearHistory}
                className="apple-press inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-segment)] hover:text-[var(--text-primary)]"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Limpar sessão</span>
              </button>
            </div>

            <AnimatePresence initial={false}>
              {turns.map((turn) => (
                <TurnCard
                  key={turn.id}
                  turn={turn}
                  onRetry={(q, id) => void sendQuestion(q, id)}
                />
              ))}
            </AnimatePresence>
            <div ref={bottomRef} className="h-2 scroll-mb-36" />
          </div>
        )}
      </div>

      {/* Campo de envio fixo na base com degradê suave (scroll edge effect) */}
      <div
        className="pointer-events-none sticky bottom-0 z-20 -mx-4 mt-auto px-4 pt-10 pb-4 sm:-mx-6 sm:px-6"
        style={{
          background:
            "linear-gradient(to top, var(--surface-canvas) 62%, transparent 100%)",
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="apple-chrome pointer-events-auto flex items-end gap-2 rounded-[24px] p-2 pl-4"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua dúvida de Ciência da Computação..."
            aria-label="Digite sua dúvida para o Tutor IA"
            className="max-h-[180px] min-h-[40px] flex-1 resize-none bg-transparent py-2 text-[15px] leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
          />

          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Enviar pergunta"
            className="apple-press flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp className="h-5 w-5" strokeWidth={2.3} />
          </button>
        </form>
        <p className="pointer-events-auto mt-2 text-center text-[11.5px] text-[var(--text-tertiary)]">
          Cada pergunta é respondida de forma independente ·{" "}
          <kbd className="font-mono">Enter</kbd> envia ·{" "}
          <kbd className="font-mono">Shift + Enter</kbd> quebra linha
        </p>
      </div>
    </div>
  );
};

export default TutorPage;
