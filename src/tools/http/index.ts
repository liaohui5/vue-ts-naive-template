import vueHook from "alova/vue";
import adapterFetch from "alova/fetch";
// import { axiosRequestAdapter } from "@alova/adapter-axios";
// import { axiosInst } from "@/tools/http/axiosInst";
import { createAlova } from "alova";
import { createServerTokenAuthentication } from "alova/client";
import { refreshAccessToken } from "@/api/auth";
import { logout } from "@/store/auth";
import { env, tokenManager } from "@/tools";
import { ErrnoEnum } from "./errno.enum";
import { withBearerToken } from "./interceptors/request";

// 自动刷新 token, 详情查看文档
// docs: https://alova.js.org/zh-CN/tutorial/client/strategy/token-authentication
export const TOKEN_HEADER_KEY = "Authorization";
const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication({
  refreshTokenOnSuccess: {
    isExpired: (res) => {
      // 如果服务端返回了 401 状态码: 说明 accessToken 过期
      // 需要用本地的 refreshToken 去获取新的 accessToken
      return res.status === ErrnoEnum.Unauthorized;
    },
    handler: async () => {
      try {
        // 当 isExpired 返回 true, 就执行这个函数去获取新的 accessToken
        const res = await refreshAccessToken();
        tokenManager.saveAccessToken(res.accessToken);
      } catch (e) {
        // handler 抛出异常, 证明 refreshAccessToken 这个方法没有正常
        // 获得新的 accessToken, 那就证明本地的 refreshToken 也过期了
        // 那就需要重新登录一次
        // 注: 要保持抛出异常, 否则会一直重试请求
        await logout();
        throw e;
      }
    },
  },
  assignToken: (alovaInst) => {
    // 自动过滤掉: "登录请求" 和 "访客请求", 如: method.meta = { authRole: null }
    // 然后自动在其他需要加上 accessToken 的请求发送前执行这个方法
    withBearerToken(alovaInst.config);
  },
});

function createAlovaInst() {
  return createAlova({
    // 响应式数据钩子
    statesHook: vueHook,

    // 设置缓存
    // cacheFor: env.DEV ? null : 5000,

    // 基础URL
    baseURL: env.VITE_APP_API_BASE_URL,

    // 注意阅读适配器文档
    // https://alova.js.org/zh-CN/resource/request-adapter/axios/
    // BUG: https://github.com/alovajs/alova/issues/772
    // requestAdapter: axiosRequestAdapter({
    //   axios: axiosInst,
    // }),
    requestAdapter: adapterFetch(),

    // @ts-ignore
    beforeRequest: onAuthRequired(),

    // @ts-ignore
    responded: onResponseRefreshToken(async (res) => {
      const body = await res.json();
      return body.data;
    }),
  });
}

export const alovaInst = createAlovaInst();
