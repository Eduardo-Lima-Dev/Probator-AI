import { useEffect, useState } from 'react'
import { useTheme } from '../theme/ThemeContext'
import { getMaterias } from '../api/materiasApi'
import type { Materia } from '../api/materiasApi'
import { BoldBtn } from '../components/ui/BoldBtn'
import { Badge } from '../components/ui/Badge'
import { I } from '../components/ui/icons'

export function MateriaisPage() {
  const { T } = useTheme()
  const [materias, setMaterias] = useState<Materia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getMaterias()
      .then(setMaterias)
      .catch(() => setError('Não foi possível carregar as matérias.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ padding: '28px 32px 48px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Upload zone */}
      <div
        style={{
          padding: 28,
          borderRadius: 16,
          border: `2px dashed ${T.aiBorder}`,
          background: T.aiBg,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: T.aiGrad,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0,
          }}
        >
          <I.Upload size={24} stroke={2.2} />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 15.5, fontWeight: 700, letterSpacing: -0.3, color: T.text }}>
            Arraste PDFs, slides ou .docx
          </div>
          <div style={{ fontSize: 13, color: T.textDim, marginTop: 2 }}>
            A IA detecta capítulos automaticamente e sugere tópicos para suas próximas provas.
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BoldBtn T={T} variant="ai" icon={<I.Upload size={14} stroke={2.2} />} disabled>
            Selecionar arquivos
          </BoldBtn>
          <Badge T={T} />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div style={{ padding: '12px 16px', background: `${T.danger}12`, border: `1px solid ${T.danger}30`, borderRadius: 12, color: T.danger, fontSize: 13, marginBottom: 20 }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ color: T.textMute, fontSize: 14, textAlign: 'center', padding: 40 }}>Carregando matérias…</div>
      )}

      {/* Materias grid */}
      {!loading && materias.length === 0 && !error && (
        <div
          style={{
            textAlign: 'center',
            padding: 60,
            color: T.textMute,
            fontSize: 14,
            background: T.surface,
            borderRadius: 16,
            border: `1px solid ${T.border}`,
          }}
        >
          <I.Folder size={40} stroke={1.4} style={{ marginBottom: 12, display: 'block', margin: '0 auto 12px' }} />
          Nenhuma matéria encontrada.
        </div>
      )}

      {!loading && materias.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {materias.map((m) => (
            <div
              key={m.id}
              style={{
                padding: 18,
                background: T.surface,
                borderRadius: 14,
                border: `1px solid ${T.border}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: T.aiBg,
                    color: T.ai,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <I.Doc size={18} stroke={1.8} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: -0.2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: T.text,
                    }}
                  >
                    {m.name}
                  </div>
                  {m.description && (
                    <div style={{ fontSize: 11.5, color: T.textMute, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
