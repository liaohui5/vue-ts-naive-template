import type { App } from "vue";
import { createRouter, createWebHashHistory, type Router } from "vue-router";
import { setupRouterGuards } from "./guards";
import { routes } from "./routes";

export * from "./guards";
export * from "./routes";

/**
 * 设置路由实例
 * @param app - vue 应用实例
 * @returns 路由是否已经 ready
 */
export function setupRouter(app: App) {
  const router = createRouter({
    history: createWebHashHistory(),
    routes,
  });

  setupRouterGuards(router);
  setRouterInstance(router);

  app.use(router);

  return router.isReady();
}

// vueRouter 实例对象
// 方便在 script setup 外使用 router(比如单元测试)
let _router: Router | undefined;

/**
 * 设置 router 实例, 用于在 setup router 之外使用 router
 * @param router - router 实例
 */
export function setRouterInstance(router: Router) {
  _router = router;
}

/**
 * 获取 router 实例, 用于在 setup router 之外使用 router
 * @returns router - router 实例
 */
export const getRouterInstance = () => _router;
