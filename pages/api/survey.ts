import { supabaseClient } from './common/supabase'
import { PresenterHeader, Preso, Profile } from '@types'
import { NextApiRequest, NextApiResponse } from 'next'
import { StatusCodes } from 'http-status-codes'

type Data =
  | {
      preso: Preso
      presenter: PresenterHeader
    }
  | {
      error: string
    }

/**
 *
 */
export default async function asynchandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { presoShortCode } = JSON.parse(req.body)

    // Lookup preso by shortCode
    const presoResult = await supabaseClient
      .from<Preso>('Preso')
      .select()
      .eq('shortCode', presoShortCode)
      .maybeSingle()

    // Find the presenter of the preso
    const presenterResult = await supabaseClient
      .from<Profile>('profiles')
      .select()
      .eq('id', presoResult.data?.userId)
      .maybeSingle()

    res.status(StatusCodes.OK).json({
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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: message })
  }
}
