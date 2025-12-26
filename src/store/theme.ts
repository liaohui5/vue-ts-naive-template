import { type ConfigProviderProps, lightTheme, darkTheme, zhCN, dateZhCN } from "naive-ui";
import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, watchEffect } from "vue";
import { lighten, setHtmlTheme } from "@/tools/index";

export const APP_THEME = "__app_theme_key__";
export const useTheme = defineStore("theme", () => {
  const appTheme = useLocalStorage<"light" | "dark">(APP_THEME, "light");
  // 设置 html 标签的主题
  watchEffect(() => setHtmlTheme(appTheme.value));
  const isDarkTheme = computed(() => appTheme.value === "dark");
  const primaryColor = computed(() => "#2d8cf0"); // 主颜色

  /**
   * 设置主题
   * @param {boolean} isDark - 是否是暗黑主题
   */
  function setAppTheme(isDark: boolean) {
    appTheme.value = isDark ? "dark" : "light";
  }

  /**
   * 切换主题
   */
  function switchAppTheme() {
    if (isDarkTheme.value) {
      appTheme.value = "light";
    } else {
      appTheme.value = "dark";
    }
  }

  const configProviderProps = computed<ConfigProviderProps>(() => ({
    theme: isDarkTheme.value ? darkTheme : lightTheme,
    locale: zhCN,
    dateLocale: dateZhCN,
    themeOverrides: {
      common: {
        // https://www.naiveui.com/zh-CN/light/docs/theme#use-theme-vars
        primaryColor: primaryColor.value,
        primaryColorHover: lighten(primaryColor.value, 6),
        primaryColorPressed: lighten(primaryColor.value, 6),
      },
      Button: {
        textColor: primaryColor.value,
      },
      LoadingBar: {
        colorLoading: primaryColor.value,
      },
    },
  }));

  return {
    isDarkTheme,
    appTheme,
    setAppTheme,
    switchAppTheme,
    configProviderProps,
  };
});
