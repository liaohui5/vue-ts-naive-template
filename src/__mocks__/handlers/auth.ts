import { http, HttpResponse } from "msw";
import { success, mockLoginResponse, mockRefreshTokenResponse } from "@/__mocks__/mocks";

// 模拟登录接口的响应
export const login = http.post("/api/login", () => {
  const mockData = mockLoginResponse.generate();
  mockData.avatar = "https://avatars.githubusercontent.com/u/29266093";
  return success(mockData);

  // 虽然使用 zod 规则可以很方便的模拟数据, 但是每次数据都
  // 不一样如果需要一个固定的数据, 请使用手动模拟的方式
  // return HttpResponse.json({
  //   id: 1,
  //   username: "admin",
  //   avatar: "https://iph.href.lu/100x100?text=img",
  //   email: "admin@qq.com",
  //   created_at: "2024-06-10T17:17:09.000Z",
  //   token: "msw-mock-token-string",
  // });
});

// 模拟刷新 accessToken 接口的响应
export const refreshAccessToken = http.get("/api/refresh_access_token", async ({ request }) => {
  const url = new URL(request.url);
  const params = url.searchParams;
  if (params.get("expired")?.toString() === "1") {
    // 如果携带了 expired 参数则模拟 refreshToken 也已经过期的情况
    return HttpResponse.json({ error: "refresh token expired" }, { status: 401 });
  }

  // 刷新 accessToken
  const mockData = mockRefreshTokenResponse.generate();
  return success(mockData);
});
