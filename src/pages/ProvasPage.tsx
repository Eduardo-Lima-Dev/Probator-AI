import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../theme/ThemeContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { getAllExams, deleteExam } from '../api/examsApi'
import type { ExamListItem, ExamStatus } from '../api/examsApi'
import { BoldBtn } from '../components/ui/BoldBtn'
import { BoldChip } from '../components/ui/BoldChip'
import { StatusPill } from '../components/ui/StatusPill'
import { I } from '../components/ui/icons'
import { useToast } from '../components/ui/Toast'

type StatusFilter = 'todos' | ExamStatus
const FILTER_OPTIONS: { v: StatusFilter; l: string }[] = [
  { v: 'todos', l: 'Todos' },
  { v: 'draft', l: 'Rascunho' },
  { v: 'generated', l: 'Gerada' },
  { v: 'archived', l: 'Arquivada' },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export function ProvasPage() {
  const { T } = useTheme()
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const toast = useToast()
  const [exams, setExams] = useState<ExamListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    getAllExams()
      .then(setExams)
      .catch(() => setError('Não foi possível carregar as provas.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(
    () => exams.filter((e) => statusFilter === 'todos' || e.status === statusFilter),
    [exams, statusFilter],
  )

  const counts = useMemo(() => ({
    total: exams.length,
    draft: exams.filter((e) => e.status === 'draft').length,
    generated: exams.filter((e) => e.status === 'generated').length,
    archived: exams.filter((e) => e.status === 'archived').length,
  }), [exams])

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await deleteExam(id)
      setExams((prev) => prev.filter((e) => e.id !== id))
      toast.success('Prova excluída com sucesso.')
    } catch {
      toast.error('Não foi possível excluir a prova.')
    } finally {
      setDeletingId(null)
      setConfirmDeleteId(null)
    }
  }

  const kpis = [
    { n: counts.total, l: 'Total', s: 'provas criadas', c: T.ai },
    { n: counts.archived, l: 'Arquivadas', s: 'aplicadas', c: T.success },
    { n: counts.generated, l: 'Geradas', s: 'aguardando aplicação', c: T.primaryAlt },
    { n: counts.draft, l: 'Rascunhos', s: 'em construção', c: T.warn },
  ]

  if (isMobile) {
    return (
      <div style={{ padding: '20px 16px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {kpis.map((k) => (
            <div key={k.l} style={{ padding: 16, background: T.surface, borderRadius: 14, border: `1px solid ${T.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: T.textDim, fontWeight: 600, letterSpacing: 0.2, textTransform: 'uppercase' }}>
                <span style={{ width: 7, height: 7, borderRadius: 99, background: k.c }} /> {k.l}
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: -1.2, lineHeight: 1, marginTop: 8, fontFamily: 'ui-monospace, monospace' }}>{loading ? '—' : k.n}</div>
              <div style={{ fontSize: 11, color: T.textMute, marginTop: 2 }}>{k.s}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 16, scrollbarWidth: 'none' }}>
          {FILTER_OPTIONS.map((f) => (
            <BoldChip key={f.v} T={T} active={statusFilter === f.v} onClick={() => setStatusFilter(f.v)} size="sm"
              accent={f.v === 'archived' ? T.success : f.v === 'generated' ? T.primaryAlt : f.v === 'draft' ? T.warn : undefined}>
              {f.l}
            </BoldChip>
          ))}
        </div>

        {error && <div style={{ padding: '12px 16px', background: `${T.danger}12`, border: `1px solid ${T.danger}30`, borderRadius: 12, color: T.danger, fontSize: 13, marginBottom: 16 }}>{error}</div>}
        {loading && <div style={{ color: T.textMute, fontSize: 14, textAlign: 'center', padding: 40 }}>Carregando…</div>}

        {/* Empty state mobile */}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 24px', background: T.surface, borderRadius: 16, border: `1px solid ${T.border}` }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: T.aiBg, color: T.ai, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <I.Doc size={26} stroke={1.6} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 6, letterSpacing: -0.3 }}>
              {exams.length === 0 ? 'Nenhuma prova ainda' : 'Nenhum resultado'}
            </div>
            <div style={{ fontSize: 13, color: T.textMute, lineHeight: 1.5, marginBottom: 20 }}>
              {exams.length === 0
                ? 'Crie sua primeira prova e gere versões embaralhadas com IA.'
                : `Não há provas com status "${FILTER_OPTIONS.find(f => f.v === statusFilter)?.l}".`}
            </div>
            {exams.length === 0 ? (
              <BoldBtn T={T} variant="ai" icon={<I.Plus size={14} stroke={2.2} />} onClick={() => navigate('/provas/nova')}>
                Nova prova
              </BoldBtn>
            ) : (
              <BoldBtn T={T} variant="outline" onClick={() => setStatusFilter('todos')}>
                Ver todas as provas
              </BoldBtn>
            )}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((e) => (
            <div key={e.id} style={{ padding: '14px 16px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div onClick={() => navigate(`/provas/${e.id}/analytics`)} style={{ cursor: 'pointer', flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: -0.2, color: T.text, marginBottom: 4 }}>{e.title}</div>
                  <div style={{ fontSize: 12, color: T.textMute, marginBottom: 6 }}>{e.materia.name} · {formatDate(e.createdAt)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <StatusPill T={T} status={e.status} />
                    <span style={{ fontSize: 11.5, color: T.textDim, fontFamily: 'ui-monospace, monospace' }}>{e.versions.length} versão(ões)</span>
                  </div>
                </div>
                {e.versions.length > 0 && (
                  <BoldBtn T={T} size="sm" variant="light" icon={<I.Check size={12} stroke={2} />} onClick={() => navigate(`/provas/${e.id}/corrigir`)}>
                    Corrigir
                  </BoldBtn>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '28px 32px 48px', maxWidth: 1400, margin: '0 auto' }}>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {kpis.map((k) => (
          <div key={k.l} style={{ padding: 18, background: T.surface, borderRadius: 16, border: `1px solid ${T.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: T.textDim, fontWeight: 600, letterSpacing: 0.2, textTransform: 'uppercase' }}>
              <span style={{ width: 7, height: 7, borderRadius: 99, background: k.c }} /> {k.l}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
              <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1.4, lineHeight: 1, fontFamily: 'ui-monospace, monospace' }}>{loading ? '—' : k.n}</span>
              <span style={{ fontSize: 12, color: T.textMute }}>{k.s}</span>
            </div>
          </div>
        ))}
      </div>

      {error && <div style={{ padding: '12px 16px', background: `${T.danger}12`, border: `1px solid ${T.danger}30`, borderRadius: 12, color: T.danger, fontSize: 13, marginBottom: 20 }}>{error}</div>}

      {/* Filter row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, letterSpacing: -0.4, color: T.text }}>Todas as provas</h2>
          <span style={{ fontSize: 12.5, color: T.textMute }}>{loading ? '—' : filtered.length} resultado(s)</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {FILTER_OPTIONS.map((f) => (
            <BoldChip key={f.v} T={T} active={statusFilter === f.v} onClick={() => setStatusFilter(f.v)} size="sm"
              accent={f.v === 'archived' ? T.success : f.v === 'generated' ? T.primaryAlt : f.v === 'draft' ? T.warn : undefined}>
              {f.l}
            </BoldChip>
          ))}
        </div>
      </div>

      {loading && <div style={{ color: T.textMute, fontSize: 14, textAlign: 'center', padding: 60, background: T.surface, borderRadius: 16, border: `1px solid ${T.border}` }}>Carregando provas…</div>}

      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 32px', background: T.surface, borderRadius: 16, border: `1px solid ${T.border}` }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: T.aiBg, color: T.ai, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <I.Doc size={30} stroke={1.6} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 8, letterSpacing: -0.4 }}>
            {exams.length === 0 ? 'Nenhuma prova ainda' : 'Nenhum resultado'}
          </div>
          <div style={{ fontSize: 14, color: T.textMute, lineHeight: 1.6, maxWidth: 360, margin: '0 auto 24px' }}>
            {exams.length === 0
              ? 'Crie sua primeira prova e gere versões embaralhadas com IA a partir do banco de questões.'
              : `Não há provas com status "${FILTER_OPTIONS.find(f => f.v === statusFilter)?.l}". Tente outro filtro.`}
          </div>
          {exams.length === 0 ? (
            <BoldBtn T={T} variant="ai" icon={<I.Sparkles size={15} stroke={2.2} />} onClick={() => navigate('/provas/nova')}>
              Criar primeira prova
            </BoldBtn>
          ) : (
            <BoldBtn T={T} variant="outline" onClick={() => setStatusFilter('todos')}>
              Ver todas as provas
            </BoldBtn>
          )}
        </div>
      )}

      {/* Table */}
      {!loading && filtered.length > 0 && (
        <div style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr 0.9fr 0.6fr 1.6fr', padding: '12px 22px', gap: 14, background: T.surfaceAlt, borderBottom: `1px solid ${T.border}`, fontSize: 11, color: T.textMute, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>
            <div>Título</div><div>Matéria</div><div>Status</div><div>Versões</div><div style={{ textAlign: 'right' }}>Ações</div>
          </div>

          {filtered.map((e, idx) => (
            <div
              key={e.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.7fr 1fr 0.9fr 0.6fr 1.6fr',
                padding: '15px 22px',
                gap: 14,
                alignItems: 'center',
                borderBottom: idx < filtered.length - 1 ? `1px solid ${T.border}` : 'none',
                background: confirmDeleteId === e.id ? `${T.danger}06` : 'transparent',
                transition: 'background .1s',
              }}
            >
              <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/provas/${e.id}/analytics`)}>
                <div style={{ fontWeight: 600, letterSpacing: -0.2, fontSize: 13.5, color: T.text }}>{e.title}</div>
                <div style={{ fontSize: 11.5, color: T.textMute, marginTop: 2 }}>criada {formatDate(e.createdAt)}</div>
              </div>
              <div style={{ fontSize: 12.5, color: T.textDim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.materia.name}</div>
              <div><StatusPill T={T} status={e.status} /></div>
              <div style={{ fontSize: 13, fontFamily: 'ui-monospace, monospace', color: T.text }}>{e.versions.length}×</div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                {confirmDeleteId === e.id ? (
                  <>
                    <BoldBtn T={T} size="sm" variant="ghost" onClick={() => setConfirmDeleteId(null)} disabled={deletingId === e.id}>Cancelar</BoldBtn>
                    <BoldBtn T={T} size="sm" variant="outline" icon={<I.Trash size={12} stroke={2} />} onClick={() => handleDelete(e.id)} disabled={deletingId === e.id} style={{ color: T.danger, borderColor: `${T.danger}60` }}>
                      {deletingId === e.id ? '…' : 'Confirmar'}
                    </BoldBtn>
                  </>
                ) : (
                  <>
                    <BoldBtn T={T} size="sm" variant="light" icon={<I.ArrowRight size={12} stroke={2} />} onClick={() => navigate(`/provas/${e.id}/analytics`)}>Ver</BoldBtn>
                    {e.versions.length > 0 && (
                      <BoldBtn T={T} size="sm" variant="light" icon={<I.Check size={12} stroke={2} />} onClick={() => navigate(`/provas/${e.id}/corrigir`)}>Corrigir</BoldBtn>
                    )}
                    <BoldBtn T={T} size="sm" variant="light" icon={<I.Trash size={12} stroke={2} />} onClick={() => setConfirmDeleteId(e.id)} style={{ color: T.danger }}>Excluir</BoldBtn>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
