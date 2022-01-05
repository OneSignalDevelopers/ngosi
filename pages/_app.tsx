import { useOneSignal } from '@common/useOneSignal'
import SupabaseProvider from '@common/supabaseProvider'
import { AppProps } from 'next/app'
import '../styles/globals.css'

export default function Ngosi({ Component, pageProps }: AppProps) {
  useOneSignal()

  return (
    <SupabaseProvider>
      <Component {...pageProps} />
    </SupabaseProvider>
  )
}
