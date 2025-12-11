import { HttpResponse, http } from "msw";
import { useMockApi } from "@/tools";
import { mockLoginResponse, mockRefreshAccessToken } from "@/__mocks__/mocks";

export const loginHandler = http.post(useMockApi("/api/auth/login"), () => {
  const mockData = mockLoginResponse.generate();
  mockData.avatar = "https://avatars.githubusercontent.com/u/29266093";
  return HttpResponse.json(mockData);

  // 虽然使用验证规则可以很方便的模拟数据, 但是每次数据都
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

export const refreshAccessToken = http.post(useMockApi("/api/auth/refresh_access_token"), () => {
  const mockData = mockRefreshAccessToken.generate();
  return HttpResponse.json(mockData);
});
