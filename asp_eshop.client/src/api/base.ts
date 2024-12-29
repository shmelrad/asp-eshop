interface RequestConfig extends RequestInit {
  auth?: boolean
  params?: Record<string, string>
}

export class BaseApi {
  private baseUrl: string

  constructor(path: string) {
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    this.baseUrl = `${baseUrl}${path}`
  }

  protected async request<T>(
    endpoint: string,
    { auth = false, params, ...config }: RequestConfig = {}
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => 
        url.searchParams.append(key, value)
      )
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(auth && { Authorization: `Bearer ${localStorage.getItem('token')}` }),
      ...config.headers,
    }

    const response = await fetch(url, { ...config, headers })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    const text = await response.text()
    return text ? JSON.parse(text) : undefined
  }

  protected get<T>(endpoint: string, config?: RequestConfig) {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }

  protected post<T>(endpoint: string, data?: unknown, config?: RequestConfig) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  protected put<T>(endpoint: string, data?: unknown, config?: RequestConfig) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  protected delete<T>(endpoint: string, config?: RequestConfig) {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }
}
