import { Profile } from '@types'
import { NextApiRequest, NextApiResponse } from 'next'
import { StatusCodes } from 'http-status-codes'
import { supabaseClient } from './common/supabase'

const OneSignalApiKey = 'NmI4NTI5NWEtMzZmYy00MTgxLWI0ZDUtNzYxMDJhMTgzMzkz'
const OneSignalAppId = 'c0961ce4-be33-4242-a8f7-83d9f9725a79'

type Data =
  | {
      message: string
    }
  | {
      error: string
    }

async function upsertEmailDevice(
  email: string,
  extId: string
): Promise<string | null> {
  const endpoint = 'https://onesignal.com/api/v1/players'
  const reqBody = {
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
      body: JSON.stringify(reqBody)
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
  const reqBody = {
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
      body: JSON.stringify(reqBody)
    })

    console.log(JSON.stringify(res, null, 2))
    const a = await res.json()

    return 'succeded'
    // return success ? 'succeded' : 'failed'
  } catch (error) {
    console.error(error)
    return 'failed'
  }
}

enum OneSignalEmailTemplate {
  template1 = '613e4df2-b4aa-4612-b448-4e27ffffb730'
}

async function sendEmail(
  email: string,
  subject: string,
  template: OneSignalEmailTemplate
): Promise<void> {
  const endpoint = 'https://onesignal.com/api/v1/notifications'
  const reqBody = {
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
      body: JSON.stringify(reqBody)
    })

    const data = await res.json()

    console.log(data)
  } catch (error) {
    console.error(error)
  }
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
      return
    }

    await upsertEmailDevice('william@onesignal.com', id)
    const result = await updateTags(id, {
      test: 'Hello'
    })
    if (result !== 'succeded') {
      return
    }

    await sendEmail(
      'william@onesignal.com',
      'Test Demo',
      OneSignalEmailTemplate.template1
    )

    res.status(StatusCodes.OK).json({ message: JSON.stringify(data) })
  } catch (error) {
    const { message } = error as Error
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: message })
  }
}
