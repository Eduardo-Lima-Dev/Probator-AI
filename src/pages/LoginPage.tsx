import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../api/authApi'
import { useTheme } from '../theme/ThemeContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { BoldLogo } from '../components/ui/BoldLogo'
import { BoldBtn } from '../components/ui/BoldBtn'
import { BoldField } from '../components/ui/BoldField'
import { I } from '../components/ui/icons'

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.6c-.2 1.3-1 2.4-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.5z" />
      <path fill="#34A853" d="M12 22c2.8 0 5.2-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7C4.4 19.9 8 22 12 22z" />
      <path fill="#FBBC05" d="M6.2 13.6c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V6.9H2.7C2 8.3 1.6 9.9 1.6 11.6s.4 3.3 1.1 4.7l3.5-2.7z" />
      <path fill="#EA4335" d="M12 5.4c1.5 0 2.9.5 4 1.5l3-3C17.1 2.2 14.7 1.2 12 1.2 8 1.2 4.4 3.3 2.7 6.9l3.5 2.7c.8-2.5 3.1-4.2 5.8-4.2z" />
    </svg>
  )
}

export function LoginPage() {
  const { T } = useTheme()
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await loginUser({ email, password })
      navigate('/provas', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível realizar o login.')
    } finally {
      setIsLoading(false)
    }
  }

  const formPanel = (
    <div
      style={{
        flex: isMobile ? undefined : 0.85,
        padding: isMobile ? '28px 24px 24px' : '64px 72px',
        background: T.bg,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: isMobile ? undefined : 'center',
      }}
    >
      <div style={{ maxWidth: isMobile ? undefined : 380, width: '100%' }}>
        <h2
          style={{
            fontSize: isMobile ? 24 : 32,
            fontWeight: 700,
            margin: '0 0 6px',
            letterSpacing: -0.8,
            color: T.text,
          }}
        >
          Entrar
        </h2>
        <p style={{ color: T.textDim, margin: '0 0 28px', fontSize: isMobile ? 13.5 : 14 }}>
          Use seu e-mail institucional para continuar.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <BoldField T={T} label="E-MAIL INSTITUCIONAL" type="email" value={email} onChange={setEmail} placeholder="prof@universidade.br" required autoComplete="email" />
          <BoldField T={T} label="SENHA" type="password" value={password} onChange={setPassword} placeholder="••••••••" required autoComplete="current-password" />

          <div
            style={{
              display: 'flex',
              justifyContent: isMobile ? 'flex-end' : 'space-between',
              alignItems: 'center',
              marginTop: -4,
            }}
          >
            {!isMobile && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: T.textDim, cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: T.ai }} />
                Manter conectado
              </label>
            )}
            <a href="#" style={{ fontSize: isMobile ? 12.5 : 13, color: T.ai, textDecoration: 'none', fontWeight: 600 }}>
              Esqueci a senha
            </a>
          </div>

          {error && (
            <div style={{ fontSize: 13, color: T.danger, padding: '10px 14px', background: `${T.danger}12`, borderRadius: 10, border: `1px solid ${T.danger}30` }}>
              {error}
            </div>
          )}

          <BoldBtn T={T} size="lg" variant="ai" type="submit" disabled={isLoading} iconRight={<I.ArrowRight size={16} stroke={2.2} />} style={{ width: '100%' }}>
            {isLoading ? 'Entrando…' : 'Entrar'}
          </BoldBtn>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: T.textMute, fontSize: 12, margin: '4px 0' }}>
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span>ou</span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
          </div>

          <BoldBtn T={T} size="lg" variant="outline" type="button" style={{ width: '100%' }} icon={<GoogleIcon />}>
            Continuar com Google
          </BoldBtn>
        </form>

        <p style={{ marginTop: isMobile ? 'auto' : 28, paddingTop: isMobile ? 24 : undefined, color: T.textDim, fontSize: 13.5 }}>
          Primeira vez?{' '}
          <Link to="/cadastro" style={{ color: T.ai, textDecoration: 'none', fontWeight: 600 }}>
            Crie sua conta
          </Link>
        </p>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.bg, minHeight: '100vh' }}>
        {/* Hero */}
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: T.hero,
            padding: '32px 24px 40px',
            color: '#fff',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BoldLogo size={32} />
            <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: -0.3 }}>Probator·AI</span>
          </div>
          <div style={{ marginTop: 28 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 11px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.10)',
                fontSize: 11.5,
                fontWeight: 600,
                letterSpacing: 0.2,
              }}
            >
              <I.Sparkles size={11} stroke={2.4} /> Avaliações com IA
            </div>
            <h1 style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1.2, margin: '14px 0 10px' }}>
              Crie uma prova em{' '}
              <em
                style={{
                  fontStyle: 'normal',
                  background: T.aiGrad,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                três passos
              </em>
              .
            </h1>
            <p style={{ fontSize: 14.5, lineHeight: 1.5, color: 'rgba(255,255,255,0.75)', margin: 0, maxWidth: 320 }}>
              Versões embaralhadas e gabarito verificado, prontas em menos de 30 segundos.
            </p>
          </div>
          {/* Floating decorative card */}
          <div
            style={{
              position: 'absolute',
              top: 26,
              right: -50,
              width: 200,
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 14,
              padding: 14,
              transform: 'rotate(6deg)',
              boxShadow: '0 24px 50px rgba(0,0,0,0.45)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 5,
                  background: T.aiGrad,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <I.Sparkles size={9} stroke={2.6} />
              </span>
              Versão A · v1 de v4
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: '#fff', fontWeight: 500, lineHeight: 1.35 }}>
              1. Calcule a derivada de f(x) = 3x² + 2x − 5 em x = 2.
            </div>
          </div>
        </div>
        {formPanel}
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', minHeight: '100vh' }}>
      {/* Brand panel */}
      <div
        style={{
          flex: 1.1,
          position: 'relative',
          overflow: 'hidden',
          background: T.hero,
          color: '#fff',
          padding: '40px 56px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <BoldLogo size={40} />
          <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: -0.3 }}>Probator·AI</span>
        </div>

        <div style={{ margin: 'auto 0', maxWidth: 540, position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '6px 14px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.10)',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 0.2,
            }}
          >
            <I.Sparkles size={12} stroke={2.4} /> Avaliações com IA
          </div>
          <h1 style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.0, letterSpacing: -2.4, margin: '20px 0 18px' }}>
            Crie uma prova em{' '}
            <em
              style={{
                fontStyle: 'normal',
                background: T.aiGrad,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              três passos
            </em>
            .
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.5, color: 'rgba(255,255,255,0.75)', margin: 0, maxWidth: 460 }}>
            Versões embaralhadas, gabarito verificado e estatísticas por questão — prontas em menos de 30 segundos.
          </p>

          <div
            style={{
              marginTop: 38,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 14,
              maxWidth: 520,
            }}
          >
            {[
              { n: '30s', t: 'Geração média', s: 'p/ prova de 10 questões' },
              { n: '4 v', t: 'Versões/prova', s: 'embaralhadas e numeradas' },
              { n: '100%', t: 'Gabarito verificado', s: 'por IA + você' },
            ].map((m) => (
              <div
                key={m.t}
                style={{
                  padding: 16,
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.10)',
                }}
              >
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    letterSpacing: -1,
                    background: T.aiGrad,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {m.n}
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 4 }}>{m.t}</div>
                <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)' }}>{m.s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating preview card */}
        <div
          style={{
            position: 'absolute',
            top: 60,
            right: -80,
            width: 280,
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 16,
            padding: 18,
            transform: 'rotate(6deg)',
            boxShadow: '0 32px 70px rgba(0,0,0,0.55)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                background: T.aiGrad,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <I.Sparkles size={10} stroke={2.6} />
            </span>
            Versão A · 1 de 4
          </div>
          <div style={{ marginTop: 12, fontSize: 13, color: '#fff', fontWeight: 500, lineHeight: 1.4 }}>
            1. Calcule a derivada de f(x) = 3x² + 2x − 5 em x = 2.
          </div>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['a) 14', 'b) 12', 'c) 10', 'd) 8'].map((o, i) => (
              <div
                key={o}
                style={{
                  fontSize: 11.5,
                  color: i === 0 ? '#a855f7' : 'rgba(255,255,255,0.65)',
                  fontWeight: i === 0 ? 600 : 500,
                }}
              >
                {o}
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
          © 2026 Probator·AI · LGPD compliant
        </div>
      </div>

      {formPanel}
    </div>
  )
}
