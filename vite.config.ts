import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

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
        manualChunks(id) {
          if (id.includes("naive-ui")) return "naive-ui";
          if (id.includes("lodash-es")) return "lodash-es";
          if (id.includes("vue-router")) return "vue-router";
          if (id.includes("@iconify/vue")) return "iconify";
          if (id.includes("@vueuse/core")) return "vueuse";
          if (id.includes("vue")) return "vue";
          if (id.includes("pinia")) return "pinia";
        },
      },
    },
  },
});
