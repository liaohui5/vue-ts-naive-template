import { describe, it, expect } from "vitest";
import { encodePassword, md5, uuid } from "@/tools";

describe("tools", () => {
  it("md5", () => {
    const original = "123456";
    const encoded = md5(original);
    expect(encoded).toBe("e10adc3949ba59abbe56e057f20f883e");
  });

  it("uuid", () => {
    const $id = uuid();
    const uuidReg = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    expect($id).toMatch(uuidReg);
  });

  describe("password", () => {
    it("应该更新 password 字段为原字符串的 md5", () => {
      const data = {
        password: "123456",
      };

      const newData = encodePassword(data);
      expect(newData.password).toBe("e10adc3949ba59abbe56e057f20f883e");
    });

    it("应该返回新对象, 而不是修改原对象", () => {
      const original = {
        password: "123456",
      };
      const newData = encodePassword(original);
      expect(newData).not.toBe(original);
    });

    it("应该更新 password 字段, 但是不能影响其他字段", () => {
      const original = {
        account: "foo",
        password: "123456",
      };
      const newData = encodePassword(original);
      expect(newData.account).toBe("foo");
      expect(newData.password).toBe("e10adc3949ba59abbe56e057f20f883e");
    });

    it("如果没有 password 字段, 应该直接返回原对象", () => {
      const original = {
        account: "foo",
      };
      const newData = encodePassword(original);
      expect(original).toBe(newData);
    });

    it("password 字段不是 string 类型, 应该直接返回原对象", () => {
      const original = {
        account: "foo",
        password: 123,
      };
      const newData = encodePassword(original);
      expect(original).toBe(newData);
    });
  });
});
