import { AttendeesView } from '@types'
import { StatusCodes } from 'http-status-codes'
import { NextApiRequest, NextApiResponse } from 'next'
import { supabaseClient } from './common/supabase'

interface SurveyFeedbackRequest {
  readonly presenterId: string
}

export interface SurveyFeedbackData {
  readonly attendeedId: string
  readonly attendeeName: string
  readonly feedback: string
  readonly createdAt: string
}

type Data =
  | {
      surveyFeedback: Array<SurveyFeedbackData>
    }
  | {
      error: string
    }

export default async function asynchandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { presenterId } = JSON.parse(req.body) as SurveyFeedbackRequest

    // Lookup survey responsed for given presenterId
    const { data, error } = await supabaseClient
      .from<AttendeesView>('attendees_view')
      .select()
      .not('feedback', 'eq', null)
      .eq('presenter', presenterId)

    if (error)
      return res.status(StatusCodes.NOT_FOUND).json({ error: error.message })

    console.log(data)
    data &&
      res.status(StatusCodes.OK).json({
        surveyFeedback: data.map((x) => {
          return {
            attendeedId: x.attendee,
            attendeeName: x.name,
            createdAt: x.created_at,
            feedback: x.feedback
          } as SurveyFeedbackData
        })
      })
  } catch (error) {
    console.error(error)

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: (error as Error).message })
  }
}
