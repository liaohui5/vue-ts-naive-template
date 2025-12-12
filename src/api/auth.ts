import { tokenManager } from "@/tools";
import { http, $http } from "@/tools/http-alova";
import type { ILoginForm, ILoginResponse, IRefreshTokenResponse } from "@/types/auth";

// 登录接口
export const login = (data: ILoginForm) => http.Post<ILoginResponse>("/api/auth/login", data);

// 自动刷新 accessToken 接口
// 注: 不能使用默认的 http 实例, 默认的 http 实例上有拦截器
// 需要使用 $http 实例, 这个实例上没有任何的拦截器
export async function refreshAccessToken() {
  const refreshToken = tokenManager.getRefreshToken();
  return $http.Post<IRefreshTokenResponse>("/api/auth/refresh_access_token", { refreshToken });
}
