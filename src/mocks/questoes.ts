export type Questao = {
  n: number
  enunciado: string
  alts: string[]
  correct: number
  topic?: string
}

export const questoesA: Questao[] = [
  {
    n: 1,
    enunciado: 'Calcule a derivada de f(x) = 3x² + 2x − 5 no ponto x = 2.',
    alts: ['12', '14', '10', '16'],
    correct: 1,
    topic: 'Derivadas',
  },
  {
    n: 2,
    enunciado: 'Sobre limites, assinale a alternativa correta a respeito da continuidade de f em x = a.',
    alts: [
      'f(a) deve existir e lim f(x) = f(a)',
      'Basta lim f(x) existir',
      'f deve ser derivável em a',
      'Nenhuma das anteriores',
    ],
    correct: 0,
    topic: 'Continuidade',
  },
  {
    n: 3,
    enunciado: 'A regra da cadeia aplicada a sen(3x²) resulta em:',
    alts: ['6x · cos(3x²)', 'cos(3x²)', '3x² · cos(x)', '−sen(6x)'],
    correct: 0,
    topic: 'Regra da cadeia',
  },
  {
    n: 4,
    enunciado: 'O limite quando x → ∞ de (2x+1)/(x−3) é:',
    alts: ['0', '1', '2', '∞'],
    correct: 2,
    topic: 'Limites no infinito',
  },
  {
    n: 5,
    enunciado: 'Calcule a integral definida ∫₀² (3x² + 2x − 5) dx.',
    alts: ['a) 6', 'b) 8', 'c) 12', 'd) 2'],
    correct: 0,
    topic: 'Integral definida',
  },
]

export const questoesB: Questao[] = [
  { ...questoesA[2], n: 1, alts: ['cos(3x²)', '6x · cos(3x²)', '−sen(6x)', '3x² · cos(x)'], correct: 1 },
  { ...questoesA[0], n: 2, alts: ['10', '12', '16', '14'], correct: 3 },
  { ...questoesA[3], n: 3, alts: ['∞', '2', '1', '0'], correct: 1 },
  {
    ...questoesA[1],
    n: 4,
    alts: [
      'Basta lim f(x) existir',
      'Nenhuma das anteriores',
      'f(a) deve existir e lim f(x) = f(a)',
      'f deve ser derivável em a',
    ],
    correct: 2,
  },
]

export const sampleQuestoes: Questao[] = [
  { n: 1, enunciado: 'Calcule a integral definida ∫₀² (3x² + 2x − 5) dx.', alts: ['a) 6', 'b) 8', 'c) 12', 'd) 2'], correct: 0, topic: 'Integral definida' },
  { n: 2, enunciado: 'Pelo Teorema Fundamental do Cálculo, se F é primitiva de f em [a, b], então:', alts: ['a) F(a) − F(b)', 'b) F(b) − F(a)', 'c) F\'(b) − F\'(a)', 'd) f(b) − f(a)'], correct: 1, topic: 'TFC' },
  { n: 3, enunciado: 'Calcule a área entre as curvas y = x² e y = 2x no intervalo [0, 2].', alts: ['a) 4/3', 'b) 8/3', 'c) 2', 'd) 1'], correct: 0, topic: 'Áreas entre curvas' },
  { n: 4, enunciado: 'O volume do sólido gerado pela rotação de y = √x em torno do eixo x, no intervalo [0, 4], é:', alts: ['a) 4π', 'b) 8π', 'c) 16π/3', 'd) 32π/5'], correct: 1, topic: 'Volumes' },
  { n: 5, enunciado: 'Avalie ∫ x · eˣ dx por integração por partes.', alts: ['a) eˣ + C', 'b) x·eˣ − eˣ + C', 'c) eˣ(x + 1) + C', 'd) x²·eˣ/2 + C'], correct: 1, topic: 'Integração por partes' },
]
