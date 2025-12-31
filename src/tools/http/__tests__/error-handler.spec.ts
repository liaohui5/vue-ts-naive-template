import { describe, expect, it, vi } from "vitest";
import { initMockHttp } from "@/__tests__/helpers";
import {
  validationErrorHandler,
  internalErrorHandler,
  internalErrorMessage,
} from "@/tools/http/interceptors/error-handler";
import * as notifyModule from "@/tools/notify";
import { ErrnoEnum } from "@/tools/http/errno.enum";

vi.mock("@/tools/http-axios/interceptors/error-handler", {
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

  describe("处理参数验证错误", () => {
    it(`如果状态码不是 ${ErrnoEnum.FailedToValidate} 不要进行任何处理`, async () => {
      const { send, replyError } = initMockHttp(undefined, undefined, validationErrorHandler);
      replyError(ErrnoEnum.InternalError);

      await expect(send).rejects.toThrow();
    });
  });
});
