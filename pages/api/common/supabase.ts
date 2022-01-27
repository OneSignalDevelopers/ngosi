import { SupabaseUrl, SupabaseAnonKey } from '@common/constants'
import { createClient } from '@supabase/supabase-js'
import { onesignalClient } from './onesignal'

export const supabaseClient = createClient(SupabaseUrl, SupabaseAnonKey)

const subscriptionToPublishedVideos = supabaseClient
  .from('Preso')
  .on('UPDATE', async (payload) => {
    // Ideally we can inspect the diff of the change and only
    // react if there's a change.
    const { id: presoId, publishedContentUrl } = payload.new

    try {
      const { error, data: presoAttendees } = await supabaseClient
        .from('attendees_view')
        .select('email, attendee')
        .match({ preso: presoId, notifyWhenVideoPublished: true })

      if (error) {
        console.error(error)
        return
      }

      if (!presoAttendees || !presoAttendees.length) {
        return
      }

      console.log('Attendee emails', presoAttendees)
      const osClientRes = await onesignalClient.createNotification({
        template_id: 'a30dcca1-e693-45ad-a277-acb608fd55e3',
        include_external_user_ids: presoAttendees.map((x) => x.attendee)
      })

      console.log('OneSignal Client Response', osClientRes)
    } catch (error) {
      console.error(error)
    }
  })
  .subscribe()
