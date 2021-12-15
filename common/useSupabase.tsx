import {
  AuthChangeEvent,
  createClient,
  Session,
  SupabaseClient
} from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SupabaseAnonKey, SupabaseUrl } from './constants'

export type AuthState = 'authenticated' | 'not-authenticated'

export const supabaseClient = createClient(SupabaseUrl, SupabaseAnonKey)

export const useSupabase = (): {
  authState: AuthState
  session: Session | null
  supabaseClient: SupabaseClient
} => {
  const [session, setSession] = useState<Session | null>(null)
  const [authState, setAuthState] = useState<AuthState>('not-authenticated')
  const router = useRouter()

  useEffect(() => {
    try {
      setSession(supabaseClient.auth.session())
      const { data, error } = supabaseClient.auth.onAuthStateChange((event) => {
        onAuthChanged(event, session)

        switch (event) {
          case 'SIGNED_IN':
            setAuthState('authenticated')
            router.push('/account')
            break
          case 'SIGNED_OUT':
            setAuthState('not-authenticated')
        }

        setSession(session)
      })

      fetchUser()

      return () => data?.unsubscribe()
    } catch (err) {
      throw err
    }

    async function onAuthChanged(
      event: AuthChangeEvent,
      session: Session | null = null
    ) {
      await fetch('api/auth', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ event, session })
      })
    }

    function fetchUser() {
      const user = supabaseClient.auth.user()
      if (user) {
        setAuthState('authenticated')
      }
    }
  }, [router, session])

  return { authState, session, supabaseClient }
}
