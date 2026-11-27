export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface UserInfoResponse {
  valid: boolean;
  duplicated: boolean;
  message: string;
}
