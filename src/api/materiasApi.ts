import { apiRequest } from './httpClient'

export type Materia = {
  id: string
  name: string
  description: string | null
}

export async function getMaterias(): Promise<Materia[]> {
  return apiRequest<Materia[]>('/materias/all')
}

export async function getMateriaById(id: string): Promise<Materia> {
  return apiRequest<Materia>(`/materias/${id}`)
}

export type CreateMateriaPayload = { name: string; description?: string }

export async function createMateria(payload: CreateMateriaPayload): Promise<Materia> {
  return apiRequest<Materia>('/materias', { method: 'POST', body: payload, auth: true })
}

export async function updateMateria(id: string, payload: CreateMateriaPayload): Promise<Materia> {
  return apiRequest<Materia>(`/materias/${id}`, { method: 'PUT', body: payload, auth: true })
}

export async function deleteMateria(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/materias/${id}`, { method: 'DELETE', auth: true })
}
