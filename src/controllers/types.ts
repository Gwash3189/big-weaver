export type ZodishSafeParseResult<Rslt extends boolean> = {
  success: Rslt,
  error: Rslt extends false ? { flatten: () => Record<string, any> } : never,
}

export type Zodish = {
  safeParse: (args: any) => ZodishSafeParseResult<boolean>
}

export type RequestValidationInput = {
  query?: Zodish
  body?: Zodish
}
