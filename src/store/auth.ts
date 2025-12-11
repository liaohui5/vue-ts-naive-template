import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import * as api from "@/api/auth";
import { $goto } from "@/hooks/useGoto";
import { log, tokenManager, encodePassword } from "@/tools";
import { showErrMsg } from "@/tools/notify";
import { useLoading } from "@/hooks/useLoading";
import type { LoginFormType, LoginResponseType } from "@/types/auth";

export const AUTH_USER_KEY = "__auth_user__";
export const useAuth = defineStore("auth", () => {
  const loginForm = ref<LoginFormType>({
    account: "",
    password: "",
  });
  function setLoginFormData(data?: LoginFormType) {
    if (!data) {
      return;
    }
    loginForm.value = encodePassword(data);
  }

  const $loading = useLoading();
  const authUser = useLocalStorage(AUTH_USER_KEY, {} as LoginResponseType);
  const isLogin = computed<boolean>(() => Boolean(authUser.value.id));
  function setAuthUser(authUer: LoginResponseType) {
    authUser.value = authUer;
  }

  async function login(data?: LoginFormType) {
    setLoginFormData(data);
    $loading.show();
    try {
      const loginRes = await api.login(loginForm.value);
      log("[authStore@login]登录接口响应", loginRes);
      setAuthUser(loginRes);
      tokenManager.saveAccessToken(authUser.value.accessToken);
      tokenManager.saveRefreshToken(authUser.value.refreshToken);
      await $goto.redirectToHome();
    } catch (e) {
      showErrMsg("登录失败,请稍后重试");
      log("[authStore@login]登录失败,请稍后重试:", e);
    } finally {
      $loading.hide();
    }
  }

  async function logout() {
    tokenManager.removeTokens();
    setAuthUser({} as LoginResponseType);
    $goto.redirectToLogin();
  }

  return {
    isLoading: $loading.isLoading,
    isLogin,
    authUser,
    loginForm,
    logout,
    login,
    setLoginFormData, // expose for unit test
  };
});
