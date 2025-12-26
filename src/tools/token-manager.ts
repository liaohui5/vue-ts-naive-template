/**
 * tokenManager 工具类, 用于管理 accessToken 和 refreshToken
 * @class tokenManager
 */
export const __ACCESS_TOKEN_KEY__ = "__access_token__";
export const __REFRESH_TOKEN_KEY__ = "__refresh_token__";
export const storage = window.localStorage;

export const getAccessToken = () => storage.getItem(__ACCESS_TOKEN_KEY__);
export const hasAccessToken = () => Boolean(getAccessToken());
export const saveAccessToken = (token: string) => storage.setItem(__ACCESS_TOKEN_KEY__, token);
export const removeAccessToken = () => storage.removeItem(__ACCESS_TOKEN_KEY__);

export const getRefreshToken = () => storage.getItem(__REFRESH_TOKEN_KEY__);
export const hasRefreshToken = () => Boolean(getRefreshToken());
export const saveRefreshToken = (token: string) => storage.setItem(__REFRESH_TOKEN_KEY__, token);
export const removeRefreshToken = () => storage.removeItem(__REFRESH_TOKEN_KEY__);

/**
 * 删除所有的 token, 包括 accessToken 和 refreshToken
 */
export const removeTokens = () => {
  removeAccessToken();
  removeRefreshToken();
};

/**
 * 获取带有 Bearer 前缀的 accessToken
 * @returns {string} - 带有 Bearer 前缀的 accessToken
 */
export const getBearerToken = () => `Bearer ${getAccessToken()}`;
