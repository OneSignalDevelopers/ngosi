import { Profile } from '@types'
import { NextApiRequest, NextApiResponse } from 'next'
import { StatusCodes } from 'http-status-codes'
import { supabaseClient } from './common/supabase'

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
    const { id, username, avatar_url, website } = JSON.parse(
      req.body
    ) as Profile

    const { data, error } = await supabaseClient
      .from<Profile>('profiles')
      .upsert({
        id: id,
        username,
        website,
        avatar_url: avatar_url || ''
      })
      .single()

    if (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: JSON.stringify(error) })
    } else {
      res.status(StatusCodes.OK).json({ message: JSON.stringify(data) })
    }
  } catch (error) {
    const { message } = error as Error
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: message })
  }
}
