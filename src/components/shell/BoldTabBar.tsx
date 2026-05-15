import { NavLink, useNavigate } from 'react-router-dom'
import { useTheme } from '../../theme/ThemeContext'
import { I } from '../ui/icons'
const TAB_ITEMS = [
  { to: '/provas', label: 'Provas', icon: (size: number) => <I.Doc size={size} stroke={1.8} /> },
  { to: '/estatisticas', label: 'Estatísticas', icon: (size: number) => <I.Chart size={size} stroke={1.8} /> },
  { to: '/materiais', label: 'Materiais', icon: (size: number) => <I.Folder size={size} stroke={1.8} /> },
]

export function BoldTabBar() {
  const { T } = useTheme()
  const navigate = useNavigate()

  return (
    <nav
      style={{
        flexShrink: 0,
        borderTop: `1px solid ${T.border}`,
        background: T.bg,
        display: 'flex',
        alignItems: 'center',
        padding: '8px 10px 14px',
        gap: 4,
      }}
    >
      {TAB_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/provas'}
          style={{ flex: 1, textDecoration: 'none' }}
        >
          {({ isActive }) => (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '8px 4px',
                color: isActive ? T.ai : T.textMute,
              }}
            >
              <div
                style={{
                  padding: '4px 14px',
                  borderRadius: 99,
                  background: isActive ? T.aiBg : 'transparent',
                  transition: 'all .15s',
                }}
              >
                {item.icon(20)}
              </div>
              <span style={{ fontSize: 10.5, fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
            </div>
          )}
        </NavLink>
      ))}

      {/* FAB center */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => navigate('/provas/nova')}
          aria-label="Nova prova"
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            background: T.aiGrad,
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 8px 20px rgba(124,58,237,0.38)`,
            flexShrink: 0,
          }}
        >
          <I.Plus size={20} stroke={2.2} />
        </button>
      </div>
    </nav>
  )
}
