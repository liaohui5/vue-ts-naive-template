import { $goto } from "@/hooks/useGoto";
import { tokenManager } from "@/tools";
import { ErrnoEnum, http } from "@/tools/http";
import { removeTokens } from "@/tools/token-manager";
import type { LoginFormType, LoginResponseType, RefreshAccessTokenType } from "@/types/auth";
import type { AxiosResponse } from "axios";

// 登录接口
export const login = (data: LoginFormType) => http.post<LoginResponseType>("/api/auth/login", data);

// refreshToken 也过期了, 需要重新登录
export const logout = () => {
  removeTokens();
  $goto.redirectToLogin();
};

// 自动刷新 accessToken 接口
export async function refreshAccessToken() {
  const refreshToken = tokenManager.getRefreshToken();
  return http
    .request<RefreshAccessTokenType>({
      // 标记请求: 告诉拦截器(这个请求)不要自动刷新token, 否则可能导致死循环
      // 注意修改 axios.d.ts 否则会有 ts 类型错误
      isRefreshTokenRequest: true,
      url: "/api/auth/refresh_access_token",
      method: "POST",
      data: {
        refreshToken,
      },
    })
    .then((res) => {
      if ((res as unknown as AxiosResponse).status === ErrnoEnum.Unauthorized) {
        throw new Error("refresh token is expired");
      }
      return res as unknown as string;
    })
    .catch(logout);
}
