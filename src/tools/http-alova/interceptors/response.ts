import { isObject } from "@/tools";

export function unwrapData<T extends object>(res: T) {
  if (isObject(res) && "data" in res) {
    return res.data;
  }
  return res;
}
