export interface ZodishSafeParseResult<Rslt extends boolean, Input extends any> {
  success: Rslt
  error?: Rslt extends false ? {
      flatten: () => Record<string, any>
  } : never
  data?: Rslt extends true ? Input : never
}
export interface Zodish<Input extends any> {
  safeParse: (args: any) => ZodishSafeParseResult<boolean, Input>
}
export interface RequestValidationInput<Input extends any> {
  query?: Zodish<Input>
  body?: Zodish<Input>
}
