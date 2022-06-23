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
        <a>Presos</a>
      </Link>
      <Link href="/surveys">
        <a>Surveys</a>
      </Link>
      <Link href="/groupies">
        <a>Audience</a>
      </Link>
      <Link href="/account">
        <a>Account</a>
      </Link>
      <button
        className=""
        onClick={async () => {
          const { error } = await client.auth.signOut()
          if (error) console.error('Error logging out.')
        }}
      >
        Logout
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
