import { createContext, useEffect, useState } from 'react'
import { useAuthStateChange, useClient } from 'react-supabase'

interface AuthState {
  session: Record<string, any> | null
  user: Record<string, any> | null
}

const initialState = { session: null, user: null }
export const AuthContext = createContext<AuthState>(initialState)

export const AuthProvider: React.FC = ({ children }) => {
  const client = useClient()
  const [state, setState] = useState<AuthState>(initialState)

  useEffect(() => {
    const session = client.auth.session()
    setState({ session, user: session?.user ?? null })
  }, [client.auth])

  useAuthStateChange((event, session) => {
    console.log(`Supbase auth event: ${event}`, session)
    setState({ session, user: session?.user ?? null })
  })

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}
