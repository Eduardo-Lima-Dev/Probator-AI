import { createContext, useContext } from 'react'
import type { UserMe } from '../api/userApi'

export type UserContextValue = {
  user: UserMe | null
  isLoading: boolean
  error: string
}

export const UserContext = createContext<UserContextValue>({
  user: null,
  isLoading: true,
  error: '',
})

export function useCurrentUser(): UserContextValue {
  return useContext(UserContext)
}
