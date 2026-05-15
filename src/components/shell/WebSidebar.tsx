import { NavLink, useNavigate } from 'react-router-dom'
import { useTheme } from '../../theme/ThemeContext'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { BoldLogo } from '../ui/BoldLogo'
import { I } from '../ui/icons'
import { logoutUser } from '../../api/authApi'

const NAV_ITEMS = [
  { to: '/provas', label: 'Provas', icon: (size: number) => <I.Doc size={size} stroke={1.8} /> },
  { to: '/estatisticas', label: 'Estatísticas', icon: (size: number) => <I.Chart size={size} stroke={1.8} /> },
  { to: '/materiais', label: 'Materiais', icon: (size: number) => <I.Folder size={size} stroke={1.8} /> },
]

const TURMA_COLORS = ['#7c3aed', '#0ea5e9', '#f59e0b', '#16a34a']

export function WebSidebar() {
  const { T } = useTheme()
  const { user } = useCurrentUser()
  const navigate = useNavigate()

  const displayName = user?.email ? user.email.split('@')[0] : 'Usuário'
  const displayInstitution = user?.role ?? ''
  const initials = displayName.slice(0, 2).toUpperCase()

  function handleLogout() {
    logoutUser()
    navigate('/login', { replace: true })
  }

  return (
    <aside
      style={{
        width: 216,
        flexShrink: 0,
        background: T.surface,
        borderRight: `1px solid ${T.border}`,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 14px',
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 22px' }}>
        <BoldLogo size={32} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: -0.3, color: T.text }}>Probator·AI</div>
          <div style={{ fontSize: 10.5, color: T.textMute, letterSpacing: 0.3, textTransform: 'uppercase', fontWeight: 600 }}>Versão Pro</div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/provas'}
            style={({ isActive }) => ({
              padding: '10px 12px',
              borderRadius: 10,
              background: isActive ? T.aiBg : 'transparent',
              color: isActive ? T.ai : T.textDim,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              fontSize: 13.5,
              fontWeight: isActive ? 600 : 500,
              transition: 'all .12s',
            })}
          >
            {({ isActive }) => (
              <>
                <span style={{ color: isActive ? T.ai : T.textDim }}>
                  {item.icon(18)}
                </span>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Turmas */}
      <div style={{ marginTop: 22, padding: '0 4px' }}>
        <div
          style={{
            fontSize: 10.5,
            color: T.textMute,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            fontWeight: 700,
            padding: '0 8px 8px',
          }}
        >
          Turmas
        </div>
        {['MAT001-A · Cálculo I', 'HIS204-B · História', 'QUI101-C · Química', 'CC201-A · Algoritmos'].map(
          (t, i) => (
            <button
              key={t}
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                width: '100%',
                padding: '8px 10px',
                borderRadius: 8,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                color: T.textDim,
                fontSize: 12.5,
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: TURMA_COLORS[i],
                  flexShrink: 0,
                }}
              />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t}</span>
            </button>
          ),
        )}
      </div>

      {/* User card */}
      <div
        style={{
          marginTop: 'auto',
          padding: 12,
          background: T.surfaceAlt,
          borderRadius: 12,
          border: `1px solid ${T.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #0b1f4d, #2c1d6b)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 12,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: T.text,
              }}
            >
              {displayName}
            </div>
            <div
              style={{
                fontSize: 11,
                color: T.textMute,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {displayInstitution}
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Sair"
            style={{
              background: 'transparent',
              border: 'none',
              color: T.textMute,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 4,
              borderRadius: 6,
            }}
          >
            <I.Logout size={14} stroke={1.8} />
          </button>
        </div>
      </div>
    </aside>
  )
}
