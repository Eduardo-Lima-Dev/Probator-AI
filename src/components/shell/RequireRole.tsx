import { Navigate, Outlet } from 'react-router-dom'
import { useCurrentUser } from '../../hooks/useCurrentUser'

type RequireRoleProps = {
  role: string
}

export function RequireRole({ role }: RequireRoleProps) {
  const { user } = useCurrentUser()

  if (user?.role !== role) {
    return <Navigate to="/provas" replace />
  }

  return <Outlet />
}
