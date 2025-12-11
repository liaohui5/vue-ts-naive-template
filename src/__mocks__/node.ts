import { type SetupServer, setupServer } from "msw/node";
import { handlers } from "./handlers";

// for node.js env
// https://msw.nodejs.cn/docs/api/setup-worker/start/
const server: SetupServer = setupServer(...handlers);
export const closeMockServer = () => server.close();
export const resetMockServer = () => server.resetHandlers();
export function startMockServer() {
  return server.listen({
    onUnhandledRequest: "bypass", // 忽略未处理的请求
  });
}
