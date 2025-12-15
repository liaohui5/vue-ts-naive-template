import adapterFetch from "alova/fetch";
import vueHook from "alova/vue";
import { createAlova } from "alova";
import { createServerTokenAuthentication } from "alova/client";
import { genRequestId, withToken } from "./interceptors/request";
import { unwrapData } from "./interceptors/response";
import { env, tokenManager } from "@/tools";
import { refreshAccessToken } from "@/api/auth";
import { logout } from "@/store/auth";

// docs: https://alova.js.org/zh-CN/tutorial/client/strategy/token-authentication
const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication({
  refreshTokenOnSuccess: {
    isExpired: (res) => {
      // 如果服务端返回了 401 状态码: 说明 accessToken 过期
      // 需要用本地的 refreshToken 去获取新的 accessToken
      return res.status === 401;
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
        await logout();

        // 注: 要保持抛出异常, 否则会一直重试请求
        throw e;
      }
    },
  },
  assignToken: (alovaInst) => {
    // 自动过滤掉: "登录请求" 和 "访客请求", 如: method.meta = { authRole: null }
    // 然后自动在其他需要加上 accessToken 的请求发送前执行这个方法
    withToken(alovaInst);
  },
});

function createHttp() {
  return createAlova({
    baseURL: env.BASE_URL,
    statesHook: vueHook,
    requestAdapter: adapterFetch(),
    beforeRequest: onAuthRequired((alovaInst) => {
      genRequestId(alovaInst);
    }),
    responded: onResponseRefreshToken({
      // onComplete() {}
      async onSuccess(response, _alovaInst) {
        if (response.status >= 400) {
          throw new Error(response.statusText);
        }

        // res.data.code === 0
        const body = await response.json();
        if (body.code !== 0) {
          throw new Error(body.message);
        }

        // unwrap data -> res.data.data
        return unwrapData(body.data);
      },

      onError(error, alovaInst) {
        console.log("[请求出错了]", error, alovaInst);
      },
    }),
  });
}

export const http = createHttp();
