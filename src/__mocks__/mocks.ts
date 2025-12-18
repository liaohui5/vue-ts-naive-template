import * as z from "zod";
import { zocker } from "zocker";
import { HttpResponse } from "msw";

// mws: https://msw.nodejs.cn/docs/getting-started/
// zocker: https://github.com/LorisSigrist/zocker
export function success(data: unknown) {
  return HttpResponse.json({
    success: true,
    msg: "success",
    data,
  });
}

export function failed(data: unknown) {
  return HttpResponse.json({
    success: false,
    msg: "failed",
    data,
  });
}

// 模拟登录接口响应
const loginResponseZod = z.object({
  id: z.number(),
  username: z.string(),
  email: z.email(),
  avatar: z.url(),
  accessToken: z.uuidv4(),
  refreshToken: z.uuidv4(),
});

// 导出模拟数据: mockLoginResponse.generate()
export const mockLoginResponse = zocker(loginResponseZod);
export type ILoginResponse = z.infer<typeof loginResponseZod>;

// 模拟刷新 accessToken 接口响应
const refreshAccessTokenResponseZod = z.object({
  accessToken: z.uuidv4(),
});
export const mockRefreshTokenResponse = zocker(refreshAccessTokenResponseZod);
export type IRefreshTokenResponse = z.infer<typeof refreshAccessTokenResponseZod>;

// 文章实体
export const articleZod = z.object({
  id: z.number().positive().int(),
  author: z.string().max(12),
  author_id: z.number().positive().int(),
  title: z.string(),
  content: z.string().min(32),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export const mockArticleListResponse = zocker(z.array(articleZod));
export type IArticleItem = z.infer<typeof articleZod>;
