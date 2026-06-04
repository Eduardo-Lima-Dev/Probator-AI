import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../theme/ThemeContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { getExamVersion, getAnswerKey, replaceQuestion } from '../api/examsApi'
import type { ExamVersion, AnswerKey, AlternativeLabel } from '../api/examsApi'
import { getQuestions } from '../api/questionsApi'
import type { Question } from '../api/questionsApi'
import { BoldBtn } from '../components/ui/BoldBtn'
import { Badge } from '../components/ui/Badge'
import { I } from '../components/ui/icons'

type LocationState = {
  examId: string
  materiaId: string
  versions: Array<{ id: string; versionLabel: string }>
}

const LABEL_INDEX: Record<AlternativeLabel, number> = { A: 0, B: 1, C: 2, D: 3, E: 4 }

function getCorrectIdx(questionPosition: number, answerKey: AnswerKey[]): number {
  const ak = answerKey.find((k) => k.questionPosition === questionPosition)
  return ak ? (LABEL_INDEX[ak.shuffledLabel] ?? -1) : -1
}

export function RevisarProvaPage() {
  const { T } = useTheme()
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | null

  const [activeVersionId, setActiveVersionId] = useState(state?.versions[0]?.id ?? '')
  const [versionData, setVersionData] = useState<ExamVersion | null>(null)
  const [answerKey, setAnswerKey] = useState<AnswerKey[]>([])
  const [loadingVersion, setLoadingVersion] = useState(true)
  const [versionError, setVersionError] = useState('')
  const [activeQIdx, setActiveQIdx] = useState(0)
  const [mobileTab, setMobileTab] = useState<'list' | 'questao' | 'acoes'>('questao')

  // Question bank picker state
  const [showReplace, setShowReplace] = useState(false)
  const [bankQuestions, setBankQuestions] = useState<Question[]>([])
  const [loadingBank, setLoadingBank] = useState(false)
  const [selectedBankQ, setSelectedBankQ] = useState<string | null>(null)
  const [replacing, setReplacing] = useState(false)
  const [replaceError, setReplaceError] = useState('')

  // Answer key modal
  const [showAnswerKey, setShowAnswerKey] = useState(false)

  useEffect(() => {
    if (!state) {
      navigate('/provas/nova', { replace: true })
    }
  }, [state, navigate])

  useEffect(() => {
    if (!activeVersionId) {
      setLoadingVersion(false)
      setVersionError('Nenhuma versão disponível para revisão.')
      return
    }
    setLoadingVersion(true)
    setVersionError('')
    setActiveQIdx(0)
    Promise.all([getExamVersion(activeVersionId), getAnswerKey(activeVersionId)])
      .then(([v, ak]) => { setVersionData(v); setAnswerKey(ak) })
      .catch(() => setVersionError('Não foi possível carregar a versão.'))
      .finally(() => setLoadingVersion(false))
  }, [activeVersionId])

  function openReplace() {
    setShowReplace(true)
    setSelectedBankQ(null)
    setReplaceError('')
    if (!state?.materiaId) return
    setLoadingBank(true)
    getQuestions({ materiaId: state.materiaId, limit: 50 })
      .then(setBankQuestions)
      .catch(() => setBankQuestions([]))
      .finally(() => setLoadingBank(false))
  }

  async function handleReplace() {
    if (!selectedBankQ || !versionData) return
    const q = versionData.questions[activeQIdx]
    if (!q) return
    setReplacing(true)
    setReplaceError('')
    try {
      await replaceQuestion(activeVersionId, q.questionPosition, selectedBankQ)
      setShowReplace(false)
      // Reload version
      const [v, ak] = await Promise.all([getExamVersion(activeVersionId), getAnswerKey(activeVersionId)])
      setVersionData(v)
      setAnswerKey(ak)
    } catch (err) {
      setReplaceError(err instanceof Error ? err.message : 'Erro ao substituir questão.')
    } finally {
      setReplacing(false)
    }
  }

  if (!state) return null

  const { versions } = state
  const q = versionData?.questions[activeQIdx] ?? null
  const correctIdx = q ? getCorrectIdx(q.questionPosition, answerKey) : -1

  const questionList = (
    <div style={{ background: T.surface, borderRight: `1px solid ${T.border}`, overflow: 'auto', display: 'flex', flexDirection: 'column', height: isMobile ? undefined : '100%' }}>
      <div style={{ padding: '18px 18px 12px', borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
        <div style={{ fontSize: 10.5, letterSpacing: 0.4, textTransform: 'uppercase', color: T.textMute, fontWeight: 700 }}>Etapa 2 · Revisar</div>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.3, color: T.text, marginTop: 2 }}>
          {versionData ? `Versão ${versionData.versionLabel}` : 'Carregando…'}
        </div>
        <div style={{ fontSize: 12, color: T.textDim, marginTop: 4 }}>
          {loadingVersion ? '…' : `${versionData?.questions.length ?? 0} questões`}
        </div>
      </div>
      <div style={{ padding: '8px 10px', flex: 1, overflowY: 'auto' }}>
        {loadingVersion && <div style={{ padding: 20, textAlign: 'center', color: T.textMute, fontSize: 13 }}>Carregando questões…</div>}
        {!loadingVersion && versionData?.questions.map((qi, i) => (
          <button key={qi.id} type="button" onClick={() => { setActiveQIdx(i); if (isMobile) setMobileTab('questao') }}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', width: '100%', borderRadius: 10, fontFamily: 'inherit', background: i === activeQIdx ? T.aiBg : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', marginBottom: 2 }}>
            <span style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, background: i === activeQIdx ? T.ai : T.surfaceAlt, color: i === activeQIdx ? '#fff' : T.textDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, fontFamily: 'ui-monospace, monospace' }}>
              {qi.questionPosition}
            </span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: i === activeQIdx ? 600 : 500, color: i === activeQIdx ? T.ai : T.text, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {qi.question.statement}
              </div>
              <div style={{ fontSize: 10.5, color: T.textMute, marginTop: 3, textTransform: 'capitalize' }}>{qi.question.level}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  const questionViewer = (
    <div style={{ overflow: 'auto', padding: isMobile ? '16px' : '24px 38px 32px', background: T.bg, flex: 1 }}>
      {/* Version switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <button type="button" onClick={() => navigate('/provas')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: T.textDim, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 500 }}>
          <I.ArrowLeft size={14} stroke={2} /> Provas
        </button>
        <div style={{ display: 'flex', gap: 6, padding: 3, background: T.surfaceAlt, borderRadius: 10 }}>
          {versions.map((v) => (
            <button key={v.id} type="button" onClick={() => setActiveVersionId(v.id)}
              style={{ minWidth: 36, height: 30, padding: '0 8px', borderRadius: 7, fontFamily: 'inherit', background: activeVersionId === v.id ? T.surface : 'transparent', color: activeVersionId === v.id ? T.text : T.textDim, border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, boxShadow: activeVersionId === v.id ? '0 2px 6px rgba(0,0,0,0.08)' : 'none' }}>
              v{v.versionLabel}
            </button>
          ))}
        </div>
      </div>

      {versionError && <div style={{ padding: '12px 16px', background: `${T.danger}12`, border: `1px solid ${T.danger}30`, borderRadius: 12, color: T.danger, fontSize: 13, marginBottom: 16 }}>{versionError}</div>}

      {loadingVersion && <div style={{ padding: 60, textAlign: 'center', color: T.textMute, fontSize: 14 }}>Carregando versão…</div>}

      {!loadingVersion && q && (
        <div style={{ padding: 32, background: T.surface, borderRadius: 18, border: `1px solid ${T.border}`, maxWidth: 720 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{ padding: '4px 10px', borderRadius: 6, background: T.aiBg, color: T.ai, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.3, fontFamily: 'ui-monospace, monospace' }}>
              QUESTÃO {q.questionPosition}
            </span>
            <span style={{ fontSize: 11.5, color: T.textMute, textTransform: 'capitalize' }}>{q.question.level}</span>
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0, lineHeight: 1.45, letterSpacing: -0.3, color: T.text }}>{q.question.statement}</h2>

          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {q.alternatives.map((a) => {
              const isCorrect = a.alternativePosition === correctIdx
              return (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: isCorrect ? `${T.success}10` : T.surfaceAlt, border: `1.5px solid ${isCorrect ? T.success : 'transparent'}`, borderRadius: 12 }}>
                  <span style={{ width: 22, height: 22, borderRadius: 99, background: isCorrect ? T.success : T.surface, color: isCorrect ? '#fff' : T.textDim, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: 11, border: isCorrect ? 'none' : `1.5px solid ${T.border}` }}>
                    {String.fromCharCode(65 + a.alternativePosition)}
                  </span>
                  <span style={{ fontSize: 14.5, color: T.text, fontWeight: isCorrect ? 600 : 400 }}>{a.alternative.text}</span>
                  {isCorrect && <I.Check size={14} stroke={2.5} style={{ color: T.success, marginLeft: 'auto', flexShrink: 0 }} />}
                </div>
              )
            })}
          </div>

          {correctIdx >= 0 && (
            <div style={{ marginTop: 18, padding: 14, background: T.aiBg, border: `1px solid ${T.aiBorder}`, borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: T.ai, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase' }}>
                <I.Check size={11} stroke={2.4} /> Gabarito desta versão: alternativa {String.fromCharCode(65 + correctIdx)}
              </div>
              {(() => {
                const ak = answerKey.find((k) => k.questionPosition === q.questionPosition)
                return ak ? (
                  <p style={{ margin: '6px 0 0', fontSize: 12.5, color: T.textDim, lineHeight: 1.5 }}>
                    Original: <strong>{ak.originalLabel}</strong> → Embaralhada: <strong>{ak.shuffledLabel}</strong>
                  </p>
                ) : null
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  )

  const actionsPanel = (
    <div style={{ background: T.surface, borderLeft: isMobile ? 'none' : `1px solid ${T.border}`, padding: '22px 20px', overflow: 'auto' }}>
      <div style={{ fontSize: 11, color: T.textMute, letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>Ações</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <BoldBtn T={T} variant="outline" icon={<I.Refresh size={13} stroke={2} />} onClick={openReplace} style={{ width: '100%', justifyContent: 'flex-start' }} disabled={!q}>
          Substituir questão
        </BoldBtn>
        <BoldBtn T={T} variant="outline" icon={<I.Doc size={13} stroke={1.8} />} onClick={() => setShowAnswerKey(true)} style={{ width: '100%', justifyContent: 'flex-start' }}>
          Ver gabarito completo
        </BoldBtn>
      </div>

      <div style={{ height: 1, background: T.border, margin: '20px 0' }} />

      <div style={{ fontSize: 11, color: T.textMute, letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>Exportar</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BoldBtn T={T} variant="outline" icon={<I.Doc size={13} stroke={1.8} />} disabled style={{ flex: 1, justifyContent: 'flex-start' }}>Baixar PDFs</BoldBtn>
          <Badge T={T} />
        </div>
      </div>

      {versionData && (
        <div style={{ marginTop: 20, padding: 14, background: T.aiBg, borderRadius: 12, border: `1px solid ${T.aiBorder}` }}>
          <div style={{ fontSize: 12, color: T.ai, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase' }}>Verificação</div>
          <div style={{ marginTop: 8, fontSize: 13, color: T.text, fontWeight: 600 }}>
            {answerKey.length === versionData.questions.length ? 'Gabarito 100% consistente' : 'Verificando gabarito…'}
          </div>
          <div style={{ marginTop: 4, fontSize: 11.5, color: T.textDim, lineHeight: 1.45 }}>
            {versionData.questions.length} questões · {answerKey.length} entradas no gabarito
          </div>
        </div>
      )}

      <BoldBtn T={T} size="lg" variant="ai" onClick={() => navigate('/provas')} icon={<I.Check size={14} stroke={2.4} />} style={{ width: '100%', marginTop: 18 }}>
        Concluir revisão
      </BoldBtn>
    </div>
  )

  return (
    <>
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: T.bg }}>
          <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}`, background: T.surface, flexShrink: 0 }}>
            {(['list', 'questao', 'acoes'] as const).map((tab) => (
              <button key={tab} type="button" onClick={() => setMobileTab(tab)} style={{ flex: 1, padding: '12px 4px', border: 'none', background: 'transparent', color: mobileTab === tab ? T.ai : T.textDim, fontFamily: 'inherit', fontSize: 12.5, fontWeight: mobileTab === tab ? 600 : 500, borderBottom: `2px solid ${mobileTab === tab ? T.ai : 'transparent'}`, cursor: 'pointer' }}>
                {tab === 'list' ? 'Lista' : tab === 'questao' ? 'Questão' : 'Ações'}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {mobileTab === 'list' && questionList}
            {mobileTab === 'questao' && questionViewer}
            {mobileTab === 'acoes' && actionsPanel}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 260px', height: '100%', minHeight: '100vh', overflow: 'hidden' }}>
          {questionList}
          {questionViewer}
          {actionsPanel}
        </div>
      )}

      {/* Replace question modal */}
      {showReplace && (
        <div onClick={() => !replacing && setShowReplace(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: T.surface, borderRadius: 20, border: `1px solid ${T.border}`, padding: 24, maxWidth: 560, width: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: T.text }}>Substituir questão {q?.questionPosition}</h3>
                <p style={{ fontSize: 12, color: T.textMute, margin: '4px 0 0' }}>Selecione uma questão do banco da mesma matéria</p>
              </div>
              <button type="button" onClick={() => setShowReplace(false)} style={{ background: 'transparent', border: 'none', color: T.textMute, cursor: 'pointer' }}><I.Close size={18} stroke={2} /></button>
            </div>

            {replaceError && <div style={{ padding: '10px 14px', background: `${T.danger}12`, border: `1px solid ${T.danger}30`, borderRadius: 10, color: T.danger, fontSize: 13, marginBottom: 12 }}>{replaceError}</div>}

            <div style={{ flex: 1, overflow: 'auto', marginBottom: 14 }}>
              {loadingBank && <div style={{ padding: 30, textAlign: 'center', color: T.textMute, fontSize: 13 }}>Carregando banco…</div>}
              {!loadingBank && bankQuestions.length === 0 && <div style={{ padding: 30, textAlign: 'center', color: T.textMute, fontSize: 13 }}>Nenhuma questão disponível.</div>}
              {bankQuestions.map((bq) => {
                const alreadyUsed = versionData?.questions.some((vq) => vq.questionId === bq.id) ?? false
                const selected = selectedBankQ === bq.id
                return (
                  <button key={bq.id} type="button" disabled={alreadyUsed} onClick={() => setSelectedBankQ(bq.id)}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', width: '100%', borderRadius: 10, fontFamily: 'inherit', background: selected ? T.aiBg : 'transparent', border: `1.5px solid ${selected ? T.aiBorder : 'transparent'}`, cursor: alreadyUsed ? 'not-allowed' : 'pointer', textAlign: 'left', marginBottom: 4, opacity: alreadyUsed ? 0.4 : 1 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 99, border: `2px solid ${selected ? T.ai : T.border}`, background: selected ? T.ai : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                      {selected && <div style={{ width: 8, height: 8, borderRadius: 99, background: '#fff' }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: T.text, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{bq.statement}</div>
                      <span style={{ fontSize: 10.5, color: T.textMute, textTransform: 'capitalize', marginTop: 3, display: 'inline-block' }}>
                        {bq.level}{alreadyUsed ? ' · já nesta versão' : ''}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <BoldBtn T={T} variant="ghost" onClick={() => setShowReplace(false)} disabled={replacing}>Cancelar</BoldBtn>
              <BoldBtn T={T} variant="ai" icon={<I.Check size={14} stroke={2.4} />} onClick={handleReplace} disabled={!selectedBankQ || replacing}>
                {replacing ? 'Substituindo…' : 'Confirmar substituição'}
              </BoldBtn>
            </div>
          </div>
        </div>
      )}

      {/* Answer key modal */}
      {showAnswerKey && answerKey.length > 0 && (
        <div onClick={() => setShowAnswerKey(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: T.surface, borderRadius: 20, border: `1px solid ${T.border}`, padding: 24, maxWidth: 500, width: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: T.text }}>Gabarito — Versão {versionData?.versionLabel}</h3>
              <button type="button" onClick={() => setShowAnswerKey(false)} style={{ background: 'transparent', border: 'none', color: T.textMute, cursor: 'pointer' }}><I.Close size={18} stroke={2} /></button>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              {answerKey.map((ak) => (
                <div key={ak.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: T.textDim, minWidth: 30 }}>Q{ak.questionPosition}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ak.question.statement}</div>
                  </div>
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: T.aiBg, color: T.ai, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{ak.shuffledLabel}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
