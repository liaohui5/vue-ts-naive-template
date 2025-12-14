import { startMockWorker } from "@/__mocks__/browser";
import { env } from "@/tools";

export async function setupMSW() {
  if (env.VITE_APP_MOCK_API_ENABLED) {
    await startMockWorker();
  }
}
