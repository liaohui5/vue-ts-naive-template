import { describe, expect, it } from "vitest";
import { initMockHttp } from "@/__tests__/helpers";
import { genRequestId, REQUEST_ID_KEY, TOKEN_HEADER_KEY, withToken, withBearerToken } from "@/tools/http";
import { removeAccessToken, saveAccessToken } from "@/tools/token-manager";

describe("请求拦截器", () => {
  describe("生成请求id", () => {
    it(`应该给请求 params 参数添加 ${REQUEST_ID_KEY} 字段`, async () => {
      const { reply, send, getLastRequest } = initMockHttp(genRequestId);
      reply();

      await send();
      const { params } = getLastRequest();
      expect(params[REQUEST_ID_KEY]).toBeTypeOf("string");
    });

    it(`应该给请求 params 参数添加 ${REQUEST_ID_KEY} 字段, 并且不会影响其他 params 字段`, async () => {
      const { reply, send, getLastRequest } = initMockHttp(genRequestId);
      reply();

      await send({
        params: {
          foo: "foo",
          bar: "bar",
        },
      });

      const { params } = getLastRequest();
      expect(params.foo).toBe("foo");
      expect(params.bar).toBe("bar");
      expect(params[REQUEST_ID_KEY]).toBeTypeOf("string");
    });
  });

  describe("自动携带 token", () => {
    it(`如果有token, 将 token 将设置到 request headers 的 ${TOKEN_HEADER_KEY} 字段`, async () => {
      const { reply, send, getLastRequest } = initMockHttp(withToken);
      reply();

      // 防止其他 test case 会影响, 先删除 token
      removeAccessToken();
      await send();
      const { headers } = getLastRequest();
      expect(headers?.[TOKEN_HEADER_KEY]).toBe(undefined);

      // 保存 token 后再次发送
      saveAccessToken("mock-token");
      await send();
      const req = getLastRequest();
      expect(req.headers?.[TOKEN_HEADER_KEY]).toBe("mock-token");
    });

    it(`如果有token, 将 token 将设置到 request headers 的 ${TOKEN_HEADER_KEY} 字段`, async () => {
      const { reply, send, getLastRequest } = initMockHttp(withBearerToken);
      reply();

      // 防止其他 test case 会影响, 先删除 token
      removeAccessToken();
      await send();
      const { headers } = getLastRequest();
      expect(headers?.[TOKEN_HEADER_KEY]).toBe(undefined);

      // 保存 token 后再次发送
      saveAccessToken("mock-token");
      await send();
      const req = getLastRequest();

      // 所谓 Bearer 格式, 本质就是在 token 前面加上 Bearer 前缀, 类似: `Bearer ${token}`
      expect(req.headers?.[TOKEN_HEADER_KEY]).toBe("Bearer mock-token");
    });
  });
});
