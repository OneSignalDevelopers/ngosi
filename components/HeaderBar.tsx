import { useAuth } from '@components/Hooks/useAuth'
import Link from 'next/link'
import { useClient } from 'react-supabase'

const HeaderBarAnonymous = () => (
  <Link href="/signin">
    <a className="underline">Login</a>
  </Link>
)

const HeaderBarLoggedIn = () => {
  const client = useClient()

  return (
    <>
      <Link href="/presos">
        <a className="font-display">PRESOS</a>
      </Link>
      <Link href="/surveys">
        <a className="font-display">SURVEYS</a>
      </Link>
      <Link href="/groupies">
        <a className="font-display">AUDIENCE</a>
      </Link>
      <Link href="/account">
        <a className="font-display">ACCOUNT</a>
      </Link>
      <button
        className=""
        onClick={async () => {
          const { error } = await client.auth.signOut()
          if (error) console.error('Error logging out.')
        }}
      >
        LOGOUT
      </button>
    </>
  )
}

const HeaderBar = () => {
  const { session } = useAuth()
  return (
    <nav className="flex flex-none justify-between p-2 h-12 bg-accent-primary text-sm text-black font-bold min-w-full px-6 py-3">
      <Link href="/">
        <a>ngosi</a>
      </Link>
      {session ? <HeaderBarLoggedIn /> : <HeaderBarAnonymous />}
    </nav>
  )
}

export default HeaderBar
