import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../theme/ThemeContext'
import { I } from '../components/ui/icons'

const STEPS = [
  { l: 'Lendo material e tópicos', d: 600 },
  { l: 'Gerando banco de questões', d: 900 },
  { l: 'Verificando gabarito', d: 700 },
  { l: 'Embaralhando versões', d: 600 },
]

export function ProcessingPage() {
  const { T } = useTheme()
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let i = 0
    function tick() {
      if (i >= STEPS.length) {
        setTimeout(() => navigate('/provas/nova/revisar'), 300)
        return
      }
      setProgress(i + 1)
      const delay = STEPS[i].d
      i++
      setTimeout(tick, delay)
    }
    tick()
  }, [navigate])

  return (
    <div
      style={{
        height: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        background: T.bg,
      }}
    >
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 28,
            margin: '0 auto 24px',
            background: T.aiGrad,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 22px 60px rgba(124,58,237,0.45)',
            color: '#fff',
          }}
          className="animate-pulse-scale"
        >
          <I.Sparkles size={42} stroke={2.2} />
        </div>

        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            margin: '0 0 6px',
            letterSpacing: -0.8,
            color: T.text,
          }}
        >
          Gerando sua prova…
        </h2>
        <p style={{ color: T.textDim, margin: '0 0 30px', fontSize: 14 }}>
          Questões sendo geradas com IA
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
          {STEPS.map((s, i) => {
            const done = progress > i
            const active = progress === i + 1
            return (
              <div
                key={s.l}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  background: active ? T.aiBg : T.surface,
                  border: `1px solid ${active ? T.aiBorder : T.border}`,
                  borderRadius: 12,
                  transition: 'all .2s',
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 99,
                    background: done ? T.success : active ? T.ai : T.surfaceAlt,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'background .2s',
                  }}
                >
                  {done ? (
                    <I.Check size={12} stroke={3} />
                  ) : active ? (
                    <div style={{ width: 8, height: 8, borderRadius: 99, background: '#fff' }} />
                  ) : null}
                </div>
                <div
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: done || active ? T.text : T.textMute,
                    transition: 'color .2s',
                  }}
                >
                  {s.l}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
