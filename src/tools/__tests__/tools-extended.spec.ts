import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  __ACCESS_TOKEN_KEY__,
  __REFRESH_TOKEN_KEY__,
  getAccessToken,
  hasAccessToken,
  saveAccessToken,
  removeAccessToken,
  getRefreshToken,
  hasRefreshToken,
  saveRefreshToken,
  removeRefreshToken,
  removeTokens,
  getBearerToken,
} from "@/tools/token-manager";
import { lighten } from "@/tools/color";
import { showMsg, showErrMsg } from "@/tools/notify";
import { start as progressStart, done as progressDone } from "@/tools/progress";
import { isURL, setHtmlTheme, isUseMSW, log } from "@/tools";

describe("token-manager", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("accessToken", () => {
    it("saveAccessToken 应该保存到 localStorage 并可以使用 getAccessToken 获取", () => {
      saveAccessToken("my-access-token");
      expect(getAccessToken()).toBe("my-access-token");
      expect(localStorage.getItem(__ACCESS_TOKEN_KEY__)).toBe("my-access-token");
    });

    it("hasAccessToken 应该在有 token 时返回 true, 否则返回 false", () => {
      expect(hasAccessToken()).toBe(false);
      saveAccessToken("any-token");
      expect(hasAccessToken()).toBe(true);
    });

    it("removeAccessToken 应该删除存储的 accessToken", () => {
      saveAccessToken("my-access-token");
      removeAccessToken();
      expect(getAccessToken()).toBeNull();
    });
  });

  describe("refreshToken", () => {
    it("saveRefreshToken 应该保存到 localStorage 并可以使用 getRefreshToken 获取", () => {
      saveRefreshToken("my-refresh-token");
      expect(getRefreshToken()).toBe("my-refresh-token");
      expect(localStorage.getItem(__REFRESH_TOKEN_KEY__)).toBe("my-refresh-token");
    });

    it("hasRefreshToken 应该在有 refreshToken 时返回 true, 否则返回 false", () => {
      expect(hasRefreshToken()).toBe(false);
      saveRefreshToken("any-refresh-token");
      expect(hasRefreshToken()).toBe(true);
    });

    it("removeRefreshToken 应该删除存储的 refreshToken", () => {
      saveRefreshToken("my-refresh-token");
      removeRefreshToken();
      expect(getRefreshToken()).toBeNull();
    });
  });

  describe("removeTokens", () => {
    it("应该同时删除 accessToken 和 refreshToken", () => {
      saveAccessToken("access");
      saveRefreshToken("refresh");
      removeTokens();
      expect(getAccessToken()).toBeNull();
      expect(getRefreshToken()).toBeNull();
    });
  });

  describe("getBearerToken", () => {
    it("应该返回 Bearer 前缀的 token 字符串", () => {
      saveAccessToken("my-access-token");
      expect(getBearerToken()).toBe("Bearer my-access-token");
    });

    it("没有 token 时应该返回 'Bearer null'", () => {
      removeAccessToken();
      expect(getBearerToken()).toBe("Bearer null");
    });
  });
});

describe("lighten", () => {
  it("应该将颜色变亮指定的百分比", () => {
    expect(lighten("#000000", 100)).toBe("#ffffff");
  });

  it("应该处理不带 # 前缀的颜色值", () => {
    expect(lighten("000000", 100)).toBe("#ffffff");
  });

  it("变亮 0% 应该返回原色", () => {
    expect(lighten("#ff0000", 0)).toBe("#ff0000");
  });

  it("变亮 50% 应该返回中间值", () => {
    // 255 * 50 / 100 = 127.5 → Math.trunc = 127 → 0x7f
    const result = lighten("#000000", 50);
    expect(result).toBe("#7f7f7f");
  });

  it("变亮超过 100% 时应该返回白色", () => {
    expect(lighten("#ff0000", 200)).toBe("#ffffff");
  });

  it("白色变亮任何值都返回白色", () => {
    expect(lighten("#ffffff", 50)).toBe("#ffffff");
  });
});

describe("notify", () => {
  beforeEach(() => {
    window.$message = {
      info: vi.fn(),
      error: vi.fn(),
    } as any;
  });

  it("showMsg 应该调用 window.$message.info", () => {
    showMsg("test info");
    expect(window.$message.info).toHaveBeenCalledWith("test info");
  });

  it("showErrMsg 应该调用 window.$message.error", () => {
    showErrMsg("test error");
    expect(window.$message.error).toHaveBeenCalledWith("test error");
  });
});

describe("progress", () => {
  beforeEach(() => {
    window.$loading = {
      start: vi.fn(),
      finish: vi.fn(),
    } as any;
  });

  it("start 应该调用 window.$loading.start", () => {
    progressStart();
    expect(window.$loading.start).toHaveBeenCalledOnce();
  });

  it("done 应该调用 window.$loading.finish", () => {
    progressDone();
    expect(window.$loading.finish).toHaveBeenCalledOnce();
  });
});

describe("isURL", () => {
  it("应该识别有效的 http URL", () => {
    expect(isURL("https://example.com")).toBe(true);
  });

  it("应该识别有效的 https URL", () => {
    expect(isURL("https://example.com/path?query=1")).toBe(true);
  });

  it("应该识别带端口的 URL", () => {
    expect(isURL("http://localhost:8080/path")).toBe(true);
  });

  it("应该拒绝无效的 URL", () => {
    expect(isURL("not a url")).toBe(false);
  });

  it("应该拒绝空字符串", () => {
    expect(isURL("")).toBe(false);
  });
});

describe("setHtmlTheme", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
  });

  it("应该设置 data-theme 属性为 light", () => {
    setHtmlTheme("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("应该设置 data-theme 属性为 dark", () => {
    setHtmlTheme("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("多次调用应该覆盖之前的主题值", () => {
    setHtmlTheme("light");
    setHtmlTheme("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
});

describe("isUseMSW", () => {
  it("在开发环境且 API Base URL 为空时应该返回 true", () => {
    // env.DEV 在 vitest 中为 true, env.VITE_APP_API_BASE_URL 默认为 ""
    expect(isUseMSW()).toBe(true);
  });
});

describe("log", () => {
  it("应该在开发环境调用 console.log", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    log("test message");
    expect(spy).toHaveBeenCalledWith("test message");
    spy.mockRestore();
  });
});
