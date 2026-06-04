import { useEffect, useState } from 'react'
import { useTheme } from '../theme/ThemeContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { getQuestions, archiveQuestion } from '../api/questionsApi'
import type { Question } from '../api/questionsApi'
import { getMaterias } from '../api/materiasApi'
import type { Materia } from '../api/materiasApi'
import type { DifficultyLevel } from '../api/examsApi'
import { BoldBtn } from '../components/ui/BoldBtn'
import { BoldChip } from '../components/ui/BoldChip'
import { I } from '../components/ui/icons'
import { useToast } from '../components/ui/Toast'

const LEVEL_LABEL: Record<DifficultyLevel, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
}

const LEVEL_COLOR = (T: ReturnType<typeof useTheme>['T'], level: DifficultyLevel) => ({
  facil: { c: T.success, bg: 'rgba(22,163,74,0.10)' },
  medio: { c: T.warn, bg: 'rgba(217,119,6,0.10)' },
  dificil: { c: T.danger, bg: 'rgba(220,38,38,0.10)' },
}[level])

// Paleta de cores para identificar matérias visualmente
const MATERIA_PALETTE = ['#7c3aed', '#0ea5e9', '#16a34a', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']

function getMateriaColor(materiaId: string, materias: Materia[]): { color: string; bg: string } {
  const idx = materias.findIndex((m) => m.id === materiaId)
  const color = MATERIA_PALETTE[(idx < 0 ? 0 : idx) % MATERIA_PALETTE.length]
  return { color, bg: `${color}18` }
}

export function BancoQuestoesPage() {
  const { T } = useTheme()
  const isMobile = useIsMobile()
  const { user } = useCurrentUser()
  const isAdmin = user?.role === 'admin'
  const toast = useToast()
  const [materias, setMaterias] = useState<Materia[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [materiaFilter, setMateriaFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState<DifficultyLevel | ''>('')
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [archivingId, setArchivingId] = useState<string | null>(null)
  const [confirmArchiveId, setConfirmArchiveId] = useState<string | null>(null)
  const LIMIT = 20

  useEffect(() => {
    getMaterias().then(setMaterias).catch(() => {})
  }, [])

  useEffect(() => {
    setPage(1)
  }, [materiaFilter, levelFilter])

  useEffect(() => {
    setLoading(true)
    setError('')
    getQuestions({
      ...(materiaFilter && { materiaId: materiaFilter }),
      ...(levelFilter && { level: levelFilter }),
      page,
      limit: LIMIT,
    })
      .then(setQuestions)
      .catch(() => setError('Não foi possível carregar as questões.'))
      .finally(() => setLoading(false))
  }, [materiaFilter, levelFilter, page])

  async function handleArchive(id: string) {
    setArchivingId(id)
    try {
      await archiveQuestion(id)
      setQuestions((prev) => prev.filter((q) => q.id !== id))
      toast.success('Questão arquivada com sucesso.')
    } catch {
      toast.error('Não foi possível arquivar a questão.')
    } finally {
      setArchivingId(null)
      setConfirmArchiveId(null)
    }
  }

  return (
    <div style={{ padding: isMobile ? '16px 16px 40px' : '28px 32px 48px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, letterSpacing: -0.6, color: T.text, margin: '0 0 4px' }}>Banco de Questões</h1>
        <p style={{ color: T.textDim, fontSize: 13, margin: 0 }}>Questões disponíveis para geração de provas</p>
      </div>

      {/* Materia filter */}
      <select
        value={materiaFilter}
        onChange={(e) => setMateriaFilter(e.target.value)}
        style={{ width: isMobile ? '100%' : 'auto', height: 40, padding: '0 14px', borderRadius: 10, border: `1.5px solid ${T.border}`, background: T.surface, color: materiaFilter ? T.text : T.textMute, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', outline: 'none', marginBottom: 12 }}
      >
        <option value="">Todas as matérias</option>
        {materias.map((m) => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>

      {/* Level chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['', 'facil', 'medio', 'dificil'] as const).map((l) => (
          <BoldChip
            key={l}
            T={T}
            active={levelFilter === l}
            onClick={() => setLevelFilter(l)}
            size="sm"
            accent={l === 'facil' ? T.success : l === 'medio' ? T.warn : l === 'dificil' ? T.danger : undefined}
          >
            {l === '' ? 'Todos' : LEVEL_LABEL[l]}
          </BoldChip>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '12px 16px', background: `${T.danger}12`, border: `1px solid ${T.danger}30`, borderRadius: 12, color: T.danger, fontSize: 13, marginBottom: 20 }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ color: T.textMute, fontSize: 14, textAlign: 'center', padding: 60, background: T.surface, borderRadius: 16, border: `1px solid ${T.border}` }}>
          Carregando questões…
        </div>
      )}

      {/* Empty */}
      {!loading && questions.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: 60, color: T.textMute, fontSize: 14, background: T.surface, borderRadius: 16, border: `1px solid ${T.border}` }}>
          <I.Doc size={36} stroke={1.4} style={{ display: 'block', margin: '0 auto 12px' }} />
          Nenhuma questão encontrada.
          <div style={{ fontSize: 12, marginTop: 8, color: T.textMute }}>
            Importe questões via Materiais → Importar do NotebookLM
          </div>
        </div>
      )}

      {/* Questions list */}
      {!loading && questions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {questions.map((q, idx) => {
            const lc = LEVEL_COLOR(T, q.level)
            const mc = getMateriaColor(q.materiaId, materias)
            const materiaNome = materias.find((m) => m.id === q.materiaId)?.name
            const isExpanded = expandedId === q.id
            const isConfirm = confirmArchiveId === q.id
            return (
              <div
                key={q.id}
                style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.border}`, overflow: 'hidden' }}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '16px 18px', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
                >
                  <span style={{ width: 28, height: 28, borderRadius: 7, background: T.surfaceAlt, color: T.textDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11.5, fontWeight: 700, fontFamily: 'ui-monospace, monospace', flexShrink: 0 }}>
                    {(page - 1) * LIMIT + idx + 1}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: T.text, lineHeight: 1.4, marginBottom: 6, display: '-webkit-box', WebkitLineClamp: isExpanded ? undefined : 2, WebkitBoxOrient: 'vertical', overflow: isExpanded ? 'visible' : 'hidden' }}>
                      {q.statement}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                      {/* Matéria badge com cor */}
                      {materiaNome && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: mc.bg, color: mc.color }}>
                          <span style={{ width: 6, height: 6, borderRadius: 99, background: mc.color, flexShrink: 0 }} />
                          {materiaNome}
                        </span>
                      )}
                      {/* Nível */}
                      <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: lc.bg, color: lc.c }}>
                        {LEVEL_LABEL[q.level]}
                      </span>
                      <span style={{ fontSize: 11.5, color: T.textMute }}>
                        {q.alternatives.length} alternativas
                      </span>
                    </div>
                  </div>
                  <I.ArrowRight size={14} stroke={1.8} style={{ color: T.textMute, flexShrink: 0, transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform .15s', marginTop: 4 }} />
                </button>

                {/* Expanded view — sem destacar resposta certa ou explicações */}
                {isExpanded && (
                  <div style={{ padding: '0 18px 18px', borderTop: `1px solid ${T.border}` }}>
                    <div style={{ paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {q.alternatives.map((a) => (
                        <div
                          key={a.id}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: T.surfaceAlt }}
                        >
                          <span style={{ width: 22, height: 22, borderRadius: 99, background: T.surface, color: T.textDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0, border: `1.5px solid ${T.border}` }}>
                            {a.originalLabel}
                          </span>
                          <div style={{ fontSize: 13.5, color: T.text }}>{a.text}</div>
                        </div>
                      ))}
                    </div>
                    {isAdmin && (
                      <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        {isConfirm ? (
                          <>
                            <BoldBtn T={T} size="sm" variant="ghost" onClick={() => setConfirmArchiveId(null)} disabled={archivingId === q.id}>
                              Cancelar
                            </BoldBtn>
                            <BoldBtn T={T} size="sm" variant="outline" icon={<I.Inbox size={12} stroke={2} />} onClick={() => handleArchive(q.id)} disabled={archivingId === q.id} style={{ color: T.warn, borderColor: `${T.warn}60` }}>
                              {archivingId === q.id ? 'Arquivando…' : 'Confirmar arquivo'}
                            </BoldBtn>
                          </>
                        ) : (
                          <BoldBtn T={T} size="sm" variant="light" icon={<I.Inbox size={12} stroke={2} />} onClick={() => setConfirmArchiveId(q.id)}>
                            Arquivar questão
                          </BoldBtn>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, gap: 12 }}>
          <BoldBtn T={T} variant="outline" size="sm" icon={<I.ArrowLeft size={13} stroke={2} />} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || loading}>
            Anterior
          </BoldBtn>
          <span style={{ fontSize: 13, color: T.textMute }}>Página {page}</span>
          <BoldBtn T={T} variant="outline" size="sm" iconRight={<I.ArrowRight size={13} stroke={2} />} onClick={() => setPage((p) => p + 1)} disabled={questions.length < LIMIT || loading}>
            Próxima
          </BoldBtn>
        </div>
      )}
    </div>
  )
}
