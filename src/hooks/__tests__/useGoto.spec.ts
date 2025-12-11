import { describe, expect, it } from "vitest";
import { mountSetupComponentWithRouterMock } from "@/__tests__/helpers";
import { useGoto } from "@/hooks/useGoto";
import { RouteNames } from "@/router";

describe("useGoto", () => {
  describe("重定向", () => {
    it("应该重定向到登录页", async () => {
      const { router } = mountSetupComponentWithRouterMock(() => {
        // 这是在组件的 setup 函数中执行
        useGoto().redirect(RouteNames.Login);
      });
      await router.getPendingNavigation(); // 等待当前正在进行的导航完成
      expect(router.currentRoute.value.name).toBe(RouteNames.Login);
    });

    it("应该重定向到首页", async () => {
      const { router } = mountSetupComponentWithRouterMock(() => {
        useGoto().redirect(RouteNames.Home);
      });
      await router.getPendingNavigation();
      expect(router.currentRoute.value.name).toBe(RouteNames.Home);
    });
  });

  describe("跳转页面", () => {
    it("应该跳转登录页", async () => {
      const { router } = mountSetupComponentWithRouterMock(() => {
        useGoto().gotoPage(RouteNames.Login);
      });
      await router.getPendingNavigation();
      expect(router.currentRoute.value.name).toBe(RouteNames.Login);
    });

    it("应该跳转首页", async () => {
      const { router } = mountSetupComponentWithRouterMock(() => {
        useGoto().gotoPage(RouteNames.Home);
      });
      await router.getPendingNavigation();
      expect(router.currentRoute.value.name).toBe(RouteNames.Home);
    });
  });
});
