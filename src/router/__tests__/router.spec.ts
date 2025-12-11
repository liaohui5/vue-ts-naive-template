import { describe, expect, it, vi } from "vitest";
import { setupRouterMock } from "@/__tests__/helpers";
import { RouteNames } from "@/router";
import { progress, tokenManager } from "@/tools";

describe("router", () => {
  describe("检查登录路由守卫", () => {
    it("没有登录时,访问需要登录的页面应该重定向到登录页", async () => {
      tokenManager.removeTokens(); // 删除 token, 验证登录需要用到 token 是否存在
      expect(tokenManager.hasAccessToken()).toBe(false);

      const routerMock = setupRouterMock();
      await routerMock.push({ name: RouteNames.Home });

      expect(routerMock.currentRoute.value.name).toBe(RouteNames.Login);
    });

    it("已经登录后,访问需要登录的页面应该正常访问", async () => {
      tokenManager.saveAccessToken("some-token-string"); // 模拟登录的状态

      const routerMock = setupRouterMock();
      await routerMock.push({ name: RouteNames.Home });

      expect(routerMock.currentRoute.value.name).toBe(RouteNames.Home);
    });
  });

  describe("路由切换进度条路由守卫", () => {
    it("切换路由之前开启进度条,切换路由之后关闭进度条", async () => {
      // mock
      vi.spyOn(progress, "start");
      vi.spyOn(progress, "done");
      const routerMock = setupRouterMock();

      await routerMock.push({ name: RouteNames.Login });
      expect(progress.start).toBeCalled();
      expect(progress.done).toBeCalled();
    });
  });
});
