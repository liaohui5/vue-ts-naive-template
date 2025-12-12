import adapterFetch from "alova/fetch";
import vueHook from "alova/vue";
import { createAlova } from "alova";
import { createServerTokenAuthentication } from "alova/client";
import { genRequestId } from "./interceptors/request";
import { unwrapData } from "./interceptors/response";
import { env } from "@/tools";
import { refreshAccessToken } from "@/api/auth";
// import { tokenManager } from "@/tools/token-manager";

// docs: https://alova.js.org/zh-CN/tutorial/client/strategy/token-authentication
const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication({
  refreshTokenOnSuccess: {
    isExpired: (res: Response) => res.status === 401,
    handler: async () => {
      // TODO: optimize it
      const { accessToken } = await refreshAccessToken();
      console.log("[refreshTokenOnSuccess]", accessToken);
      // tokenManager.saveAccessToken(accessToken);
    },
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
        const json = await response.json();
        if (json.code !== 0) {
          throw new Error(json.message);
        }

        // unwrap data
        return unwrapData(json.data);
      },

      onError(error, alovaInst) {
        console.log("[请求出错了]", error, alovaInst);
      },
    }),
  });
}

export const http = createHttp();
export const $http = createAlova({
  statesHook: vueHook,
  requestAdapter: adapterFetch(),
});
