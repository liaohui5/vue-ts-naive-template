import * as z from "zod";
import { zocker } from "zocker";

// 仅模拟登录接口数据用的 schema
// 可以直接根据验证规则来生成符合规则的数据
const loginResponseZod = z.object({
  id: z.number(),
  username: z.string(),
  email: z.email(),
  avatar: z.url(),
  accessToken: z.uuidv4(),
  refreshToken: z.uuidv4(),
});

// 导出模拟数据: mockLoginResponse.generate()
export const mockLoginResponse = zocker(loginResponseZod);
export type LoginResponseType = z.infer<typeof loginResponseZod>;

// 刷新 accessToken 接口数据用的 schema
const refreshAccessTokenZod = z.object({
  refreshToken: z.uuidv4(),
});
export const mockRefreshAccessToken = zocker(refreshAccessTokenZod);
export type RefreshAccessTokenType = z.infer<typeof refreshAccessTokenZod>;
