import type { BoldTokens } from '../../theme/tokens'
import type { ExamStatus } from '../../api/examsApi'

const LABEL: Record<ExamStatus, string> = {
  draft: 'Rascunho',
  generated: 'Gerada',
  archived: 'Arquivada',
}

const STYLE: Record<ExamStatus, (T: BoldTokens) => { c: string; bg: string }> = {
  draft: (T) => ({ c: T.warn, bg: 'rgba(217,119,6,0.10)' }),
  generated: (T) => ({ c: T.primaryAlt, bg: 'rgba(29,78,216,0.10)' }),
  archived: (T) => ({ c: T.success, bg: 'rgba(22,163,74,0.10)' }),
}

type StatusPillProps = {
  T: BoldTokens
  status: ExamStatus
}

export function StatusPill({ T, status }: StatusPillProps) {
  const m = STYLE[status]?.(T) ?? { c: T.textMute, bg: T.surfaceAlt }

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
      {LABEL[status] ?? status}
    </span>
  )
}
