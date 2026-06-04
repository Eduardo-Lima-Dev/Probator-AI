import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../theme/ThemeContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { getMaterias } from '../api/materiasApi'
import type { Materia } from '../api/materiasApi'
import { createExam } from '../api/examsApi'
import type { DifficultyLevel } from '../api/examsApi'
import { BoldBtn } from '../components/ui/BoldBtn'
import { BoldField } from '../components/ui/BoldField'
import { Section } from '../components/ui/Section'
import { I } from '../components/ui/icons'

const DIFFICULTIES: { v: DifficultyLevel | ''; label: string; desc: string }[] = [
  { v: 'facil', label: 'Fácil', desc: 'Aplicação direta' },
  { v: 'medio', label: 'Médio', desc: 'Análise + síntese' },
  { v: 'dificil', label: 'Difícil', desc: 'Alta complexidade' },
]

const DIFF_COLOR = (T: ReturnType<typeof useTheme>['T'], v: string) =>
  v === 'facil' ? T.success : v === 'medio' ? T.warn : T.danger

export function NovaProvaPage() {
  const { T } = useTheme()
  const isMobile = useIsMobile()
  const navigate = useNavigate()

  const [titulo, setTitulo] = useState('')
  const [materiaId, setMateriaId] = useState('')
  const [description, setDescription] = useState('')
  const [versions, setVersions] = useState(2)
  const [questions, setQuestions] = useState(10)
  const [difficulty, setDifficulty] = useState<DifficultyLevel | ''>('')
  const [materias, setMaterias] = useState<Materia[]>([])
  const [loadingMaterias, setLoadingMaterias] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getMaterias()
      .then(setMaterias)
      .catch(() => {})
      .finally(() => setLoadingMaterias(false))
  }, [])

  async function handleGenerate(e: FormEvent) {
    e.preventDefault()
    if (!titulo.trim()) { setError('Informe o título da prova.'); return }
    if (!materiaId) { setError('Selecione uma matéria.'); return }
    setError('')
    setIsLoading(true)
    try {
      const exam = await createExam({
        title: titulo.trim(),
        materiaId,
        ...(description.trim() && { description: description.trim() }),
      })
      navigate('/provas/nova/processando', {
        state: {
          examId: exam.id,
          materiaId: exam.materiaId,
          versionCount: versions,
          questionCount: questions,
          ...(difficulty && { level: difficulty }),
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar a prova.')
      setIsLoading(false)
    }
  }

  const configPanel = (
    <div style={{ background: T.surface, borderRight: isMobile ? 'none' : `1px solid ${T.border}`, overflowY: 'auto', padding: '20px 22px 28px', width: isMobile ? '100%' : undefined }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
        <button type="button" onClick={() => navigate('/provas')} style={{ width: 34, height: 34, borderRadius: 10, background: T.surfaceAlt, border: `1px solid ${T.border}`, color: T.textDim, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <I.X size={14} />
        </button>
        <div>
          <div style={{ fontSize: 10.5, letterSpacing: 0.4, textTransform: 'uppercase', color: T.textMute, fontWeight: 600 }}>Etapa 1 · Parâmetros</div>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.4, color: T.text }}>Nova prova</div>
        </div>
      </div>

      <Section T={T} title="Matéria" hint="obrigatório">
        <select
          required
          value={materiaId}
          onChange={(e) => setMateriaId(e.target.value)}
          disabled={loadingMaterias}
          style={{ width: '100%', minHeight: 48, padding: '12px 14px', background: T.surface, borderRadius: 12, border: `1.5px solid ${T.border}`, color: materiaId ? T.text : T.textMute, fontSize: 14, fontFamily: 'inherit', fontWeight: 500, outline: 'none', cursor: loadingMaterias ? 'wait' : 'pointer', appearance: 'none' }}
        >
          <option value="" disabled>{loadingMaterias ? 'Carregando…' : 'Selecione uma matéria'}</option>
          {materias.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </Section>

      <Section T={T} title="Dificuldade" hint="opcional">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, padding: 4, background: T.surfaceAlt, borderRadius: 12 }}>
          {DIFFICULTIES.map((d) => {
            const active = difficulty === d.v
            const dc = DIFF_COLOR(T, d.v)
            return (
              <button key={d.v} type="button" onClick={() => setDifficulty(active ? '' : d.v)}
                style={{ padding: '8px 6px', borderRadius: 9, fontFamily: 'inherit', background: active ? T.surface : 'transparent', color: active ? T.text : T.textDim, border: 'none', cursor: 'pointer', boxShadow: active ? '0 2px 6px rgba(0,0,0,0.08)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 13, fontWeight: 600 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: dc }} />{d.label}
                </div>
                <div style={{ fontSize: 10, color: T.textMute, marginTop: 2 }}>{d.desc}</div>
              </button>
            )
          })}
        </div>
        {!difficulty && <div style={{ fontSize: 11, color: T.textMute, marginTop: 5 }}>Sem filtro: mistura todas as dificuldades.</div>}
      </Section>

      <Section T={T} title="Número de questões" hint="padrão: 10">
        <div style={{ padding: 14, background: T.surfaceAlt, borderRadius: 12, border: `1px solid ${T.border}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -2, lineHeight: 0.95, fontFamily: 'ui-monospace, monospace', background: T.aiGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{questions}</div>
              <div style={{ fontSize: 10.5, color: T.textMute, letterSpacing: 0.3, textTransform: 'uppercase', fontWeight: 600, marginTop: 4 }}>questões por versão</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="button" onClick={() => setQuestions(Math.max(1, questions - 1))} style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>−</button>
              <button type="button" onClick={() => setQuestions(Math.min(50, questions + 1))} style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>+</button>
            </div>
          </div>
          <input type="range" min="1" max="50" value={questions} onChange={(e) => setQuestions(+e.target.value)} style={{ width: '100%', marginTop: 12, accentColor: T.ai }} />
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {[5, 10, 15, 20].map((n) => (
              <button key={n} type="button" onClick={() => setQuestions(n)} style={{ flex: 1, height: 28, borderRadius: 8, fontFamily: 'inherit', background: questions === n ? T.aiBg : 'transparent', color: questions === n ? T.ai : T.textDim, border: `1px solid ${questions === n ? T.aiBorder : T.border}`, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{n}</button>
            ))}
          </div>
        </div>
      </Section>

      <Section T={T} title="Versões">
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button key={n} type="button" onClick={() => setVersions(n)} style={{ flex: 1, height: 38, borderRadius: 10, fontFamily: 'inherit', background: versions === n ? T.text : T.surfaceAlt, color: versions === n ? T.bg : T.textDim, border: 'none', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>{n}×</button>
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: T.textMute, marginTop: 6 }}>Cada versão tem questões e alternativas embaralhadas.</div>
      </Section>
    </div>
  )

  const rightPanel = (
    <div style={{ overflow: 'auto', padding: '24px 28px 32px', background: T.bg }}>
      <form id="nova-prova-form" onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ padding: 22, background: T.surface, borderRadius: 16, border: `1px solid ${T.border}` }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 14px', letterSpacing: -0.2, color: T.text }}>Dados da prova</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <BoldField T={T} label="TÍTULO" type="text" value={titulo} onChange={setTitulo} placeholder="Ex.: P1 — Derivadas e Continuidade" required />
            <label style={{ display: 'block' }}>
              <div style={{ fontSize: 12, color: T.textDim, marginBottom: 7, fontWeight: 600, letterSpacing: 0.2 }}>DESCRIÇÃO / TÓPICOS <span style={{ fontSize: 10.5, color: T.textMute, fontWeight: 400 }}>opcional</span></div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={'Derivadas\nRegra da cadeia\nLimites no infinito'}
                style={{ width: '100%', minHeight: 120, padding: '12px 14px', fontFamily: 'inherit', fontSize: 13.5, background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 12, color: T.text, resize: 'vertical', outline: 'none', lineHeight: 1.55, boxSizing: 'border-box' }}
              />
            </label>
          </div>
        </div>

        {/* Summary */}
        <div style={{ padding: 22, borderRadius: 16, background: T.hero, color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 0.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Resumo</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: '4px 0 6px', letterSpacing: -0.6 }}>{titulo || 'Nova prova'}</h3>
              <div style={{ display: 'flex', gap: 18, color: 'rgba(255,255,255,0.7)', fontSize: 12.5, flexWrap: 'wrap' }}>
                <span><strong style={{ color: '#fff' }}>{questions}</strong> questões</span>
                <span><strong style={{ color: '#fff' }}>{versions}</strong> versões</span>
                {difficulty && <span><strong style={{ color: '#fff' }}>{DIFFICULTIES.find((d) => d.v === difficulty)?.label}</strong></span>}
                {materiaId && <span>{materias.find((m) => m.id === materiaId)?.name}</span>}
              </div>
            </div>
            <BoldBtn T={T} size="lg" variant="ai" type="submit" form="nova-prova-form" disabled={isLoading || !titulo || !materiaId} icon={<I.Sparkles size={16} stroke={2.2} />} iconRight={<I.ArrowRight size={16} stroke={2.2} />}>
              {isLoading ? 'Criando…' : 'Gerar prova'}
            </BoldBtn>
          </div>
          {error && (
            <div style={{ marginTop: 12, fontSize: 13, color: '#fff', padding: '10px 14px', background: 'rgba(255,255,255,0.15)', borderRadius: 10 }}>
              {error}
            </div>
          )}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, background: 'radial-gradient(circle, rgba(124,58,237,0.40) 0%, transparent 70%)', pointerEvents: 'none' }} />
        </div>
      </form>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '100%', minHeight: '100vh', overflow: isMobile ? 'auto' : 'hidden' }}>
      <div style={{ width: isMobile ? '100%' : '360px', flexShrink: 0 }}>{configPanel}</div>
      <div style={{ flex: 1, overflow: isMobile ? 'visible' : 'auto' }}>{rightPanel}</div>
    </div>
  )
}
