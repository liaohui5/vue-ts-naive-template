import { env } from "./env-vars";

/**
 * useMockApi 函数用于根据 path 获取模拟数据
 * @param {string} path - 模拟数据的路径
 */
export function useMockApi(path: string): string {
  return `${env.VITE_APP_API_BASE_URL}${path}`;
}
