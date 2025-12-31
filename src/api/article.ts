import { alovaInst } from "@/tools/http";
import type { IPagination, PaginationData } from "@/types/api";
import type { IArticleItem, ICreateArticleForm, IUpdateArticleForm } from "@/types/article";

// fetch articles list
export function fetchArticles(pagination: IPagination, search: string) {
  return alovaInst.Get<PaginationData<IArticleItem>>("/api/articles", {
    params: {
      ...pagination,
      search,
    },
  });
}

// create article item
export function createArticle(data: ICreateArticleForm) {
  return alovaInst.Post("/api/articles", data);
}

// update article item by id
export const updateArticle = (id: string | number, data: IUpdateArticleForm) => {
  return alovaInst.Patch(`/api/articles/${id}`, data);
};

// delete article item by id
export const deleteArticle = (id: string | number) => alovaInst.Delete(`/api/articles/${id}`);
