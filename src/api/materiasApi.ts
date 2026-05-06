import { apiRequest } from './httpClient'

export type Materia = {
  id: string
  name: string
  description: string | null
}

export async function getMaterias(): Promise<Materia[]> {
  return apiRequest<Materia[]>('/materias/all')
}
