import type { AxiosRequestConfig } from "axios";
import { assign, tokenManager, uuid } from "@/tools";

export const REQUEST_ID_KEY = "request_id";
export const TOKEN_HEADER_KEY = "Authorization";

/**
 * 给请求添加请求ID,放到 query 参数中
 * @param {AxiosRequestConfig} config - Method 对象
 * @returns {AxiosRequestConfig} - 已经添加请求ID的 Method 对象
 */
export function genRequestId(config: AxiosRequestConfig) {
  const reqIdParams = {
    [REQUEST_ID_KEY]: uuid(),
  };
  config.params = assign(reqIdParams, config.params);
  return config;
}

/**
 * 如果存在 accessToken, 则将 token 添加到 request headers 中
 * @param {AxiosRequestConfig} config - Method 对象
 * @returns {AxiosRequestConfig} - 已经添加 token 的 Method 对象
 */
export function withToken(config: AxiosRequestConfig) {
  if (tokenManager.hasAccessToken()) {
    const tokenHeader = {
      [TOKEN_HEADER_KEY]: tokenManager.getAccessToken(),
    };
    config.headers = assign({}, config.headers, tokenHeader);
  }

  return config;
}

// 如果有 token，则将 token 以 bearer 的格式添加到 header 中
export function withBearerToken(config: AxiosRequestConfig) {
  if (tokenManager.hasAccessToken()) {
    const tokenHeader = {
      [TOKEN_HEADER_KEY]: tokenManager.getBearerToken(),
    };
    config.headers = assign({}, config.headers, tokenHeader);
  }
  return config;
}
