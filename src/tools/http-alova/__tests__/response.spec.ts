import { describe, it, expect } from "vitest";
import { unwrapData } from "@/tools/http-alova/interceptors/response";

describe("响应拦截器", () => {
  describe("响应数据解包", () => {
    it("解包响应数据,响应体是对象, 并且有data字段直接返回响应体的 data 字段", async () => {
      const unwrapped = unwrapData({
        data: {
          foo: "bar",
        },
      });

      expect(unwrapped).toEqual({
        foo: "bar",
      });
    });

    it("解包响应数据, 响应体是对象, 没有 data 字段, 直接返回响应体", async () => {
      const unwrapped = unwrapData({
        foo: "bar",
      });

      expect(unwrapped).toEqual({
        foo: "bar",
      });
    });
  });
});
