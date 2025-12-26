export type { ILoginForm } from "@/validation/auth.schema";

/**
 * 登录成功后,服务器返回的数据类型
 * @typedef {object} ILoginResponse
 * @property {number} id - 用户 id
 * @property {string} username - 用户名
 * @property {string} email - 用户邮箱
 * @property {string} avatar - 用户头像
 * @property {string} accessToken - 访问 token
 * @property {string} refreshToken - 刷新 token
 */
export interface ILoginResponse {
  id: number;
  username: string;
  email: string;
  avatar: string;
  accessToken: string;
  refreshToken: string;
}

/**
 * 刷新 token 成功后,服务器返回的数据类型
 * @typedef {object} IRefreshTokenResponse
 * @property {string} accessToken - 新的访问 token
 */
export interface IRefreshTokenResponse {
  accessToken: string;
}
