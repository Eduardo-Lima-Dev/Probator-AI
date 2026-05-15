import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { getAccessToken } from '../../api/httpClient'
import { getCurrentUser } from '../../api/userApi'
import type { UserMe } from '../../api/userApi'
import { logoutUser } from '../../api/authApi'
import { UserContext } from '../../hooks/useCurrentUser'
import { useTheme } from '../../theme/ThemeContext'

export function RequireAuth() {
  const { T } = useTheme()
  const hasToken = Boolean(getAccessToken())

  const [user, setUser] = useState<UserMe | null>(null)
  const [isLoading, setIsLoading] = useState(hasToken)
  const [redirectToLogin, setRedirectToLogin] = useState(!hasToken)

  useEffect(() => {
    if (!hasToken) return

    getCurrentUser()
      .then((u) => {
        setUser(u)
      })
      .catch(() => {
        logoutUser()
        setRedirectToLogin(true)
      })
      .finally(() => {
        setIsLoading(false)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (redirectToLogin) {
    return <Navigate to="/login" replace />
  }

  if (isLoading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: T.bg,
          color: T.textMute,
          fontSize: 14,
        }}
      >
        Carregando...
      </div>
    )
  }

  return (
    <UserContext.Provider value={{ user, isLoading: false, error: '' }}>
      <Outlet />
    </UserContext.Provider>
  )
}
