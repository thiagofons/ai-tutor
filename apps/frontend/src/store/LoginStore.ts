import { create } from "zustand";

export type FeedbackType = "error" | "success" | "info";

interface LoginStore {
  msg: string;
  msgType: FeedbackType;
  setMsg: (novoMsg: string, type?: FeedbackType) => void;
  clearMsg: () => void;
}

const useLoginStore = create<LoginStore>((set) => ({
  msg: "",
  msgType: "error",
  setMsg: (novoMsg, type = "error") =>
    set(() => ({ msg: novoMsg, msgType: type })),
  clearMsg: () => set(() => ({ msg: "", msgType: "error" })),
}));

export default useLoginStore;
