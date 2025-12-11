import { md5 } from "./md5";

interface HavePasswordFiled {
  password: string;
  [key: string]: any;
}

export function encodePassword<T extends HavePasswordFiled>(data: T): T {
  return {
    ...data,
    password: md5(data.password),
  };
}
