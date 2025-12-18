import { http, HttpResponse } from "msw";
import { mockArticleListResponse, success } from "@/__mocks__/mocks";

// 文章列表
export const fetchArticles = http.get("/api/articles", () => {
  return success({
    total: 50,
    datas: mockArticleListResponse.array({ min: 10, max: 10 }).generate(),
  });
});

// 创建文章
export const createArticle = http.post("/api/articles", () => success({ id: 1 }));

// 更新文章
export const updateArticle = http.patch("/api/articles/:id", ({ params }) => {
  const { id } = params;
  return success({ id });
});

// 删除文章
export const deleteArticle = http.delete("/api/articles/:id", ({ params }) => {
  const r = Math.random();
  if (r >= 0.5) {
    // 有一半的几率会模拟 accessToken 过期(目的是为了测试客户端是否会重试失败的请求)
    return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  return success({ id });
});
