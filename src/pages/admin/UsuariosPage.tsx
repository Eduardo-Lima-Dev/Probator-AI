import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../theme/ThemeContext'
import { useIsMobile } from '../../hooks/useIsMobile'
import { getAllUsers, deleteUserById } from '../../api/userApi'
import type { AdminUser } from '../../api/userApi'
import { BoldBtn } from '../../components/ui/BoldBtn'
import { I } from '../../components/ui/icons'
import { useToast } from '../../components/ui/Toast'

export function UsuariosPage() {
  const { T } = useTheme()
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const toast = useToast()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  function loadUsers() {
    setLoading(true)
    setError('')
    getAllUsers()
      .then(setUsers)
      .catch(() => setError('Não foi possível carregar os usuários.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadUsers() }, [])

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await deleteUserById(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
      toast.success('Usuário excluído com sucesso.')
    } catch {
      toast.error('Não foi possível excluir o usuário.')
    } finally {
      setDeletingId(null)
      setConfirmDeleteId(null)
    }
  }

  const pad = isMobile ? '16px 16px 40px' : '28px 32px 48px'

  return (
    <div style={{ padding: pad, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: `${T.ai}18`, color: T.ai, letterSpacing: 0.4, textTransform: 'uppercase' }}>Admin</span>
          <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, letterSpacing: -0.6, color: T.text, margin: '6px 0 2px' }}>Usuários</h1>
          <p style={{ color: T.textDim, fontSize: 13, margin: 0 }}>
            {loading ? 'Carregando…' : `${users.length} usuário(s) cadastrado(s)`}
          </p>
        </div>
        <BoldBtn T={T} size="sm" variant="light" icon={<I.Refresh size={13} stroke={2} />} onClick={loadUsers} disabled={loading}>
          Atualizar
        </BoldBtn>
      </div>

      {error && <div style={{ padding: '12px 16px', background: `${T.danger}12`, border: `1px solid ${T.danger}30`, borderRadius: 12, color: T.danger, fontSize: 13, marginBottom: 16 }}>{error}</div>}
      {loading && <div style={{ color: T.textMute, fontSize: 14, textAlign: 'center', padding: 60, background: T.surface, borderRadius: 16, border: `1px solid ${T.border}` }}>Carregando usuários…</div>}
      {!loading && users.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: 60, color: T.textMute, fontSize: 14, background: T.surface, borderRadius: 16, border: `1px solid ${T.border}` }}>
          <I.Users size={36} stroke={1.4} style={{ display: 'block', margin: '0 auto 12px' }} />
          Nenhum usuário encontrado.
        </div>
      )}

      {!loading && users.length > 0 && (
        isMobile ? (
          /* Mobile: cards */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {users.map((u) => (
              <div key={u.id} style={{ background: T.surface, borderRadius: 14, border: `1px solid ${confirmDeleteId === u.id ? `${T.danger}40` : T.border}`, padding: '14px 16px', transition: 'border-color .15s' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {u.name ?? <span style={{ color: T.textMute, fontStyle: 'italic' }}>Sem nome</span>}
                    </div>
                    <div style={{ fontSize: 12.5, color: T.textDim, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                    {u.materias?.length > 0 && (
                      <div style={{ fontSize: 12, color: T.textMute, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {u.materias.map((m) => m.name).join(', ')}
                      </div>
                    )}
                  </div>
                  <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: u.role === 'admin' ? `${T.ai}18` : `${T.success}18`, color: u.role === 'admin' ? T.ai : T.success, flexShrink: 0 }}>
                    {u.role}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {confirmDeleteId === u.id ? (
                    <>
                      <BoldBtn T={T} size="sm" variant="ghost" onClick={() => setConfirmDeleteId(null)} disabled={deletingId === u.id}>Cancelar</BoldBtn>
                      <BoldBtn T={T} size="sm" variant="outline" icon={<I.Trash size={12} stroke={2} />} onClick={() => handleDelete(u.id)} disabled={deletingId === u.id} style={{ color: T.danger, borderColor: `${T.danger}60` }}>
                        {deletingId === u.id ? '…' : 'Confirmar'}
                      </BoldBtn>
                    </>
                  ) : (
                    <>
                      <BoldBtn T={T} size="sm" variant="light" icon={<I.Edit size={12} stroke={2} />} onClick={() => navigate(`/admin/usuarios/${u.id}`)}>Editar</BoldBtn>
                      <BoldBtn T={T} size="sm" variant="light" icon={<I.Trash size={12} stroke={2} />} onClick={() => setConfirmDeleteId(u.id)} style={{ color: T.danger }}>Excluir</BoldBtn>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop: table */
          <div style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 110px 1fr 150px', padding: '10px 20px', borderBottom: `1px solid ${T.border}`, fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: 0.4, textTransform: 'uppercase' }}>
              <span>Nome</span><span>E-mail</span><span>Papel</span><span>Matérias</span><span style={{ textAlign: 'right' }}>Ações</span>
            </div>
            {users.map((u, idx) => (
              <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 110px 1fr 150px', padding: '14px 20px', borderBottom: idx < users.length - 1 ? `1px solid ${T.border}` : 'none', alignItems: 'center', background: confirmDeleteId === u.id ? `${T.danger}06` : 'transparent', transition: 'background .15s' }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 12 }}>
                  {u.name ?? <span style={{ color: T.textMute, fontStyle: 'italic', fontWeight: 400 }}>—</span>}
                </span>
                <span style={{ fontSize: 13, color: T.textDim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 12 }}>{u.email}</span>
                <span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: u.role === 'admin' ? `${T.ai}18` : `${T.success}18`, color: u.role === 'admin' ? T.ai : T.success }}>
                    {u.role === 'admin' ? 'admin' : 'professor'}
                  </span>
                </span>
                <span style={{ fontSize: 12, color: T.textDim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 12 }}>
                  {u.materias?.length ? u.materias.map((m) => m.name).join(', ') : <span style={{ color: T.textMute }}>—</span>}
                </span>
                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                  {confirmDeleteId === u.id ? (
                    <>
                      <BoldBtn T={T} size="sm" variant="ghost" onClick={() => setConfirmDeleteId(null)} disabled={deletingId === u.id}>Cancelar</BoldBtn>
                      <BoldBtn T={T} size="sm" variant="outline" icon={<I.Trash size={12} stroke={2} />} onClick={() => handleDelete(u.id)} disabled={deletingId === u.id} style={{ color: T.danger, borderColor: `${T.danger}60` }}>
                        {deletingId === u.id ? '…' : 'Confirmar'}
                      </BoldBtn>
                    </>
                  ) : (
                    <>
                      <BoldBtn T={T} size="sm" variant="light" icon={<I.Edit size={12} stroke={2} />} onClick={() => navigate(`/admin/usuarios/${u.id}`)}>Editar</BoldBtn>
                      <BoldBtn T={T} size="sm" variant="light" icon={<I.Trash size={12} stroke={2} />} onClick={() => setConfirmDeleteId(u.id)} style={{ color: T.danger }}>Excluir</BoldBtn>
                    </>
                  )}
                </div>
              </div>
            ))}
            <p style={{ fontSize: 11, color: T.textMute, margin: '8px 20px', textAlign: 'right' }}>* Senhas não são exibidas por segurança.</p>
          </div>
        )
      )}
    </div>
  )
}
