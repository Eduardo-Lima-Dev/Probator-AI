import type { BoldTokens } from '../../theme/tokens'
import type { ProvaStatus } from '../../mocks/provas'

type StatusPillProps = {
  T: BoldTokens
  status: ProvaStatus
}

export function StatusPill({ T, status }: StatusPillProps) {
  const map: Record<ProvaStatus, { c: string; bg: string }> = {
    Aplicada: { c: T.success, bg: 'rgba(22,163,74,0.10)' },
    Gerada: { c: T.primaryAlt, bg: 'rgba(29,78,216,0.10)' },
    Rascunho: { c: T.warn, bg: 'rgba(217,119,6,0.10)' },
  }
  const m = map[status]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 24,
        padding: '0 10px',
        borderRadius: 99,
        background: m.bg,
        color: m.c,
        fontSize: 11.5,
        fontWeight: 600,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 99, background: m.c, flexShrink: 0 }} />
      {status}
    </span>
  )
}
