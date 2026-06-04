const RAW_API_BASE_URL = (import.meta.env.VITE_API_URL ?? '').trim()
const API_BASE_URL = normalizeBaseUrl(RAW_API_BASE_URL)
const TOKEN_KEY = 'probatorai.auth.token'

type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: unknown
  auth?: boolean
}

type ApiErrorPayload = {
  message?: string | string[]
}

function normalizeBaseUrl(value: string): string {
  if (!value) {
    return ''
  }

  if (/^https?:\/\//i.test(value)) {
    return value.replace(/\/+$/, '')
  }

  return `http://${value}`.replace(/\/+$/, '')
}

async function parseErrorMessage(response: Response): Promise<string | null> {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null

    if (Array.isArray(payload?.message)) {
      return payload.message.join(', ').trim() || null
    }

    if (typeof payload?.message === 'string') {
      return payload.message.trim() || null
    }
  }

  const textBody = await response.text().catch(() => '')
  return textBody.trim() || null
}

function buildUrl(path: string): string {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_URL nao configurada. Defina a URL da API no arquivo .env.')
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAccessToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearAccessToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export async function apiRequest<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const { method = 'GET', body, auth = false } = options
  const token = getAccessToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (auth) {
    if (!token) {
      throw new Error('Sessao expirada. Faca login novamente.')
    }
    headers.Authorization = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(buildUrl(path), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Nao foi possivel conectar com a API.')
  }

  if (!response.ok) {
    const messageFromApi = await parseErrorMessage(response)
    const statusMessage = `HTTP ${response.status}${response.statusText ? ` - ${response.statusText}` : ''}`
    throw new Error(messageFromApi ?? statusMessage)
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  return (await response.json()) as TResponse
}
