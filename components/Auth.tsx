import { useSupabase } from '@common/useSupabase'
import { useState } from 'react'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const { supabaseClient } = useSupabase()

  const handleLogin = async (email: string) => {
    try {
      setLoading(true)
      const { user, error } = await supabaseClient.auth.signIn({ email })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      const e = error as any
      alert(e.error_description || e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col w-72 space-y-4">
      <h1 className="text-2xl">Ngosi</h1>

      <input
        className="h-10 p-4"
        type="email"
        placeholder="joe@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        className="h-10 border-2 hover:bg-gray-100"
        onClick={(e) => {
          e.preventDefault()
          handleLogin(email)
        }}
        disabled={loading}
      >
        {loading ? 'Loading' : 'Send Magic Link'}
      </button>
    </div>
  )
}
