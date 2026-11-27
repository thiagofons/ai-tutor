import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "../config/api";
import type { LoginPayload } from "../interfaces/Auth";
import type { TokenResponse } from "../interfaces/TokenResponse";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const efetuarLogin = async (payload: LoginPayload): Promise<TokenResponse> => {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ApiError(
      "Não foi possível conectar ao servidor. Verifique se o back-end está rodando em localhost:4000.",
      0,
    );
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new ApiError("E-mail ou senha inválidos.", response.status);
    }
    throw new ApiError(
      `Não foi possível entrar agora (erro ${response.status}).`,
      response.status,
    );
  }

  return (await response.json()) as TokenResponse;
};

const useEfetuarLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => efetuarLogin(payload),
  });
};

export default useEfetuarLogin;
