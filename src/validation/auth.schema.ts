import * as z from "zod";

// 登录表单数据验证规则
export const loginZod = z.object({
  account: z.email({ error: "邮箱格式有误" }),
  password: z.string().min(6, "密码至少6位").max(16, "密码最多16位"),
});

export type LoginFormType = z.infer<typeof loginZod>;

