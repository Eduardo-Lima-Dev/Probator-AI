import { apiRequest } from './httpClient'

export type UserMe = {
  sub: string
  email: string
  role: string
}

export async function getCurrentUser(): Promise<UserMe> {
  return apiRequest<UserMe>('/user/me', { auth: true })
}
