import { SupabaseUrl, SupabaseAnonKey } from '@common/constants'
import { createClient } from '@supabase/supabase-js'

export const supabaseClient = createClient(SupabaseUrl, SupabaseAnonKey)

const subscriptionToPublishedVideos = supabaseClient
  .from('Preso')
  .on('*', (payload) => {
    console.log('Change received!', payload)
  })
  .subscribe()
