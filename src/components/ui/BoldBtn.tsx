import { useState } from 'react'
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import type { BoldTokens } from '../../theme/tokens'

type Variant = 'primary' | 'ai' | 'ghost' | 'outline' | 'light' | 'success'
type Size = 'sm' | 'md' | 'lg'

type BoldBtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  T: BoldTokens
  variant?: Variant
  size?: Size
  icon?: ReactNode
  iconRight?: ReactNode
  style?: CSSProperties
}

const SIZES: Record<Size, { h: number; px: number; fs: number; gap: number; fw: number }> = {
  sm: { h: 34, px: 12, fs: 13, gap: 6, fw: 500 },
  md: { h: 44, px: 16, fs: 14, gap: 8, fw: 600 },
  lg: { h: 54, px: 22, fs: 15.5, gap: 10, fw: 600 },
}

export function BoldBtn({
  T,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  children,
  onClick,
  disabled,
  style,
  type = 'button',
  ...rest
}: BoldBtnProps) {
  const [hov, setHov] = useState(false)

  const palettes: Record<Variant, { bg: string; fg: string; bd: string }> = {
    primary: { bg: T.text, fg: T.bg, bd: T.text },
    ai: { bg: T.aiGrad, fg: '#fff', bd: 'transparent' },
    ghost: { bg: 'transparent', fg: T.text, bd: 'transparent' },
    outline: { bg: T.surface, fg: T.text, bd: T.borderStrong },
    light: { bg: T.surfaceAlt, fg: T.text, bd: 'transparent' },
    success: { bg: T.success, fg: '#fff', bd: 'transparent' },
  }

  const p = palettes[variant]
  const s = SIZES[size]
  const isAI = variant === 'ai'

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      disabled={disabled}
      style={{
        height: s.h,
        padding: `0 ${s.px}px`,
        background: p.bg,
        color: p.fg,
        border: `1px solid ${p.bd}`,
        borderRadius: 14,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        fontSize: s.fs,
        fontWeight: s.fw,
        fontFamily: 'inherit',
        letterSpacing: -0.1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'transform .12s, box-shadow .12s, opacity .12s',
        transform: hov && !disabled ? 'translateY(-1px)' : 'none',
        boxShadow: isAI
          ? `0 10px 24px rgba(124,58,237,${hov ? 0.45 : 0.32})`
          : hov && !disabled
            ? '0 6px 20px rgba(0,0,0,0.10)'
            : 'none',
        opacity: disabled ? 0.55 : 1,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        ...style,
      }}
      {...rest}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  )
}
