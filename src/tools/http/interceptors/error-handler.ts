import { log } from "@/tools";
import { showErrMsg } from "@/tools/notify";
import type { AxiosError } from "axios";
import { ErrnoEnum } from "../errno.enum";

// 处理数据验证错误: 格式化错误信息
export function validationErrorHandler(error: AxiosError) {
  if (error.status === ErrnoEnum.FailedToValidate) {
    showErrMsg("请求参数没有通过服务端校验,请检查参数是否正确");
    log("[error-handler@validationErrorHandler]请求参数没有通过服务端校验", error);
  }
  return Promise.reject(error);
}

// 处理 500 错误
export const internalErrorMessage = "服务器内部错误, 请稍后再试";
export function internalErrorHandler(error: AxiosError) {
  if (error.status === ErrnoEnum.InternalError) {
    showErrMsg(internalErrorMessage);
    return Promise.reject(error);
  }
  return Promise.reject(error);
}
