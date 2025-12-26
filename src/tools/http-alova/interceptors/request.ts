import { assign, tokenManager, uuid } from "@/tools";
import { getAccessToken, getBearerToken } from "@/tools/token-manager";
import type { Method } from "alova";

/**
 * 给请求添加请求ID,放到 query 参数中
 * @param {{ config }: Method} - Method 对象
 * @param {config.params} - Method 对象中的 params 字段
 * @returns {void} - 无返回值
 */
export const REQUEST_ID_KEY = "request_id";

/**
 * 给请求添加请求ID,放到 query 参数中
 * @param {{ config }: Method} - Method 对象
 * @param {config.params} - Method 对象中的 params 字段
 * @returns {void} - 无返回值
 */
export function genRequestId({ config }: Method) {
  const reqIdParams = {
    [REQUEST_ID_KEY]: uuid(),
  };
  config.params = assign({}, config.params, reqIdParams);
}

/**
 * 给请求添加请求ID,放到 query 参数中
 */
export const TOKEN_HEADER_KEY = "Authorization";

/**
 * 自动携带 token
 * 如果 tokenManager 中存在 accessToken, 则将 token 添加到 request headers 中
 * @param {{ config }: Method} - Method 对象
 * @returns {void} - 无返回值
 */
export function withToken({ config }: Method) {
  if (!tokenManager.hasAccessToken()) {
    return;
  }
  const headerWithToken = {
    [TOKEN_HEADER_KEY]: getAccessToken(),
  };
  config.headers = assign({}, config.headers, headerWithToken);
}


/**
 * 自动携带 token (bearer 格式)
 * 如果 tokenManager 中存在 accessToken, 则将 token 添加到 request headers 中, 并将其格式化为 bearer 格式
 * @param {{ config }: Method} - Method 对象
 * @returns {void} - 无返回值
 */
export function withBearerToken({ config }: Method) {
  if (!tokenManager.hasAccessToken()) {
    return;
  }
  const headerWithToken = {
    [TOKEN_HEADER_KEY]: getBearerToken(),
  };
  config.headers = assign({}, config.headers, headerWithToken);
}
