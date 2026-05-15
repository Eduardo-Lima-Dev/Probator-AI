import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../api/authApi'
import { getMaterias } from '../api/materiasApi'
import type { Materia } from '../api/materiasApi'
import { useTheme } from '../theme/ThemeContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { BoldLogo } from '../components/ui/BoldLogo'
import { BoldBtn } from '../components/ui/BoldBtn'
import { BoldField } from '../components/ui/BoldField'
import { I } from '../components/ui/icons'

export function RegisterPage() {
  const { T } = useTheme()
  const isMobile = useIsMobile()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [materiaId, setMateriaId] = useState('')
  const [materias, setMaterias] = useState<Materia[]>([])
  const [loadingMaterias, setLoadingMaterias] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getMaterias()
      .then(setMaterias)
      .catch(() => setError('Não foi possível carregar as matérias.'))
      .finally(() => setLoadingMaterias(false))
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }
    setIsLoading(true)
    try {
      await registerUser({ name, email, password, materiaId })
      navigate('/login', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar a conta.')
    } finally {
      setIsLoading(false)
    }
  }

  const formContent = (
    <div
      style={{
        flex: isMobile ? undefined : 0.85,
        padding: isMobile ? '28px 24px 40px' : '48px 72px',
        background: T.bg,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: isMobile ? undefined : 'center',
        overflowY: 'auto',
      }}
    >
      <div style={{ maxWidth: isMobile ? undefined : 400, width: '100%' }}>
        <button
          type="button"
          onClick={() => navigate('/login')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'transparent',
            border: 'none',
            color: T.textDim,
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 13,
            fontWeight: 500,
            padding: 0,
            marginBottom: 20,
          }}
        >
          <I.ArrowLeft size={14} stroke={2} />
          Voltar para login
        </button>

        <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 700, margin: '0 0 6px', letterSpacing: -0.8, color: T.text }}>
          Criar conta
        </h2>
        <p style={{ color: T.textDim, margin: '0 0 24px', fontSize: 14 }}>
          Junte-se ao Probator·AI para criar provas com IA.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <BoldField T={T} label="NOME COMPLETO" type="text" value={name} onChange={setName} placeholder="Prof. Ricardo Silva" required autoComplete="name" />
          <BoldField T={T} label="E-MAIL INSTITUCIONAL" type="email" value={email} onChange={setEmail} placeholder="prof@universidade.br" required autoComplete="email" />

          {/* Materia select */}
          <label style={{ display: 'block' }}>
            <div style={{ fontSize: 12, color: T.textDim, marginBottom: 7, fontWeight: 600, letterSpacing: 0.2 }}>
              MATÉRIA <span style={{ color: T.danger, marginLeft: 2 }}>*</span>
            </div>
            <select
              required
              value={materiaId}
              onChange={(e) => setMateriaId(e.target.value)}
              disabled={loadingMaterias}
              style={{
                width: '100%',
                minHeight: 50,
                padding: '12px 14px',
                background: T.surface,
                borderRadius: 12,
                border: `1.5px solid ${T.border}`,
                color: materiaId ? T.text : T.textMute,
                fontSize: 15,
                fontFamily: 'inherit',
                fontWeight: 500,
                outline: 'none',
                cursor: loadingMaterias ? 'wait' : 'pointer',
                appearance: 'none',
              }}
            >
              <option value="" disabled>
                {loadingMaterias ? 'Carregando matérias...' : 'Selecione uma matéria'}
              </option>
              {materias.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>

          <BoldField T={T} label="SENHA" type="password" value={password} onChange={setPassword} placeholder="••••••••" required autoComplete="new-password" />
          <BoldField T={T} label="CONFIRMAR SENHA" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••" required autoComplete="new-password" />

          {error && (
            <div style={{ fontSize: 13, color: T.danger, padding: '10px 14px', background: `${T.danger}12`, borderRadius: 10, border: `1px solid ${T.danger}30` }}>
              {error}
            </div>
          )}

          <BoldBtn T={T} size="lg" variant="ai" type="submit" disabled={isLoading} iconRight={<I.ArrowRight size={16} stroke={2.2} />} style={{ width: '100%', marginTop: 4 }}>
            {isLoading ? 'Criando conta…' : 'Criar conta'}
          </BoldBtn>
        </form>

        <p style={{ marginTop: 24, color: T.textDim, fontSize: 13.5, textAlign: 'center' }}>
          Já tem uma conta?{' '}
          <Link to="/login" style={{ color: T.ai, textDecoration: 'none', fontWeight: 600 }}>
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.bg, minHeight: '100vh' }}>
        <div style={{ background: T.hero, padding: '28px 24px 32px', color: '#fff', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BoldLogo size={28} />
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.3 }}>Probator·AI</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.1, letterSpacing: -0.8, margin: '16px 0 8px' }}>
            Comece a criar provas inteligentes.
          </h1>
        </div>
        {formContent}
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', minHeight: '100vh' }}>
      <div
        style={{
          flex: 1.1,
          background: T.hero,
          color: '#fff',
          padding: '40px 56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <BoldLogo size={40} />
          <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: -0.3 }}>Probator·AI</span>
        </div>
        <h1 style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, margin: '0 0 18px', maxWidth: 480 }}>
          Comece a criar provas{' '}
          <em
            style={{
              fontStyle: 'normal',
              background: T.aiGrad,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            inteligentes
          </em>
          .
        </h1>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', maxWidth: 420, lineHeight: 1.5 }}>
          Crie sua conta em segundos e comece a gerar avaliações com IA.
        </p>
      </div>
      {formContent}
    </div>
  )
}
