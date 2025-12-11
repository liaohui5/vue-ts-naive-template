import { createPinia, setActivePinia, storeToRefs } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetStorage, setupRouterMock } from "@/__tests__/helpers";
import { RouteNames } from "@/router";
import { AUTH_USER_KEY, useAuth } from "@/store/auth";
import { hasAccessToken, hasRefreshToken } from "@/tools/token-manager";
import * as authApi from "@/api/auth";

describe("auth store", () => {
  beforeEach(() => {
    resetStorage();
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("提交登录表单应该设置loading状态, 提交完成后应该再次设置loading状态", async () => {
    const store = useAuth();
    expect(store.isLoading).toBe(false);

    const promise = store.login();
    expect(store.isLoading).toBe(true);

    await promise;
    expect(store.isLoading).toBe(false);
  });

  it("提交登陆表单进行请求的时候, 应该密文发送密码, 避免明文传输", async () => {
    const mockLoginApi = vi.fn(() => {
      return Promise.resolve({
        id: 1,
        username: "foo",
        email: "123456@example.com",
      } as any);
    });
    vi.spyOn(authApi, "login").mockImplementation(mockLoginApi);

    const store = useAuth();
    const { isLogin, authUser } = storeToRefs(store);
    expect(isLogin.value).toBe(false);
    expect(authUser.value).toEqual({});

    // 通过数据验证 -> 发送登录请求
    store.setLoginFormData({
      account: "123456@example.com",
      password: "123456", // md5: e10adc3949ba59abbe56e057f20f883e
    });
    await store.login();

    // 验证密码是否是密文传输
    expect(mockLoginApi).toBeCalledWith({
      account: "123456@example.com",
      password: "e10adc3949ba59abbe56e057f20f883e",
    });
  });

  it("登录成功后,应该设置登录用户的数据和登录状态", async () => {
    const store = useAuth();
    const { isLogin, authUser } = storeToRefs(store);
    expect(isLogin.value).toBe(false);
    expect(authUser.value).toEqual({});

    // 通过数据验证 -> 发送登录请求
    store.setLoginFormData({
      account: "123456@example.com",
      password: "123456",
    });
    await store.login();
    expect(isLogin.value).toBe(true);
    expect(authUser.value).toHaveProperty("id");
  });

  it("登录成功后,应该保存 accessToken 和 refreshToken", async () => {
    const store = useAuth();
    expect(hasAccessToken()).toBe(false);

    store.setLoginFormData({
      account: "123456@example.com",
      password: "123456",
    });
    await store.login();

    expect(hasAccessToken()).toBe(true);
    expect(hasRefreshToken()).toBe(true);
  });

  it("登录成功后,应该保存已经登录的用户数据到 localStorage", async () => {
    expect(localStorage.getItem(AUTH_USER_KEY)).toBeNull();

    const store = useAuth();
    store.setLoginFormData({
      account: "123456@example.com",
      password: "123456",
    });
    await store.login();

    expect(localStorage.getItem(AUTH_USER_KEY)).not.toBeNull();
  });

  it("登录成功后,应该自动跳到首页", async () => {
    const routerMock = setupRouterMock();
    const store = useAuth();
    store.setLoginFormData({
      account: "123456@example.com",
      password: "123456",
    });
    await store.login();

    await routerMock.getPendingNavigation(); // 等待当前正在进行的导航完成
    expect(routerMock.currentRoute.value.name).toBe(RouteNames.Home);
  });

  it("退出登录后,应该删除已经登录的用户数据", async () => {
    const store = useAuth();

    // login first
    store.setLoginFormData({
      account: "123456@example.com",
      password: "123456",
    });
    await store.login();
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
    store.setLoginFormData({
      account: "123456@example.com",
      password: "123456",
    });
    await store.login();
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

    // login first
    store.setLoginFormData({
      account: "123456@example.com",
      password: "123456",
    });
    await store.login();
    expect(store.isLogin).toBe(true);

    // logout
    store.logout();
    await routerMock.getPendingNavigation(); // 等待当前正在进行的导航完成
    expect(routerMock.currentRoute.value.name).toBe(RouteNames.Login);
  });
});
