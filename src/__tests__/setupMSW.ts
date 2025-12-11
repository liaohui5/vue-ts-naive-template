import { afterAll, afterEach, beforeAll } from "vitest";
import { closeMockServer, resetMockServer, startMockServer } from "@/__mocks__/node";

// 启动 mock service worker
beforeAll(() => {
  // 确保测试环境用的是 mock service worker
  import.meta.env.VITE_APP_API_BASE_URL=""
  startMockServer();
});

// 关闭 mock service worker
afterAll(closeMockServer);

// 重置 mock service worker
afterEach(resetMockServer);
