import { Preso, PresoDetails, PresoForm } from '@types'
import cuid from 'cuid'
import { nanoid } from 'nanoid'
import { NextApiRequest, NextApiResponse } from 'next'
import { StatusCodes } from 'http-status-codes'
import { supabaseClient } from './common/supabase'
import {
  OneSignalEmailTemplates,
  sendEmail,
  setEmailDevice
} from './common/onesignal'

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
    const {
      url,
      eventName,
      title,
      eventLocation,
      publishedContentUrl,
      id: presoId
    } = JSON.parse(req.body) as PresoDetails

    const { data: oldContentUrl, error: oldContentUrlError } =
      await supabaseClient
        .from<Preso>('Preso')
        .select('*')
        .eq('id', presoId)
        .single()

    if (oldContentUrlError) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }

    if (publishedContentUrl == oldContentUrl?.publishedContentUrl) {
      return res.status(StatusCodes.OK).json({ success: true })
    }

    const { data: updatedPreso, error: updatedPresoError } =
      await supabaseClient
        .from<Preso>('Preso')
        .update({
          eventName: eventName,
          eventLocation: eventLocation,
          title: title,
          url: url,
          publishedContentUrl: publishedContentUrl
        })
        .match({ id: presoId })
        .single()

    if (updatedPresoError) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }

    const { data: presoAttendees, error: presoAttendeesError } =
      await supabaseClient
        .from('attendees_view')
        .select('email, attendee')
        .match({ preso: presoId, notifyWhenVideoPublished: true })

    if (presoAttendeesError) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }

    if (presoAttendees && presoAttendees.length) {
      const { id: templateId, subject } = OneSignalEmailTemplates.videoPublished

      await Promise.all(
        presoAttendees.map(async (x) => {
          const { email, attendee } = x
          await setEmailDevice(email, attendee)
          // set data tags
          await sendEmail(email, subject, templateId)
        })
      )
    }

    res.status(StatusCodes.OK).json({ success: true })
  } catch (error) {
    const { message } = error as Error
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: message })
  }
}
