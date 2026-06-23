import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../theme/ThemeContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { getAllExams } from '../api/examsApi'
import type { ExamListItem } from '../api/examsApi'
import { getCorrectionHistory } from '../lib/correctionHistory'
import { BoldBtn } from '../components/ui/BoldBtn'
import { StatusPill } from '../components/ui/StatusPill'
import { I } from '../components/ui/icons'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function EstatisticasPage() {
  const { T } = useTheme()
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const [exams, setExams] = useState<ExamListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function reload() {
    setLoading(true)
    getAllExams()
      .then(setExams)
      .catch(() => setError('Não foi possível carregar as estatísticas.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { reload() }, [])

  const totalVersions = exams.reduce((acc, e) => acc + e.versions.length, 0)
  const correcoes = getCorrectionHistory()
  const mediaAcertos = correcoes.length > 0
    ? correcoes.reduce((acc, c) => acc + c.acertos / c.total_questoes, 0) / correcoes.length
    : null
  const kpis = [
    { l: 'Provas criadas', v: exams.length, c: T.ai },
    { l: 'Versões geradas', v: totalVersions, c: T.primaryAlt },
    { l: 'Arquivadas', v: exams.filter((e) => e.status === 'archived').length, c: T.success },
    { l: 'Rascunhos', v: exams.filter((e) => e.status === 'draft').length, c: T.warn },
  ]

  const pad = isMobile ? '16px 16px 40px' : '28px 32px 48px'

  return (
    <div style={{ padding: pad, maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 22 : 30, fontWeight: 700, margin: 0, letterSpacing: -0.8, color: T.text }}>Estatísticas</h1>
          <div style={{ color: T.textDim, fontSize: 13, marginTop: 4 }}>Visão geral das suas provas</div>
        </div>
        <BoldBtn T={T} variant="light" size="sm" icon={<I.Refresh size={13} stroke={2} />} onClick={reload} disabled={loading}>
          Atualizar
        </BoldBtn>
      </div>

      {error && <div style={{ padding: '12px 16px', background: `${T.danger}12`, border: `1px solid ${T.danger}30`, borderRadius: 12, color: T.danger, fontSize: 13, marginBottom: 16 }}>{error}</div>}

      {/* KPIs — 2 col mobile, 4 col desktop */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 10 : 14, marginBottom: 20 }}>
        {kpis.map((k) => (
          <div key={k.l} style={{ padding: isMobile ? 14 : 22, borderRadius: 14, background: T.surface, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.textDim, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: k.c, flexShrink: 0 }} />
              {k.l}
            </div>
            <div style={{ fontSize: isMobile ? 32 : 44, fontWeight: 700, letterSpacing: -1.4, lineHeight: 1, fontFamily: 'ui-monospace, monospace', marginTop: 8 }}>
              {loading ? '—' : k.v}
            </div>
          </div>
        ))}
      </div>

      {/* Analytics info banner */}
      <div style={{ padding: isMobile ? 16 : 22, background: T.aiBg, border: `1px solid ${T.aiBorder}`, borderRadius: 16, marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: T.aiGrad, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <I.Sparkles size={16} stroke={2.2} />
        </div>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: T.text, marginBottom: 4 }}>Analytics de desempenho</div>
          {correcoes.length > 0 ? (
            <div style={{ fontSize: 12.5, color: T.textDim, lineHeight: 1.5 }}>
              <strong style={{ color: T.text }}>{correcoes.length}</strong> correção(ões) registrada(s) neste dispositivo · média de{' '}
              <strong style={{ color: T.text }}>{Math.round((mediaAcertos ?? 0) * 100)}%</strong> de acertos.
            </div>
          ) : (
            <div style={{ fontSize: 12.5, color: T.textDim, lineHeight: 1.5 }}>
              Nenhuma correção registrada ainda. Entre em uma prova gerada e use "Corrigir prova" para ler o gabarito de um aluno.
            </div>
          )}
          <div style={{ marginTop: 10 }}>
            <BoldBtn T={T} size="sm" variant="light" icon={<I.ArrowRight size={12} stroke={2} />} onClick={() => navigate('/banco-questoes')}>
              Ver banco de questões
            </BoldBtn>
          </div>
        </div>
      </div>

      {/* Provas recentes */}
      <div style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: T.text }}>Provas recentes</h3>
          <span style={{ fontSize: 12, color: T.textMute }}>{loading ? '—' : exams.length} prova(s)</span>
        </div>

        {loading && <div style={{ padding: 40, textAlign: 'center', color: T.textMute, fontSize: 14 }}>Carregando…</div>}
        {!loading && exams.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: T.textMute, fontSize: 14 }}>Nenhuma prova criada ainda.</div>}

        {!loading && exams.length > 0 && (
          isMobile ? (
            /* Mobile: card list */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {exams.map((e, idx) => (
                <div
                  key={e.id}
                  onClick={() => navigate(`/provas/${e.id}/analytics`)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: idx < exams.length - 1 ? `1px solid ${T.border}` : 'none', cursor: 'pointer', background: 'transparent', transition: 'background .1s' }}
                  onTouchStart={(el) => { el.currentTarget.style.background = T.surfaceAlt }}
                  onTouchEnd={(el) => { el.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</div>
                    <div style={{ fontSize: 12, color: T.textMute, marginTop: 3 }}>{e.materia.name} · {formatDate(e.createdAt)}</div>
                    <div style={{ marginTop: 6 }}>
                      <StatusPill T={T} status={e.status} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                    <span style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', color: T.textDim }}>{e.versions.length}×</span>
                    <I.ArrowRight size={14} stroke={1.8} style={{ color: T.textMute }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Desktop: table */
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 0.8fr 0.8fr', padding: '10px 22px', gap: 14, background: T.surfaceAlt, fontSize: 11, color: T.textMute, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>
                <div>Título</div><div>Matéria</div><div>Status</div><div>Versões</div><div>Criada em</div>
              </div>
              {exams.map((e, idx) => (
                <div key={e.id} onClick={() => navigate(`/provas/${e.id}/analytics`)}
                  style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 0.8fr 0.8fr', gap: 14, padding: '14px 22px', borderBottom: idx < exams.length - 1 ? `1px solid ${T.border}` : 'none', alignItems: 'center', cursor: 'pointer', transition: 'background .1s' }}
                  onMouseEnter={(el) => { el.currentTarget.style.background = T.surfaceAlt }}
                  onMouseLeave={(el) => { el.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</div>
                  <div style={{ fontSize: 12.5, color: T.textDim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.materia.name}</div>
                  <div><StatusPill T={T} status={e.status} /></div>
                  <div style={{ fontSize: 13, fontFamily: 'ui-monospace, monospace', color: T.text }}>{e.versions.length}×</div>
                  <div style={{ fontSize: 12, color: T.textMute }}>{formatDate(e.createdAt)}</div>
                </div>
              ))}
            </>
          )
        )}
      </div>
    </div>
  )
}
