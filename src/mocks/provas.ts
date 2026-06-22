export type ProvaStatus = 'Rascunho' | 'Gerada' | 'Aplicada'

export type HardestQuestion = {
  n: number
  topic: string
  err: number
}

export type Prova = {
  id: string
  title: string
  disciplina: string
  turma: string
  status: ProvaStatus
  versions: number
  questions: number
  created: string
  applied?: string
  avg?: number
  students?: number
  hardest?: HardestQuestion[]
}

export const mockProvas: Prova[] = [
  {
    id: 'p1',
    title: 'P1 — Derivadas e Continuidade',
    disciplina: 'Cálculo I',
    turma: 'MAT001-A · 2026.1',
    status: 'Aplicada',
    versions: 4,
    questions: 10,
    created: '12 abr',
    applied: '24 abr',
    avg: 7.4,
    students: 38,
    hardest: [
      { n: 7, topic: 'Regra da cadeia', err: 62 },
      { n: 4, topic: 'Limites no infinito', err: 51 },
      { n: 9, topic: 'Continuidade por partes', err: 44 },
    ],
  },
  {
    id: 'p2',
    title: 'Bimestral — Brasil República',
    disciplina: 'História do Brasil',
    turma: 'HIS204-B · 2026.1',
    status: 'Gerada',
    versions: 2,
    questions: 12,
    created: '02 mai',
  },
  {
    id: 'p3',
    title: 'Recuperação — Estequiometria',
    disciplina: 'Química Geral',
    turma: 'QUI101-C · 2026.1',
    status: 'Rascunho',
    versions: 2,
    questions: 8,
    created: '08 mai',
  },
  {
    id: 'p4',
    title: 'P1 — Algoritmos e Estruturas',
    disciplina: 'Ciência da Computação',
    turma: 'CC201-A · 2026.1',
    status: 'Aplicada',
    versions: 3,
    questions: 15,
    created: '15 mar',
    applied: '28 mar',
    avg: 6.8,
    students: 42,
    hardest: [
      { n: 11, topic: 'Complexidade O(n log n)', err: 71 },
      { n: 6, topic: 'Árvores AVL', err: 58 },
      { n: 13, topic: 'Hash colisão', err: 49 },
    ],
  },
  {
    id: 'p5',
    title: 'Trimestral — Modernismo',
    disciplina: 'Literatura Brasileira',
    turma: 'LET102-A · 2026.1',
    status: 'Aplicada',
    versions: 2,
    questions: 10,
    created: '20 mar',
    applied: '02 abr',
    avg: 8.1,
    students: 28,
    hardest: [
      { n: 3, topic: 'Semana de 22', err: 39 },
      { n: 8, topic: 'Drummond — análise', err: 35 },
    ],
  },
  {
    id: 'p6',
    title: 'Concordância e Regência',
    disciplina: 'Língua Portuguesa',
    turma: 'LP301-D · 2026.1',
    status: 'Gerada',
    versions: 3,
    questions: 12,
    created: '05 mai',
  },
]

export const statusOptions: Array<'Todos' | ProvaStatus> = ['Todos', 'Rascunho', 'Gerada', 'Aplicada']
