/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),

    // 自动导入 naive-ui 组件
    AutoImport({
      imports: [
        "vue",
        {
          "naive-ui": ["useDialog", "useMessage", "useNotification", "useLoadingBar"],
        },
      ],
    }),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
  ],

  test: {
    // 测试相关配置: https://vitest.dev/
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./src/__tests__/setupMSW.ts"],
  },

  resolve: {
    // 路径别名配置
    alias: {
      "@": "/src/",
    },
  },

  build: {
    // 打包相关配置: https://cn.vite.dev/config/build-options
    target: "es2020",
    cssTarget: "chrome80",
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1024,

    // 打包的时的分包策略
    rollupOptions: {
      output: {
        manualChunks: {
          "naive-ui": ["naive-ui"],
          "lodash-es": ["lodash-es"],
          "vue-router": ["vue-router"],
          iconify: ["@iconify/vue"],
          vueuse: ["@vueuse/core"],
          vue: ["vue"],
          pinia: ["pinia"],
        },
      },
    },
  },
});
