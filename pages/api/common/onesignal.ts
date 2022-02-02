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
