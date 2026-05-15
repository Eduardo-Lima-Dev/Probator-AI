import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../theme/ThemeContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { sampleQuestoes } from '../mocks/questoes'
import type { Questao } from '../mocks/questoes'
import { BoldBtn } from '../components/ui/BoldBtn'
import { Badge } from '../components/ui/Badge'
import { I } from '../components/ui/icons'

const VERSIONS = ['A', 'B', 'C', 'D']
const TOTAL_QUESTIONS = 10

export function RevisarProvaPage() {
  const { T } = useTheme()
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const [activeIdx, setActiveIdx] = useState(0)
  const [version, setVersion] = useState('A')
  const [mobileTab, setMobileTab] = useState<'list' | 'questao' | 'acoes'>('questao')

  const questions = useMemo<Questao[]>(
    () => Array.from({ length: TOTAL_QUESTIONS }, (_, i) => ({ ...sampleQuestoes[i % sampleQuestoes.length], n: i + 1 })),
    [],
  )

  const q = questions[activeIdx]

  const questionList = (
    <div style={{ background: T.surface, borderRight: `1px solid ${T.border}`, overflow: 'auto', display: 'flex', flexDirection: 'column', height: isMobile ? undefined : '100%' }}>
      <div style={{ padding: '18px 18px 12px', borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
        <div style={{ fontSize: 10.5, letterSpacing: 0.4, textTransform: 'uppercase', color: T.textMute, fontWeight: 700 }}>Etapa 2 · Revisar</div>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3, color: T.text }}>P2 — Integrais</div>
        <div style={{ fontSize: 12, color: T.textDim, marginTop: 4 }}>{questions.length} questões · 4 versões</div>
      </div>
      <div style={{ padding: '8px 10px', flex: 1, overflowY: 'auto' }}>
        {questions.map((qi, i) => (
          <button key={i} type="button" onClick={() => { setActiveIdx(i); if (isMobile) setMobileTab('questao') }}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', width: '100%', borderRadius: 10, fontFamily: 'inherit', background: i === activeIdx ? T.aiBg : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', marginBottom: 2 }}>
            <span style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, background: i === activeIdx ? T.ai : T.surfaceAlt, color: i === activeIdx ? '#fff' : T.textDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, fontFamily: 'ui-monospace, monospace' }}>{qi.n}</span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: i === activeIdx ? 600 : 500, color: i === activeIdx ? T.ai : T.text, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{qi.enunciado}</div>
              {qi.topic && <div style={{ fontSize: 10.5, color: T.textMute, marginTop: 3 }}>{qi.topic}</div>}
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  const questionViewer = (
    <div style={{ overflow: 'auto', padding: isMobile ? '16px' : '24px 38px 32px', background: T.bg, flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <button type="button" onClick={() => navigate('/provas/nova')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: T.textDim, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 500 }}>
          <I.ArrowLeft size={14} stroke={2} /> Voltar
        </button>
        <div style={{ display: 'flex', gap: 6, padding: 3, background: T.surfaceAlt, borderRadius: 10 }}>
          {VERSIONS.slice(0, 4).map((v) => (
            <button key={v} type="button" onClick={() => setVersion(v)} style={{ width: 36, height: 30, borderRadius: 7, fontFamily: 'inherit', background: version === v ? T.surface : 'transparent', color: version === v ? T.text : T.textDim, border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, boxShadow: version === v ? '0 2px 6px rgba(0,0,0,0.08)' : 'none' }}>v{v}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: 32, background: T.surface, borderRadius: 18, border: `1px solid ${T.border}`, maxWidth: 720 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ padding: '4px 10px', borderRadius: 6, background: T.aiBg, color: T.ai, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.3, fontFamily: 'ui-monospace, monospace' }}>QUESTÃO {q.n}</span>
          {q.topic && <span style={{ fontSize: 11.5, color: T.textMute }}>{q.topic}</span>}
          <button type="button" style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, background: 'transparent', border: `1px solid ${T.border}`, padding: '4px 10px', borderRadius: 7, color: T.textDim, fontSize: 11.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            <I.Sparkles size={11} stroke={2.4} /> Regerar
          </button>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 600, margin: 0, lineHeight: 1.4, letterSpacing: -0.3, color: T.text }}>{q.enunciado}</h2>

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {q.alts.map((a, i) => (
            <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: i === q.correct ? 'rgba(22,163,74,0.08)' : T.surfaceAlt, border: `1.5px solid ${i === q.correct ? T.success : 'transparent'}`, borderRadius: 12, cursor: 'pointer' }}>
              <span style={{ width: 22, height: 22, borderRadius: 99, background: i === q.correct ? T.success : T.surface, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: i === q.correct ? 'none' : `1.5px solid ${T.border}` }}>
                {i === q.correct && <I.Check size={12} stroke={3} />}
              </span>
              <span style={{ fontSize: 14.5, color: T.text, fontWeight: i === q.correct ? 600 : 500 }}>{a}</span>
            </label>
          ))}
        </div>

        <div style={{ marginTop: 20, padding: 14, background: T.aiBg, border: `1px solid ${T.aiBorder}`, borderRadius: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: T.ai, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase' }}>
            <I.Sparkles size={11} stroke={2.4} /> Justificativa do gabarito
          </div>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: T.textDim, lineHeight: 1.55 }}>
            A alternativa correta foi verificada pela IA com base nos tópicos e no material de referência fornecido.
          </p>
        </div>
      </div>
    </div>
  )

  const actionsPanel = (
    <div style={{ background: T.surface, borderLeft: isMobile ? 'none' : `1px solid ${T.border}`, padding: '22px 20px', overflow: 'auto' }}>
      <div style={{ fontSize: 11, color: T.textMute, letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>Ações</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <BoldBtn T={T} variant="outline" icon={<I.Sparkles size={13} stroke={2.4} />} style={{ width: '100%', justifyContent: 'flex-start' }}>Reescrever enunciado</BoldBtn>
        <BoldBtn T={T} variant="outline" icon={<I.Refresh size={13} stroke={2} />} style={{ width: '100%', justifyContent: 'flex-start' }}>Trocar alternativas</BoldBtn>
        <BoldBtn T={T} variant="outline" icon={<I.Plus size={13} stroke={2.2} />} style={{ width: '100%', justifyContent: 'flex-start' }}>Adicionar questão</BoldBtn>
        <BoldBtn T={T} variant="outline" icon={<I.Trash size={13} stroke={2} />} style={{ width: '100%', justifyContent: 'flex-start' }}>Remover questão</BoldBtn>
      </div>

      <div style={{ height: 1, background: T.border, margin: '20px 0' }} />

      <div style={{ fontSize: 11, color: T.textMute, letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>Exportar</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BoldBtn T={T} variant="outline" icon={<I.Doc size={13} stroke={1.8} />} disabled style={{ flex: 1, justifyContent: 'flex-start' }}>Baixar PDFs</BoldBtn>
          <Badge T={T} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BoldBtn T={T} variant="outline" icon={<I.Doc size={13} stroke={1.8} />} disabled style={{ flex: 1, justifyContent: 'flex-start' }}>Baixar gabarito</BoldBtn>
          <Badge T={T} />
        </div>
      </div>

      <div style={{ marginTop: 24, padding: 14, background: T.aiBg, borderRadius: 12, border: `1px solid ${T.aiBorder}` }}>
        <div style={{ fontSize: 12, color: T.ai, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase' }}>Verificação</div>
        <div style={{ marginTop: 8, fontSize: 13, color: T.text, fontWeight: 600 }}>Gabarito 100% consistente</div>
        <div style={{ marginTop: 4, fontSize: 11.5, color: T.textDim, lineHeight: 1.45 }}>Todas as {questions.length} questões têm exatamente uma alternativa correta.</div>
      </div>

      <BoldBtn T={T} size="lg" variant="ai" onClick={() => navigate('/provas')} icon={<I.Check size={14} stroke={2.4} />} style={{ width: '100%', marginTop: 18 }}>
        Salvar prova
      </BoldBtn>
    </div>
  )

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: T.bg }}>
        {/* Mobile tab switcher */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}`, background: T.surface, flexShrink: 0 }}>
          {([['list', 'Lista'], ['questao', 'Questão'], ['acoes', 'Ações']] as const).map(([tab, label]) => (
            <button key={tab} type="button" onClick={() => setMobileTab(tab)} style={{ flex: 1, padding: '12px 4px', border: 'none', background: 'transparent', color: mobileTab === tab ? T.ai : T.textDim, fontFamily: 'inherit', fontSize: 12.5, fontWeight: mobileTab === tab ? 600 : 500, borderBottom: `2px solid ${mobileTab === tab ? T.ai : 'transparent'}`, cursor: 'pointer' }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          {mobileTab === 'list' && questionList}
          {mobileTab === 'questao' && questionViewer}
          {mobileTab === 'acoes' && actionsPanel}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 260px', height: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      {questionList}
      {questionViewer}
      {actionsPanel}
    </div>
  )
}
