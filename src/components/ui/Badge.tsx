import type { BoldTokens } from '../../theme/tokens'

type BadgeProps = {
  T: BoldTokens
  label?: string
}

export function Badge({ T, label = 'Em breve' }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 20,
        padding: '0 8px',
        borderRadius: 999,
        background: `${T.warn}1a`,
        color: T.warn,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 0.3,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {label}
    </span>
  )
}
