import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../theme/ThemeContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { mockProvas } from '../mocks/provas'
import { BoldBtn } from '../components/ui/BoldBtn'
import { Badge } from '../components/ui/Badge'
import { I } from '../components/ui/icons'

const DIST = [2, 4, 7, 9, 11, 5, 0]
const DIST_LABELS = ['0–2', '2–4', '4–6', '6–7', '7–8', '8–9', '9–10']
const DIST_MAX = Math.max(...DIST)

const TOPICOS = ['Limites', 'Continuidade', 'Derivada · regra do produto', 'Limites no infinito', 'Derivada · cadeia', 'Reta tangente', 'Regra da cadeia', 'Derivada implícita', 'Continuidade por partes', 'Teorema do valor intermediário']

export function AnalyticsPage() {
  const { T } = useTheme()
  const isMobile = useIsMobile()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const prova = mockProvas.find((p) => p.id === id) ?? mockProvas.find((p) => p.status === 'Aplicada')

  if (!prova) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: T.textMute, fontSize: 14, background: T.bg }}>
        Prova não encontrada.
      </div>
    )
  }

  const kpis = [
    { l: 'Média', v: prova.avg ?? 0, suf: '/10', c: T.ai, big: true },
    { l: 'Alunos', v: prova.students ?? 0, suf: '', c: T.primaryAlt },
    { l: 'Aprovação', v: 76, suf: '%', c: T.success },
    { l: 'Desvio padrão', v: 1.8, suf: '', c: T.warn },
  ]

  return (
    <div style={{ padding: isMobile ? '16px' : '28px 32px 48px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, gap: 20, flexWrap: 'wrap' }}>
        <div>
          <button type="button" onClick={() => navigate('/provas')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'transparent', border: 'none', color: T.textDim, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, padding: 0, marginBottom: 8 }}>
            <I.ArrowLeft size={12} stroke={2} /> Voltar
          </button>
          <h1 style={{ fontSize: isMobile ? 22 : 30, fontWeight: 700, margin: 0, letterSpacing: -0.8, lineHeight: 1.05, color: T.text }}>{prova.title}</h1>
          <div style={{ color: T.textDim, fontSize: 13.5, marginTop: 6 }}>{prova.disciplina} · {prova.turma} · aplicada {prova.applied}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <BoldBtn T={T} variant="outline" icon={<I.Doc size={13} stroke={1.8} />} disabled>Exportar PDF</BoldBtn>
          <Badge T={T} />
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
        {kpis.map((k) => (
          <div key={k.l} style={{ padding: isMobile ? 16 : 22, borderRadius: 16, background: k.big ? T.hero : T.surface, color: k.big ? '#fff' : T.text, border: k.big ? '1px solid rgba(255,255,255,0.10)' : `1px solid ${T.border}`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: 11.5, color: k.big ? 'rgba(255,255,255,0.65)' : T.textDim, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>{k.l}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
              <span style={{ fontSize: isMobile ? 36 : 44, fontWeight: 700, letterSpacing: -1.6, lineHeight: 1, fontFamily: 'ui-monospace, monospace', background: k.big ? T.aiGrad : 'transparent', WebkitBackgroundClip: k.big ? 'text' : 'unset', WebkitTextFillColor: k.big ? 'transparent' : 'inherit' }}>{k.v}</span>
              <span style={{ fontSize: 14, color: k.big ? 'rgba(255,255,255,0.55)' : T.textMute }}>{k.suf}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: 18, marginBottom: 18 }}>
        {/* Distribution */}
        <div style={{ padding: 24, background: T.surface, borderRadius: 18, border: `1px solid ${T.border}` }}>
          <div style={{ marginBottom: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, letterSpacing: -0.2, color: T.text }}>Distribuição de notas</h3>
            <span style={{ fontSize: 12, color: T.textMute }}>{prova.students} alunos · buckets de 1 ponto</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 180 }}>
            {DIST.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 11.5, color: T.textDim, fontWeight: 600, fontFamily: 'ui-monospace, monospace' }}>{v}</div>
                <div style={{ width: '100%', height: `${(v / DIST_MAX) * 100}%`, background: i >= 3 ? T.aiGrad : T.surfaceAlt, borderRadius: '8px 8px 4px 4px', minHeight: 4 }} />
                <div style={{ fontSize: 10, color: T.textMute, fontFamily: 'ui-monospace, monospace' }}>{DIST_LABELS[i]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hardest */}
        <div style={{ padding: 24, background: T.surface, borderRadius: 18, border: `1px solid ${T.border}` }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, letterSpacing: -0.2, color: T.text }}>Questões mais difíceis</h3>
            <span style={{ fontSize: 12, color: T.textMute }}>por % de erro</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {(prova.hardest ?? []).map((h) => (
              <div key={h.n}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ padding: '2px 7px', borderRadius: 6, background: T.surfaceAlt, fontSize: 10.5, color: T.textDim, fontWeight: 700, fontFamily: 'ui-monospace, monospace' }}>Q{h.n}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: -0.2, color: T.text }}>{h.topic}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: T.danger, fontFamily: 'ui-monospace, monospace' }}>{h.err}%</span>
                </div>
                <div style={{ height: 6, background: T.surfaceAlt, borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: `${h.err}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #ef4444)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Per-question table */}
      <div style={{ background: T.surface, borderRadius: 18, border: `1px solid ${T.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, letterSpacing: -0.2, color: T.text }}>Acertos por questão</h3>
          <span style={{ fontSize: 12, color: T.textMute }}>{prova.questions} questões</span>
        </div>
        {!isMobile && (
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1.5fr 1fr 100px 100px', padding: '10px 22px', gap: 14, background: T.surfaceAlt, fontSize: 11, color: T.textMute, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>
            <div>Q</div><div>Tópico</div><div>Acerto</div><div>Tempo</div><div>Dificuldade</div>
          </div>
        )}
        {Array.from({ length: prova.questions }).map((_, i) => {
          const acerto = 92 - i * 4 + (i % 3) * 6
          const tempo = 90 + i * 18
          if (isMobile) {
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i === prova.questions - 1 ? 'none' : `1px solid ${T.border}` }}>
                <span style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', color: T.textDim, fontWeight: 600, minWidth: 30 }}>Q{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{TOPICOS[i % TOPICOS.length]}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <div style={{ flex: 1, height: 4, background: T.surfaceAlt, borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: `${acerto}%`, height: '100%', background: acerto > 70 ? T.success : acerto > 50 ? T.warn : T.danger }} />
                    </div>
                    <span style={{ fontSize: 11, color: T.textDim, fontFamily: 'ui-monospace, monospace' }}>{acerto}%</span>
                  </div>
                </div>
              </div>
            )
          }
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1.5fr 1fr 100px 100px', gap: 14, padding: '14px 22px', borderBottom: i === prova.questions - 1 ? 'none' : `1px solid ${T.border}`, alignItems: 'center', fontSize: 13 }}>
              <div style={{ fontFamily: 'ui-monospace, monospace', color: T.textDim, fontWeight: 600 }}>Q{i + 1}</div>
              <div style={{ fontWeight: 500, color: T.text }}>{TOPICOS[i % TOPICOS.length]}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: 6, background: T.surfaceAlt, borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: `${acerto}%`, height: '100%', background: acerto > 70 ? T.success : acerto > 50 ? T.warn : T.danger }} />
                </div>
                <span style={{ fontSize: 12, color: T.textDim, fontFamily: 'ui-monospace, monospace', minWidth: 32 }}>{acerto}%</span>
              </div>
              <div style={{ fontSize: 12.5, color: T.textDim, fontFamily: 'ui-monospace, monospace' }}>{Math.floor(tempo / 60)}m {tempo % 60}s</div>
              <div>
                <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: acerto > 70 ? 'rgba(22,163,74,0.10)' : acerto > 50 ? 'rgba(217,119,6,0.10)' : 'rgba(220,38,38,0.10)', color: acerto > 70 ? T.success : acerto > 50 ? T.warn : T.danger }}>
                  {acerto > 70 ? 'Fácil' : acerto > 50 ? 'Médio' : 'Difícil'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
