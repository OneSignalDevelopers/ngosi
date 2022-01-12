import { Preso, PresoDetails, PresoForm } from '@types'
import cuid from 'cuid'
import { nanoid } from 'nanoid'
import { NextApiRequest, NextApiResponse } from 'next'
import { StatusCodes } from 'http-status-codes'
import { supabaseClient } from './common/supabase'

type PresoPostResp =
  | {
      success: true
      presoShortCode: string
    }
  | {
      success: false
      error: string
    }

type PresoPutResp =
  | {
      success: true
    }
  | { success: false; error: string }

/**
 * Create a preso.
 */
export default async function asynchandler(
  req: NextApiRequest,
  res: NextApiResponse<PresoPostResp | PresoPutResp>
) {
  switch (req.method) {
    case 'PUT':
      return await updatePreso(req, res)
    case 'POST':
      return await addPreso(req, res)
  }
}

async function addPreso(
  req: NextApiRequest,
  res: NextApiResponse<PresoPostResp>
) {
  try {
    const { url, userId, eventName, title, eventLocation } = JSON.parse(
      req.body
    ) as PresoForm

    if (!url) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'Presentation url is required.'
      })
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
        .json({ success: false, error: JSON.stringify(error) })
    } else {
      res
        .status(StatusCodes.OK)
        .json({ success: true, presoShortCode: data?.shortCode || '' })
    }
  } catch (error) {
    const { message } = error as Error
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: message })
  }
}

async function updatePreso(
  req: NextApiRequest,
  res: NextApiResponse<PresoPutResp>
) {
  try {
    const { url, eventName, title, eventLocation, publishedContentUrl, id } =
      JSON.parse(req.body) as PresoDetails

    const { data, error } = await supabaseClient
      .from<Preso>('Preso')
      .update({
        eventName: eventName,
        eventLocation: eventLocation,
        title: title,
        url: url
      })
      .match({ id: id })
      .single()

    res.status(StatusCodes.OK).json({ success: true })
  } catch (error) {}
}
