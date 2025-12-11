import type { AxiosResponse } from "axios";
import { isObject } from "@/tools";

// 注意: 这个位置的类型标注可以这样强行写死
// 1. 因为响应拦截器是 for 循环动态添加的, 所以axios默认无法自动推断出响应类型
// 2. 但是由于我们在 axios.d.ts 中强行将类型标注为 解构后的类型
// 3. 所以这里可以强行将类型标注为 解构后的类型
export const unwrapData = (res: AxiosResponse) => {
  const body = res.data;
  if (isObject(body) && "data" in body) {
    return body.data as AxiosResponse;
  }
  return body as AxiosResponse;
};
