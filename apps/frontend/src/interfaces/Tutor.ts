export interface UserQueryRequestDTO {
  query: string;
}

export interface JobCreatedResponseDTO {
  jobId: string;
  topic: string;
}

export interface LLMResult {
  answer: string;
}

export interface QueueWorkerResponseDTO {
  jobId: string;
  status: string;
  result: LLMResult | null;
}

export type TurnStatus = "enqueuing" | "streaming" | "completed" | "error";

export interface TutorTurn {
  id: string;
  query: string;
  jobId?: string;
  status: TurnStatus;
  answer?: string;
  errorMessage?: string;
  createdAt: Date;
}
