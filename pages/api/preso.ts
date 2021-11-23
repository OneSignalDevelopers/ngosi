import { PresoForm } from '@types'
import cuid from 'cuid'
import { nanoid } from 'nanoid'
import { NextApiRequest, NextApiResponse } from 'next'
import { db } from './common/database'

type Data =
  | {
      presoShortCode: string
    }
  | {
      error: string
    }

export default async function asynchandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { url, userId, eventName, title, eventLocation } = JSON.parse(
      req.body
    ) as PresoForm
    if (!url) {
      res.status(400).json({ error: 'Presentation url is required.' })
    }

    const preso = await db.preso.create({
      data: {
        id: cuid(),
        eventName: eventName,
        eventLocation: eventLocation,
        title: title,
        url: url,
        shortCode: nanoid(7),
        userId: userId
      }
    })

    res.status(200).json({ presoShortCode: preso.shortCode })
  } catch (error) {
    const { message } = error as Error
    res.status(500).json({ error: message })
  }
}
