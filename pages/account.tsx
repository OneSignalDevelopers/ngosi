import { useSupabase } from '@common/supabaseProvider'
import Account from '@components/Account'
import { NextPage } from 'next'
import Head from 'next/head'

const AccountPage: NextPage = () => {
  const { session, supabaseClient } = useSupabase()

  return (
    <div className="h-screen w-screen flex flex-col  items-center justify-center bg-primary">
      <Head>
        <script
          src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
          async
        ></script>
      </Head>
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
    </div>
  )
}

export default AccountPage
