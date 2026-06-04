import type { ReactNode } from 'react'
import type { BoldTokens } from '../../theme/tokens'

type BoldChipProps = {
  T: BoldTokens
  active?: boolean
  children: ReactNode
  onClick?: () => void
  accent?: string
  size?: 'sm' | 'md'
}

export function BoldChip({ T, active, children, onClick, accent, size = 'md' }: BoldChipProps) {
  const sz = size === 'sm' ? { h: 28, px: 10, fs: 12 } : { h: 34, px: 13, fs: 13 }

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: sz.h,
        padding: `0 ${sz.px}px`,
        borderRadius: 999,
        background: active ? (accent ?? T.ai) : T.surface,
        color: active ? '#fff' : T.textDim,
        border: `1px solid ${active ? (accent ?? T.ai) : T.border}`,
        fontSize: sz.fs,
        fontWeight: active ? 600 : 500,
        fontFamily: 'inherit',
        cursor: 'pointer',
        transition: 'all .12s',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  )
}
