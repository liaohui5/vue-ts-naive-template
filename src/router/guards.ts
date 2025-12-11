import type { Router } from "vue-router";
import { log, progress, tokenManager } from "@/tools";
import { RouteNames } from "./routes";

/**
 * 设置路由守卫
 * @param {VueRouter} router - vue-router 实例
 */
export function setupRouterGuards(router: Router) {
  setupProgressGuard(router);
  setupAuthGuard(router);
}

/**
 * 开发阶段会输出 router 调试信息
 * @param {VueRouter} router - vue-router 实例
 */
export function setupLoggerGuard(router: Router) {
  router.beforeEach(() => {
    log("=> beforeEach:", router);
  });
  router.afterEach(() => {
    log("=> afterEach:", router);
  });
}

/**
 * 进度条路由首页(表示加载状态)
 * @param {VueRouter} router - vue-router 实例
 * @description
 * 1. 切换路由之前开启进度条
 * 2. 切换路由之后关闭进度条
 */
export function setupProgressGuard(router: Router) {
  router.beforeEach(() => {
    progress.start();
  });
  router.afterEach(() => {
    progress.done();
  });
}

/**
 * 设置登录路由守卫
 * @param {VueRouter} router - vue-router 实例
 * @description
 * 1. 检查是否是公共路由
 * 2. 检查是否已经登录了
 * 3. 如果是公共路由, 或者已经登录了, 都可以继续访问
 * 4. 如果不是公共路由, 或者没有登录, 都重定向到登录页
 */
export function setupAuthGuard(router: Router) {
  router.beforeEach((to, _form, next) => {
    if (to.meta.isPublic || tokenManager.hasAccessToken()) {
      return next();
    }
    return next({ name: RouteNames.Login });
  });
}
