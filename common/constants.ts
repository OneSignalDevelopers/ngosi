export const __env__ = process.env.NEXT_PUBLIC_ENV!
export const isLocal = __env__ === 'local'
export const isStaging = __env__ === 'staging'
export const isProduction = __env__ === 'production'
export const OneSignalApiKey = process.env.ONESIGNAL_API_KEY!
export const PublicUrl = process.env.NEXT_PUBLIC_PUBLIC_URL
export const LocalUrl = 'localhost:3000'
export const OneSignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!
export const SupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const SupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
