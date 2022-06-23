import { useAuth } from '@components/Hooks/useAuth'
import { FeedbackList } from '@components/FeedbackList'
import { NextPage } from 'next'

const SurveysPage: NextPage = () => {
  const { session } = useAuth()

  return (
    <>
      <h1>Survey Responses</h1>
      <FeedbackList
        presenterId={
          session?.user?.id || 'ce32f57d-c350-4464-8837-c3aad7178064'
        }
      />
    </>
  )
}

export default SurveysPage
