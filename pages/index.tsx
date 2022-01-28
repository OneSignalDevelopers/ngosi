import { useSupabase } from '@common/supabaseProvider'
import Auth from '@components/Auth'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Home: NextPage = () => {
  const { session, client: supabaseClient } = useSupabase()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.replace('/signin')
    }
  }, [router, session])

  return (
    <>
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
    </>
  )
}

export default Home
