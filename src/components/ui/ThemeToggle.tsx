import { useTheme } from '../../theme/ThemeContext'
import { I } from './icons'

type ThemeToggleProps = {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { dark, toggle, T } = useTheme()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Alternar tema"
      className={className}
      style={{
        width: 38,
        height: 38,
        borderRadius: 12,
        background: T.surface,
        border: `1px solid ${T.border}`,
        color: T.textDim,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'background .15s, color .15s',
      }}
    >
      {dark ? <I.Sun size={16} /> : <I.Moon size={16} />}
    </button>
  )
}
