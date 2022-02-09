import { SupabaseUrl, SupabaseAnonKey } from '@common/constants'
import { createClient } from '@supabase/supabase-js'

export const supabaseClient = createClient(SupabaseUrl, SupabaseAnonKey)
