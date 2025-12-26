import * as z from "zod";

// 创建文章的验证规则
// title: 文章标题, 最少2个字符
// content: 文章内容, 最少2个字符
// author: 文章作者, 可以为空
export const createArticleZod = z.object({
  title: z.string().min(2, "标题不能少于2个字符"),
  content: z.string().min(2, "标题不能少于2个字符"),
  author: z.string(),
});
export const updateArticleZod = createArticleZod.partial();

export type ICreateArticleForm = z.infer<typeof createArticleZod>;
export type IUpdateArticleForm = z.infer<typeof updateArticleZod>;
