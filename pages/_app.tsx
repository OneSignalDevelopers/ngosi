import { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import '../styles/globals.css'

export default function Ngosi({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  )
}
