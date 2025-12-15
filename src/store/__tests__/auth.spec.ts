import { createPinia, setActivePinia, storeToRefs } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetStorage, setupRouterMock } from "@/__tests__/helpers";
import { RouteNames } from "@/router";
import { AUTH_USER_KEY, useAuth } from "@/store/auth";
import { hasAccessToken, hasRefreshToken } from "@/tools/token-manager";
import { watchEffect } from "vue";

describe("auth store", () => {
  beforeEach(() => {
    resetStorage();
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("发送请求时候,应该自动设置 isLoading 的状态", async () => {
    // WARN: 其实这个可以不用测试了, 因为 loading 状态已经交给 alova 来管了
    // 不是由我们手动管理的, 所以可以不用测试 alova 这个库的具体实现行为
    // 但是:由于最开始没有使用 alova 来实现, 是手动管理的 loading 状态的
    // 所以加上这个测试用例吧,方便对比
    const store = useAuth();
    const callback = vi.fn();
    watchEffect(() => callback(store.isLoading));

    await store.login();
    expect(callback).toBeCalledTimes(3);
    expect(callback).toBeCalledWith(false); // default value
    expect(callback).toBeCalledWith(true); //  show loading
    expect(callback).toBeCalledWith(false); // hide loading
  });

  it("提交登陆表单进行请求的时候, 应该密文发送密码, 避免明文传输", async () => {
    const store = useAuth();

    // 通过数据验证 -> 发送登录请求
    const promise = store.login({
      account: "123456@example.com",
      password: "123456", // md5: e10adc3949ba59abbe56e057f20f883e
    });

    // 验证密码是否是密文传输
    expect(store.loginForm).toEqual({
      account: "123456@example.com",
      password: "e10adc3949ba59abbe56e057f20f883e",
    });

    await promise;
  });

  it("登录成功后,应该设置登录用户的数据和登录状态", async () => {
    const store = useAuth();
    const { isLogin, authUser } = storeToRefs(store);
    expect(isLogin.value).toBe(false);
    expect(authUser.value).toEqual({});

    // 通过数据验证 -> 发送登录请求
    await store.login({
      account: "123456@example.com",
      password: "123456",
    });
    expect(isLogin.value).toBe(true);
    expect(authUser.value).toHaveProperty("id");
  });

  it("登录成功后,应该保存 accessToken 和 refreshToken", async () => {
    const store = useAuth();
    expect(hasAccessToken()).toBe(false);

    await store.login({
      account: "123456@example.com",
      password: "123456",
    });

    expect(hasAccessToken()).toBe(true);
    expect(hasRefreshToken()).toBe(true);
  });

  it("登录成功后,应该保存已经登录的用户数据到 localStorage", async () => {
    expect(localStorage.getItem(AUTH_USER_KEY)).toBeNull();

    const store = useAuth();
    await store.login({
      account: "123456@example.com",
      password: "123456",
    });

    expect(localStorage.getItem(AUTH_USER_KEY)).not.toBeNull();
  });

  it("登录成功后,应该自动跳到首页", async () => {
    const routerMock = setupRouterMock();
    const store = useAuth();
    await store.login({
      account: "123456@example.com",
      password: "123456",
    });

    await routerMock.getPendingNavigation(); // 等待当前正在进行的导航完成
    expect(routerMock.currentRoute.value.name).toBe(RouteNames.Home);
  });

  it("退出登录后,应该删除已经登录的用户数据", async () => {
    const store = useAuth();

    // login first
    await store.login({
      account: "123456@example.com",
      password: "123456",
    });
    expect(store.isLogin).toBe(true);
    expect(store.authUser).not.toEqual({});

    // logout
    store.logout();

    expect(store.isLogin).toBe(false);
    expect(store.authUser).toEqual({});
  });

  it("退出登录后,应该删除 token", async () => {
    const store = useAuth();

    // login first
    await store.login({
      account: "123456@example.com",
      password: "123456",
    });
    expect(store.isLogin).toBe(true);
    expect(store.authUser).not.toEqual({});

    // logout
    store.logout();
    expect(hasAccessToken()).toBe(false);
    expect(hasRefreshToken()).toBe(false);
  });

  it("退出登录后,应该自动回到登录页", async () => {
    const routerMock = setupRouterMock();
    const store = useAuth();

    // logout
    await store.logout();
    await routerMock.getPendingNavigation(); // 等待当前正在进行的导航完成
    expect(routerMock.currentRoute.value.name).toBe(RouteNames.Login);
  });
});
