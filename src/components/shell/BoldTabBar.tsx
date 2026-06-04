import { NavLink, useNavigate } from 'react-router-dom'
import { useTheme } from '../../theme/ThemeContext'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { I } from '../ui/icons'

const PROFESSOR_TABS = [
  { to: '/provas', label: 'Provas', icon: (size: number) => <I.Doc size={size} stroke={1.8} /> },
  { to: '/estatisticas', label: 'Stats', icon: (size: number) => <I.Chart size={size} stroke={1.8} /> },
  { to: '/materiais', label: 'Materiais', icon: (size: number) => <I.Folder size={size} stroke={1.8} /> },
  { to: '/banco-questoes', label: 'Banco', icon: (size: number) => <I.Inbox size={size} stroke={1.8} /> },
]

const ADMIN_TABS = [
  { to: '/materiais', label: 'Materiais', icon: (size: number) => <I.Folder size={size} stroke={1.8} /> },
  { to: '/banco-questoes', label: 'Banco', icon: (size: number) => <I.Inbox size={size} stroke={1.8} /> },
  { to: '/admin/usuarios', label: 'Usuários', icon: (size: number) => <I.Users size={size} stroke={1.8} /> },
  { to: '/admin/importar', label: 'Importar', icon: (size: number) => <I.Upload size={size} stroke={1.8} /> },
]

function TabItem({ item }: { item: (typeof PROFESSOR_TABS)[number] }) {
  const { T } = useTheme()
  return (
    <NavLink
      to={item.to}
      end={item.to === '/provas'}
      style={{ flex: 1, textDecoration: 'none' }}
    >
      {({ isActive }) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 4px', color: isActive ? T.ai : T.textMute }}>
          <div style={{ padding: '4px 14px', borderRadius: 99, background: isActive ? T.aiBg : 'transparent', transition: 'all .15s' }}>
            {item.icon(20)}
          </div>
          <span style={{ fontSize: 10.5, fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
        </div>
      )}
    </NavLink>
  )
}

export function BoldTabBar() {
  const { T } = useTheme()
  const navigate = useNavigate()
  const { user } = useCurrentUser()

  const isAdmin = user?.role === 'admin'
  const allTabs = isAdmin ? ADMIN_TABS : PROFESSOR_TABS
  const half = Math.floor(allTabs.length / 2)
  const leftTabs = allTabs.slice(0, half)
  const rightTabs = allTabs.slice(half)

  return (
    <nav
      style={{
        flexShrink: 0,
        borderTop: `1px solid ${T.border}`,
        background: T.bg,
        display: 'flex',
        alignItems: 'flex-end',
        padding: '0 4px 14px',
        position: 'relative',
      }}
    >
      {isAdmin ? (
        /* Admin: abas distribuídas uniformemente, sem FAB */
        allTabs.map((item) => <TabItem key={item.to} item={item} />)
      ) : (
        /* Professor: 2 abas | FAB central | 2 abas */
        <>
          <div style={{ flex: 1, display: 'flex' }}>
            {leftTabs.map((item) => <TabItem key={item.to} item={item} />)}
          </div>

          <div style={{ width: 72, flexShrink: 0 }} />

          <div style={{ flex: 1, display: 'flex' }}>
            {rightTabs.map((item) => <TabItem key={item.to} item={item} />)}
          </div>

          <button
            type="button"
            onClick={() => navigate('/provas/nova')}
            aria-label="Nova prova"
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              transform: 'translate(-50%, -38%)',
              width: 54,
              height: 54,
              borderRadius: 18,
              background: T.aiGrad,
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px rgba(124,58,237,0.45)`,
              zIndex: 10,
            }}
          >
            <I.Plus size={22} stroke={2.2} />
          </button>
        </>
      )}
    </nav>
  )
}
