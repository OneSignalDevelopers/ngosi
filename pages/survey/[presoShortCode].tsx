import EventHeader from '@components/EventHeader'
import FatalError from '@components/FatalError'
import PresentationInfo from '@components/PresentationInfo'
import SurveyForm from '@components/SurveyForm'
import { PresenterHeader, Preso } from '@types'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import type { SurveyForm as ISurveyForm } from 'types'

const Survey: NextPage = () => {
  const router = useRouter()
  const [preso, setPreso] = useState<Preso | null>(null)
  const [presenter, setPresenter] = useState<PresenterHeader | null>(null)

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
      const { preso, presenter } = json
      if (preso && presenter) {
        setPreso(preso)
        setPresenter(presenter)
      }
    }

    fetchPresentation()
  }, [router.query])

  const onSurveySubmit = async (values: ISurveyForm) => {
    try {
      await fetch('/api/survey-response', {
        method: 'POST',
        body: JSON.stringify({
          ...values,
          presoShortCode: router.query.presoShortCode
        } as ISurveyForm)
      })

      router.replace(preso!.url)
    } catch (error) {
      console.error(error)
    }
  }

  if (!preso || !presenter) {
    return <FatalError message="Presentation doesn't exist" />
  }

  return (
    <>
      <EventHeader name="React Conf" location="London" />

      <div className="flex flex-col flex-1 mt-2 space-y-3">
        <div className="px-8 py-2">
          <PresentationInfo
            firstName={presenter.firstName}
            lastName={presenter.lastName}
            title={preso.title}
          />
        </div>
        <div className="w-full bg-gray-50">
          <div className="px-8 py-3">
            <SurveyForm onSubmit={(values) => onSurveySubmit(values)} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Survey
