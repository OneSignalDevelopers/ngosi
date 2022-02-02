import { SupabaseUrl, SupabaseAnonKey } from '@common/constants'
import { createClient } from '@supabase/supabase-js'
import {
  OneSignalEmailTemplates,
  sendEmail,
  upsertEmailDevice
} from './onesignal'

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
      const { id: templateId, subject } = OneSignalEmailTemplates.videoPublished

      await Promise.all(
        presoAttendees.map(async (x) => {
          const { email, attendee } = x
          await upsertEmailDevice(email, attendee)
          // set data tags
          await sendEmail(email, subject, templateId)
        })
      )
      console.log(
        'Emailed attendees',
        presoAttendees.map((x) => x.email)
      )
    } catch (error) {
      console.error(error)
    }
  })
  .subscribe()
