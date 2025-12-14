import { createApp } from "vue";
import { setupMSW } from "@/plugins/msw";
import { setupRouter } from "@/router";
import { setupStore } from "@/store";
import { setupNaiveUI } from "./plugins/naive-ui";

import App from "./App.vue";
import "./style.css";

async function bootstrap() {
  await setupMSW();
  const app = createApp(App);
  setupStore(app);
  setupNaiveUI();
  await setupRouter(app);
  app.mount("#app");
}

bootstrap();
