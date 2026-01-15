import { tokenManager } from "@/tools";
import { alovaInst } from "@/tools/http";
import type { ILoginForm, ILoginResponse, IRefreshTokenResponse } from "@/types/auth";

// 登录接口
export const login = (data: ILoginForm) => {
  const alovaMethod = alovaInst.Post<ILoginResponse>("/api/login", data);

  // 将请求标记为登录请求
  alovaMethod.meta = {
    authRole: "login",
  };
  return alovaMethod;
};

// 自动刷新 accessToken 接口
export async function refreshAccessToken() {
  const refreshToken = tokenManager.getRefreshToken();
  const alovaMethod = alovaInst.Get<IRefreshTokenResponse>("/api/refresh_access_token", {
    cacheFor: null, // 不允许使用缓存
    params: {
      refreshToken,
    },
  });

  // 将请求标记为: 刷新访问令牌的请求
  alovaMethod.meta = {
    authRole: "refreshToken",
  };
  return alovaMethod;
}
