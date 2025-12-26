// 显示提示信息: 单独封装以解耦
export function showMsg(message: string) {
  window.$message?.info(message);
}

// 显示"错误"信息: 单独封装以解耦
export function showErrMsg(message: string) {
  window.$message?.error(message);
}

