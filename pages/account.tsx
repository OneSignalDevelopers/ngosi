import { useSupabase } from '@common/supabaseProvider'
import Account from '@components/Account'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

const AccountPage: NextPage = () => {
  const { authState, session, supabaseClient } = useSupabase()
  const router = useRouter()

  if (!session) {
    return <div>No session</div>
  }

  return (
    <div className="h-screen w-screen bg-primary pt-4 pl-6">
      <Head>
        <script
          src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
          async
        ></script>
      </Head>
      <h1 className="text-white text-6xl">ngosi</h1>
      <Account key={session.user?.id} session={session!} />
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
