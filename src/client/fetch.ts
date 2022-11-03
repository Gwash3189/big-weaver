interface ZodishValidator<T = unknown> { parse: (data: unknown, params?: any) => T }
interface FetchInput<T> {
  path?: ZodishValidator
  body?: ZodishValidator
  response?: ZodishValidator<T>
}
interface IncomingInput {
  path?: unknown
  body?: unknown
  response?: unknown
}

export class Fetch<U = unknown> {
  private readonly input: FetchInput<U>
  private readonly path: (...any: any[]) => string

  constructor (path: (...any: any[]) => string, input: FetchInput<U>) {
    this.input = input
    this.path = path
  }

  static input <U = unknown>({ path, validation = {} }: { path: (...any: any[]) => string, validation?: FetchInput<U> }) {
    return new Fetch<U>(path, validation)
  }

  private headers (headers: Record<string, string> = {}) {
    return {
      'Content-type': 'application/json',
      ...headers
    }
  }

  private async fetch (path: string, options: RequestInit = {}) {
    return await fetch(path, {
      ...options,
      headers: {
        ...this.headers(),
        ...(options.headers === undefined ? {} : options.headers)
      }
    }).then(async (response) => {
      if (response.status > 299 || response.status < 200) {
        return await Promise.reject(new Error(`Response status is ${response.status}`))
      } else {
        return await response.json()
      }
    })
  }

  private async validatePath ({ path }: IncomingInput) {
    let pathResult = path

    try {
      if (path !== undefined && (this.input.path != null)) {
        pathResult = this.input.path?.parse(path)
      }
    } catch (error) {
      if (error instanceof Error) {
        return await Promise.reject(error)
      }

      return await Promise.reject(new Error('Arguments did not pass provded validation'))
    }

    return await Promise.resolve({ path: pathResult })
  }

  private async validateBody ({ body }: IncomingInput) {
    try {
      if (body !== undefined && (this.input.body != null)) {
        this.input.body?.parse(body)
      }
    } catch (error) {
      if (error instanceof Error) {
        return await Promise.reject(error)
      }

      return await Promise.reject(new Error('Arguments did not pass provded validation'))
    }

    return await Promise.resolve()
  }

  private async validateResponse ({ response }: IncomingInput) {
    let responseResult = response

    try {
      if (response !== undefined && (this.input.response != null)) {
        responseResult = this.input.response?.parse(response)
      }
    } catch (error) {
      if (error instanceof Error) {
        return await Promise.reject(error)
      }

      return await Promise.reject(new Error('Arguments did not pass provded validation'))
    }

    return await Promise.resolve({ response: responseResult })
  }

  key (data: unknown = {}) {
    return this.path(data)
  }

  async get (pathInput: unknown, options: RequestInit = {}) {
    const pathResult = await this.validatePath({
      path: pathInput
    })

    const response = await this.fetch(this.path(pathResult.path), {
      ...options,
      method: 'GET'
    })

    return await ((await this.validateResponse({ response })).response as Promise<U>)
  }

  async post (pathInput: unknown, options: RequestInit = {}): Promise<U> {
    const pathResult = await this.validatePath({
      path: pathInput
    })
    await this.validateBody({
      body: options.body
    })

    const response = await this.fetch(this.path(pathResult.path), {
      ...options,
      method: 'POST'
    })

    return await ((await this.validateResponse({ response })).response as Promise<U>)
  }

  async put (pathInput: unknown, options: RequestInit = {}): Promise<U> {
    const pathResult = await this.validatePath({
      path: pathInput
    })
    await this.validateBody({
      body: options.body
    })

    const response = await this.fetch(this.path(pathResult.path), {
      ...options,
      method: 'PUT'
    })

    return await ((await this.validateResponse({ response })).response as Promise<U>)
  }

  async delete (pathInput: unknown, options: RequestInit = {}): Promise<U> {
    const pathResult = await this.validatePath({
      path: pathInput
    })
    await this.validateBody({
      body: options.body
    })

    const response = await this.fetch(this.path(pathResult.path), {
      ...options,
      method: 'DELETE'
    })

    return await ((await this.validateResponse({ response })).response as Promise<U>)
  }
}
