export type { ILoginForm } from "@/validation/auth.schema";

export interface ILoginResponse {
  id: number;
  username: string;
  email: string;
  avatar: string;
  accessToken: string;
  refreshToken: string;
}

export interface IRefreshTokenResponse {
  accessToken: string;
}
