import { config, mount } from "@vue/test-utils";
import AxiosMockAdapter from "axios-mock-adapter";
import { vi } from "vitest";
import {
  createRouterMock,
  injectRouterMock,
  type RouterMock,
  type RouterMockOptions,
  VueRouterMock,
} from "vue-router-mock";
import { routes, setRouterInstance, setupRouterGuards } from "@/router";
import {
  createHttpClient,
  type ErrorInterceptor,
  type RequestInterceptor,
  type ResponseInterceptor,
} from "@/tools/http-axios";

/**
 * 设置路由模拟器(RouterMock 是专门用于测试 vue-router 的库)
 *
 * 此函数用于创建和配置一个路由模拟器，该模拟器可以在测试环境中模拟路由行为
 * 它允许根据提供的配置选项自定义路由模拟的行为，例如是否使用实际导航，是否运行路由守卫等
 *
 * @returns 返回一个配置好的路由模拟器实例
 */
export function setupRouterMock(): RouterMock {
  const options: RouterMockOptions = {
    routes,
    useRealNavigation: true, // 使用真实的导航会调用路由守卫, 如果为 false 则不会调用路由守卫
  };

  const routerMock = createRouterMock({
    spy: {
      create: (fn) => vi.fn(fn),
      reset: (spy) => spy.mockClear(),
    },
    ...options,
  });

  setupRouterGuards(routerMock);
  setRouterInstance(routerMock);
  return routerMock;
}

/**
 * 利用  Vue Test Utils 和 VueRouterMock 模拟设置组件测试环境
 *
 * @param setup - 组件的 setup 函数
 * @returns 返回一个包含组件和路由模拟器实例的对象
 */
export function mountSetupComponentWithRouterMock(setup: () => void) {
  // 为 Vue Test Utils 安装插件, 添加 routerMock 实例到 VueWrapper
  // https://test-utils.vuejs.org/zh/guide/extending-vtu/plugins.html
  config.plugins.VueWrapper.install(VueRouterMock);
  const routerMock = setupRouterMock();
  injectRouterMock(routerMock);

  const vueComponentWithRouterMock = {
    render() {},
    setup,
  };

  const wrapper = mount(vueComponentWithRouterMock);
  const router = wrapper.router;

  // 注入之前先重置路由状态, 如果不重置的话, 会被路由守卫影响
  // 路由守卫的测试逻辑在 router.spec.ts 中做测试
  // 如果你希望在测试组件的时候一起测试路由守卫, 也可以注释它
  router.reset();

  return {
    wrapper,
    router,
  };
}

// 重置 localStorage 和 sessionStorage 状态
export function resetStorage() {
  localStorage.clear();
  sessionStorage.clear();
}

// 初始化模拟 axios-mock-adapter 及一些助手函数
export function initMockHttp(
  reqInterceptor?: RequestInterceptor,
  resInterceptor?: ResponseInterceptor,
  errInterceptor?: ErrorInterceptor,
) {
  const reqInterceptors: Array<RequestInterceptor> = [];
  const resInterceptors: Array<ResponseInterceptor> = [];
  const errInterceptors: Array<ErrorInterceptor> = [];
  if (reqInterceptor) {
    reqInterceptors.push(reqInterceptor);
  }
  if (resInterceptor) {
    resInterceptors.push(resInterceptor);
  }
  if (errInterceptor) {
    errInterceptors.push(errInterceptor);
  }

  const mockClient = createHttpClient({}, reqInterceptors, resInterceptors, errInterceptors);
  const mockServer = new AxiosMockAdapter(mockClient);
  mockServer.reset();

  // 模拟请求的响应
  function reply<T extends object>(body?: T, headers?: T, status: number = 200) {
    mockServer.onGet("/mock-request").reply(status, body, headers || {});
  }

  // 模拟错误请求
  function replyError(status: number = 500) {
    return mockServer.onGet("/mock-request").reply(status);
  }

  // 模拟发送请求
  function send(opts = {}) {
    return mockClient.get("/mock-request", opts);
  }

  // 获取最后一个请求的信息
  function getLastRequest() {
    const requests = mockServer.history.get;
    return requests[requests.length - 1];
  }

  return {
    mockClient,
    mockServer,
    reply,
    replyError,
    send,
    getLastRequest,
  };
}
