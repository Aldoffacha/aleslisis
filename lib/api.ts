const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

interface ApiOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

async function request<T>(endpoint: string, { method = 'GET', body, headers = {} }: ApiOptions = {}): Promise<T> {
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

export interface User {
  id: number
  username: string
  email: string
}

export interface AuthResponse extends User {}

export const api = {
  login: (username: string, password: string) =>
    request<AuthResponse>('/login/', { method: 'POST', body: { username, password } }),

  register: (username: string, email: string, password: string) =>
    request<AuthResponse>('/register/', { method: 'POST', body: { username, email, password } }),

  logout: () =>
    request<{ message: string }>('/logout/', { method: 'POST' }),

  me: () =>
    request<User>('/me/'),
}
