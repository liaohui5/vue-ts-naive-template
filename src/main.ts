import { createApp } from "vue";
import { setupMSW } from "@/plugins/msw";
import { setupRouter } from "@/router";
import { setupStore } from "@/store";
import { setupNaiveUI } from "./plugins/naive-ui";

import App from "./App.vue";
import "./style.css";

/**
 * Bootstrap the Vue application.
 *
 * 1. Set up the Mock Service Worker.
 * 2. Create the Vue application instance.
 * 3. Set up the Pinia store.
 * 4. Set up the Naive UI plugin.
 * 5. Set up the Vue Router.
 * 6. Mount the application to the "#app" element.
 */
async function bootstrap() {
  await setupMSW();
  const app = createApp(App);
  setupStore(app);
  setupNaiveUI();
  await setupRouter(app);
  app.mount("#app");
}

bootstrap();
