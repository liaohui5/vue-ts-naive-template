export type { ICreateArticleForm, IUpdateArticleForm } from "@/views/home/rules";

export interface IArticleItem {
  id: number;
  author: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
