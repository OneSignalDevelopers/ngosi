import { useSupabase } from '@common/supabaseProvider'
import Account from '@components/Account'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const AccountPage: NextPage = () => {
  const router = useRouter()
  const { session, client: supabaseClient } = useSupabase()

  useEffect(() => {
    if (!session || !session.user) {
      router.replace('/signin')
    }
  }, [session, router])

  return (
    <>
      <h1 className="text-white text-6xl">Ngosi</h1>
      <Account key={session!.user?.id} session={session!} />
      <button
        className="h-12 bg-black text-white font-bold text-xl mt-5 w-80"
        onClick={async () => {
          const { error } = await supabaseClient.auth.signOut()
          if (error) console.log('Error logging out:', error.message)
        }}
      >
        Logout
      </button>
    </>
  )
}

export default AccountPage
