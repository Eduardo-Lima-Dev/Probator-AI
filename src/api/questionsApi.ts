import { apiRequest } from './httpClient'
import type { DifficultyLevel, AlternativeLabel } from './examsApi'

export type Question = {
  id: string
  materiaId: string
  statement: string
  level: DifficultyLevel
  importedFrom: string | null
  sourceUrl: string | null
  archivedAt: string | null
  createdAt: string
  updatedAt: string
  alternatives: Array<{
    id: string
    originalLabel: AlternativeLabel
    text: string
    explanation: string | null
    isCorrect: boolean
  }>
}

export type QueryQuestionsParams = {
  materiaId?: string
  level?: DifficultyLevel
  page?: number
  limit?: number
}

export async function getQuestions(params: QueryQuestionsParams = {}): Promise<Question[]> {
  const qs = new URLSearchParams()
  if (params.materiaId) qs.set('materiaId', params.materiaId)
  if (params.level) qs.set('level', params.level)
  if (params.page) qs.set('page', String(params.page))
  if (params.limit) qs.set('limit', String(params.limit))
  const path = `/questions${qs.toString() ? `?${qs}` : ''}`
  return apiRequest<Question[]>(path, { auth: true })
}

export async function getQuestionById(id: string): Promise<Question> {
  return apiRequest<Question>(`/questions/${id}`, { auth: true })
}

export async function archiveQuestion(id: string): Promise<Question> {
  return apiRequest<Question>(`/questions/${id}/archive`, { method: 'PATCH', auth: true })
}
