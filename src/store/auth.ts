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
  const loginForm = ref<ILoginForm>({ account: "", password: "" });
  const authUser = useLocalStorage<ILoginResponse>(AUTH_USER_KEY, {} as ILoginResponse);
  const isLogin = computed<boolean>(() => Boolean(authUser.value.id));

  function _setLoginFormData(data?: ILoginForm) {
    if (!data) return;
    loginForm.value = encodePassword(data);
  }

  function setAuthUser(authUer: ILoginResponse) {
    authUser.value = authUer;
  }

  const { loading: isLoading, send: sendLoginRequest } = useRequest((data: ILoginForm) => api.login(data), {
    initialData: {} as ILoginResponse,
    immediate: false,
  })
    .onSuccess(({ data }) => {
      log("[authStore@login]登录接口响应", data);
      setAuthUser(data);
      tokenManager.saveAccessToken(data.accessToken);
      tokenManager.saveRefreshToken(data.refreshToken);
      $goto.redirectToHome();
    })
    .onError((alovaInst) => {
      showErrMsg("登录失败,请稍后重试");
      log("[authStore@login]登录失败,请稍后重试:", alovaInst);
    });

  function login(data?: ILoginForm) {
    _setLoginFormData(data);
    return sendLoginRequest(loginForm.value);
  }

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

// use logout outside of setup script
export const logout = () => useAuth().logout();
