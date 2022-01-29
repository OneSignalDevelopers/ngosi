import { useOneSignal } from '@common/useOneSignal'
import SupabaseProvider from '@common/supabaseProvider'
import { AppProps } from 'next/app'
import Head from 'next/head'
import FooterBar from '@components/FooterBar'
import HeaderBar from '@components/HeaderBar'
import '../styles/globals.css'

export default function Ngosi({ Component, pageProps }: AppProps) {
  useOneSignal()

  return (
    <SupabaseProvider>
        <Head>
          <title>Ngosi</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div id="shell" className="flex flex-col min-h-screen min-w-full bg-background-primary items-center justify-center">
          <HeaderBar />
          <main className="flex flex-col flex-1 pt-5 pb-5">
            <Component {...pageProps} />
          </main>
          <FooterBar />
        </div>
    </SupabaseProvider>
  )
}
