import { http } from "msw";
import { useMockApi } from "@/tools";
import { mockArticleListResponse, success } from "@/__mocks__/mocks";

// 文章列表
export const listArticles = http.get(useMockApi("/api/articles"), () => {
  return success({
    total: 50,
    datas: mockArticleListResponse.array({ min: 10, max: 10 }).generate(),
  });
});

// 创建文章
export const createArticle = http.post(useMockApi("/api/articles"), () => success({ id: 1 }));

// 更新文章
export const updateArticle = http.post(useMockApi("/api/articles/:id"), ({ params }) => {
  const { id } = params;
  return success({ id });
});

// 删除文章
export const deleteArticle = http.delete(useMockApi("/api/articles/:id"), ({ params }) => {
  const { id } = params;
  return success({ id });
});
