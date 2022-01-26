import { useSupabase } from '@common/supabaseProvider'
import Footer from '@components/Footer'
import PresentationForm from '@components/PresoForm'
import { PresoForm } from '@types'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

const Preso: NextPage = () => {
  const router = useRouter()
  const { session } = useSupabase()

  const onSubmit = async (values: PresoForm) => {
    try {
      const response = await fetch('/api/preso', {
        method: 'POST',
        body: JSON.stringify({
          ...values,
          userId: session!.user?.id
        } as PresoForm)
      })
      const json = await response.json()
      router.replace(`/qr?preso=${encodeURIComponent(json.presoShortCode)}`)
    } catch (error) {
      const { message } = error as Error
      console.error(message)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Ngosi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col flex-1">
        <h1 className="text-3xl bg-black py-2 px-6 text-white">
          Add Presentation
        </h1>
        <div className="pt-4 px-6 mt-6">
          <div className="flex flex-col items-center justify-center">
            <PresentationForm onSubmit={(values) => onSubmit(values)} />
            <button
              className="w-80 h-14 bg-black text-white font-bold text-xl mt-5"
              type="button"
              onClick={() => {
                router.replace('presos')
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Preso
