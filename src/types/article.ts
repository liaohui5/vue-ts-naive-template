export type { ICreateArticleForm, IUpdateArticleForm } from "@/views/home/rules";

export interface IArticleItem {
  id: number;
  author: string;
  author_id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
