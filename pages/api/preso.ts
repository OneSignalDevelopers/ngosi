import { supabaseClient } from '@common/useSupabase'
import { Preso, PresoForm } from '@types'
import cuid from 'cuid'
import { nanoid } from 'nanoid'
import { NextApiRequest, NextApiResponse } from 'next'
import { StatusCodes } from 'http-status-codes'

type Data =
  | {
      presoShortCode: string
    }
  | {
      error: string
    }

/**
 * Create a preso.
 */
export default async function asynchandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { url, userId, eventName, title, eventLocation } = JSON.parse(
      req.body
    ) as PresoForm
    if (!url) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Presentation url is required.' })
    }

    const { data, error } = await supabaseClient
      .from<Preso>('Preso')
      .insert({
        id: cuid(),
        eventName: eventName,
        eventLocation: eventLocation,
        title: title,
        url: url,
        shortCode: nanoid(7),
        userId: userId
      })
      .single()

    if (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: JSON.stringify(error) })
    } else {
      res.status(StatusCodes.OK).json({ presoShortCode: data?.shortCode || '' })
    }
  } catch (error) {
    const { message } = error as Error
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: message })
  }
}
