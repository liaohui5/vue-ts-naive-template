import { beforeEach, describe, expect, it, vi } from "vitest";
import { REQUEST_ID_KEY } from "@/tools/http-alova/interceptors/request";
import { genRequestId, TOKEN_HEADER_KEY, withBearerToken, withToken } from "@/tools/http-axios";
import * as tools from "@/tools";
import { hasAccessToken, removeTokens, saveAccessToken } from "@/tools/token-manager";

describe("请求拦截器", () => {
  beforeEach(() => {
    removeTokens();
    vi.resetAllMocks();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  describe("给每个请求生成请求ID", () => {
    it(`应该给请求 params 参数添加 ${REQUEST_ID_KEY} 字段`, async () => {
      vi.spyOn(tools, "uuid").mockImplementation(() => "mock-uuid-str");

      const mockAlovaInst: any = {
        params: {},
      };

      genRequestId(mockAlovaInst);
      expect(mockAlovaInst.params).toHaveProperty(REQUEST_ID_KEY);
      expect(mockAlovaInst.params[REQUEST_ID_KEY]).toBe("mock-uuid-str");
    });

    it(`应该给请求 params 参数添加 ${REQUEST_ID_KEY} 字段, 并且不会影响其他 params 字段`, async () => {
      vi.spyOn(tools, "uuid").mockImplementation(() => "mock-uuid-str");

      const mockAlovaInst: any = {
        params: {
          foo: "bar",
        },
      };

      genRequestId(mockAlovaInst);
      expect(mockAlovaInst).toEqual({
        params: {
          [REQUEST_ID_KEY]: "mock-uuid-str",
          foo: "bar",
        },
      });
    });
  });

  describe("自动携带 token", () => {
    it(`如果有token, 将 token 将设置到 request headers 的 ${TOKEN_HEADER_KEY} 字段`, async () => {
      expect(hasAccessToken()).toBe(false);

      // mock login status
      saveAccessToken("mock-access-token-str");
      expect(hasAccessToken()).toBe(true);

      const mockAlovaInst: any = {
        headers: {},
      };

      withToken(mockAlovaInst);
      expect(mockAlovaInst).toEqual({
        headers: {
          [TOKEN_HEADER_KEY]: "mock-access-token-str",
        },
      });
    });

    it(`如果有token, 将 token 将设置到 request headers 的 ${TOKEN_HEADER_KEY} 字段(bearer 格式)`, async () => {
      expect(hasAccessToken()).toBe(false);

      // mock login status
      saveAccessToken("mock-access-token-str");
      expect(hasAccessToken()).toBe(true);

      const mockAlovaInst: any = {
        headers: {},
      };

      withBearerToken(mockAlovaInst);
      expect(mockAlovaInst).toEqual({
        headers: {
          [TOKEN_HEADER_KEY]: "Bearer mock-access-token-str",
        },
      });
    });
  });
});
