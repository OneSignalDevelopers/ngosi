import { AppProps } from 'next/app'
import '../styles/globals.css'

export default function Ngosi({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
