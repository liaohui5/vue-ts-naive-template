import { beforeEach, describe, expect, it, vi } from "vitest";
import { initMockHttp } from "@/__tests__/helpers";
import {
  createAccessTokenExpiredHandler,
  ErrnoEnum,
  validationErrorHandler,
  internalErrorHandler,
  internalErrorMessage,
} from "@/tools/http/interceptors/error-handler";
import { removeAccessToken, saveRefreshToken, removeRefreshToken } from "@/tools/token-manager";
import * as httpModule from "@/tools/http";
import * as notifyModule from "@/tools/notify";

vi.mock("@/tools/http/interceptors/error-handler", {
  spy: true,
});

vi.mock("@/tools/notify", {
  spy: true,
});

describe("错误处理拦截器", () => {
  it(`处理状态码为 ${ErrnoEnum.InternalError} 的服务器内部错误`, async () => {
    const { send, replyError } = initMockHttp(undefined, undefined, internalErrorHandler);
    replyError(ErrnoEnum.InternalError);
    await expect(send).rejects.toThrow();
    expect(notifyModule.showErrMsg).toBeCalledWith(internalErrorMessage);
  });

  describe("自动刷新AccessToken", () => {
    // 模拟刷新 accessToken 的请求
    const requestNewAccessToken = vi.fn(() => Promise.resolve("new-access-token"));

    beforeEach(() => {
      vi.resetAllMocks();
    });

    it(`如果响应状态码不是 ${ErrnoEnum.Unauthorized}, 应该不做任何处理`, async () => {
      const errInterceptor = createAccessTokenExpiredHandler(requestNewAccessToken);
      const { send, replyError } = initMockHttp(undefined, undefined, errInterceptor);

      replyError(ErrnoEnum.InternalError);

      await expect(send).rejects.toThrow(); // 抛出异常
      expect(requestNewAccessToken).not.toBeCalled();
    });

    it(`如果没有 refreshToken, 应该不做任何处理`, async () => {
      // 确保没有 refreshToken, 防止其他测试用例影响
      removeRefreshToken();

      const errInterceptor = createAccessTokenExpiredHandler(requestNewAccessToken);
      const { send, replyError } = initMockHttp(undefined, undefined, errInterceptor);

      replyError(ErrnoEnum.Unauthorized);
      await expect(send).rejects.toThrow();
    });

    it(`如果响应状态码是 ${ErrnoEnum.Unauthorized}, 应该尝试刷新 accessToken 并重新发送请求`, async () => {
      saveRefreshToken("test-refresh-token");
      removeAccessToken();

      const errInterceptor = createAccessTokenExpiredHandler(requestNewAccessToken);
      let { mockServer, mockClient } = initMockHttp(undefined, undefined, errInterceptor);

      const mockRetry = vi.spyOn(httpModule, "retryFailedRequest").mockImplementation((_, config) => {
        return mockClient.request(httpModule.withBearerToken(config));
      });

      mockServer.onGet("/protected").reply((config) => {
        console.log("\n\n\n>>> mockServer.onGet('/protected').replay()", config.headers);
        return {
          // 第一次请求由于没有 AccessToken, 会返回 401
          // 后续再次请求的时候携带了 AccessToken, 会返回 200
          status: Boolean(config.headers!.Authorization) ? 200 : 401,
          data: {},
        };
      });

      const res = await mockClient.get("/protected");
      expect(requestNewAccessToken).toBeCalled(); // 调用了请求新 accessToken 方法
      expect(mockRetry).toBeCalled();
      expect(mockServer.history.get.length).toBe(2);
      expect(res.status).toBe(200); // 这是第二次携带 accessToken 后发送请求获取的结果
    });

    it(`如果刷新 accessToken 失败, 则直接返回原响应`, async () => {
      saveRefreshToken("test-refresh-token");
      removeAccessToken();

      // 获取新 AccessToken 失败
      const fetchNewAccessToken = vi.fn(() => Promise.resolve(""));
      const errInterceptor = createAccessTokenExpiredHandler(fetchNewAccessToken);
      let { mockServer, send, replyError } = initMockHttp(undefined, undefined, errInterceptor);

      replyError(ErrnoEnum.Unauthorized);
      await expect(send).rejects.toThrow();
      expect(fetchNewAccessToken).toBeCalled();
      expect(mockServer.history.get.length).toBe(1); // 只请求了一次, 说明没有重新发送已失败的请求
    });
  });

  describe("处理参数验证错误", () => {
    it(`如果状态码不是 ${ErrnoEnum.FailedToValidate} 不要进行任何处理`, async () => {
      const { send, replyError } = initMockHttp(undefined, undefined, validationErrorHandler);
      replyError(ErrnoEnum.InternalError);

      await expect(send).rejects.toThrow();
    });
  });
});
