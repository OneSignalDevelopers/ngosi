import { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { useOneSignal } from "@common/utils"
import '../styles/globals.css'

export default function Ngosi({ Component, pageProps }: AppProps) {
  useOneSignal()
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  )
}
