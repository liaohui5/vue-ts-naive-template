import { env } from "@/tools";
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { validationErrorHandler, internalErrorHandler } from "./interceptors/error-handler";
import { genRequestId } from "./interceptors/request";
import { unwrapData } from "./interceptors/response";

export * from "./interceptors/error-handler";
export * from "./interceptors/request";
export * from "./interceptors/response";

export type RequestInterceptor = (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
export type ResponseInterceptor = (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
export type ErrorInterceptor = (error: AxiosError) => Promise<AxiosError> | Promise<AxiosResponse>;

/**
 * 创建一个HTTP客户端
 *
 * 此函数通过给定的基础配置和请求/响应拦截器来创建一个Axios HTTP客户端
 * 它允许在发送请求前后和接收响应前后执行自定义逻辑
 *
 * @param baseConfig - 基础请求配置，用于axios.create
 * @param reqInterceptors - 请求拦截器数组，用于在请求发送之前执行逻辑
 * @param resInterceptors - 响应拦截器数组，用于在响应接收后执行逻辑
 * @param errInterceptors - 错误拦截器数组，用于在响应报错(比如HTTP响应状态码500)的执行逻辑
 * @returns 返回一个配置好拦截器的Axios实例
 */
export function createAxiosInst(
  baseConfig: AxiosRequestConfig,
  reqInterceptors: Array<RequestInterceptor> = [],
  resInterceptors: Array<ResponseInterceptor> = [],
  errInterceptors: Array<ErrorInterceptor> = [],
): AxiosInstance {
  const client = axios.create(baseConfig);

  for (let i = 0; i < reqInterceptors.length; i++) {
    /** @ts-ignore */
    client.interceptors.request.use(reqInterceptors[i]);
  }

  for (let i = 0; i < resInterceptors.length; i++) {
    client.interceptors.response.use(resInterceptors[i]);
  }

  for (let i = 0; i < errInterceptors.length; i++) {
    client.interceptors.response.use(null, errInterceptors[i]);
  }

  return client;
}

/////////////////////////////////////////////////////////////////
// 创建默认的 http 实例
// 可以直接使用这个实例, 也可以根据需要手动创建一个实例
/////////////////////////////////////////////////////////////////
export const axiosInst = createAxiosInst(
  {
    baseURL: env.VITE_APP_API_BASE_URL,
    timeout: 30 * 1000, // 30s
    headers: {
      "Content-Type": "application/json",
    },
  },
  // [genRequestId, withBearerToken],
  [genRequestId],
  [unwrapData],
  [internalErrorHandler, validationErrorHandler],
);
