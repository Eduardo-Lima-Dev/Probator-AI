import { apiRequest } from './httpClient'

export type UserMe = {
  sub: string
  email: string
  role: string
}

export type AdminUser = {
  id: string
  email: string
  name: string | null
  role: string
  materias: Array<{ id: string; name: string; description: string | null }>
  createdAt: string
  updatedAt: string
}

export type UpdateUserPayload = {
  name?: string
  email?: string
  password?: string
}

export async function getCurrentUser(): Promise<UserMe> {
  return apiRequest<UserMe>('/user/me', { auth: true })
}

export async function getAllUsers(): Promise<AdminUser[]> {
  return apiRequest<AdminUser[]>('/user/all', { auth: true })
}

export async function getUserById(id: string): Promise<AdminUser> {
  return apiRequest<AdminUser>(`/user/${id}`, { auth: true })
}

export async function updateUserById(id: string, payload: UpdateUserPayload): Promise<AdminUser> {
  return apiRequest<AdminUser>(`/user/${id}`, { method: 'PUT', body: payload, auth: true })
}

export async function deleteUserById(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/user/${id}`, { method: 'DELETE', auth: true })
}

export async function updateMe(payload: UpdateUserPayload): Promise<AdminUser> {
  return apiRequest<AdminUser>('/user/me', { method: 'PUT', body: payload, auth: true })
}

export async function deleteMe(): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/user/me', { method: 'DELETE', auth: true })
}
