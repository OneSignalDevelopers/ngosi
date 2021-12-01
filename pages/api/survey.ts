import { PresenterHeader, Preso } from '@types'
import { NextApiRequest, NextApiResponse } from 'next'
import { db } from './common/database'

type Data =
  | {
      preso: Preso
      presenter: PresenterHeader
    }
  | {
      error: string
    }

/**
 * 1. Fetch the preso using the short code
 * 2. Pluck userId property from record
 */
export default async function asynchandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { presoShortCode } = JSON.parse(req.body)

    const preso = await db.preso.findUnique({
      where: { shortCode: presoShortCode }
    })
    if (!preso) {
      res
        .status(500)
        .json({ error: `Preso with ID ${presoShortCode} couldn't be found.` })
      return
    }

    const presenter = await db.profiles.findUnique({
      where: { id: preso.userId }
    })
    if (!presenter) {
      res
        .status(500)
        .json({ error: `Presenter with ID ${preso.userId} couldn't be found.` })
      return
    }

    res.status(200).json({
      preso: {
        id: preso.id,
        eventName: preso.eventName,
        shortCode: preso.shortCode,
        title: preso.title,
        url: preso.url,
        eventLocation: preso.eventLocation || undefined,
        userId: preso.userId
      },
      presenter: {
        firstName: presenter?.username!,
        lastName: '',
        profileImage: presenter.avatar_url || undefined
      }
    })
  } catch (error) {
    const { message } = error as Error
    res.status(500).json({ error: message })
  }
}
