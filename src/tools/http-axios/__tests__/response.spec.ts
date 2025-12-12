import { describe, expect, it } from "vitest";
import { initMockHttp } from "@/__tests__/helpers";
import { unwrapData } from "@/tools/http-axios";

describe("响应拦截器", () => {
  describe("响应数据解包", () => {
    it("解包响应数据,响应体是对象, 并且有data字段直接返回响应体的 data 字段", async () => {
      const { reply, send } = initMockHttp(undefined, unwrapData);
      reply({
        data: {
          foo: "foo",
        },
      });

      await expect(send()).resolves.toEqual({ foo: "foo" });
    });

    it("解包响应数据, 响应体是对象, 没有 data 字段, 直接返回响应体", async () => {
      const { reply, send } = initMockHttp(undefined, unwrapData);
      reply({ foo: "foo" });

      await expect(send()).resolves.toEqual({ foo: "foo" });
    });
  });
});
