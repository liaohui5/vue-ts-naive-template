import { http } from "msw";
import { success, failed, successWithId } from "@/__mocks__/shared";
import z from "zod";
import { zocker } from "zocker";

// 模拟文章列表接口响应
export const fetchArticles = http.get("/api/articles", () => {
  const mockData = zocker(
    z.array(
      z.object({
        id: z.number().positive().int(),
        author: z.string().regex(/^[a-zA-Z0-9]{4,16}$/),
        title: z.string(),
        content: z.string().min(32),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    ),
  )
    .array({ min: 10, max: 10 })
    .generate();

  return success({
    total: 50,
    datas: mockData,
  });
});

// 创建文章
export const createArticle = http.post("/api/articles", successWithId);

// 更新文章
export const updateArticle = http.patch("/api/articles/:id", successWithId);

// 删除文章
// 有一半的几率会模拟 accessToken 过期
// 目的是为了测试客户端是否会重试失败的请求
export const deleteArticle = http.delete("/api/articles/:id", () => {
  if (Math.random() >= 0.5) {
    return failed(null, 401);
  }
  return successWithId();
});
