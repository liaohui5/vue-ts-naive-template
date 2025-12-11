import type { App } from "vue";
import { createRouter, createWebHashHistory, type Router } from "vue-router";
import { setupRouterGuards } from "./guards";
import { routes } from "./routes";

export * from "./guards";
export * from "./routes";
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

// 方便在 script setup 外使用 router(比如单元测试)
let _router: Router | undefined;
export function setRouterInstance(router: Router) {
  _router = router;
}

export const getRouterInstance = () => _router;
