import { Profile } from '@types'
import { NextApiRequest, NextApiResponse } from 'next'
import { StatusCodes } from 'http-status-codes'
import { supabaseClient } from './common/supabase'
import { OneSignalApiKey, OneSignalAppId } from '@common/constants'

type Data =
  | {
      message: string
    }
  | {
      error: string
    }

interface EmailTemplate {
  readonly id: string
  readonly subject: string
}

const OneSignalEmailTemplates: Record<string, EmailTemplate> = {
  accountUpdated: {
    subject: 'Account Updated',
    id: '67e66178-78fd-4e8e-8588-5a389f42af1d'
  }
}

async function upsertEmailDevice(
  email: string,
  extId: string
): Promise<string | null> {
  const endpoint = 'https://onesignal.com/api/v1/players'
  const body = {
    app_id: OneSignalAppId,
    device_type: 11,
    identifier: email,
    external_user_id: extId
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const { success, id } = await res.json()

    return success ? id : null
  } catch (error) {
    console.error(error)
    return null
  }
}

async function updateTags(
  extId: string,
  newTags: Record<string, string | number | boolean>
): Promise<'succeded' | 'failed'> {
  const endpoint = `https://onesignal.com/api/v1/apps/${OneSignalAppId}/users/${extId}`
  const body = {
    tags: {
      ...newTags
    }
  }

  try {
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(body)
    })

    const { success } = await res.json()
    return success ? 'succeded' : 'failed'
  } catch (error) {
    console.error(error)
    return 'failed'
  }
}

async function sendEmail(
  email: string,
  subject: string,
  template: string
): Promise<void> {
  const endpoint = 'https://onesignal.com/api/v1/notifications'
  const body = {
    app_id: OneSignalAppId,
    template_id: template,
    email_subject: subject,
    include_email_tokens: [email]
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: `Bearer ${OneSignalApiKey}`
      },
      body: JSON.stringify(body)
    })

    const data = await res.json()

    console.log('sendEmal', data)
  } catch (error) {
    console.error(error)
  }
}

export default async function asynchandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { id, username, avatar_url, website, email } = JSON.parse(
      req.body
    ) as Profile

    const { data, error } = await supabaseClient
      .from<Profile>('profiles')
      .upsert(
        {
          id: id,
          username,
          website,
          avatar_url: avatar_url || ''
        },
        {
          returning: 'minimal',
          count: 'exact'
        }
      )

    if (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: JSON.stringify(error) })
    }

    await upsertEmailDevice(email, id)

    const result = await updateTags(id, {
      username
    })
    if (result !== 'succeded') return

    const { id: templateId, subject } = OneSignalEmailTemplates.accountUpdated
    await sendEmail(email, subject, templateId)
    res.status(StatusCodes.OK).json({ message: JSON.stringify(data) })
  } catch (error) {
    const { message } = error as Error
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: message })
  }
}
