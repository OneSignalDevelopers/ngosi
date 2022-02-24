import { useSupabase } from '@common/supabaseProvider'
import { FeedbackList } from '@components/FeedbackList'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const SurveysPage: NextPage = () => {
  const router = useRouter()
  const { authState, session } = useSupabase()

  useEffect(() => {
    if (authState !== 'authenticated') {
      router.replace('/signin')
    }
  }, [authState, router])

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
