const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

interface HttpOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

export async function httpRequest<T>(endpoint: string, { method = 'GET', body, headers = {} }: HttpOptions = {}): Promise<T> {
  const res = await fetch(`${API_BASE}/api/auth${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || data.detail || 'Error en la solicitud')
  }

  return data as T
}
