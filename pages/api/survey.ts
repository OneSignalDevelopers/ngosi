import { Presenter, Preso } from '@types'
import cuid from 'cuid'
import { StatusCodes } from 'http-status-codes'
import { NextApiRequest, NextApiResponse } from 'next'
import { db } from './common/database'

type Data =
  | {
      preso: Preso
      presenter: Presenter
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

    const preso = await db.preso.findUnique({
      where: { shortCode: presoShortCode }
    })

    if (!preso) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: `Preso with ID ${presoShortCode} couldn't be found.` })
      return
    }

    const presenter = await db.presenter.findUnique({
      where: { id: preso?.presenterId }
    })
    if (!presenter) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: `An unrecoverable error occured.` })
      return
    }

    res.status(StatusCodes.OK).json({
      preso: {
        id: preso.id,
        eventName: preso.eventName,
        shortCode: preso.shortCode,
        title: preso.title,
        url: preso.url,
        eventLocation: preso.eventLocation
      },
      presenter: {
        id: presenter.id,
        email: presenter.email,
        firstName: presenter.firstName,
        lastName: presenter.lastName,
        profileImage: presenter.profileImage || '',
        presentations: []
      }
    })
  } catch (error) {
    const { message } = error as Error
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: message })
  }
}
