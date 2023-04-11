export interface ZodishSafeParseResult<Rslt extends boolean, Input> {
  success: Rslt
  error?: Rslt extends false ? {
    flatten: () => Record<string, any>
  } : never
  data?: Rslt extends true ? Input : never
}
export interface Zodish<Input> {
  safeParse: (args: any) => ZodishSafeParseResult<boolean, Input>
}
export interface RequestValidationInput<Query = {}, Body = {}> {
  query?: Zodish<Query>
  body?: Zodish<Body>
}
