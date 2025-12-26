import { http } from "@/tools/http-alova";
import type { IPagination, PaginationData } from "@/types/api";
import type { IArticleItem, ICreateArticleForm, IUpdateArticleForm } from "@/types/article";

// fetch articles list
export function fetchArticles(pagination: IPagination, search: string) {
  return http.Get<PaginationData<IArticleItem>>("/api/articles", {
    params: {
      ...pagination,
      search,
    },
  });
}

// create article item
export function createArticle(data: ICreateArticleForm) {
  return http.Post("/api/articles", data);
}

// update article item by id
export const updateArticle = (id: string | number, data: IUpdateArticleForm) => {
  return http.Patch(`/api/articles/${id}`, data);
};

// delete article item by id
export const deleteArticle = (id: string | number) => http.Delete(`/api/articles/${id}`);
