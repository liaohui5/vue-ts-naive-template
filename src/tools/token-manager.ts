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

export const removeTokens = () => {
  removeAccessToken();
  removeRefreshToken();
};

export const getBearerToken = () => `Bearer ${getAccessToken()}`;
