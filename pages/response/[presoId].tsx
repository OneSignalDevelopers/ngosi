import { useSupabase } from '@common/supabaseProvider'
import { Survey } from '@types'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface AttendeeView {
  presenter: string
  preso: string
  attendee: string
  email: string
  name: string
  created_at: string
}

const SurveyResponses: NextPage = () => {
  const router = useRouter()
  const { client } = useSupabase()
  const { presoId } = router.query
  const [surveys, setSurveys] = useState<AttendeeView[]>([])

  useEffect(() => {
    async function getSurveyResponses() {
      if (typeof presoId !== 'string') {
        return
      }

      const { data, error } = await client
        .from<AttendeeView>('attendees_view')
        .select()
        .eq('preso', presoId)

      error && console.error(error)

      setSurveys(data || [])
    }

    getSurveyResponses()
  }, [client, presoId])

  return (
    <div>
      <h1>Survey Responses</h1>
      <ul>
        {surveys.map((s) => (
          <li key={s.attendee}>
            {s.name}-{s.email}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SurveyResponses
