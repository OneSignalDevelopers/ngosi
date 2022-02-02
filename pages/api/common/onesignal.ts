import { OneSignalApiKey, OneSignalAppId } from '@common/constants'
import * as OneSignal from 'onesignal-node'

export const onesignalClient = new OneSignal.Client(
  OneSignalAppId,
  OneSignalApiKey
)

interface EmailTemplate {
  readonly id: string
  readonly subject: string
}

export const OneSignalEmailTemplates: Record<string, EmailTemplate> = {
  videoPublished: {
    id: 'e204560e-e737-451e-afe1-496a098046ce',
    subject: 'A video has published'
  }
}

export async function sendEmail(
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
  } catch (error) {
    console.error(error)
  }
}

export async function upsertEmailDevice(
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

export async function updateTags(
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
