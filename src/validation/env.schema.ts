import * as z from "zod";

export const envZod = z.object({
  // vite 在打包的时候会自动注入
  MODE: z.string(),
  DEV: z.boolean(),
  PROD: z.boolean(),
  SSR: z.boolean(),
  BASE_URL: z.string(),

  // 借口请求地址
  VITE_APP_API_BASE_URL: z.string().default("/"),

  // 是否开启 mock 数据
  VITE_APP_MOCK_API_ENABLED: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => JSON.parse(v)),

  // 是否允许验证响应参数
  VITE_APP_API_VLIDATION_ENABLED: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => JSON.parse(v)),
});
