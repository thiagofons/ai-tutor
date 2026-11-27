import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useLoginStore from "../store/LoginStore";
import useTokenStore from "../store/TokenStore";
import { ApiError } from "./useEfetuarLogin";

export type FetchWithAuth = (
  url: string,
  options?: RequestInit,
) => Promise<Response>;

const useFetchWithAuth = () => {
  const setMsg = useLoginStore((s) => s.setMsg);
  const clearTokenResponse = useTokenStore((s) => s.clearTokenResponse);
  const navigate = useNavigate();
  const location = useLocation();

  const handleUnauthorized = useCallback(
    (message = "Sua sessão expirou. Faça login novamente.") => {
      clearTokenResponse();
      setMsg(message, "error");
      navigate("/login", {
        replace: true,
        state: { destino: location.pathname },
      });
    },
    [clearTokenResponse, location.pathname, navigate, setMsg],
  );

  const fetchWithAuth: FetchWithAuth = useCallback(
    async (url: string, options?: RequestInit) => {
      const token = useTokenStore.getState().tokenResponse.token;
      const headers = new Headers(options?.headers);

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      let response: Response;
      try {
        response = await fetch(url, {
          ...options,
          headers,
        });
      } catch {
        throw new ApiError(
          "Não foi possível conectar ao servidor. Verifique se o back-end está rodando em localhost:4000.",
          0,
        );
      }

      if (!response.ok) {
        if (response.status === 401) {
          handleUnauthorized();
          throw new ApiError("Não autenticado.", 401);
        }

        if (response.status === 403) {
          throw new ApiError(
            "Você não tem permissão para acessar este recurso.",
            403,
          );
        }

        const errorBody: unknown = await response.json().catch(() => null);
        if (
          errorBody &&
          typeof errorBody === "object" &&
          "message" in errorBody &&
          typeof (errorBody as { message: unknown }).message === "string"
        ) {
          throw new ApiError(
            (errorBody as { message: string }).message,
            response.status,
          );
        }

        throw new ApiError(
          `Erro inesperado na requisição (status ${response.status}).`,
          response.status,
        );
      }

      return response;
    },
    [handleUnauthorized],
  );

  return { fetchWithAuth, handleUnauthorized };
};

export default useFetchWithAuth;
