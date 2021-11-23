import EventHeader from '@components/EventHeader'
import FatalError from '@components/FatalError'
import Footer from '@components/Footer'
import SurveyForm from '@components/SurveyForm'
import { Preso } from '@types'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import type { SurveyForm as ISurveyForm } from 'types'

const Survey: NextPage = () => {
  const router = useRouter()
  const [preso, setPreso] = useState<Preso | null>(null)

  useEffect(() => {
    const { presoShortCode } = router.query
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
      }
    }

    fetchPresentation()
  }, [router.query])

  const onSurveySubmit = async (values: ISurveyForm) => {
    const response = await fetch('/api/survey-response', {
      method: 'POST',
      body: JSON.stringify({
        ...values,
        presoShortCode: router.query.presoShortCode
      })
    })
  }

  if (!preso) {
    return <FatalError message="Presentation doesn't exist" />
  }

  return (
    <div className="flex flex-col min-h-screen min-w-full">
      <Head>
        <title>Ngosi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <EventHeader name="React Conf" location="London" />

      <main className="flex flex-col flex-1 mt-2 space-y-3">
        <div className="px-8 py-2">
          {/* <PresentationInfo
            firstName={preso}
            lastName={lastName}
            title={preso.title}
          /> */}
        </div>
        <div className="w-full bg-gray-50">
          <div className="px-8 py-3">
            <SurveyForm onSubmit={(values) => onSurveySubmit(values)} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Survey
