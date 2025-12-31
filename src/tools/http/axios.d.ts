import type { ZodObject, ZodTypeAny } from "zod";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/api";

/////////////////////////////////////////////////
// 扩展 axios 类型, 增加验证参数的功能
////////////////////////////////////////////////
declare module "axios" {
  // 注意: 必须覆盖原来的类型, 因为 unwrapData 响应拦截器是会自动解出 data 字段
  // 的, 如果不覆盖, 它无法正常推断出返回值类型, 一定会导致类型错误
  export interface AxiosInstance {
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    request<T = any>(config: AxiosRequestConfig): Promise<T>;
  }
}
