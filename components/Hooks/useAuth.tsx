import { AuthContext } from '../Providers/AuthProvider'
import { useContext } from 'react'

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined)
    throw Error('useAuth must be used within AuthProvider')
  return context
}
