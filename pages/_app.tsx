import { AppProps } from 'next/app'
import Head from 'next/head'
import FooterBar from '@components/FooterBar'
import HeaderBar from '@components/HeaderBar'
import { AuthProvider } from '@components/Providers/AuthProvider'
import { Provider } from 'react-supabase'
import { createClient } from '@supabase/supabase-js'
import { SupabaseUrl, SupabaseAnonKey } from '@common/constants'
import { useOneSignal } from '../components/Hooks/useOneSignal'

import '../styles/globals.css'

const client = createClient(SupabaseUrl, SupabaseAnonKey)

export default function Ngosi({ Component, pageProps }: AppProps) {
  useOneSignal()

  return (
    <Provider value={client}>
      <AuthProvider>
        <Head>
          <title>Ngosi</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div
          id="shell"
          className="flex flex-col min-h-screen min-w-full bg-background-primary items-center justify-center"
        >
          <HeaderBar />
          <main className="flex flex-col flex-1 pt-5 pb-5">
            <Component {...pageProps} />
          </main>
          <FooterBar />
        </div>
      </AuthProvider>
    </Provider>
  )
}
