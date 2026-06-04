import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useTheme } from '../theme/ThemeContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { getMaterias, getMateriaById, createMateria, updateMateria, deleteMateria } from '../api/materiasApi'
import type { Materia } from '../api/materiasApi'
import { BoldBtn } from '../components/ui/BoldBtn'
import { BoldField } from '../components/ui/BoldField'
import { I } from '../components/ui/icons'

export function MateriaisPage() {
  const { T } = useTheme()
  const isMobile = useIsMobile()
  const { user } = useCurrentUser()
  const isAdmin = user?.role === 'admin'

  const [materias, setMaterias] = useState<Materia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Detail modal (professor view)
  const [selectedMateria, setSelectedMateria] = useState<Materia | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  // Create / Edit modal
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState<Materia | null>(null)
  const [formName, setFormName] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  // Delete
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { loadMaterias() }, [])

  function loadMaterias() {
    setLoading(true)
    getMaterias()
      .then(setMaterias)
      .catch(() => setError('Não foi possível carregar as matérias.'))
      .finally(() => setLoading(false))
  }

  function openCreate() {
    setEditTarget(null)
    setFormName('')
    setFormDesc('')
    setFormError('')
    setShowForm(true)
  }

  function openEdit(m: Materia, e: React.MouseEvent) {
    e.stopPropagation()
    setEditTarget(m)
    setFormName(m.name)
    setFormDesc(m.description ?? '')
    setFormError('')
    setShowForm(true)
  }

  function handleCardClick(id: string) {
    if (isAdmin) return // admin usa botões inline, não o modal de detalhe
    setLoadingDetail(true)
    getMateriaById(id)
      .then(setSelectedMateria)
      .catch(() => { const f = materias.find((m) => m.id === id) ?? null; setSelectedMateria(f) })
      .finally(() => setLoadingDetail(false))
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!formName.trim()) return
    setSaving(true)
    setFormError('')
    try {
      const payload = { name: formName.trim(), ...(formDesc.trim() && { description: formDesc.trim() }) }
      if (editTarget) {
        const updated = await updateMateria(editTarget.id, payload)
        setMaterias((prev) => prev.map((m) => m.id === updated.id ? updated : m))
      } else {
        const created = await createMateria(payload)
        setMaterias((prev) => [...prev, created])
      }
      setShowForm(false)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar matéria.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setDeleting(true)
    try {
      await deleteMateria(id)
      setMaterias((prev) => prev.filter((m) => m.id !== id))
      setConfirmDeleteId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível excluir a matéria.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div style={{ padding: isMobile ? '16px 16px 40px' : '28px 32px 48px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5, color: T.text, margin: 0 }}>Materiais</h1>
          <p style={{ color: T.textDim, fontSize: 14, margin: '4px 0 0' }}>Matérias cadastradas na plataforma</p>
        </div>
        {isAdmin && (
          <BoldBtn T={T} variant="ai" icon={<I.Plus size={13} stroke={2.2} />} onClick={openCreate}>
            Nova matéria
          </BoldBtn>
        )}
      </div>

      {error && <div style={{ padding: '12px 16px', background: `${T.danger}12`, border: `1px solid ${T.danger}30`, borderRadius: 12, color: T.danger, fontSize: 13, marginBottom: 20 }}>{error}</div>}
      {loading && <div style={{ color: T.textMute, fontSize: 14, textAlign: 'center', padding: 40 }}>Carregando matérias…</div>}

      {!loading && materias.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: 60, color: T.textMute, fontSize: 14, background: T.surface, borderRadius: 16, border: `1px solid ${T.border}` }}>
          <I.Folder size={40} stroke={1.4} style={{ display: 'block', margin: '0 auto 12px' }} />
          Nenhuma matéria cadastrada.
          {isAdmin && (
            <div style={{ marginTop: 12 }}>
              <BoldBtn T={T} variant="ai" icon={<I.Plus size={13} stroke={2.2} />} onClick={openCreate}>Nova matéria</BoldBtn>
            </div>
          )}
        </div>
      )}

      {/* Grid */}
      {!loading && materias.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {materias.map((m) => (
            <div
              key={m.id}
              onClick={() => handleCardClick(m.id)}
              style={{
                padding: 18,
                background: T.surface,
                borderRadius: 14,
                border: `1px solid ${confirmDeleteId === m.id ? `${T.danger}50` : T.border}`,
                cursor: isAdmin ? 'default' : 'pointer',
                transition: 'border-color .15s, box-shadow .15s',
              }}
              onMouseEnter={(e) => { if (!isAdmin) { e.currentTarget.style.borderColor = T.aiBorder; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)' } }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = confirmDeleteId === m.id ? `${T.danger}50` : T.border; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: T.aiBg, color: T.ai, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <I.Doc size={18} stroke={1.8} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: -0.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: T.text }}>{m.name}</div>
                  {m.description && <div style={{ fontSize: 11.5, color: T.textMute, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.description}</div>}
                </div>
              </div>

              {/* Admin actions */}
              {isAdmin && (
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${T.border}`, display: 'flex', gap: 6 }}>
                  {confirmDeleteId === m.id ? (
                    <>
                      <BoldBtn T={T} size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null) }} disabled={deleting}>Cancelar</BoldBtn>
                      <BoldBtn T={T} size="sm" variant="outline" icon={<I.Trash size={11} stroke={2} />} onClick={(e) => { e.stopPropagation(); handleDelete(m.id) }} disabled={deleting} style={{ color: T.danger, borderColor: `${T.danger}60` }}>
                        {deleting ? '…' : 'Confirmar'}
                      </BoldBtn>
                    </>
                  ) : (
                    <>
                      <BoldBtn T={T} size="sm" variant="light" icon={<I.Edit size={11} stroke={2} />} onClick={(e) => openEdit(m, e)}>Editar</BoldBtn>
                      <BoldBtn T={T} size="sm" variant="light" icon={<I.Trash size={11} stroke={2} />} onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(m.id) }} style={{ color: T.danger }}>Excluir</BoldBtn>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Detail modal (professor) */}
      {(loadingDetail || selectedMateria) && (
        <div onClick={() => setSelectedMateria(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: T.surface, borderRadius: 20, border: `1px solid ${T.border}`, padding: 28, maxWidth: 440, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
            {loadingDetail ? <div style={{ color: T.textMute, fontSize: 14, textAlign: 'center', padding: 20 }}>Carregando…</div> : selectedMateria && (
              <>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: T.aiBg, color: T.ai, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <I.Doc size={22} stroke={1.8} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: T.text, margin: '0 0 4px', letterSpacing: -0.3 }}>{selectedMateria.name}</h2>
                    <div style={{ fontSize: 11, color: T.textMute, fontFamily: 'monospace' }}>{selectedMateria.id}</div>
                  </div>
                  <button type="button" onClick={() => setSelectedMateria(null)} style={{ background: 'transparent', border: 'none', color: T.textMute, cursor: 'pointer', padding: 4 }}><I.Close size={18} stroke={2} /></button>
                </div>
                {selectedMateria.description
                  ? <p style={{ fontSize: 14, color: T.textDim, lineHeight: 1.6, margin: 0 }}>{selectedMateria.description}</p>
                  : <p style={{ fontSize: 14, color: T.textMute, fontStyle: 'italic', margin: 0 }}>Sem descrição cadastrada.</p>
                }
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
                  <BoldBtn T={T} variant="ghost" onClick={() => setSelectedMateria(null)} style={{ width: '100%' }}>Fechar</BoldBtn>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Create / Edit modal (admin) */}
      {showForm && (
        <div onClick={() => !saving && setShowForm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: T.surface, borderRadius: 20, border: `1px solid ${T.border}`, padding: 28, maxWidth: 420, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: T.text }}>
                {editTarget ? 'Editar matéria' : 'Nova matéria'}
              </h2>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', color: T.textMute, cursor: 'pointer' }}><I.Close size={18} stroke={2} /></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <BoldField T={T} label="NOME" type="text" value={formName} onChange={setFormName} placeholder="Ex.: Cálculo I" required />
              <label style={{ display: 'block' }}>
                <div style={{ fontSize: 12, color: T.textDim, marginBottom: 7, fontWeight: 600, letterSpacing: 0.2 }}>DESCRIÇÃO <span style={{ fontSize: 10.5, color: T.textMute, fontWeight: 400 }}>opcional</span></div>
                <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="Conteúdos abordados nesta matéria…" style={{ width: '100%', minHeight: 80, padding: '12px 14px', fontFamily: 'inherit', fontSize: 13.5, background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 12, color: T.text, resize: 'vertical', outline: 'none', lineHeight: 1.5, boxSizing: 'border-box' }} />
              </label>
              {formError && <div style={{ fontSize: 13, color: T.danger, padding: '10px 14px', background: `${T.danger}12`, borderRadius: 10 }}>{formError}</div>}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <BoldBtn T={T} variant="ghost" type="button" onClick={() => setShowForm(false)} disabled={saving}>Cancelar</BoldBtn>
                <BoldBtn T={T} variant="ai" type="submit" disabled={saving} iconRight={<I.Check size={14} stroke={2.4} />}>
                  {saving ? 'Salvando…' : editTarget ? 'Salvar' : 'Criar matéria'}
                </BoldBtn>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
