import { useSupabase } from '@common/supabaseProvider'
import Account from '@components/Account'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useEffect, useState } from 'react'

const AccountPage: NextPage = () => {
  const router = useRouter();
  const { authState, session, client: supabaseClient } = useSupabase()

  useEffect(() => {
    if (authState !== 'authenticated') {
      router.replace('/signin')
    }
  }, [authState, router])

  if (!session) {
    return <div>No session</div>
  }

  return (
    <>
      <h1 className="text-white text-6xl">Ngosi</h1>
      <Account key={session.user?.id} session={session!} />
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
