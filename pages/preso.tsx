import { useSupabase } from '@common/supabaseProvider'
import FooterBar from '@components/FooterBar'
import PresentationForm from '@components/PresoForm'
import { PresoForm } from '@types'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import {validatePresos} from "validation/presos"

const Preso: NextPage = () => {
  const router = useRouter()
  const { session } = useSupabase()

  const onSubmit = async (values: PresoForm) => {
    const { title, url, eventName, eventLocation } = values;
    try {
      const isPresosvalid = await validatePresos.validate({ title, url, eventName, eventLocation });
      if (isPresosvalid) {
        const response = await fetch('/api/preso', {
          method: 'POST',
          body: JSON.stringify({
            ...values,
            userId: session!.user?.id
          } as PresoForm)
        })
        const json = await response.json()
        router.replace(`/qr?preso=${encodeURIComponent(json.presoShortCode)}`)
      }
    } catch (error) {
      const { message } = error as Error
      alert(message)
      console.error(message)
    }
  }

  return (
    <>
      <h1 className="text-2xl bg-black py-2 px-6 text-white text-center font-bold">
        Add Presentation
      </h1>
      <div className="pt-12 px-6 mt-6">
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
    </>
  )
}

export default Preso
