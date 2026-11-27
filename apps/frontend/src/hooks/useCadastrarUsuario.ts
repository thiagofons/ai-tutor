import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "../config/api";
import type { RegisterPayload, UserInfoResponse } from "../interfaces/Auth";
import { ApiError } from "./useEfetuarLogin";

const cadastrarUsuario = async (
  payload: RegisterPayload,
): Promise<UserInfoResponse> => {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/users`, {
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
    throw new ApiError(
      `Erro ao criar conta (status ${response.status}).`,
      response.status,
    );
  }

  const data = (await response.json()) as UserInfoResponse;

  if (data.duplicated) {
    throw new ApiError(
      data.message || "Já existe uma conta cadastrada com este e-mail.",
      409,
    );
  }

  if (!data.valid) {
    throw new ApiError(
      data.message || "Dados inválidos para criação de conta.",
      400,
    );
  }

  return data;
};

const useCadastrarUsuario = () => {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => cadastrarUsuario(payload),
  });
};

export default useCadastrarUsuario;
