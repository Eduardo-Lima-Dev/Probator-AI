import { apiRequest } from './httpClient'

export type ExamStatus = 'draft' | 'generated' | 'archived'
export type DifficultyLevel = 'facil' | 'medio' | 'dificil'
export type AlternativeLabel = 'A' | 'B' | 'C' | 'D' | 'E'

export type ExamListItem = {
  id: string
  materiaId: string
  materia: { id: string; name: string; description: string | null }
  title: string
  description: string | null
  status: ExamStatus
  createdAt: string
  updatedAt: string
  versions: Array<{ id: string; versionLabel: string }>
}

export type ExamVersionAlternative = {
  id: string
  alternativeId: string
  alternative: { id: string; text: string }
  alternativePosition: number
}

export type ExamVersionQuestion = {
  id: string
  questionId: string
  questionPosition: number
  question: { id: string; statement: string; level: DifficultyLevel }
  alternatives: ExamVersionAlternative[]
}

export type ExamVersion = {
  id: string
  examId: string
  versionLabel: string
  createdAt: string
  questions: ExamVersionQuestion[]
}

export type AnswerKey = {
  id: string
  examVersionId: string
  questionId: string
  question: { id: string; statement: string }
  questionPosition: number
  originalLabel: AlternativeLabel
  shuffledLabel: AlternativeLabel
}

export type CreateExamPayload = {
  title: string
  materiaId: string
  description?: string
}

export type GenerateVersionsPayload = {
  versionCount: number
  questionCount: number
  level?: DifficultyLevel
}

export type GeneratedVersion = {
  id: string
  examId: string
  versionLabel: string
  createdAt: string
}

export async function createExam(payload: CreateExamPayload): Promise<ExamListItem> {
  return apiRequest<ExamListItem>('/exams', { method: 'POST', body: payload, auth: true })
}

export async function getAllExams(materiaId?: string): Promise<ExamListItem[]> {
  const path = materiaId ? `/exams?materiaId=${encodeURIComponent(materiaId)}` : '/exams'
  return apiRequest<ExamListItem[]>(path, { auth: true })
}

export async function getExamById(id: string): Promise<ExamListItem> {
  return apiRequest<ExamListItem>(`/exams/${id}`, { auth: true })
}

export async function generateVersions(examId: string, payload: GenerateVersionsPayload): Promise<GeneratedVersion[]> {
  return apiRequest<GeneratedVersion[]>(`/exams/${examId}/generate`, { method: 'POST', body: payload, auth: true })
}

export async function regenerateVersions(examId: string, payload: GenerateVersionsPayload): Promise<GeneratedVersion[]> {
  return apiRequest<GeneratedVersion[]>(`/exams/${examId}/regenerate`, { method: 'POST', body: payload, auth: true })
}

export async function getExamVersion(versionId: string): Promise<ExamVersion> {
  return apiRequest<ExamVersion>(`/exams/versions/${versionId}`, { auth: true })
}

export async function getAnswerKey(versionId: string): Promise<AnswerKey[]> {
  return apiRequest<AnswerKey[]>(`/exams/versions/${versionId}/answer-key`, { auth: true })
}

export async function replaceQuestion(versionId: string, position: number, replacementQuestionId: string): Promise<void> {
  return apiRequest<void>(`/exams/versions/${versionId}/questions/${position}/replace`, {
    method: 'POST',
    body: { replacementQuestionId },
    auth: true,
  })
}

export async function deleteExam(id: string): Promise<void> {
  return apiRequest<void>(`/exams/${id}`, { method: 'DELETE', auth: true })
}
