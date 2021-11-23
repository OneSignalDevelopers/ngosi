import { useSupabase } from '@common/useSupabase'
import Account from '@components/Account'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const AccountPage: NextPage = () => {
  const { authState, session, supabaseClient } = useSupabase()
  const router = useRouter()

  // useEffect(() => {
  //   if (authState !== 'authenticated' || !session) {
  //     router.replace('/sign-in')
  //   }
  // }, [authState, router, session])

  return (
    <div className="h-screen w-screen bg-primary pt-4 pl-6">
      <Head>
        <script
          src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
          async
        ></script>
      </Head>
      <h1 className="text-white text-6xl">ngosi</h1>
      {session && <Account key={session.user?.id} session={session!} />}
      <button
        className=""
        onClick={async () => {
          const { error } = await supabaseClient.auth.signOut()
          if (error) console.log('Error logging out:', error.message)
        }}
      >
        Logout
      </button>
    </div>
  )
}

export default AccountPage
