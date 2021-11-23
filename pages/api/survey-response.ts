import { prisma } from '.prisma/client'
import { SurveyForm } from '@types'
import cuid from 'cuid'
import { nanoid } from 'nanoid'
import { NextApiRequest, NextApiResponse } from 'next'
import { db } from './common/database'
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
      fullName,
      email,
      notificationOfOtherTalks,
      notificationWhenVideoPublished,
      rateMyPresentation,
      presoShortCode
    } = JSON.parse(req.body) as SurveyForm & { presoShortCode: string }

    const preso = await db.preso.findUnique({
      where: { shortCode: presoShortCode }
    })
    if (!preso) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: `Preso with short code ${presoShortCode} couldn't be found.`
      })
      return
    }

    // lookup attendee
    // create one if they aren't in the db
    const attendee = await db.attendee.create({
      data: {
        id: cuid(),
        email,
        fullName
      }
    })

    const surveyResponse = await db.survey.create({
      data: {
        id: cuid(),
        presoId: preso.id,
        attendeeId: attendee.id,
        notifyOfOtherTalks: notificationOfOtherTalks,
        notifyWhenVideoPublished: notificationWhenVideoPublished,
        sendPresoFeedback: rateMyPresentation
      }
    })

    res.status(StatusCodes.OK).json({ message: 'ok' })
  } catch (error) {
    const { message } = error as Error
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: message })
  }
}
