import { Preso } from '@types'

import { NextApiRequest, NextApiResponse } from 'next'
import { db } from './common/database'

type Data =
  | {
      preso: Preso
    }
  | {
      error: string
    }

export default async function asynchandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { presoShortCode } = JSON.parse(req.body)
    if (!presoShortCode) {
      res.status(400).json({ error: `Invalid url.` })
      return
    }

    const preso = await db.preso.findUnique({
      where: { shortCode: presoShortCode }
    })

    if (!preso) {
      res
        .status(500)
        .json({ error: `Preso with ID ${presoShortCode} couldn't be found.` })
      return
    }

    res.status(200).json({
      preso: {
        eventName: preso.eventName,
        shortCode: preso.shortCode,
        title: preso.title,
        url: preso.url,
        eventLocation: preso.eventLocation
      }
    })
  } catch (error) {
    const { message } = error as Error
    res.status(500).json({ error: message })
  }
}
