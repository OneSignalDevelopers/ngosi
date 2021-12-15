import { supabaseClient } from '@common/useSupabase'
import { PresenterHeader, Preso, Profile } from '@types'
import { NextApiRequest, NextApiResponse } from 'next'

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

    const presoResult = await supabaseClient
      .from<Preso>('Preso')
      .select()
      .eq('shortCode', presoShortCode)
      .maybeSingle()

    const presenterResult = await supabaseClient
      .from<Profile>('profiles')
      .select()
      .eq('id', presoResult.data?.userId)
      .maybeSingle()

    res.status(200).json({
      preso: {
        ...presoResult.data!,
        eventLocation: presoResult.data!.eventLocation || undefined
      },
      presenter: {
        ...presenterResult.data!
      }
    })
  } catch (error) {
    const { message } = error as Error
    res.status(500).json({ error: message })
  }
}
