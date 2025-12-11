import { createDiscreteApi } from "naive-ui";
import { useTheme } from "@/store/theme";

function setupNaiveUIDiscreteApi() {
  const themeStore = useTheme();

  // https://www.naiveui.com/zh-CN/light/components/discrete
  const { message, dialog, notification, loadingBar } = createDiscreteApi(
    ["message", "dialog", "notification", "loadingBar"],
    { configProviderProps: themeStore.configProviderProps },
  );

  // WARNING: type declare in src/vite-env.d.ts
  window.$message = message;
  window.$dialog = dialog;
  window.$notification = notification;
  window.$loading = loadingBar;
}

function fixNaiveUIStyleConflict() {
  //  FIX: https://www.naiveui.com/zh-CN/light/docs/style-conflict
  const meta = document.createElement("meta");
  meta.name = "naive-ui-style";
  document.head.appendChild(meta);
}

export function setupNaiveUI() {
  fixNaiveUIStyleConflict();
  setupNaiveUIDiscreteApi();
}
