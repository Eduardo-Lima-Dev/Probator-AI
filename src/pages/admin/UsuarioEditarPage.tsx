import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../../theme/ThemeContext'
import { useIsMobile } from '../../hooks/useIsMobile'
import { getUserById, updateUserById, deleteUserById } from '../../api/userApi'
import type { AdminUser } from '../../api/userApi'
import { BoldBtn } from '../../components/ui/BoldBtn'
import { BoldField } from '../../components/ui/BoldField'
import { I } from '../../components/ui/icons'

export function UsuarioEditarPage() {
  const { T } = useTheme()
  const isMobile = useIsMobile()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [user, setUser] = useState<AdminUser | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    if (!id) return
    setLoadingUser(true)
    getUserById(id)
      .then((u) => {
        setUser(u)
        setName(u.name ?? '')
        setEmail(u.email)
      })
      .catch(() => setLoadError('Não foi possível carregar o usuário.'))
      .finally(() => setLoadingUser(false))
  }, [id])

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!id) return
    setError('')
    setSuccess('')

    if (password && password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }
    if (password && password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    const payload: { name?: string; email?: string; password?: string } = {}
    if (name.trim() !== (user?.name ?? '') && name.trim().length >= 3) payload.name = name.trim()
    if (email !== user?.email) payload.email = email
    if (password) payload.password = password

    if (Object.keys(payload).length === 0) {
      setError('Nenhuma alteração para salvar.')
      return
    }

    setIsLoading(true)
    try {
      const updated = await updateUserById(id, payload)
      setUser(updated)
      setPassword('')
      setConfirmPassword('')
      setSuccess('Usuário atualizado com sucesso.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível atualizar o usuário.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (!id) return
    setIsDeleting(true)
    setDeleteError('')
    try {
      await deleteUserById(id)
      navigate('/admin/usuarios', { replace: true })
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Não foi possível excluir o usuário.')
      setIsDeleting(false)
    }
  }

  if (loadingUser) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: T.textMute, fontSize: 14 }}>
        Carregando…
      </div>
    )
  }

  if (loadError || !user) {
    return (
      <div style={{ padding: isMobile ? '16px' : '28px 32px' }}>
        <button
          type="button"
          onClick={() => navigate('/admin/usuarios')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: T.textDim, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 500, padding: 0, marginBottom: 16 }}
        >
          <I.ArrowLeft size={14} stroke={2} />
          Voltar
        </button>
        <div style={{ padding: '12px 16px', background: `${T.danger}12`, border: `1px solid ${T.danger}30`, borderRadius: 12, color: T.danger, fontSize: 13 }}>
          {loadError || 'Usuário não encontrado.'}
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: isMobile ? '16px 16px 40px' : '28px 32px 48px', maxWidth: 600, margin: '0 auto' }}>
      {/* Back button + header */}
      <div style={{ marginBottom: 24 }}>
        <button
          type="button"
          onClick={() => navigate('/admin/usuarios')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: T.textDim, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 500, padding: 0, marginBottom: 16 }}
        >
          <I.ArrowLeft size={14} stroke={2} />
          Voltar para usuários
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: `${T.ai}18`, color: T.ai, letterSpacing: 0.4, textTransform: 'uppercase' }}>
            Admin
          </span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              background: user.role === 'admin' ? `${T.ai}18` : `${T.success}18`,
              color: user.role === 'admin' ? T.ai : T.success,
            }}
          >
            {user.role}
          </span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.6, color: T.text, margin: 0 }}>
          Editar usuário
        </h1>
        <p style={{ color: T.textDim, fontSize: 14, margin: '4px 0 0' }}>{user.email}</p>
      </div>

      {/* Edit form */}
      <div
        style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, marginBottom: 24 }}
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <BoldField
            T={T}
            label="NOME"
            type="text"
            value={name}
            onChange={setName}
            placeholder="Nome completo"
            autoComplete="name"
          />
          <BoldField
            T={T}
            label="E-MAIL"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="prof@universidade.br"
            required
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
          {success && (
            <div style={{ fontSize: 13, color: T.success, padding: '10px 14px', background: `${T.success}12`, borderRadius: 10, border: `1px solid ${T.success}30` }}>
              {success}
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

      {/* Matérias info */}
      {user.materias?.length > 0 && (
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, marginBottom: 24 }}>
          <h2 style={{ fontSize: 11, fontWeight: 700, color: T.textMute, margin: '0 0 12px', letterSpacing: 0.4, textTransform: 'uppercase' }}>
            Matérias
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {user.materias.map((m) => (
              <span
                key={m.id}
                style={{ padding: '4px 10px', borderRadius: 8, background: T.aiBg, color: T.ai, fontSize: 12, fontWeight: 500 }}
              >
                {m.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Danger zone */}
      <div style={{ background: T.surface, border: `1px solid ${T.danger}30`, borderRadius: 16, padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: T.danger, margin: '0 0 8px', letterSpacing: -0.2 }}>
          Zona de perigo
        </h2>
        <p style={{ fontSize: 13, color: T.textDim, margin: '0 0 16px' }}>
          Ao excluir este usuário, todos os seus dados serão removidos permanentemente.
        </p>

        {deleteError && (
          <div style={{ fontSize: 13, color: T.danger, padding: '10px 14px', background: `${T.danger}12`, borderRadius: 10, border: `1px solid ${T.danger}30`, marginBottom: 12 }}>
            {deleteError}
          </div>
        )}

        {!showDeleteConfirm ? (
          <BoldBtn T={T} variant="outline" icon={<I.Trash size={14} stroke={2} />} onClick={() => setShowDeleteConfirm(true)}>
            Excluir usuário
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
                onClick={handleDelete}
                disabled={isDeleting}
                style={{ color: T.danger, borderColor: `${T.danger}60` }}
              >
                {isDeleting ? 'Excluindo…' : 'Sim, excluir'}
              </BoldBtn>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
