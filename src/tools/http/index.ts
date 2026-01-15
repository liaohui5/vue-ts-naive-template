import vueHook from "alova/vue";
import { createServerTokenAuthentication } from "alova/client";
import { createAlova } from "alova";
import { axiosRequestAdapter } from "@alova/adapter-axios";
import { axiosInst } from "@/tools/http/axiosInst";
import { refreshAccessToken } from "@/api/auth";
import { logout } from "@/store/auth";
import { env, tokenManager } from "@/tools";
import { ErrnoEnum } from "./errno.enum";

///////////////////////////////////////////////////////////////////////////////////
// 自动刷新 accessToken, 详情查看文档
// docs: https://alova.js.org/zh-CN/tutorial/client/strategy/token-authentication
///////////////////////////////////////////////////////////////////////////////////
export const TOKEN_HEADER_KEY = "Authorization";
const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication({
  // NOTE: https://github.com/alovajs/alova/issues/772
  refreshTokenOnError: {
    isExpired: (res) => {
      return res.status === ErrnoEnum.Unauthorized;
    },
    handler: async () => {
      try {
        const res = await refreshAccessToken();
        tokenManager.saveAccessToken(res.accessToken);
      } catch (e) {
        await logout();
        throw e;
      }
    },
  },
});

/////////////////////////////////////////////////////////////////
// 创建默认的 alova 实例
// 这个实例会使用 axiosInst 来发送请求
// 这个实例会自动去刷新 accessToken(当服务端返回 401 状态码之时)
/////////////////////////////////////////////////////////////////
export const alovaInst = createAlova({
  statesHook: vueHook,

  // 设置缓存
  /* @ts-ignore */
  cacheFor: env.DEV ? null : 5000,

  // 注意阅读适配器文档
  // https://alova.js.org/zh-CN/resource/request-adapter/axios/
  /* @ts-ignore */
  requestAdapter: axiosRequestAdapter({
    axios: axiosInst,
  }),

  // @ts-ignore
  beforeRequest: onAuthRequired(),

  // @ts-ignore
  responded: onResponseRefreshToken(),
});
