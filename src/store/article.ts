import { defineStore } from "pinia";
import * as api from "@/api/article";
import { CurdStore } from "./curd";

class ArticleStore<IArticleItem> extends CurdStore<IArticleItem> {}

export const useArticle = defineStore("article", () => {
  return new ArticleStore({
    listApi: api.fetchArticles,
    createApi: api.createArticle,
    updateApi: api.updateArticle,
    deleteApi: api.deleteArticle,
  });
});
