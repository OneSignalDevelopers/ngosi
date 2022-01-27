import { OneSignalApiKey, OneSignalAppId } from '@common/constants'
import * as OneSignal from 'onesignal-node'

export const onesignalClient = new OneSignal.Client(
  OneSignalAppId,
  OneSignalApiKey
)
