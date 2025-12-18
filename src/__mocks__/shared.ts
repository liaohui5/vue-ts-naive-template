import { HttpResponse } from "msw";
import z from "zod";
import { zocker } from "zocker";

// mws: https://msw.nodejs.cn/docs/getting-started/
// zocker: https://github.com/LorisSigrist/zocker
export function success(data: unknown) {
  return HttpResponse.json({
    success: true,
    msg: "success",
    data,
  });
}

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

// mock operation success
export function successWithId() {
  const id = zocker(z.number().positive().int()).generate();
  return HttpResponse.json({
    success: true,
    msg: "success",
    data: { id },
  });
}
