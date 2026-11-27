import {
  EventStreamContentType,
  fetchEventSource,
} from "@microsoft/fetch-event-source";
import { useCallback, useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../config/api";
import type {
  JobCreatedResponseDTO,
  QueueWorkerResponseDTO,
  TutorTurn,
} from "../interfaces/Tutor";
import useTokenStore from "../store/TokenStore";
import { ApiError } from "./useEfetuarLogin";
import useFetchWithAuth from "./useFetchWithAuth";

class FatalSseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FatalSseError";
  }
}

function createLocalId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `turn-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const useTutorStream = () => {
  const [turns, setTurns] = useState<TutorTurn[]>([]);
  const { fetchWithAuth, handleUnauthorized } = useFetchWithAuth();
  const controllersRef = useRef<Map<string, AbortController>>(new Map());

  // Encerra qualquer conexão SSE aberta se o usuário sair da tela
  useEffect(() => {
    const controllers = controllersRef.current;
    return () => {
      controllers.forEach((controller) => controller.abort());
      controllers.clear();
    };
  }, []);

  const updateTurn = useCallback(
    (id: string, updater: (turn: TutorTurn) => TutorTurn) => {
      setTurns((prev) =>
        prev.map((turn) => (turn.id === id ? updater(turn) : turn)),
      );
    },
    [],
  );

  const openSseStream = useCallback(
    async (turnId: string, jobId: string, topic: string) => {
      const controller = new AbortController();
      controllersRef.current.set(turnId, controller);

      const token = useTokenStore.getState().tokenResponse.token;
      const streamUrl = topic.startsWith("http")
        ? topic
        : `${API_BASE_URL}${topic.startsWith("/") ? topic : `/${topic}`}`;

      let receivedResult = false;

      try {
        await fetchEventSource(streamUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "text/event-stream",
          },
          signal: controller.signal,
          openWhenHidden: true,

          async onopen(response) {
            if (response.status === 401) {
              handleUnauthorized();
              throw new FatalSseError("Sessão expirada.");
            }

            if (!response.ok) {
              throw new FatalSseError(
                `Não foi possível abrir o stream SSE (status ${response.status}).`,
              );
            }

            const contentType = response.headers.get("content-type") ?? "";
            if (!contentType.includes(EventStreamContentType)) {
              throw new FatalSseError(
                "Resposta inesperada do servidor ao abrir o canal SSE.",
              );
            }
          },

          onmessage(event) {
            if (!event.data) return;

            try {
              const payload = JSON.parse(event.data) as QueueWorkerResponseDTO;
              const answerText =
                payload.result?.answer?.trim() ||
                "O tutor concluiu o processamento, mas não retornou texto.";

              receivedResult = true;
              updateTurn(turnId, (turn) => ({
                ...turn,
                jobId: payload.jobId || jobId,
                status: "completed",
                answer: answerText,
                errorMessage: undefined,
              }));
              controller.abort();
            } catch {
              throw new FatalSseError(
                "Não foi possível interpretar a resposta recebida do servidor.",
              );
            }
          },

          onclose() {
            if (!receivedResult && !controller.signal.aborted) {
              throw new FatalSseError(
                "A conexão SSE foi encerrada antes da resposta chegar.",
              );
            }
          },

          onerror(err) {
            // Relançar o erro impede que o fetchEventSource fique reconectando em loop infinito
            throw err;
          },
        });
      } catch (error: unknown) {
        if (controller.signal.aborted && receivedResult) {
          return;
        }

        const message =
          error instanceof Error && error.message
            ? error.message
            : "Erro ao receber a resposta em tempo real.";

        updateTurn(turnId, (turn) => ({
          ...turn,
          status: "error",
          errorMessage: message,
        }));
      } finally {
        controllersRef.current.delete(turnId);
      }
    },
    [handleUnauthorized, updateTurn],
  );

  const sendQuestion = useCallback(
    async (rawQuery: string, existingTurnId?: string) => {
      const query = rawQuery.trim();
      if (!query) return;

      const turnId = existingTurnId ?? createLocalId();

      if (existingTurnId) {
        controllersRef.current.get(existingTurnId)?.abort();
        controllersRef.current.delete(existingTurnId);
        updateTurn(existingTurnId, (turn) => ({
          ...turn,
          status: "enqueuing",
          answer: undefined,
          errorMessage: undefined,
        }));
      } else {
        setTurns((prev) => [
          ...prev,
          {
            id: turnId,
            query,
            status: "enqueuing",
            createdAt: new Date(),
          },
        ]);
      }

      try {
        // 1. Envia a pergunta ao Gateway (POST /items) -> recebe 202 Accepted com jobId e topic
        const response = await fetchWithAuth(`${API_BASE_URL}/items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        const data = (await response.json()) as JobCreatedResponseDTO;

        updateTurn(turnId, (turn) => ({
          ...turn,
          jobId: data.jobId,
          status: "streaming",
        }));

        // 2. Abre o canal SSE autenticado para escutar a resposta do Worker
        await openSseStream(turnId, data.jobId, data.topic);
      } catch (error: unknown) {
        if (error instanceof ApiError && error.status === 401) {
          return;
        }

        const message =
          error instanceof Error && error.message
            ? error.message
            : "Não foi possível enviar sua pergunta.";

        updateTurn(turnId, (turn) => ({
          ...turn,
          status: "error",
          errorMessage: message,
        }));
      }
    },
    [fetchWithAuth, openSseStream, updateTurn],
  );

  const clearHistory = useCallback(() => {
    controllersRef.current.forEach((controller) => controller.abort());
    controllersRef.current.clear();
    setTurns([]);
  }, []);

  const activeCount = turns.filter(
    (t) => t.status === "enqueuing" || t.status === "streaming",
  ).length;

  return {
    turns,
    activeCount,
    sendQuestion,
    clearHistory,
  };
};

export default useTutorStream;
