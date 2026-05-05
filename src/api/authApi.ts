export type RegisterPayload = {
  name: string
  email: string
  password: string
  course: string
}

export type LoginPayload = {
  email: string
  password: string
}

type AuthResponse = {
  message?: string
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? ''
const AUTH_API_PREFIX = import.meta.env.VITE_AUTH_API_PREFIX ?? '/api/auth'
const AUTH_MODE = import.meta.env.VITE_AUTH_MODE ?? (API_BASE_URL ? 'api' : 'local')
const LOCAL_USERS_KEY = 'probatorai.local.users'
const LOCAL_SESSION_KEY = 'probatorai.local.session'

type LocalUser = {
  name: string
  email: string
  password: string
  course: string
}

async function parseErrorMessage(response: Response): Promise<string | null> {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    const jsonBody = (await response.json().catch(() => null)) as { message?: string } | null
    return jsonBody?.message?.trim() || null
  }

  const textBody = await response.text().catch(() => '')
  return textBody.trim() || null
}

function getLocalUsers(): LocalUser[] {
  const usersRaw = localStorage.getItem(LOCAL_USERS_KEY)
  if (!usersRaw) {
    return []
  }

  const parsed = JSON.parse(usersRaw) as LocalUser[] | null
  return Array.isArray(parsed) ? parsed : []
}

function setLocalUsers(users: LocalUser[]): void {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users))
}

function setLocalSession(email: string): void {
  localStorage.setItem(LOCAL_SESSION_KEY, email)
}

function postAuthLocal<TPayload>(endpoint: string, payload: TPayload): AuthResponse {
  if (endpoint.endsWith('/register')) {
    const registerPayload = payload as RegisterPayload
    const users = getLocalUsers()
    const hasUser = users.some(
      (user) => user.email.toLowerCase() === registerPayload.email.toLowerCase(),
    )

    if (hasUser) {
      throw new Error('Ja existe uma conta cadastrada com este e-mail.')
    }

    users.push({
      name: registerPayload.name,
      email: registerPayload.email,
      password: registerPayload.password,
      course: registerPayload.course,
    })
    setLocalUsers(users)
    setLocalSession(registerPayload.email)
    return { message: 'Cadastro realizado localmente com sucesso.' }
  }

  if (endpoint.endsWith('/login')) {
    const loginPayload = payload as LoginPayload
    const users = getLocalUsers()
    const user = users.find(
      (registeredUser) =>
        registeredUser.email.toLowerCase() === loginPayload.email.toLowerCase() &&
        registeredUser.password === loginPayload.password,
    )

    if (!user) {
      throw new Error('E-mail ou senha invalidos no modo local.')
    }

    setLocalSession(user.email)
    return { message: 'Login realizado localmente com sucesso.' }
  }

  throw new Error('Operacao de autenticacao local nao suportada.')
}

async function postAuth<TPayload>(
  endpoint: string,
  payload: TPayload,
  fallbackErrorMessage: string,
  fallbackSuccessMessage: string,
): Promise<AuthResponse> {
  if (AUTH_MODE === 'local') {
    return postAuthLocal(endpoint, payload)
  }

  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error(
      'Nao foi possivel conectar com a API. Verifique VITE_API_URL e se o backend esta ativo.',
    )
  }

  if (!response.ok) {
    const messageFromApi = await parseErrorMessage(response)
    const statusMessage = `HTTP ${response.status}${response.statusText ? ` - ${response.statusText}` : ''}`
    throw new Error(messageFromApi ?? `${fallbackErrorMessage} (${statusMessage})`)
  }

  return (await response.json().catch(() => ({ message: fallbackSuccessMessage }))) as AuthResponse
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  return postAuth(
    `${AUTH_API_PREFIX}/register`,
    payload,
    'Erro ao realizar cadastro.',
    'Cadastro realizado.',
  )
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  return postAuth(
    `${AUTH_API_PREFIX}/login`,
    payload,
    'Erro ao realizar login.',
    'Login realizado.',
  )
}
