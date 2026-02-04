import * as z from "zod";

// 验证登录表单的规则
// account: 邮箱,必须是邮件格式
// password: 密,至少6位,最多16位
export const loginZod = z.object({
  account: z.email({ error: "邮箱格式有误" }),
  password: z.string().min(6, "密码至少6位").max(16, "密码最多16位"),
});

export type ILoginForm = z.infer<typeof loginZod>;
