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
    <div className="flex flex-col items-center h-screen bg-primary ">
      <h1 className="text-4xl text-center">Ngosi</h1>
      <p className=" mt-5">Sign in via magic link with your email below</p>
      <div>
        <input
          className="h-9 border border-black text-lg px-2 mt-1 w-80"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <button
          onClick={(e) => {
            e.preventDefault()
            handleLogin(email)
          }}
          className=" h-14 bg-black text-white font-bold text-xl mt-5 w-80"
          disabled={loading}
        >
          <span>{loading ? 'Loading' : 'Send magic link'}</span>
        </button>
      </div>
    </div>
  )
}
