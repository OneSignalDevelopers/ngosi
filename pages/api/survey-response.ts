import { supabaseClient } from '@common/useSupabase'
import { Attendee, Preso, Survey, SurveyFormResponse } from '@types'
import cuid from 'cuid'
import { NextApiRequest, NextApiResponse } from 'next'
import { StatusCodes } from 'http-status-codes'

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
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: `Preso with short code ${presoShortCode} couldn't be found.`
      })
      return
    }

    const attendeeResult = await supabaseClient
      .from<Attendee>('Attendee')
      .select()
      .eq('email', email)
      .single()

    let attendee: Attendee | undefined = undefined
    if (attendeeResult.data) {
      attendee = attendeeResult.data
    } else {
      const { data, error } = await supabaseClient
        .from<Attendee>('Attendee')
        .insert({ email: email, fullName: fullName, id: cuid() })
        .single()

      if (data) {
        attendee = data
      }
    }

    if (!attendee) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'An unknown error occurred'
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

    res.status(StatusCodes.OK).json({ message: 'ok' })
  } catch (error) {
    const { message } = error as Error
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: message })
  }
}
