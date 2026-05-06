import { apiRequest, clearAccessToken, setAccessToken } from './httpClient'

export type RegisterPayload = {
  name: string
  email: string
  password: string
  materiaId: string
}

export type LoginPayload = {
  email: string
  password: string
}

type LoginResponse = {
  access_token: string
}

export async function registerUser(payload: RegisterPayload): Promise<void> {
  await apiRequest('/user', {
    method: 'POST',
    body: payload,
  })
}

export async function loginUser(payload: LoginPayload): Promise<void> {
  const response = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  })

  setAccessToken(response.access_token)
}

export function logoutUser(): void {
  clearAccessToken()
}
