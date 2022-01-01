import { useSupabase } from '@common/useSupabase'
import Auth from '@components/Auth'
import { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  const { session, supabaseClient } = useSupabase()

  if (!session) {
    return (
      <div className=" bg-primary ">
        <Auth />
      </div>
    )
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

export default Home
