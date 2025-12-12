export type { ILoginForm } from "@/validation/auth.schema";

// WARN: 按照道理来说, 响应的类型应该自己手动写,
// 但是因为我这里模拟的假数据是通过 zod + zocker 生成的,
// 所以我可以偷个懒, 直接用 zod schema 的类型, 就不用自己手写了
export type { ILoginResponse, IRefreshTokenResponse } from "@/__mocks__/mocks";
