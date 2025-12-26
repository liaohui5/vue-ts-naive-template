import { startMockWorker } from "@/__mocks__/browser";
import { env } from "@/tools";

/**
 * 启动 mock service worker
 * 仅仅在开发环境使用并且允许使用MSW的时候启动服务
 */
export async function setupMSW() {
  if (env.DEV && env.VITE_APP_USE_MSW) {
    await startMockWorker();
  }
}
