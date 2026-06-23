import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTheme } from '../theme/ThemeContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { getExamById, getExamVersion } from '../api/examsApi'
import type { ExamListItem, ExamVersion } from '../api/examsApi'
import { scanGabarito, homologarCorrecao } from '../api/correctionApi'
import type { CorrecaoResultado, QuestaoRevisada } from '../api/correctionApi'
import { addCorrectionHistory, getCorrectionHistory } from '../lib/correctionHistory'
import { BoldBtn } from '../components/ui/BoldBtn'
import { BoldChip } from '../components/ui/BoldChip'
import { I } from '../components/ui/icons'
import { useToast } from '../components/ui/Toast'

const LABELS = ['A', 'B', 'C', 'D', 'E']

type Metodo = 'foto' | 'manual'

function statusStyle(T: ReturnType<typeof useTheme>['T'], status: 'CORRETO' | 'ERRADO' | 'EM_BRANCO') {
  if (status === 'CORRETO') return { c: T.success, bg: 'rgba(22,163,74,0.10)', label: 'Correto' }
  if (status === 'ERRADO') return { c: T.danger, bg: 'rgba(220,38,38,0.10)', label: 'Errado' }
  return { c: T.textMute, bg: T.surfaceAlt, label: 'Em branco' }
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function CorrigirProvaPage() {
  const { T } = useTheme()
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const toast = useToast()
  const { examId } = useParams<{ examId: string }>()

  const [exam, setExam] = useState<ExamListItem | null>(null)
  const [loadingExam, setLoadingExam] = useState(true)
  const [examError, setExamError] = useState('')

  const [activeVersionId, setActiveVersionId] = useState('')
  const [versionData, setVersionData] = useState<ExamVersion | null>(null)
  const [loadingVersion, setLoadingVersion] = useState(false)

  const [metodo, setMetodo] = useState<Metodo>('foto')
  const [file, setFile] = useState<File | null>(null)
  const [scanning, setScanning] = useState(false)
  const [scanError, setScanError] = useState('')
  const [scanInfo, setScanInfo] = useState('')

  const [respostas, setRespostas] = useState<Record<number, string | null>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [resultado, setResultado] = useState<CorrecaoResultado | null>(null)
  const [historyTick, setHistoryTick] = useState(0)

  useEffect(() => {
    if (!examId) return
    getExamById(examId)
      .then((e) => {
        setExam(e)
        if (e.versions[0]) setActiveVersionId(e.versions[0].id)
        else setExamError('Esta prova ainda não tem versões geradas.')
      })
      .catch(() => setExamError('Não foi possível carregar a prova.'))
      .finally(() => setLoadingExam(false))
  }, [examId])

  useEffect(() => {
    if (!activeVersionId) return
    setLoadingVersion(true)
    getExamVersion(activeVersionId)
      .then((v) => {
        setVersionData(v)
        const initial: Record<number, string | null> = {}
        v.questions.forEach((q) => { initial[q.questionPosition] = null })
        setRespostas(initial)
        setResultado(null)
      })
      .catch(() => setExamError('Não foi possível carregar a versão selecionada.'))
      .finally(() => setLoadingVersion(false))
  }, [activeVersionId])

  const historico = useMemo(
    () => (examId ? getCorrectionHistory(examId) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [examId, historyTick],
  )

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null)
    setScanError('')
    setScanInfo('')
  }

  async function handleScan() {
    if (!file || !activeVersionId) return
    setScanning(true)
    setScanError('')
    try {
      const res = await scanGabarito(activeVersionId, file)
      setRespostas((prev) => {
        const next = { ...prev }
        res.questoes.forEach((q) => { next[q.numero_questao] = q.alternativa_marcada })
        return next
      })
      setScanInfo(
        `${res.questoes.length} questões identificadas${res.versao_prova ? ` · versão "${res.versao_prova}"` : ''}. Revise abaixo antes de corrigir.`,
      )
      toast.success('Gabarito lido com sucesso pela IA.')
    } catch (err) {
      setScanError(err instanceof Error ? err.message : 'Não foi possível processar a imagem.')
    } finally {
      setScanning(false)
    }
  }

  function toggleResposta(position: number, label: string) {
    setRespostas((prev) => ({ ...prev, [position]: prev[position] === label ? null : label }))
  }

  async function handleCorrigir() {
    if (!versionData || !exam) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const questoes: QuestaoRevisada[] = versionData.questions.map((q) => ({
        numero_questao: q.questionPosition,
        alternativa_marcada: respostas[q.questionPosition] ?? null,
      }))
      const res = await homologarCorrecao(activeVersionId, questoes)
      setResultado(res)
      addCorrectionHistory({
        id: `${activeVersionId}-${Date.now()}`,
        examId: exam.id,
        examTitle: exam.title,
        versionLabel: versionData.versionLabel,
        total_questoes: res.total_questoes,
        acertos: res.acertos,
        erros: res.erros,
        emBranco: res.emBranco,
        nota_final: res.nota_final,
        correctedAt: new Date().toISOString(),
      })
      setHistoryTick((t) => t + 1)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Não foi possível corrigir a prova.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleReset() {
    setResultado(null)
    setFile(null)
    setScanInfo('')
    setScanError('')
    setSubmitError('')
    if (versionData) {
      const initial: Record<number, string | null> = {}
      versionData.questions.forEach((q) => { initial[q.questionPosition] = null })
      setRespostas(initial)
    }
  }

  const pad = isMobile ? '16px 16px 40px' : '28px 32px 48px'

  if (loadingExam) {
    return <div style={{ padding: 60, textAlign: 'center', color: T.textMute, fontSize: 14, background: T.bg, minHeight: '100vh' }}>Carregando…</div>
  }

  if (examError && !exam) {
    return (
      <div style={{ padding: pad, background: T.bg, minHeight: '100vh' }}>
        <button type="button" onClick={() => navigate('/provas')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'transparent', border: 'none', color: T.textDim, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, padding: 0, marginBottom: 16 }}>
          <I.ArrowLeft size={12} stroke={2} /> Voltar
        </button>
        <div style={{ padding: '12px 16px', background: `${T.danger}12`, border: `1px solid ${T.danger}30`, borderRadius: 12, color: T.danger, fontSize: 13 }}>{examError}</div>
      </div>
    )
  }

  if (!exam) return null

  return (
    <div style={{ padding: pad, maxWidth: 880, margin: '0 auto' }}>
      {/* Header */}
      <button type="button" onClick={() => navigate('/provas')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'transparent', border: 'none', color: T.textDim, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, padding: 0, marginBottom: 12 }}>
        <I.ArrowLeft size={12} stroke={2} /> Provas
      </button>
      <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, margin: 0, letterSpacing: -0.7, color: T.text }}>Corrigir prova</h1>
      <div style={{ color: T.textDim, fontSize: 13.5, marginTop: 6, marginBottom: 20 }}>{exam.title} · {exam.materia.name}</div>

      {exam.versions.length > 1 && (
        <div style={{ display: 'flex', gap: 6, padding: 3, background: T.surfaceAlt, borderRadius: 10, marginBottom: 20, width: 'fit-content' }}>
          {exam.versions.map((v) => (
            <button key={v.id} type="button" onClick={() => setActiveVersionId(v.id)}
              style={{ minWidth: 36, height: 30, padding: '0 10px', borderRadius: 7, fontFamily: 'inherit', background: activeVersionId === v.id ? T.surface : 'transparent', color: activeVersionId === v.id ? T.text : T.textDim, border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, boxShadow: activeVersionId === v.id ? '0 2px 6px rgba(0,0,0,0.08)' : 'none' }}>
              v{v.versionLabel}
            </button>
          ))}
        </div>
      )}

      {examError && <div style={{ padding: '12px 16px', background: `${T.danger}12`, border: `1px solid ${T.danger}30`, borderRadius: 12, color: T.danger, fontSize: 13, marginBottom: 20 }}>{examError}</div>}

      {loadingVersion && <div style={{ padding: 50, textAlign: 'center', color: T.textMute, fontSize: 14 }}>Carregando versão…</div>}

      {!loadingVersion && versionData && !resultado && (
        <>
          {/* Método de entrada */}
          <div style={{ padding: 22, background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, marginBottom: 18 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', color: T.textDim, marginBottom: 12 }}>Como você quer informar as respostas?</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <BoldChip T={T} active={metodo === 'foto'} onClick={() => setMetodo('foto')} accent={T.ai}>
                <I.Sparkles size={13} stroke={2.2} /> Enviar foto (IA)
              </BoldChip>
              <BoldChip T={T} active={metodo === 'manual'} onClick={() => setMetodo('manual')}>
                Preencher manualmente
              </BoldChip>
            </div>

            {metodo === 'foto' && (
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', border: `1.5px dashed ${T.border}`, borderRadius: 12, cursor: 'pointer', background: T.surfaceAlt }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: T.aiBg, color: T.ai, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <I.Upload size={16} stroke={1.8} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: T.text }}>{file ? file.name : 'Tirar foto do gabarito'}</div>
                    <div style={{ fontSize: 11.5, color: T.textMute, marginTop: 2 }}>JPEG, PNG ou WEBP · até 10MB</div>
                  </div>
                  {/* capture="environment" abre a câmera traseira direto no celular; o navegador pede a permissão de câmera automaticamente na primeira vez */}
                  <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>

                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, cursor: 'pointer', color: T.ai, fontSize: 12.5, fontWeight: 600 }}>
                  Ou escolher da galeria
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>

                {scanError && <div style={{ marginTop: 10, padding: '10px 14px', background: `${T.danger}12`, border: `1px solid ${T.danger}30`, borderRadius: 10, color: T.danger, fontSize: 13 }}>{scanError}</div>}
                {scanInfo && !scanError && <div style={{ marginTop: 10, padding: '10px 14px', background: T.aiBg, border: `1px solid ${T.aiBorder}`, borderRadius: 10, color: T.ai, fontSize: 13 }}>{scanInfo}</div>}

                <BoldBtn T={T} variant="ai" icon={<I.Sparkles size={14} stroke={2.2} />} onClick={handleScan} disabled={!file || scanning} style={{ marginTop: 12 }}>
                  {scanning ? 'Lendo gabarito…' : 'Processar com IA'}
                </BoldBtn>
              </div>
            )}
          </div>

          {/* Grade de respostas */}
          <div style={{ padding: 22, background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', color: T.textDim }}>Respostas do aluno</div>
              <span style={{ fontSize: 11.5, color: T.textMute }}>{versionData.questions.length} questões</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {versionData.questions.map((q) => {
                const marcada = respostas[q.questionPosition] ?? null
                return (
                  <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: T.surfaceAlt, borderRadius: 10, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                    <span style={{ width: 30, fontSize: 12, fontFamily: 'ui-monospace, monospace', color: T.textDim, flexShrink: 0 }}>Q{q.questionPosition}</span>
                    <div style={{ display: 'flex', gap: 5, flex: 1 }}>
                      {LABELS.map((label) => {
                        const active = marcada === label
                        return (
                          <button key={label} type="button" onClick={() => toggleResposta(q.questionPosition, label)}
                            style={{ width: 30, height: 30, borderRadius: 8, fontFamily: 'inherit', background: active ? T.ai : T.surface, color: active ? '#fff' : T.textDim, border: `1.5px solid ${active ? T.ai : T.border}`, fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>
                            {label}
                          </button>
                        )
                      })}
                    </div>
                    <span style={{ fontSize: 11, color: marcada ? T.textMute : T.warn, fontWeight: 600, flexShrink: 0, minWidth: 56, textAlign: 'right' }}>
                      {marcada ? `marcou ${marcada}` : 'em branco'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {submitError && <div style={{ padding: '12px 16px', background: `${T.danger}12`, border: `1px solid ${T.danger}30`, borderRadius: 12, color: T.danger, fontSize: 13, marginBottom: 16 }}>{submitError}</div>}

          <BoldBtn T={T} size="lg" variant="ai" icon={<I.Check size={15} stroke={2.4} />} onClick={handleCorrigir} disabled={submitting} style={{ width: isMobile ? '100%' : undefined }}>
            {submitting ? 'Corrigindo…' : 'Corrigir prova'}
          </BoldBtn>

          {/* Histórico desta prova */}
          {historico.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', color: T.textDim, marginBottom: 10 }}>Correções recentes desta prova</div>
              <div style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.border}`, overflow: 'hidden' }}>
                {historico.slice(0, 5).map((h, idx) => (
                  <div key={h.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 16px', borderBottom: idx < Math.min(historico.length, 5) - 1 ? `1px solid ${T.border}` : 'none' }}>
                    <div style={{ fontSize: 12.5, color: T.text }}>v{h.versionLabel} · {formatDateTime(h.correctedAt)}</div>
                    <div style={{ fontSize: 12.5, color: T.textDim, fontFamily: 'ui-monospace, monospace' }}>{h.acertos}/{h.total_questoes} acertos</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {resultado && (
        <div>
          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { l: 'Acertos', v: resultado.acertos, c: T.success },
              { l: 'Erros', v: resultado.erros, c: T.danger },
              { l: 'Em branco', v: resultado.emBranco, c: T.textMute },
              { l: 'Nota final', v: `${resultado.nota_final}/${resultado.total_questoes}`, c: T.ai },
            ].map((k) => (
              <div key={k.l} style={{ padding: isMobile ? 12 : 18, background: T.surface, borderRadius: 14, border: `1px solid ${T.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: T.textDim, fontWeight: 700, letterSpacing: 0.2, textTransform: 'uppercase' }}>
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: k.c }} /> {k.l}
                </div>
                <div style={{ fontSize: isMobile ? 22 : 30, fontWeight: 700, letterSpacing: -1, marginTop: 6, fontFamily: 'ui-monospace, monospace', color: T.text }}>{k.v}</div>
              </div>
            ))}
          </div>

          {/* Detalhes */}
          <div style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}` }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: T.text }}>Detalhes por questão</h3>
            </div>
            {resultado.detalhes.map((d, idx) => {
              const s = statusStyle(T, d.status)
              return (
                <div key={d.posicao_questao} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', borderBottom: idx < resultado.detalhes.length - 1 ? `1px solid ${T.border}` : 'none' }}>
                  <span style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', color: T.textDim, minWidth: 28 }}>Q{d.posicao_questao}</span>
                  <span style={{ fontSize: 12.5, color: T.textDim, flex: 1 }}>
                    Gabarito <strong style={{ color: T.text }}>{d.gabarito_oficial}</strong> · Aluno <strong style={{ color: T.text }}>{d.marcada_pelo_aluno ?? '—'}</strong>
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 24, padding: '0 10px', borderRadius: 99, background: s.bg, color: s.c, fontSize: 11.5, fontWeight: 600, flexShrink: 0 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 99, background: s.c }} /> {s.label}
                  </span>
                </div>
              )
            })}
          </div>

          <BoldBtn T={T} variant="outline" icon={<I.Refresh size={13} stroke={2} />} onClick={handleReset}>
            Corrigir outra prova
          </BoldBtn>
        </div>
      )}
    </div>
  )
}
