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
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./src/__tests__/setupMSW.ts"],
  },

  resolve: {
    alias: {
      "@": "/src/",
    },
  },
  build: {
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
          iconify: ["@iconify/iconify"],
          vueuse: ["@vueuse/core"],
          vue: ["vue"],
          pinia: ["pinia"],
        },
      },
    },
  },
});
