import { useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../../theme/ThemeContext'
import { BoldLogo } from '../ui/BoldLogo'
import { ThemeToggle } from '../ui/ThemeToggle'
import { I } from '../ui/icons'
import { logoutUser } from '../../api/authApi'

const TITLES: Record<string, string> = {
  '/provas': 'Minhas provas',
  '/estatisticas': 'Estatísticas',
  '/materiais': 'Materiais',
  '/banco-questoes': 'Banco de Questões',
  '/perfil': 'Meu Perfil',
  '/provas/nova': 'Nova prova',
  '/provas/nova/processando': 'Gerando…',
  '/provas/nova/revisar': 'Revisar prova',
  '/admin/usuarios': 'Usuários',
  '/admin/importar': 'Importar questões',
}

export function BoldHeader() {
  const { T } = useTheme()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const title = TITLES[pathname] ?? 'Probator·AI'

  function handleLogout() {
    logoutUser()
    navigate('/login', { replace: true })
  }

  return (
    <header
      style={{
        flexShrink: 0,
        padding: '14px 18px 12px',
        background: T.bg,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      <BoldLogo size={30} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10.5, color: T.textMute, letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 600 }}>
          Probator·AI
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3, lineHeight: 1.15, color: T.text }}>
          {title}
        </div>
      </div>

      <ThemeToggle />

      <button
        type="button"
        onClick={handleLogout}
        aria-label="Sair"
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
        }}
      >
        <I.Logout size={16} stroke={1.8} />
      </button>
    </header>
  )
}
