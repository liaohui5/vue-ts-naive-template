import * as z from "zod";

export * from "./auth.schema";
export * from "./env.schema";

/**
 * 验证输入输出数据是否符合指定的规则
 *
 * @param label 验证的标签，用于在错误信息中标识验证的类型
 * @param rules 验证规则，使用 ZodTypeAny 类型进行定义
 * @param data 需要验证的数据对象
 * @throws 如果数据不符合规则，则抛出包含验证错误详情的异常
 */
export function validateIO<T extends object>(label: string, rules: z.ZodTypeAny, data: T) {
  const result = rules.safeParse(data);
  if (!result.success) {
    const errorMsg = `[validateIO] ${label} validation failed`;
    throw new Error(errorMsg);
  }
}

// 数据验证结果类型
interface ValidateResult<T> {
  passed: boolean;
  data?: T;
  errors: z.ZodFormattedError<T>;
}

// 数据验证(异步)
export async function validate<T>(dataSource: T, rules: z.ZodTypeAny): Promise<ValidateResult<T>> {
  const results = await rules.safeParseAsync(dataSource);
  return formatValidateResult<T>(results as z.ZodSafeParseResult<T>);
}

// 数据验证(同步)
export function validateSync<T>(dataSource: T, rules: z.ZodTypeAny): ValidateResult<T> {
  const results = rules.safeParse(dataSource);
  return formatValidateResult<T>(results as z.ZodSafeParseResult<T>);
}

// 格式化数据验证的结果
function formatValidateResult<T>(result: z.ZodSafeParseResult<T>): ValidateResult<T> {
  if (result.success) {
    return {
      passed: true,
      data: result.data,
      errors: { _errors: [] } as unknown as z.ZodFormattedError<T>,
    };
  }

  return {
    passed: false,
    data: undefined,
    errors: z.formatError(result.error),
  };
}
