import { type SetupWorker, setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// for browser env
// https://msw.nodejs.cn/docs/api/setup-worker/start/
const worker: SetupWorker = setupWorker(...handlers);
export const startMockWorker = () => {
  return worker.start({
    onUnhandledRequest: "bypass",
    quiet: false, // enable debug output
  });
};
