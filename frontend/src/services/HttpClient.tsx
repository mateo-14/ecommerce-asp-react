export class HTTPError<T> extends Error {
  constructor(
    public response: Response,
    public data: T
  ) {
    super(response.statusText)
  }
}

export class HTTPClient {
  constructor(public readonly baseUrl: string, private readonly headers: Record<string, string> = {}) {}

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json() 
    if (!response.ok) {
      throw new HTTPError(response, data)
    }

    return data as T
  }

  
  get<T>(path: string, options: RequestInit = {}): Promise<T> {
    return fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.headers,
        ...options.headers,
      }
    }).then((response) => this.handleResponse<T>(response))
  }

  post<T>(path: string, body: unknown, options: RequestInit = {}): Promise<T> {
    return fetch(`${this.baseUrl}${path}`, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...this.headers,
        ...options.headers
      }
    }).then((response) => this.handleResponse<T>(response))
  }

  put<T>(path: string, body: unknown, options: RequestInit = {}): Promise<T> {
    return fetch(`${this.baseUrl}${path}`, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...this.headers,
        ...options.headers
      }
    }).then((response) => this.handleResponse<T>(response))
  }

  delete<T>(path: string, options: RequestInit = {}): Promise<T> {
    return fetch(`${this.baseUrl}${path}`, {
      ...options,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...this.headers,
        ...options.headers
      }
    }).then((response) => this.handleResponse<T>(response))
  }

  patch<T>(path: string, body: unknown, options: RequestInit = {}): Promise<T> {
    return fetch(`${this.baseUrl}${path}`, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...this.headers,
        ...options.headers
      }
    }).then((response) => this.handleResponse<T>(response))
  }


}
