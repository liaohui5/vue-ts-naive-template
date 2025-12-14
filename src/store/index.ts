import { createPinia } from "pinia";
import type { App } from "vue";

/**
 * @description: 在app上安装pinia
 * @param {Object} app - app实例
 */
export function setupStore(app: App) {
  app.use(createPinia());
}

export * from "pinia";
export * from "@/store/auth";
export * from "@/store/theme";
export * from "@/store/article";
