export type { ILoginForm } from "@/views/login/rules";

// 登录成功后,服务器返回的数据类型
export interface ILoginResponse {
  id: number; //            用户 id
  username: string; //      用户名
  email: string; //         用户邮箱
  avatar: string; //        用户头像
  accessToken: string; //   访问 token
  refreshToken: string; //  刷新 token
}

// 刷新 token 成功后,服务器返回的数据类型
export interface IRefreshTokenResponse {
  accessToken: string; // accessToken - 新的访问 token
}
