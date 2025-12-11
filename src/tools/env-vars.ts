import { envZod } from "@/validation";

// 使用 zod 验证 import.meta.env 中的值, 默认的不用验证, 有些值是 vite 提供的,
// 比如 MODE, DEV, PROD, SSR, 只需 要验证用户自定义的环境变量即可, 使用经过 zod
// 验证后的 .env 文件内容的好处:
// 1. 写代码时候会有提示, 减少拼写错误, 直接使用 import.meta.env 没有代码提示
// 2. import.meta.env.xxx 都是字符串, transform 后可以是其他类型的值, 比如 boolean
// 3. 使用验证后的 env, 可以设置默认值, 即使没有 .env 文件也不会 undefined 导致报错
// 4. 使用这个变量, 可以防止值被意外修改
export const env = Object.freeze(envZod.parse(import.meta.env));
