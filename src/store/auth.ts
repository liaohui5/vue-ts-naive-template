import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import * as api from "@/api/auth";
import { $goto } from "@/hooks/useGoto";
import { log, tokenManager, encodePassword } from "@/tools";
import { showErrMsg } from "@/tools/notify";
import type { ILoginForm, ILoginResponse } from "@/types/auth";
import { useRequest } from "alova/client";

export const AUTH_USER_KEY = "__auth_user__";
export const useAuth = defineStore("auth", () => {
  // 真正放到请求中发送的登录数据
  const loginForm = ref<ILoginForm>({ account: "", password: "" });
  function _setLoginFormData(data?: ILoginForm) {
    if (!data) return;
    loginForm.value = encodePassword(data);
  }

  // 登录后的用户信息
  const authUser = useLocalStorage<ILoginResponse>(AUTH_USER_KEY, {} as ILoginResponse);
  const isLogin = computed<boolean>(() => Boolean(authUser.value.id));

  // 设置登录后的用户信息
  function setAuthUser(authUer: ILoginResponse) {
    authUser.value = authUer;
  }

  // 发送登录请求
  const { loading: isLoading, send: sendLoginRequest } = useRequest((data: ILoginForm) => api.login(data), {
    initialData: {} as ILoginResponse,
    immediate: false,
  })
    .onSuccess(({ data }) => {
      // 请求成功时
      log("[authStore@login]登录接口响应", data);
      setAuthUser(data);
      if (data.accessToken && data.refreshToken) {
        tokenManager.saveAccessToken(data.accessToken);
        tokenManager.saveRefreshToken(data.refreshToken);
        $goto.redirectToHome();
        return;
      }
    })
    .onError((alovaInst) => {
      // 请求失败时
      showErrMsg("登录失败,请稍后重试");
      log("[authStore@login]登录失败,请稍后重试:", alovaInst);
    });

  // 登录
  function login(data?: ILoginForm) {
    _setLoginFormData(data);
    return sendLoginRequest(loginForm.value);
  }

  // 注销
  async function logout() {
    showErrMsg("请先登录");
    tokenManager.removeTokens();
    setAuthUser({} as ILoginResponse);
    return $goto.redirectToLogin();
  }

  return {
    isLoading,
    isLogin,
    authUser,
    loginForm,
    logout,
    login,
  };
});

// 方便在 <script setup> 外部使用注销登录方法
export const logout = () => useAuth().logout();
