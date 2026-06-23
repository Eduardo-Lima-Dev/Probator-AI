const STORAGE_KEY = 'probatorai.correction.history'

export type CorrectionHistoryEntry = {
  id: string
  examId: string
  examTitle: string
  versionLabel: string
  total_questoes: number
  acertos: number
  erros: number
  emBranco: number
  nota_final: number
  correctedAt: string
}

function readAll(): CorrectionHistoryEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  const parsed = JSON.parse(raw) as CorrectionHistoryEntry[] | null
  return Array.isArray(parsed) ? parsed : []
}

export function getCorrectionHistory(examId?: string): CorrectionHistoryEntry[] {
  const all = readAll().sort((a, b) => b.correctedAt.localeCompare(a.correctedAt))
  return examId ? all.filter((entry) => entry.examId === examId) : all
}

export function addCorrectionHistory(entry: CorrectionHistoryEntry): void {
  const all = readAll()
  all.push(entry)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}
