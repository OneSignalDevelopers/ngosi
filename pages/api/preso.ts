import cuid from 'cuid'
import { nanoid } from 'nanoid'
import { NextApiRequest, NextApiResponse } from 'next'
import { db } from './common/database'
import { StatusCodes } from 'http-status-codes'
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
    const { url, presenterId } = JSON.parse(req.body)
    if (!url) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Presentation url is required.' })
    }

    const preso = await db.preso.create({
      data: {
        id: cuid(),
        eventName: 'ReactConf',
        eventLocation: 'Houston, TX',
        title: 'How to do stuff in react',
        url: 'https://conf.reactjs.org/',
        shortCode: nanoid(7),
        presenterId: presenterId
      }
    })

    res.status(StatusCodes.OK).json({ presoShortCode: preso.shortCode })
  } catch (error) {
    const { message } = error as Error
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: message })
  }
}
