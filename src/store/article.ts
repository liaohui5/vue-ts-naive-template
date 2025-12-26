import { defineStore } from "pinia";
import * as api from "@/api/article";
import { CurdStore } from "./curd";

/**
 * 文章 CURD 类, 继承自 CURDStore, 用于管理文章列表
 */
class ArticleStore<IArticleItem> extends CurdStore<IArticleItem> {}

export const useArticle = defineStore("article", () => {
  // 直接返回这个类的实例对象, 让 pinia store 来管理状态
  return new ArticleStore({
    listApi: api.fetchArticles,
    createApi: api.createArticle,
    updateApi: api.updateArticle,
    deleteApi: api.deleteArticle,
  });
});
