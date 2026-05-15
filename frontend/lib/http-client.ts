function resolveApiBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }

  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol
    const hostname = window.location.hostname === 'localhost' ? 'localhost' : '127.0.0.1'
    return `${protocol}//${hostname}:8000`
  }

  return 'http://127.0.0.1:8000'
}

interface HttpOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

function getCsrfToken(): string {
  const match = document.cookie.match(/csrftoken=([^;]+)/)
  return match ? match[1] : ''
}

async function ensureCsrfToken(): Promise<void> {
  const apiBase = resolveApiBase()

  if (getCsrfToken()) return
  await fetch(`${apiBase}/api/auth/csrf/`, {
    credentials: 'include',
  })
}

export async function httpRequest<T>(
  endpoint: string,
  { method = 'GET', body, headers = {} }: HttpOptions = {}
): Promise<T> {
  const apiBase = resolveApiBase()
  const isWrite = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())

  if (isWrite) {
    await ensureCsrfToken()
  }

  const res = await fetch(`${apiBase}/api/auth${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(isWrite ? { 'X-CSRFToken': getCsrfToken() } : {}),
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