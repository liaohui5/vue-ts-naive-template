import { http } from "@/tools/http-alova";
import type { IPagination, ISearchParams, PaginationData } from "@/types/api";
import type { IArticleItem, ICreateArticleForm, IUpdateArticleForm } from "@/types/article";

export function fetchArticles(pagination: IPagination, search: ISearchParams) {
  return http.Get<PaginationData<IArticleItem>>("/api/articles", {
    params: {
      ...pagination,
      search,
    },
  });
}

export function createArticle(data: ICreateArticleForm) {
  return http.Post("/api/articles", data);
}

export const updateArticle = (id: string | number, data: IUpdateArticleForm) => {
  return http.Patch(`/api/articles/${id}`, data);
};

export const deleteArticle = (id: string | number) => http.Delete(`/api/articles/${id}`);
