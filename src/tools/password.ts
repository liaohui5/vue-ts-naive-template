import { md5 } from "./md5";

// "加密" password 字段, 避免明文发送密码
// 为什么单独抽离一个方法来做这个事情?
// 因为在实际开发中, 可能需要用到其他加密算法
// 单独抽离一个方法来做这个事情, 方便单元测试
export function encodePassword<T extends object>(data: T): T {
  if ("password" in data && typeof data.password === "string") {
    return {
      ...data,
      password: md5(data.password),
    };
  }
  return data;
}
