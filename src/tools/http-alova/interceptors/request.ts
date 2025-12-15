import { assign, tokenManager, uuid } from "@/tools";
import { getAccessToken, getBearerToken } from "@/tools/token-manager";
import type { Method } from "alova";

// 给请求添加请求ID,放到 query 参数中
export const REQUEST_ID_KEY = "request_id";
export function genRequestId({ config }: Method) {
  const reqIdParams = {
    [REQUEST_ID_KEY]: uuid(),
  };
  config.params = assign({}, config.params, reqIdParams);
}

// 自动携带 token
export const TOKEN_HEADER_KEY = "Authorization";
export function withToken({ config }: Method) {
  if (!tokenManager.hasAccessToken()) {
    return;
  }
  const headerWithToken = {
    [TOKEN_HEADER_KEY]: getAccessToken(),
  };
  config.headers = assign({}, config.headers, headerWithToken);
}

// 自动携带 bearer token
export function withBearerToken({ config }: Method) {
  if (!tokenManager.hasAccessToken()) {
    return;
  }
  const headerWithToken = {
    [TOKEN_HEADER_KEY]: getBearerToken(),
  };
  config.headers = assign({}, config.headers, headerWithToken);
}
