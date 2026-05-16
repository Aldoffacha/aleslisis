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
  apiPrefix?: string
}

function humanizeErrorKey(key: string): string {
  if (key === 'non_field_errors') {
    return 'general'
  }

  return key.replace(/_/g, ' ')
}

function collectErrorMessages(value: unknown): string[] {
  if (typeof value === 'string') {
    return [value]
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectErrorMessages(item))
  }

  if (value && typeof value === 'object') {
    return Object.values(value).flatMap((item) => collectErrorMessages(item))
  }

  return []
}

function extractApiErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== 'object') {
    return null
  }

  const record = data as Record<string, unknown>

  if (typeof record.error === 'string' && record.error.trim()) {
    return record.error
  }

  if (typeof record.detail === 'string' && record.detail.trim()) {
    return record.detail
  }

  const fieldMessages = Object.entries(record)
    .flatMap(([key, value]) => {
      const messages = collectErrorMessages(value)
      if (!messages.length) {
        return []
      }

      return `${humanizeErrorKey(key)}: ${messages.join(', ')}`
    })
    .filter(Boolean)

  if (!fieldMessages.length) {
    return null
  }

  return fieldMessages.join(' | ')
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
  return apiRequest<T>(endpoint, { method, body, headers, apiPrefix: '/api/auth' })
}

export async function apiRequest<T>(
  endpoint: string,
  { method = 'GET', body, headers = {}, apiPrefix = '/api/auth' }: HttpOptions = {}
): Promise<T> {
  const apiBase = resolveApiBase()
  const isWrite = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  if (isWrite) {
    await ensureCsrfToken()
  }

  const res = await fetch(`${apiBase}${apiPrefix}${endpoint}`, {
    method,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(isWrite ? { 'X-CSRFToken': getCsrfToken() } : {}),
      ...headers,
    },
    credentials: 'include',
    body: body ? (isFormData ? body as FormData : JSON.stringify(body)) : undefined,
  })

  const contentType = res.headers.get('content-type') ?? ''
  const data = contentType.includes('application/json')
    ? await res.json()
    : await res.text()

  if (!res.ok) {
    if (typeof data === 'object' && data) {
      throw new Error(extractApiErrorMessage(data) || 'Error en la solicitud')
    }

    throw new Error('Error en la solicitud')
  }

  return data as T
}

export { resolveApiBase }