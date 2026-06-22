import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../../theme/ThemeContext'
import { BoldBtn } from '../ui/BoldBtn'
import { ThemeToggle } from '../ui/ThemeToggle'
import { I } from '../ui/icons'

const TITLES: Record<string, { t: string; s: string }> = {
  '/provas': { t: 'Minhas provas', s: 'Boa tarde, professor' },
  '/estatisticas': { t: 'Estatísticas', s: 'Performance e dificuldade por questão' },
  '/materiais': { t: 'Materiais', s: 'PDFs, slides e documentos das suas turmas' },
  '/provas/nova': { t: 'Nova prova', s: 'Configure os parâmetros e gere com IA' },
  '/provas/nova/revisar': { t: 'Revisar prova', s: 'Edite cada questão antes de salvar' },
  '/provas/nova/processando': { t: 'Gerando…', s: 'IA trabalhando' },
}

const IN_FLOW = ['/provas/nova', '/provas/nova/processando', '/provas/nova/revisar']

export function WebTopbar() {
  const { T } = useTheme()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const c = TITLES[pathname] ?? TITLES['/provas']
  const hideCta = IN_FLOW.includes(pathname)

  return (
    <header
      style={{
        flexShrink: 0,
        padding: '18px 32px',
        background: T.bg,
        borderBottom: `1px solid ${T.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 11,
            color: T.textMute,
            letterSpacing: 0.3,
            fontWeight: 600,
            textTransform: 'uppercase',
          }}
        >
          {c.s}
        </div>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            margin: '2px 0 0',
            letterSpacing: -0.5,
            lineHeight: 1.1,
            color: T.text,
          }}
        >
          {c.t}
        </h1>
      </div>

      {/* Search */}
      <div
        style={{
          height: 40,
          minWidth: 280,
          maxWidth: 380,
          padding: '0 12px',
          background: T.surface,
          borderRadius: 12,
          border: `1px solid ${T.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: T.textMute,
          fontSize: 13.5,
          flex: 1,
        }}
      >
        <I.Search size={14} />
        <span style={{ flex: 1 }}>Buscar provas, turmas, questões…</span>
        <kbd
          style={{
            fontSize: 10,
            padding: '2px 6px',
            borderRadius: 5,
            background: T.surfaceAlt,
            border: `1px solid ${T.border}`,
            fontFamily: 'ui-monospace, monospace',
            color: T.textDim,
          }}
        >
          ⌘K
        </kbd>
      </div>

      {/* Bell */}
      <button
        type="button"
        aria-label="Notificações"
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: T.surface,
          border: `1px solid ${T.border}`,
          color: T.textDim,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <I.Bell size={16} />
        <span
          style={{
            position: 'absolute',
            top: 9,
            right: 10,
            width: 7,
            height: 7,
            borderRadius: 99,
            background: T.ai,
            border: `2px solid ${T.surface}`,
          }}
        />
      </button>

      <ThemeToggle />

      {!hideCta && (
        <BoldBtn
          T={T}
          size="md"
          variant="ai"
          onClick={() => navigate('/provas/nova')}
          icon={<I.Sparkles size={14} stroke={2.4} />}
        >
          Nova prova
        </BoldBtn>
      )}
    </header>
  )
}
