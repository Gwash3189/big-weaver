export interface ZodishSafeParseResult<Rslt extends boolean> {
  success: Rslt
  error: Rslt extends false ? { flatten: () => Record<string, any> } : never
}

export interface Zodish {
  safeParse: (args: any) => ZodishSafeParseResult<boolean>
}

export interface RequestValidationInput {
  query?: Zodish
  body?: Zodish
}
