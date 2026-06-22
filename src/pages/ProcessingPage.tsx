import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../theme/ThemeContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { generateVersions } from '../api/examsApi'
import type { DifficultyLevel } from '../api/examsApi'
import { BoldBtn } from '../components/ui/BoldBtn'
import { I } from '../components/ui/icons'

type LocationState = {
  examId: string
  materiaId: string
  versionCount: number
  questionCount: number
  level?: DifficultyLevel
}

const STEPS = [
  'Selecionando questões do banco',
  'Verificando gabarito',
  'Embaralhando versões',
  'Finalizando',
]

export function ProcessingPage() {
  const { T } = useTheme()
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | null
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const called = useRef(false)

  useEffect(() => {
    if (!state?.examId) {
      navigate('/provas/nova', { replace: true })
      return
    }
    if (called.current) return
    called.current = true

    let step = 0
    const interval = setInterval(() => {
      if (step < STEPS.length - 1) {
        step++
        setProgress(step)
      }
    }, 750)

    generateVersions(state.examId, {
      versionCount: state.versionCount,
      questionCount: state.questionCount,
      ...(state.level && { level: state.level }),
    })
      .then((versions) => {
        clearInterval(interval)
        setProgress(STEPS.length)
        setTimeout(() => {
          navigate('/provas/nova/revisar', {
            replace: true,
            state: {
              examId: state.examId,
              materiaId: state.materiaId,
              versions: versions.map((v) => ({ id: v.id, versionLabel: v.versionLabel })),
            },
          })
        }, 500)
      })
      .catch((err) => {
        clearInterval(interval)
        setError(err instanceof Error ? err.message : 'Erro ao gerar versões.')
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ height: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? 16 : 32, background: T.bg }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <div style={{ width: 100, height: 100, borderRadius: 28, margin: '0 auto 24px', background: T.aiGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 22px 60px rgba(124,58,237,0.45)', color: '#fff' }}>
          {error ? <I.Close size={42} stroke={2} /> : <I.Sparkles size={42} stroke={2.2} />}
        </div>

        {error ? (
          <>
            <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 8px', letterSpacing: -0.8, color: T.text }}>Erro ao gerar versões</h2>
            <p style={{ color: T.danger, margin: '0 0 24px', fontSize: 14, padding: '12px 16px', background: `${T.danger}12`, borderRadius: 12, border: `1px solid ${T.danger}30` }}>{error}</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <BoldBtn T={T} variant="outline" icon={<I.ArrowLeft size={14} stroke={2} />} onClick={() => navigate('/provas/nova')}>Voltar</BoldBtn>
              <BoldBtn T={T} variant="ai" icon={<I.Refresh size={14} stroke={2} />} onClick={() => { called.current = false; setError(''); setProgress(0) }}>Tentar novamente</BoldBtn>
            </div>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 6px', letterSpacing: -0.8, color: T.text }}>Gerando sua prova…</h2>
            <p style={{ color: T.textDim, margin: '0 0 30px', fontSize: 14 }}>Montando versões embaralhadas a partir do banco de questões</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
              {STEPS.map((s, i) => {
                const done = progress > i
                const active = progress === i
                return (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: active ? T.aiBg : T.surface, border: `1px solid ${active ? T.aiBorder : T.border}`, borderRadius: 12, transition: 'all .2s' }}>
                    <div style={{ width: 22, height: 22, borderRadius: 99, background: done ? T.success : active ? T.ai : T.surfaceAlt, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background .2s' }}>
                      {done ? <I.Check size={12} stroke={3} /> : active ? <div style={{ width: 8, height: 8, borderRadius: 99, background: '#fff' }} /> : null}
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: done || active ? T.text : T.textMute, transition: 'color .2s' }}>{s}</div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
