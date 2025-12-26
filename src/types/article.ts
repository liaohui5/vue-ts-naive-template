export type { ICreateArticleForm, IUpdateArticleForm } from "@/views/home/rules";


/**
 * 文章项的数据类型
 * @property {number} id - 文章 id
 * @property {string} author - 文章作者
 * @property {string} title - 文章标题
 * @property {string} content - 文章内容
 * @property {string} createdAt - 文章创建时间
 * @property {string} updatedAt - 文章更新时间
 */
export interface IArticleItem {
  id: number;
  author: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
