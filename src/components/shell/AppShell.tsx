import { Outlet, useLocation } from 'react-router-dom'
import { useTheme } from '../../theme/ThemeContext'
import { useIsMobile } from '../../hooks/useIsMobile'
import { WebSidebar } from './WebSidebar'
import { WebTopbar } from './WebTopbar'
import { BoldHeader } from './BoldHeader'
import { BoldTabBar } from './BoldTabBar'

const IN_FLOW_PATHS = ['/provas/nova', '/provas/nova/processando', '/provas/nova/revisar']

export function AppShell() {
  const { T } = useTheme()
  const isMobile = useIsMobile()
  const { pathname } = useLocation()
  const isAnalytics = pathname.startsWith('/provas/') && pathname.endsWith('/analytics')
  const inFlow = IN_FLOW_PATHS.includes(pathname)

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        background: T.bg,
        color: T.text,
        fontFamily: '"Geist", "Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
        fontSize: 14,
        lineHeight: 1.5,
        overflow: 'hidden',
      }}
    >
      {isMobile ? (
        /* ─── Mobile layout ─── */
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', minHeight: '100vh' }}>
          {!inFlow && <BoldHeader />}
          <main style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
            <Outlet />
          </main>
          {!inFlow && !isAnalytics && <BoldTabBar />}
        </div>
      ) : (
        /* ─── Desktop layout ─── */
        <>
          {!inFlow && <WebSidebar />}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {!inFlow && <WebTopbar />}
            <main style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
              <Outlet />
            </main>
          </div>
        </>
      )}
    </div>
  )
}
