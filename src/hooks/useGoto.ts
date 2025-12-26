import { getRouterInstance, RouteNames } from "@/router";

/**
 * useGoto 是一个帮助函数, 用于在组件中进行路由跳转
 * useGoto 返回一个对象, 该对象包含以下方法:
 * gotoHome: 跳转到首页
 * redirect: 重定向到指定的路由
 * gotoPage: 跳转到指定的路由
 * redirectToLogin: 重定向到登录页
 * redirectToHome: 重定向到首页
 */
export const $goto = useGoto();

/**
 * useGoto 是一个帮助函数, 用于在组件中进行路由跳转
 *
 * @function gotoHome 跳转到首页
 * @function redirect 重定向到指定的路由
 * @function gotoPage 跳转到指定的路由
 * @function redirectToLogin 重定向到登录页
 * @function redirectToHome 重定向到首页
 */
export function useGoto() {
  /**
   * 重定向到指定的路由
   * @param {RouteNames} RouteName 需要重定向的路由名称
   * @param {Object} [params] 重定向时携带的参数
   * @return {Promise<void>} 重定向的 Promise
   */
  function redirect(RouteName: RouteNames, params = {}) {
    return getRouterInstance()?.replace({ name: RouteName, params });
  }

  /**
   * 跳转到指定的路由
   * @param {RouteNames} RouteName 需要重定向的路由名称
   * @param {Object} [params] 重定向时携带的参数
   * @return {Promise<void>} 重定向的 Promise
   */
  function gotoPage(RouteName: RouteNames, params = {}) {
    return getRouterInstance()?.push({ name: RouteName, params });
  }

  const redirectToLogin = () => redirect(RouteNames.Login);
  const redirectToHome = () => redirect(RouteNames.Home);
  const gotoHome = () => gotoPage(RouteNames.Home);

  return {
    gotoHome,
    redirect,
    gotoPage,
    redirectToLogin,
    redirectToHome,
  };
}
