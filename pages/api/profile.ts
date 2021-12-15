import { supabaseClient } from '@common/useSupabase'
import { Profile } from '@types'
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
    const { id, username, avatar_url, website } = JSON.parse(
      req.body
    ) as Profile

    const { data, error } = await supabaseClient
      .from<Profile>('profiles')
      .upsert({
        id: '5ceaf5a8-544e-42a2-8187-eb2e22bc9041',
        username,
        website,
        avatar_url: avatar_url || ''
      })
      .single()

    if (error) {
      res.status(500).json({ error: JSON.stringify(error) })
    } else {
      res.status(200).json({ message: JSON.stringify(data) })
    }
  } catch (error) {
    const { message } = error as Error
    res.status(500).json({ error: message })
  }
}
