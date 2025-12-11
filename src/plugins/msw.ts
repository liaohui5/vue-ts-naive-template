import { startMockWorker } from "@/__mocks__/browser";
import { env } from "@/tools";

export function setupMSW() {
  if (env.VITE_APP_MOCK_API_ENABLED) {
    startMockWorker();
  }
}
