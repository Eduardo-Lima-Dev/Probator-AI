import { useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import type { BoldTokens } from '../../theme/tokens'
import { I } from './icons'

type BoldFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  T: BoldTokens
  label?: string
  value: string
  onChange: (val: string) => void
  prefix?: ReactNode
  suffix?: ReactNode
  error?: string
}

export function BoldField({ T, label, value, onChange, type = 'text', placeholder, prefix, suffix, error, disabled, required, id, autoComplete }: BoldFieldProps) {
  const [focus, setFocus] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPw ? 'text' : 'password') : type

  return (
    <label style={{ display: 'block' }} htmlFor={id}>
      {label && (
        <div style={{ fontSize: 12, color: T.textDim, marginBottom: 7, fontWeight: 600, letterSpacing: 0.2 }}>
          {label}
          {required && <span style={{ color: T.danger, marginLeft: 2 }}>*</span>}
        </div>
      )}
      <div
        style={{
          minHeight: 50,
          padding: '0 14px',
          background: T.surface,
          borderRadius: 12,
          border: `1.5px solid ${error ? T.danger : focus ? T.ai : T.border}`,
          boxShadow: focus ? `0 0 0 4px ${T.aiBg}` : 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          transition: 'all .15s',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {prefix}
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: T.text,
            fontSize: 15,
            fontFamily: 'inherit',
            fontWeight: 500,
            padding: '12px 0',
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw((p) => !p)}
            aria-label={showPw ? 'Ocultar senha' : 'Mostrar senha'}
            style={{
              background: 'transparent',
              border: 'none',
              color: T.textMute,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 0,
              flexShrink: 0,
            }}
          >
            {showPw ? <I.EyeOff size={16} /> : <I.Eye size={16} />}
          </button>
        )}
        {suffix}
      </div>
      {error && (
        <div style={{ fontSize: 11.5, color: T.danger, marginTop: 4 }}>{error}</div>
      )}
    </label>
  )
}
