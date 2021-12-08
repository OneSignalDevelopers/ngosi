import { supabaseClient } from '@common/useSupabase'
import { Attendee, Preso, Survey, SurveyForm, SurveyFormResponse } from '@types'
import cuid from 'cuid'
import { NextApiRequest, NextApiResponse } from 'next'

type Data =
  | {
      message: string
    }
  | {
      error: string
    }

export default async function asynchandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const {
      email,
      fullName,
      notifyOfOtherTalks,
      notifyWhenVideoPublished,
      sendPresoFeedback,
      presoShortCode
    } = JSON.parse(req.body) as SurveyFormResponse & { presoShortCode: string }

    const presoResult = await supabaseClient
      .from<Preso>('Preso')
      .select()
      .eq('shortCode', presoShortCode)
      .maybeSingle()

    if (!presoResult.data) {
      res.status(500).json({
        error: `Preso with short code ${presoShortCode} couldn't be found.`
      })
      return
    }

    const surveyResult = await supabaseClient
      .from<Survey & { presoId: string }>('Survey')
      .insert({
        id: cuid(),
        presoId: presoResult.data.id,
        attendeeId: attendee.id,
        notifyOfOtherTalks,
        notifyWhenVideoPublished,
        sendPresoFeedback
      })
      .maybeSingle()

    res.status(200).json({ message: 'ok' })
  } catch (error) {
    const { message } = error as Error
    res.status(500).json({ error: message })
  }
}
