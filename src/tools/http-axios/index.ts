import { env } from "@/tools";
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { validationErrorHandler, internalErrorHandler, accessTokenExpiredHandler } from "./interceptors/error-handler";
import { genRequestId, withBearerToken } from "./interceptors/request";
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
export function createHttpClient(
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

/**
 * 判断一个请求是否是用来刷新 token 的请求
 * 注意修改 axios.d.ts 否则会有 ts 类型错误
 *
 * @param config AxiosRequestConfig 请求配置
 * @returns {Boolean} 返回一个布尔值, 是否是用来刷新 token 的请求
 */
export const isRefreshTokenRequest = (config: AxiosRequestConfig): boolean => Boolean(config.isRefreshTokenRequest);

/**
 * 重新发送因 accessToken 过期而失败的请求
 * 为什么不直接在 handleAccessTokenExpired 中处理呢?
 * 为了方便测试, 如果直接写死, 那么无法模拟 axiosInst 和 config 参数
 * 注意修改 axios.d.ts 否则会有 ts 类型错误
 *
 * @param axiosInst AxiosInstance 实例
 * @param config AxiosRequestConfig 请求配置
 */
export const retryFailedRequest = (axiosInst: AxiosInstance, config: AxiosRequestConfig) => axiosInst.request(config);

/////////////////////////////////////////////////////////////////
// 创建默认的 http 实例
// 可以直接使用这个实例, 也可以根据需要手动创建一个实例
/////////////////////////////////////////////////////////////////
const reqInterceptors: Array<RequestInterceptor> = [genRequestId, withBearerToken];
const resInterceptors: Array<ResponseInterceptor> = [unwrapData];
const errInterceptors: Array<ErrorInterceptor> = [
  internalErrorHandler,
  validationErrorHandler,
  accessTokenExpiredHandler,
];

export const http = createHttpClient(
  {
    baseURL: env.VITE_APP_API_BASE_URL,
    timeout: 10 * 1000, // 10s
    headers: {
      "Content-Type": "application/json",
    },
  },
  reqInterceptors,
  resInterceptors,
  errInterceptors,
);
