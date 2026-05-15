import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../theme/ThemeContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { getMaterias } from '../api/materiasApi'
import type { Materia } from '../api/materiasApi'
import { BoldBtn } from '../components/ui/BoldBtn'
import { BoldChip } from '../components/ui/BoldChip'
import { BoldField } from '../components/ui/BoldField'
import { Section } from '../components/ui/Section'
import { Badge } from '../components/ui/Badge'
import { I } from '../components/ui/icons'

type Draft = {
  disciplina: string
  turma: string
  titulo: string
  topicos: string
  versions: number
  questions: number
  types: { mcq: boolean; vf: boolean; diss: boolean }
  difficulty: string
}

const DEFAULT_DRAFT: Draft = {
  disciplina: 'Cálculo I',
  turma: 'MAT001-A',
  titulo: 'P2 — Integrais e Aplicações',
  topicos: 'Integral definida\nTeorema fundamental do cálculo\nÁreas entre curvas\nVolumes por seções',
  versions: 4,
  questions: 10,
  types: { mcq: true, vf: true, diss: false },
  difficulty: 'Médio',
}

const DIFFICULTIES = [
  { v: 'Fácil', desc: 'Aplicação direta' },
  { v: 'Médio', desc: 'Aplicação + análise' },
  { v: 'Difícil', desc: 'Síntese e prova' },
]

const QUESTION_TYPES = [
  { k: 'mcq' as const, l: 'Múltipla escolha', s: '4–5 alternativas' },
  { k: 'vf' as const, l: 'Verdadeiro / Falso', s: 'Com justificativa' },
  { k: 'diss' as const, l: 'Dissertativa', s: 'Resposta aberta' },
]

export function NovaProvaPage() {
  const { T } = useTheme()
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const [draft, setDraft] = useState<Draft>(DEFAULT_DRAFT)
  const [materias, setMaterias] = useState<Materia[]>([])
  const [material, setMaterial] = useState<string | null>(null)

  const setF = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }))

  useEffect(() => {
    getMaterias().then(setMaterias).catch(() => {})
  }, [])

  const disciplinas = materias.length > 0
    ? materias.map((m) => m.name).slice(0, 4)
    : ['Cálculo I', 'Cálculo II', 'Álgebra Linear', 'Química Geral']

  const configPanel = (
    <div
      style={{
        background: T.surface,
        borderRight: isMobile ? 'none' : `1px solid ${T.border}`,
        overflowY: 'auto',
        padding: '20px 22px 28px',
        width: isMobile ? '100%' : undefined,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
        <button
          type="button"
          onClick={() => navigate('/provas')}
          style={{ width: 34, height: 34, borderRadius: 10, background: T.surfaceAlt, border: `1px solid ${T.border}`, color: T.textDim, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <I.X size={14} />
        </button>
        <div>
          <div style={{ fontSize: 10.5, letterSpacing: 0.4, textTransform: 'uppercase', color: T.textMute, fontWeight: 600 }}>Etapa 1 · Parâmetros</div>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.4, color: T.text }}>Nova prova</div>
        </div>
      </div>

      <Section T={T} title="Disciplina">
        <BoldField T={T} value={draft.disciplina} onChange={(v) => setF('disciplina', v)} placeholder="Cálculo I" />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
          {disciplinas.map((d) => (
            <BoldChip key={d} T={T} active={draft.disciplina === d} onClick={() => setF('disciplina', d)} size="sm">{d}</BoldChip>
          ))}
        </div>
      </Section>

      <Section T={T} title="Turma">
        <BoldField T={T} value={draft.turma} onChange={(v) => setF('turma', v)} placeholder="MAT001-A" />
      </Section>

      <Section T={T} title="Título da prova">
        <BoldField T={T} value={draft.titulo} onChange={(v) => setF('titulo', v)} placeholder="P2 — Integrais" />
      </Section>

      <Section T={T} title="Dificuldade">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, padding: 4, background: T.surfaceAlt, borderRadius: 12 }}>
          {DIFFICULTIES.map((d) => {
            const active = draft.difficulty === d.v
            const dc = d.v === 'Fácil' ? T.success : d.v === 'Médio' ? T.warn : T.danger
            return (
              <button key={d.v} type="button" onClick={() => setF('difficulty', d.v)}
                style={{ padding: '8px 6px', borderRadius: 9, fontFamily: 'inherit', background: active ? T.surface : 'transparent', color: active ? T.text : T.textDim, border: 'none', cursor: 'pointer', boxShadow: active ? '0 2px 6px rgba(0,0,0,0.08)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: dc }} />{d.v}
                </div>
                <div style={{ fontSize: 10, color: T.textMute, marginTop: 2 }}>{d.desc}</div>
              </button>
            )
          })}
        </div>
      </Section>

      <Section T={T} title="Número de questões" hint="padrão: 10">
        <div style={{ padding: 14, background: T.surfaceAlt, borderRadius: 12, border: `1px solid ${T.border}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -2, lineHeight: 0.95, fontFamily: 'ui-monospace, monospace', background: T.aiGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{draft.questions}</div>
              <div style={{ fontSize: 10.5, color: T.textMute, letterSpacing: 0.3, textTransform: 'uppercase', fontWeight: 600, marginTop: 4 }}>questões</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="button" onClick={() => setF('questions', Math.max(4, draft.questions - 1))} style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>−</button>
              <button type="button" onClick={() => setF('questions', Math.min(30, draft.questions + 1))} style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>+</button>
            </div>
          </div>
          <input type="range" min="4" max="30" value={draft.questions} onChange={(e) => setF('questions', +e.target.value)} style={{ width: '100%', marginTop: 12, accentColor: T.ai }} />
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {[5, 10, 15, 20].map((n) => (
              <button key={n} type="button" onClick={() => setF('questions', n)} style={{ flex: 1, height: 28, borderRadius: 8, fontFamily: 'inherit', background: draft.questions === n ? T.aiBg : 'transparent', color: draft.questions === n ? T.ai : T.textDim, border: `1px solid ${draft.questions === n ? T.aiBorder : T.border}`, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{n}</button>
            ))}
          </div>
        </div>
      </Section>

      <Section T={T} title="Versões">
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button key={n} type="button" onClick={() => setF('versions', n)} style={{ flex: 1, height: 38, borderRadius: 10, fontFamily: 'inherit', background: draft.versions === n ? T.text : T.surfaceAlt, color: draft.versions === n ? T.bg : T.textDim, border: 'none', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>{n}×</button>
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: T.textMute, marginTop: 6 }}>Cada versão tem questões e alternativas embaralhadas.</div>
      </Section>

      <Section T={T} title="Tipos de questão">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {QUESTION_TYPES.map((t) => {
            const active = draft.types[t.k]
            return (
              <button key={t.k} type="button" onClick={() => setF('types', { ...draft.types, [t.k]: !active })}
                style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', background: active ? T.aiBg : T.surfaceAlt, border: `1.5px solid ${active ? T.aiBorder : 'transparent'}`, borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                <span style={{ width: 18, height: 18, borderRadius: 5, background: active ? T.ai : T.surface, border: active ? 'none' : `1.5px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                  {active && <I.Check size={11} stroke={3} />}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: active ? T.ai : T.text }}>{t.l}</div>
                  <div style={{ fontSize: 11.5, color: T.textMute }}>{t.s}</div>
                </div>
              </button>
            )
          })}
        </div>
      </Section>
    </div>
  )

  const rightPanel = (
    <div style={{ overflow: 'auto', padding: '24px 28px 32px', background: T.bg }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
        {/* Topics */}
        <div style={{ padding: 22, background: T.surface, borderRadius: 16, border: `1px solid ${T.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, letterSpacing: -0.2, color: T.text }}>Tópicos</h3>
            <span style={{ fontSize: 11, color: T.textMute }}>um por linha</span>
          </div>
          <textarea
            value={draft.topicos}
            onChange={(e) => setF('topicos', e.target.value)}
            style={{ width: '100%', minHeight: 200, padding: 14, fontFamily: 'inherit', fontSize: 13.5, background: T.surfaceAlt, border: `1.5px solid ${T.border}`, borderRadius: 12, color: T.text, resize: 'vertical', outline: 'none', lineHeight: 1.55 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, color: T.textDim, fontSize: 12 }}>
            <I.Sparkles size={11} stroke={2.2} /> A IA sugere tópicos a partir do material anexado.
          </div>
        </div>

        {/* Material */}
        <div style={{ padding: 22, background: T.surface, borderRadius: 16, border: `1px solid ${T.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, letterSpacing: -0.2, color: T.text }}>Material de referência</h3>
            <span style={{ fontSize: 11, color: T.textMute }}>opcional</span>
          </div>
          {!material ? (
            <div style={{ width: '100%', padding: '24px 18px', border: `2px dashed ${T.border}`, borderRadius: 12, background: T.surfaceAlt, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: T.textDim }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: T.aiBg, color: T.ai, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <I.Upload size={20} stroke={2.2} />
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: T.text }}>Arraste um PDF ou clique</div>
              <div style={{ fontSize: 11.5 }}>PDF, slides, .docx · até 50 MB</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <BoldBtn T={T} variant="light" size="sm" disabled icon={<I.Upload size={12} />}>Selecionar arquivo</BoldBtn>
                <Badge T={T} />
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: T.surfaceAlt, borderRadius: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: T.aiBg, color: T.ai, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <I.Doc size={16} stroke={1.8} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: T.text }}>{material}</div>
              </div>
              <button type="button" onClick={() => setMaterial(null)} style={{ background: 'transparent', border: 'none', color: T.textMute, cursor: 'pointer' }}>
                <I.X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Summary + generate */}
      <div style={{ marginTop: 22, padding: 22, borderRadius: 16, background: T.hero, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 0.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Resumo</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 6px', letterSpacing: -0.6 }}>{draft.titulo || 'Nova prova'}</h3>
            <div style={{ display: 'flex', gap: 18, color: 'rgba(255,255,255,0.7)', fontSize: 12.5, flexWrap: 'wrap' }}>
              <span><strong style={{ color: '#fff' }}>{draft.questions}</strong> questões</span>
              <span><strong style={{ color: '#fff' }}>{draft.versions}</strong> versões</span>
              <span><strong style={{ color: '#fff' }}>{draft.difficulty}</strong></span>
              <span>{draft.disciplina} · {draft.turma}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BoldBtn T={T} size="lg" variant="ai" onClick={() => navigate('/provas/nova/processando')} icon={<I.Sparkles size={16} stroke={2.2} />} iconRight={<I.ArrowRight size={16} stroke={2.2} />}>
              Gerar prova
            </BoldBtn>
          </div>
        </div>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, background: 'radial-gradient(circle, rgba(124,58,237,0.40) 0%, transparent 70%)', pointerEvents: 'none' }} />
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '100%', minHeight: '100vh', overflow: isMobile ? 'auto' : 'hidden' }}>
      <div style={{ width: isMobile ? '100%' : '380px', flexShrink: 0 }}>{configPanel}</div>
      <div style={{ flex: 1, overflow: isMobile ? 'visible' : 'auto' }}>{rightPanel}</div>
    </div>
  )
}
