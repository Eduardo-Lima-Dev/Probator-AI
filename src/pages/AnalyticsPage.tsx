import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../theme/ThemeContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { getExamById, getAnswerKey } from '../api/examsApi'
import type { ExamListItem, AnswerKey } from '../api/examsApi'
import { StatusPill } from '../components/ui/StatusPill'
import { BoldBtn } from '../components/ui/BoldBtn'
import { Badge } from '../components/ui/Badge'
import { I } from '../components/ui/icons'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function AnalyticsPage() {
  const { T } = useTheme()
  const isMobile = useIsMobile()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [exam, setExam] = useState<ExamListItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedVersionId, setExpandedVersionId] = useState<string | null>(null)
  const [answerKeys, setAnswerKeys] = useState<Record<string, AnswerKey[]>>({})
  const [loadingAk, setLoadingAk] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    getExamById(id)
      .then(setExam)
      .catch(() => setError('Prova não encontrada.'))
      .finally(() => setLoading(false))
  }, [id])

  async function toggleAnswerKey(versionId: string) {
    if (expandedVersionId === versionId) {
      setExpandedVersionId(null)
      return
    }
    setExpandedVersionId(versionId)
    if (answerKeys[versionId]) return
    setLoadingAk(versionId)
    try {
      const ak = await getAnswerKey(versionId)
      setAnswerKeys((prev) => ({ ...prev, [versionId]: ak }))
    } catch {
      // silently ignore
    } finally {
      setLoadingAk(null)
    }
  }

  if (loading) {
    return <div style={{ padding: 60, textAlign: 'center', color: T.textMute, fontSize: 14, background: T.bg, minHeight: '100vh' }}>Carregando…</div>
  }

  if (error || !exam) {
    return (
      <div style={{ padding: '28px 32px', background: T.bg, minHeight: '100vh' }}>
        <button type="button" onClick={() => navigate('/provas')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'transparent', border: 'none', color: T.textDim, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, padding: 0, marginBottom: 16 }}>
          <I.ArrowLeft size={12} stroke={2} /> Voltar
        </button>
        <div style={{ padding: '12px 16px', background: `${T.danger}12`, border: `1px solid ${T.danger}30`, borderRadius: 12, color: T.danger, fontSize: 13 }}>{error || 'Prova não encontrada.'}</div>
      </div>
    )
  }

  return (
    <div style={{ padding: isMobile ? '16px' : '28px 32px 48px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, gap: 20, flexWrap: 'wrap' }}>
        <div>
          <button type="button" onClick={() => navigate('/provas')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'transparent', border: 'none', color: T.textDim, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, padding: 0, marginBottom: 8 }}>
            <I.ArrowLeft size={12} stroke={2} /> Voltar
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <StatusPill T={T} status={exam.status} />
          </div>
          <h1 style={{ fontSize: isMobile ? 22 : 30, fontWeight: 700, margin: 0, letterSpacing: -0.8, lineHeight: 1.05, color: T.text }}>{exam.title}</h1>
          <div style={{ color: T.textDim, fontSize: 13.5, marginTop: 6 }}>{exam.materia.name} · criada {formatDate(exam.createdAt)}</div>
          {exam.description && <div style={{ color: T.textMute, fontSize: 13, marginTop: 4, maxWidth: 600 }}>{exam.description}</div>}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {exam.status === 'generated' && (
            <BoldBtn T={T} variant="ai" icon={<I.ArrowRight size={13} stroke={2} />} onClick={() => navigate('/provas/nova/revisar', { state: { examId: exam.id, materiaId: exam.materiaId, versions: exam.versions } })}>
              Revisar prova
            </BoldBtn>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BoldBtn T={T} variant="outline" icon={<I.Doc size={13} stroke={1.8} />} disabled>Exportar PDF</BoldBtn>
            <Badge T={T} />
          </div>
        </div>
      </div>

      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { l: 'Versões', v: exam.versions.length, c: T.ai },
          { l: 'Matéria', v: exam.materia.name, c: T.primaryAlt, text: true },
          { l: 'Criada em', v: formatDate(exam.createdAt), c: T.textDim, text: true },
          { l: 'Atualizada', v: formatDate(exam.updatedAt), c: T.textDim, text: true },
        ].map((k) => (
          <div key={k.l} style={{ padding: isMobile ? 16 : 20, borderRadius: 16, background: T.surface, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11.5, color: T.textDim, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8 }}>{k.l}</div>
            {'text' in k && k.text
              ? <div style={{ fontSize: 15, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k.v}</div>
              : <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1.6, lineHeight: 1, fontFamily: 'ui-monospace, monospace', color: T.text }}>{k.v}</div>
            }
          </div>
        ))}
      </div>

      {/* Analytics placeholder */}
      <div style={{ padding: 22, background: T.aiBg, border: `1px solid ${T.aiBorder}`, borderRadius: 16, marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: T.aiGrad, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <I.Chart size={18} stroke={2} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 4 }}>Analytics de desempenho</div>
          <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.5 }}>
            Acertos por questão, distribuição de notas e análise por turma estarão disponíveis quando o módulo de correção for implementado.
          </div>
        </div>
      </div>

      {/* Versions & answer keys */}
      <div style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, letterSpacing: -0.2, color: T.text }}>Versões geradas</h3>
          <span style={{ fontSize: 12, color: T.textMute }}>{exam.versions.length} versão(ões)</span>
        </div>

        {exam.versions.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: T.textMute, fontSize: 14 }}>
            Nenhuma versão gerada. <button type="button" style={{ background: 'none', border: 'none', color: T.ai, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600 }} onClick={() => navigate('/provas/nova')}>Gerar versões</button>
          </div>
        )}

        {exam.versions.map((v, idx) => {
          const ak = answerKeys[v.id] ?? []
          const isExpanded = expandedVersionId === v.id
          return (
            <div key={v.id} style={{ borderBottom: idx < exam.versions.length - 1 ? `1px solid ${T.border}` : 'none' }}>
              <button type="button" onClick={() => toggleAnswerKey(v.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 22px', width: '100%', background: isExpanded ? T.aiBg : 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'background .15s' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: isExpanded ? T.ai : T.surfaceAlt, color: isExpanded ? '#fff' : T.textDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0, transition: 'background .15s, color .15s' }}>
                  {v.versionLabel}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Versão {v.versionLabel}</div>
                  <div style={{ fontSize: 11.5, color: T.textMute }}>
                    {isExpanded && ak.length > 0 ? `${ak.length} questões no gabarito` : 'Clique para ver o gabarito'}
                  </div>
                </div>
                <I.ArrowRight size={14} stroke={1.8} style={{ color: T.textMute, transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform .15s' }} />
              </button>

              {isExpanded && (
                <div style={{ padding: '0 22px 16px' }}>
                  {loadingAk === v.id && <div style={{ padding: 20, textAlign: 'center', color: T.textMute, fontSize: 13 }}>Carregando gabarito…</div>}
                  {ak.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                      {ak.map((item) => (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: T.surfaceAlt, borderRadius: 10 }}>
                          <span style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', color: T.textDim, minWidth: 24 }}>Q{item.questionPosition}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.question.statement.slice(0, 40)}…</div>
                          </div>
                          <span style={{ width: 26, height: 26, borderRadius: 7, background: T.aiBg, color: T.ai, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{item.shuffledLabel}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
