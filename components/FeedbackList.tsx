import { SurveyFeedbackData } from 'pages/api/feedback'
import { useEffect, useState } from 'react'

interface Props {
  readonly presenterId: string
}

export const FeedbackList = (props: Props) => {
  const [surveyResults, setSurveyResults] = useState<SurveyFeedbackData[]>([])

  useEffect(() => {
    const fetchFeedback = async (): Promise<void> => {
      const apiResult = await fetch('/api/feedback', {
        method: 'POST',
        body: JSON.stringify({ presenterId: props.presenterId })
      })

      if (apiResult.ok) {
        const json = (await apiResult.json()) as SurveyFeedbackData[]
        setSurveyResults((json as any).surveyFeedback)
      }
    }

    fetchFeedback()
  }, [props.presenterId])

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Feedback</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {surveyResults.map((x) => (
            <tr key={x.attendeedId}>
              <td>{x.attendeeName}</td>
              <td>{x.feedback}</td>
              <td>{x.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
