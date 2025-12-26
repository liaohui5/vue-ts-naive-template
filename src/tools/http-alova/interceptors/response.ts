import { isObject } from "@/tools";


/**
 * 解包响应数据
 *
 * 如果响应体是对象, 并且存在 data 字段, 直接返回响应体的 data 字段
 * 否则直接返回响应体本身
 *
 * @template T extends object
 * @param {T} res - 响应体
 * @returns {T['data']} - 解包后的数据
 */
export function unwrapData<T extends object>(res: T) {
  if (isObject(res) && "data" in res) {
    return res.data;
  }
  return res;
}
