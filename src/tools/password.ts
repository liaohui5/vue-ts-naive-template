import { md5 } from "./md5";

export function encodePassword<T extends object>(data: T): T {
  if ("password" in data && typeof data.password === "string") {
    return {
      ...data,
      password: md5(data.password),
    };
  }
  return data;
}
