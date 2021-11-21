import { createClient } from '@supabase/supabase-js'
import { SupabaseAnonKey, SupabaseUrl } from './constants'

export const supabase = createClient(SupabaseUrl, SupabaseAnonKey)
