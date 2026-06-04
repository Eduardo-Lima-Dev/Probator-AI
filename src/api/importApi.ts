import { apiRequest } from './httpClient'
import type { DifficultyLevel } from './examsApi'

export type ImportAlternative = {
  label: string
  text: string
  explanation?: string
  isCorrect: boolean
}

export type ImportQuestion = {
  index: number
  question: string
  alternatives: ImportAlternative[]
}

export type ImportNotebooklmPayload = {
  subject: string
  level: DifficultyLevel
  questions: ImportQuestion[]
  source?: string
  url?: string
  capturedAt?: string
}

export type ImportResult = {
  materiaId: string
  materia: string
  imported: number
  skipped: number
  details: { imported: string[]; skipped: string[] }
}

export async function importFromNotebooklm(payload: ImportNotebooklmPayload): Promise<ImportResult> {
  return apiRequest<ImportResult>('/import/notebooklm', { method: 'POST', body: payload, auth: true })
}
