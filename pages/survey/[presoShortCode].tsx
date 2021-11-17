import EventHeader from '@components/EventHeader'
import FatalError from '@components/FatalError'
import Footer from '@components/Footer'
import PresentationInfo from '@components/PresentationInfo'
import SurveyForm from '@components/SurveyForm'
import { Preso } from '@types'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Survey: NextPage = () => {
  const router = useRouter()
  const [preso, setPreso] = useState<Preso | null>(null)
  const { presoShortCode } = router.query

  useEffect(() => {
    if (!presoShortCode || typeof presoShortCode !== 'string') {
      return
    }

    const fetchPresentation = async () => {
      const response = await fetch('/api/survey', {
        method: 'POST',
        body: JSON.stringify({ presoShortCode })
      })

      const json = await response.json()
      const { preso } = json
      if (preso) {
        setPreso(preso)
        console.log('Preso set', preso)
      }
    }

    fetchPresentation()
  }, [presoShortCode])

  if (!preso) {
    return <FatalError message="Presentation doesn't exist" />
  }

  const presenter = { firstName: 'William', lastName: 'Shepherd' }
  if (!presenter) {
    return (
      <FatalError message="Presenter could not be found. This is a big problem." />
    )
  }
  const { firstName, lastName } = presenter

  return (
    <div className="flex flex-col min-h-screen min-w-full">
      <Head>
        <title>Ngosi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <EventHeader name="React Conf" location="London" />

      <main className="flex flex-col flex-1 mt-2 space-y-3">
        <div className="px-8 py-2">
          <PresentationInfo
            firstName={firstName}
            lastName={lastName}
            title={preso.title}
          />
        </div>
        <div className="w-full bg-gray-50">
          <div className="px-8 py-3">
            <SurveyForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Survey
