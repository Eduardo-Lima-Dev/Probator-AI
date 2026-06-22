import { useEffect, useState } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import { useTheme } from '../../theme/ThemeContext'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { BoldLogo } from '../ui/BoldLogo'
import { I } from '../ui/icons'
import { logoutUser } from '../../api/authApi'
import { getHealth } from '../../api/healthApi'

const PROFESSOR_NAV = [
  { to: '/provas', label: 'Provas', icon: (size: number) => <I.Doc size={size} stroke={1.8} /> },
  { to: '/estatisticas', label: 'Estatísticas', icon: (size: number) => <I.Chart size={size} stroke={1.8} /> },
  { to: '/materiais', label: 'Materiais', icon: (size: number) => <I.Folder size={size} stroke={1.8} /> },
  { to: '/banco-questoes', label: 'Banco', icon: (size: number) => <I.Inbox size={size} stroke={1.8} /> },
]

const ADMIN_NAV = [
  { to: '/materiais', label: 'Materiais', icon: (size: number) => <I.Folder size={size} stroke={1.8} /> },
  { to: '/banco-questoes', label: 'Banco', icon: (size: number) => <I.Inbox size={size} stroke={1.8} /> },
  { to: '/admin/usuarios', label: 'Usuários', icon: (size: number) => <I.Users size={size} stroke={1.8} /> },
  { to: '/admin/importar', label: 'Importar', icon: (size: number) => <I.Upload size={size} stroke={1.8} /> },
]

const TURMA_COLORS = ['#7c3aed', '#0ea5e9', '#f59e0b', '#16a34a']

export function WebSidebar() {
  const { T } = useTheme()
  const { user } = useCurrentUser()
  const navigate = useNavigate()
  const [apiOnline, setApiOnline] = useState<boolean | null>(null)

  useEffect(() => {
    getHealth()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false))
  }, [])

  const navItems = user?.role === 'admin' ? ADMIN_NAV : PROFESSOR_NAV

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
        {navItems.map((item) => (
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

      {/* API health indicator */}
      <div style={{ marginTop: 'auto', paddingBottom: 8, display: 'flex', alignItems: 'center', gap: 6, padding: '12px 4px 8px' }}>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            flexShrink: 0,
            background: apiOnline === null ? T.textMute : apiOnline ? T.success : T.danger,
          }}
        />
        <span style={{ fontSize: 11, color: T.textMute }}>
          {apiOnline === null ? 'Verificando API…' : apiOnline ? 'API online' : 'API offline'}
        </span>
      </div>

      {/* User card */}
      <div
        style={{
          padding: 12,
          background: T.surfaceAlt,
          borderRadius: 12,
          border: `1px solid ${T.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Clickable profile area */}
          <Link
            to="/perfil"
            style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0, textDecoration: 'none' }}
          >
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
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Sair"
            style={{
              background: T.surfaceAlt,
              border: `1px solid ${T.border}`,
              color: T.textDim,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 9px',
              borderRadius: 8,
              flexShrink: 0,
              fontFamily: 'inherit',
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            <I.Logout size={13} stroke={1.8} />
            Sair
          </button>
        </div>
      </div>
    </aside>
  )
}
