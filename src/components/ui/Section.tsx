import type { ReactNode } from 'react'
import type { BoldTokens } from '../../theme/tokens'

type SectionProps = {
  T: BoldTokens
  title: string
  hint?: string
  children: ReactNode
}

export function Section({ T, title, hint, children }: SectionProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 7,
        }}
      >
        <div
          style={{
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            color: T.textDim,
          }}
        >
          {title}
        </div>
        {hint && <span style={{ fontSize: 10.5, color: T.textMute }}>{hint}</span>}
      </div>
      {children}
    </div>
  )
}
