import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../theme/ThemeContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { mockProvas, statusOptions } from '../mocks/provas'
import type { Prova, ProvaStatus } from '../mocks/provas'
import { BoldChip } from '../components/ui/BoldChip'
import { StatusPill } from '../components/ui/StatusPill'
import { I } from '../components/ui/icons'

function FeaturedCard({ prova, onOpen }: { prova: Prova; onOpen: () => void }) {
  const { T } = useTheme()
  return (
    <div
      onClick={onOpen}
      style={{
        padding: 24,
        borderRadius: 18,
        background: T.hero,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)' }}>
        <span style={{ width: 7, height: 7, borderRadius: 99, background: '#22c55e' }} /> Última aplicada · {prova.applied}
      </div>
      <h3 style={{ fontSize: 26, fontWeight: 700, margin: '12px 0 4px', letterSpacing: -0.8, lineHeight: 1.1 }}>{prova.title}</h3>
      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{prova.disciplina} · {prova.turma}</div>

      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { l: 'Média', v: prova.avg, suf: '/10' },
          { l: 'Alunos', v: prova.students, suf: '' },
          { l: 'Versões', v: prova.versions, suf: '' },
        ].map((k) => (
          <div key={k.l} style={{ padding: 14, background: 'rgba(255,255,255,0.06)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)' }}>
            <div style={{ fontSize: 10.5, letterSpacing: 0.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>{k.l}</div>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4, letterSpacing: -0.8, fontFamily: 'ui-monospace, monospace' }}>
              {k.v}<span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginLeft: 2 }}>{k.suf}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18, fontSize: 12.5, color: 'rgba(255,255,255,0.7)' }}>
        Ver análise completa por questão <I.ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
      </div>

      <div style={{ position: 'absolute', top: -40, right: -40, width: 220, height: 220, background: 'radial-gradient(circle, rgba(124,58,237,0.40) 0%, transparent 70%)', pointerEvents: 'none' }} />
    </div>
  )
}

function ActivityPanel() {
  const { T } = useTheme()
  const items = [
    { t: 'P1 — Derivadas aplicada', s: '38 alunos · média 7.4', when: 'há 2 dias', c: T.success },
    { t: 'Bimestral — Brasil República gerada', s: 'Aguardando aplicação', when: 'há 3 dias', c: T.primaryAlt },
    { t: 'P1 — Algoritmos aplicada', s: '42 alunos · média 6.8', when: 'há 12 dias', c: T.success },
  ]
  return (
    <div style={{ padding: 22, background: T.surface, borderRadius: 18, border: `1px solid ${T.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, letterSpacing: -0.2, color: T.text }}>Atividade recente</h3>
        <a href="#" style={{ fontSize: 12, color: T.textDim, textDecoration: 'none', fontWeight: 500 }}>Ver tudo</a>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: it.c, marginTop: 6, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: -0.2, color: T.text }}>{it.t}</div>
              <div style={{ fontSize: 11.5, color: T.textMute }}>{it.s}</div>
            </div>
            <div style={{ fontSize: 11, color: T.textMute, whiteSpace: 'nowrap' }}>{it.when}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProvasPage() {
  const { T } = useTheme()
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<'Todos' | ProvaStatus>('Todos')

  const aplicada = mockProvas.find((p) => p.status === 'Aplicada')

  const counts = {
    aplicada: mockProvas.filter((p) => p.status === 'Aplicada').length,
    gerada: mockProvas.filter((p) => p.status === 'Gerada').length,
    rascunho: mockProvas.filter((p) => p.status === 'Rascunho').length,
  }
  const totalQuestoes = mockProvas.reduce((acc, p) => acc + p.questions, 0)

  const filtered = useMemo(
    () => mockProvas.filter((p) => statusFilter === 'Todos' || p.status === statusFilter),
    [statusFilter],
  )

  const kpis = [
    { n: counts.aplicada, l: 'Aplicadas', s: 'este semestre', c: T.success },
    { n: counts.gerada, l: 'Geradas', s: 'aguardando aplicação', c: T.primaryAlt },
    { n: counts.rascunho, l: 'Rascunhos', s: 'em construção', c: T.warn },
    { n: totalQuestoes, l: 'Questões', s: 'no banco', c: T.ai },
  ]

  if (isMobile) {
    return (
      <div style={{ padding: '20px 16px 32px' }}>
        {/* KPIs 2-col */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {kpis.map((k) => (
            <div key={k.l} style={{ padding: 16, background: T.surface, borderRadius: 14, border: `1px solid ${T.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: T.textDim, fontWeight: 600, letterSpacing: 0.2, textTransform: 'uppercase' }}>
                <span style={{ width: 7, height: 7, borderRadius: 99, background: k.c }} /> {k.l}
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: -1.2, lineHeight: 1, marginTop: 8, fontFamily: 'ui-monospace, monospace' }}>{k.n}</div>
              <div style={{ fontSize: 11, color: T.textMute, marginTop: 2 }}>{k.s}</div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 16, scrollbarWidth: 'none' }}>
          {statusOptions.map((s) => (
            <BoldChip key={s} T={T} active={statusFilter === s} onClick={() => setStatusFilter(s)} size="sm"
              accent={s === 'Aplicada' ? T.success : s === 'Gerada' ? T.primaryAlt : s === 'Rascunho' ? T.warn : undefined}>
              {s}
            </BoldChip>
          ))}
        </div>

        {/* Lista mobile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => p.status === 'Aplicada' ? navigate(`/provas/${p.id}/analytics`) : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 16px',
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                cursor: p.status === 'Aplicada' ? 'pointer' : 'default',
                fontFamily: 'inherit',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: -0.2, color: T.text, marginBottom: 4 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: T.textMute }}>{p.disciplina} · criada {p.created}</div>
                <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <StatusPill T={T} status={p.status} />
                  <span style={{ fontSize: 11.5, color: T.textDim, fontFamily: 'ui-monospace, monospace' }}>{p.versions}× · {p.questions} questões</span>
                </div>
              </div>
              {p.status === 'Aplicada' && <I.ArrowRight size={14} stroke={1.8} style={{ color: T.textMute, flexShrink: 0 }} />}
            </button>
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
              <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1.4, lineHeight: 1, fontFamily: 'ui-monospace, monospace' }}>{k.n}</span>
              <span style={{ fontSize: 12, color: T.textMute }}>{k.s}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Featured + activity */}
      {aplicada && (
        <div style={{ display: 'grid', gridTemplateColumns: '2.1fr 1fr', gap: 18, marginBottom: 28 }}>
          <FeaturedCard prova={aplicada} onOpen={() => navigate(`/provas/${aplicada.id}/analytics`)} />
          <ActivityPanel />
        </div>
      )}

      {/* Filter row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, letterSpacing: -0.4, color: T.text }}>Todas as provas</h2>
          <span style={{ fontSize: 12.5, color: T.textMute }}>{filtered.length} resultados</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {statusOptions.map((s) => (
            <BoldChip key={s} T={T} active={statusFilter === s} onClick={() => setStatusFilter(s)} size="sm"
              accent={s === 'Aplicada' ? T.success : s === 'Gerada' ? T.primaryAlt : s === 'Rascunho' ? T.warn : undefined}>
              {s}
            </BoldChip>
          ))}
          <BoldChip T={T} size="sm"><I.Filter size={11} /> Turma</BoldChip>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr 1fr 0.7fr 0.7fr 0.5fr', padding: '12px 22px', gap: 14, background: T.surfaceAlt, borderBottom: `1px solid ${T.border}`, fontSize: 11, color: T.textMute, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>
          <div>Título</div><div>Turma</div><div>Status</div><div>Versões</div><div>Questões</div><div />
        </div>
        {filtered.map((p, idx) => (
          <button
            key={p.id}
            type="button"
            onClick={() => p.status === 'Aplicada' ? navigate(`/provas/${p.id}/analytics`) : undefined}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1.1fr 1fr 0.7fr 0.7fr 0.5fr',
              padding: '16px 22px',
              gap: 14,
              alignItems: 'center',
              background: 'transparent',
              border: 'none',
              cursor: p.status === 'Aplicada' ? 'pointer' : 'default',
              fontFamily: 'inherit',
              fontSize: 13.5,
              color: T.text,
              textAlign: 'left',
              width: '100%',
              borderBottom: idx === filtered.length - 1 ? 'none' : `1px solid ${T.border}`,
              transition: 'background .1s',
            }}
            onMouseEnter={(e) => { if (p.status === 'Aplicada') e.currentTarget.style.background = T.surfaceAlt }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            <div>
              <div style={{ fontWeight: 600, letterSpacing: -0.2 }}>{p.title}</div>
              <div style={{ fontSize: 11.5, color: T.textMute, marginTop: 2 }}>{p.disciplina} · criada {p.created}</div>
            </div>
            <div style={{ fontSize: 12.5, color: T.textDim, fontFamily: 'ui-monospace, monospace' }}>{p.turma.split(' · ')[0]}</div>
            <div><StatusPill T={T} status={p.status} /></div>
            <div style={{ fontSize: 13, fontFamily: 'ui-monospace, monospace' }}>{p.versions}×</div>
            <div style={{ fontSize: 13, fontFamily: 'ui-monospace, monospace' }}>{p.questions}</div>
            <div style={{ textAlign: 'right', color: T.textMute }}>
              {p.status === 'Aplicada' && <I.ArrowRight size={14} stroke={1.8} />}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
