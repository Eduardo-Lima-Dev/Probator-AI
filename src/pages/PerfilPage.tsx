import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../theme/ThemeContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { updateMe, deleteMe } from '../api/userApi'
import { logoutUser } from '../api/authApi'
import { BoldBtn } from '../components/ui/BoldBtn'
import { BoldField } from '../components/ui/BoldField'
import { I } from '../components/ui/icons'
import { useToast } from '../components/ui/Toast'

export function PerfilPage() {
  const { T } = useTheme()
  const isMobile = useIsMobile()
  const { user } = useCurrentUser()
  const navigate = useNavigate()
  const toast = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState(user?.email ?? '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')   // validação inline apenas

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (password && password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }
    if (password && password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    const payload: { name?: string; email?: string; password?: string } = {}
    if (name.trim().length >= 3) payload.name = name.trim()
    if (email && email !== user?.email) payload.email = email
    if (password) payload.password = password

    if (Object.keys(payload).length === 0) {
      setError('Nenhuma alteração para salvar.')
      return
    }

    setIsLoading(true)
    try {
      await updateMe(payload)
      setPassword('')
      setConfirmPassword('')
      if (payload.email) {
        toast.success('Perfil atualizado. Recomendamos fazer login novamente para atualizar o token.')
      } else {
        toast.success('Perfil atualizado com sucesso.')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível atualizar o perfil.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeleteAccount() {
    setIsDeleting(true)
    try {
      await deleteMe()
      logoutUser()
      navigate('/login', { replace: true })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível excluir a conta.')
      setIsDeleting(false)
    }
  }

  const initials = (user?.email ?? 'U').slice(0, 2).toUpperCase()
  const roleLabel = user?.role === 'admin' ? 'Administrador' : 'Professor'

  return (
    <div style={{ padding: isMobile ? '16px 16px 40px' : '28px 32px 48px', maxWidth: 600, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.6, color: T.text, margin: 0 }}>
          Meu Perfil
        </h1>
        <p style={{ color: T.textDim, fontSize: 14, margin: '6px 0 0' }}>
          Gerencie suas informações de conta
        </p>
      </div>

      {/* Current info banner */}
      <div
        style={{
          padding: 16,
          background: T.aiBg,
          border: `1px solid ${T.aiBorder}`,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #0b1f4d, #2c1d6b)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 15,
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{user?.email}</div>
          <div style={{ fontSize: 12, color: T.textMute, marginTop: 2 }}>{roleLabel}</div>
        </div>
      </div>

      {/* Edit form */}
      <div
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: T.text, margin: '0 0 20px', letterSpacing: -0.2 }}>
          Editar informações
        </h2>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <BoldField
            T={T}
            label="NOME"
            type="text"
            value={name}
            onChange={setName}
            placeholder="Deixe em branco para não alterar (mín. 3 caracteres)"
            autoComplete="name"
          />
          <BoldField
            T={T}
            label="E-MAIL"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="prof@universidade.br"
            autoComplete="email"
          />
          <BoldField
            T={T}
            label="NOVA SENHA"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Deixe em branco para não alterar"
            autoComplete="new-password"
          />
          {password && (
            <BoldField
              T={T}
              label="CONFIRMAR NOVA SENHA"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          )}

          {error && (
            <div style={{ fontSize: 13, color: T.danger, padding: '10px 14px', background: `${T.danger}12`, borderRadius: 10, border: `1px solid ${T.danger}30` }}>
              {error}
            </div>
          )}

          <BoldBtn
            T={T}
            variant="ai"
            type="submit"
            disabled={isLoading}
            iconRight={<I.Check size={16} stroke={2.2} />}
            style={{ alignSelf: 'flex-start' }}
          >
            {isLoading ? 'Salvando…' : 'Salvar alterações'}
          </BoldBtn>
        </form>
      </div>

      {/* Danger zone */}
      <div
        style={{
          background: T.surface,
          border: `1px solid ${T.danger}30`,
          borderRadius: 16,
          padding: 24,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: T.danger, margin: '0 0 8px', letterSpacing: -0.2 }}>
          Zona de perigo
        </h2>
        <p style={{ fontSize: 13, color: T.textDim, margin: '0 0 16px' }}>
          Ao excluir sua conta, todos os seus dados serão removidos permanentemente. Esta ação não pode ser desfeita.
        </p>

        {!showDeleteConfirm ? (
          <BoldBtn T={T} variant="outline" icon={<I.Trash size={14} stroke={2} />} onClick={() => setShowDeleteConfirm(true)}>
            Excluir minha conta
          </BoldBtn>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>
              Tem certeza? Esta ação é irreversível.
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <BoldBtn T={T} variant="ghost" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting}>
                Cancelar
              </BoldBtn>
              <BoldBtn
                T={T}
                variant="outline"
                icon={<I.Trash size={14} stroke={2} />}
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                style={{ color: T.danger, borderColor: `${T.danger}60` }}
              >
                {isDeleting ? 'Excluindo…' : 'Sim, excluir conta'}
              </BoldBtn>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
