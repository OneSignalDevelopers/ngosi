import { SupabaseUrl, SupabaseAnonKey } from '@common/constants'
import { createClient } from '@supabase/supabase-js'
import * as OneSignal from 'onesignal-node'

export const supabaseClient = createClient(SupabaseUrl, SupabaseAnonKey)

const subscriptionToPublishedVideos = supabaseClient
  .from('Preso')
  .on('UPDATE', async (payload) => {
    // Ideally we can inspect the diff of the change and only
    // react if there's a change.
    const { id: presoId, publishedContentUrl } = payload.new
    const { error, data: presoAttendees } = await supabaseClient
      .from('attendees_view')
      .select('email, attendee')
      .match({ preso: presoId, notifyWhenVideoPublished: true })

    error
      ? console.error(error)
      : console.log('Attendee emails', presoAttendees)
  })
  .subscribe()
