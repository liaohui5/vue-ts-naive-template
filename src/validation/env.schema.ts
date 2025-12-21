import * as z from "zod";

export const envZod = z.object({
  // vite 在打包的时候会自动注入
  MODE: z.string(),
  DEV: z.boolean(),
  PROD: z.boolean(),
  SSR: z.boolean(),
  BASE_URL: z.string(),

  // 接口请求地址
  VITE_APP_API_BASE_URL: z.string().default(""),

  // 是否启用 mock service worker
  VITE_APP_USE_MSW: z.enum(["false", "true"]).overwrite((v) => JSON.parse(v)),
});
