import * as z from "zod";
import { zocker } from "zocker";
import { HttpResponse } from "msw";

// mws: https://msw.nodejs.cn/docs/getting-started/
// zocker: https://github.com/LorisSigrist/zocker

export function success(data: unknown) {
  return HttpResponse.json({
    code: 0,
    data,
    msg: "success",
  });
}

export function failed(data: unknown) {
  return HttpResponse.json({
    code: 1,
    data,
    msg: "failed",
  });
}

// 使用 zod 定义数据结构来模拟接口的响应数据
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

// 刷新 accessToken 接口数据用的 schema
const refreshAccessTokenResponseZod = z.object({
  accessToken: z.uuidv4(),
});
export const mockRefreshTokenResponse = zocker(refreshAccessTokenResponseZod);
export type IRefreshTokenResponse = z.infer<typeof refreshAccessTokenResponseZod>;

// 模拟文章列表接口
export const articleZod = z.object({
  id: z.number().positive().int(),
  author: z.string(),
  author_id: z.string(),
  title: z.string(),
  content: z.string().min(32),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export const mockArticleListResponse = zocker(z.array(articleZod));
export type IArticleItem = z.infer<typeof articleZod>;
