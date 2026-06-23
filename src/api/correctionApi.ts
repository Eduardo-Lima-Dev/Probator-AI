import { apiRequest } from './httpClient'

export type QuestaoLida = {
  numero_questao: number
  alternativa_marcada: string | null
}

export type ScanGabaritoResponse = {
  examVersionId: string
  versao_prova: string | null
  questoes: QuestaoLida[]
}

export type QuestaoRevisada = {
  numero_questao: number
  alternativa_marcada: string | null
}

export type DetalheQuestao = {
  posicao_questao: number
  gabarito_oficial: string
  marcada_pelo_aluno: string | null
  status: 'CORRETO' | 'ERRADO' | 'EM_BRANCO'
}

export type CorrecaoResultado = {
  examVersionId: string
  total_questoes: number
  acertos: number
  erros: number
  emBranco: number
  nota_final: number
  detalhes: DetalheQuestao[]
}

export async function scanGabarito(examVersionId: string, file: File): Promise<ScanGabaritoResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('examVersionId', examVersionId)
  return apiRequest<ScanGabaritoResponse>('/gabaritos/process', {
    method: 'POST',
    body: formData,
    auth: true,
  })
}

export async function homologarCorrecao(
  examVersionId: string,
  questoes: QuestaoRevisada[],
): Promise<CorrecaoResultado> {
  return apiRequest<CorrecaoResultado>('/correction/homologar-correcao', {
    method: 'POST',
    body: { examVersionId, questoes },
    auth: true,
  })
}
