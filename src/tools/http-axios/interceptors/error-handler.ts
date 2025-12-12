import { refreshAccessToken } from "@/api/auth";
import { log } from "@/tools";
import { http, isRefreshTokenRequest, retryFailedRequest, withBearerToken } from "@/tools/http-axios";
import { showErrMsg } from "@/tools/notify";
import { hasRefreshToken, saveAccessToken } from "@/tools/token-manager";
import type { AxiosError, AxiosRequestConfig } from "axios";

////////////////////////////////////////////////////////////////////////////////
// 错误码:
// 这个需要和后端约定好, 具体情况具体分析
// 1. 错误码是直接用 http 状态码还是在响应体中中定义一个字段(如:errno/code)
// 2. 具体的值和对应的错误
////////////////////////////////////////////////////////////////////////////////
export enum ErrnoEnum {
  // 未登录/token过期
  Unauthorized = 401,

  // 没有权限/签名验证失败
  Forbidden = 403,

  // 数据验证失败
  FailedToValidate = 400,

  // 内部错误
  InternalError = 500,
}

// 自动获取新的 accessToken 用来延长 accessToken 的有效期
export const createAccessTokenExpiredHandler = (refreshTokenFn: () => Promise<string | void>) => {
  return async function (error: AxiosError) {
    const config = error.config as AxiosRequestConfig;
    if (error.status === ErrnoEnum.Unauthorized && hasRefreshToken() && !isRefreshTokenRequest(config)) {
      // 只有刷新成功后, 才应该重新发送(因鉴权失败)请求
      // 注意再次发送请求的时候, 应该携带最新的 AccessToken
      const newAccessToken = await refreshTokenFn();
      if (typeof newAccessToken === "string" && newAccessToken.length > 0) {
        saveAccessToken(newAccessToken);
        return retryFailedRequest(http, withBearerToken(config));
      }
    }
    return Promise.reject(error);
  };
};
export const accessTokenExpiredHandler = createAccessTokenExpiredHandler(refreshAccessToken);

// 处理数据验证错误: 格式化错误信息
export function validationErrorHandler(error: AxiosError) {
  if (error.status === ErrnoEnum.FailedToValidate) {
    showErrMsg("请求参数没有通过服务端校验,请检查参数是否正确");
    log("[error-handler@validationErrorHandler]请求参数没有通过服务端校验", error);
  }
  return Promise.reject(error);
}

// 处理 500 错误
export const internalErrorMessage = "服务器内部错误, 请稍后再试";
export function internalErrorHandler(error: AxiosError) {
  if (error.status === ErrnoEnum.InternalError) {
    showErrMsg(internalErrorMessage);
    return Promise.reject(error);
  }
  return Promise.reject(error);
}
