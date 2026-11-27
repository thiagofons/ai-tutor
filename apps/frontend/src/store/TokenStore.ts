import { create } from "zustand";
import type { TokenResponse } from "../interfaces/TokenResponse";

const STORAGE_KEY = "ai-tutor-auth";

const EMPTY_TOKEN: TokenResponse = {
  token: "",
  userId: 0,
  name: "",
};

function loadInitialToken(): TokenResponse {
  if (typeof window === "undefined") return EMPTY_TOKEN;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_TOKEN;
    const parsed = JSON.parse(raw) as Partial<TokenResponse>;
    if (
      typeof parsed.token === "string" &&
      parsed.token.length > 0 &&
      typeof parsed.userId === "number" &&
      typeof parsed.name === "string"
    ) {
      return {
        token: parsed.token,
        userId: parsed.userId,
        name: parsed.name,
      };
    }
  } catch {
    // Ignore storage errors
  }
  return EMPTY_TOKEN;
}

interface TokenStore {
  tokenResponse: TokenResponse;
  setTokenResponse: (novoTokenResponse: TokenResponse) => void;
  clearTokenResponse: () => void;
}

const useTokenStore = create<TokenStore>((set) => ({
  tokenResponse: loadInitialToken(),
  setTokenResponse: (novoTokenResponse) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(novoTokenResponse));
    } catch {
      // Ignore storage errors
    }
    set(() => ({ tokenResponse: novoTokenResponse }));
  },
  clearTokenResponse: () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
    set(() => ({ tokenResponse: EMPTY_TOKEN }));
  },
}));

export default useTokenStore;
