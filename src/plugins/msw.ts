import { startMockWorker } from "@/__mocks__/browser";
import { env } from "@/tools";

export async function setupMSW() {
  // only enable mock service worker in dev mode
  if (env.DEV && env.VITE_APP_USE_MSW) {
    await startMockWorker();
  }
}
