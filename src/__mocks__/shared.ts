import { HttpResponse } from "msw";
import { zocker } from "zocker";
import z from "zod";

// 文档信息:
// zod: https://github.com/colinhacks/zod
// mws: https://msw.nodejs.cn/docs/getting-started/
// zocker: https://github.com/LorisSigrist/zocker

/**
 * 成功的响应
 * @param data - 响应数据
 * @returns - 包含 success, msg, data 的 HttpResponse 对象
 */
export function success(data: unknown) {
  return HttpResponse.json({
    success: true,
    msg: "success",
    data,
  });
}

/**
 * 失败的响应
 * @param data - 响应数据, 可为空
 * @param status - 响应状态码, 默认为 200
 * @returns - 包含 success, msg, data 的 HttpResponse 对象
 */
export function failed(data: unknown = null, status = 200) {
  return HttpResponse.json(
    {
      success: false,
      msg: "failed",
      data,
    },
    { status },
  );
}

/**
 * 成功的响应,并且带有一个随机生成的 id
 * @returns - 包含 success, msg, data 的 HttpResponse 对象
 */
export function successWithId() {
  const id = zocker(z.number().positive().int()).generate();
  return success({ id });
}
