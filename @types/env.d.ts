declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_ENV: string
      NEXT_PUBLIC_PUBLIC_URL: string | undefined
      NEXT_PUBLIC_ONESIGNAL_APP_ID: string
      ONESIGNAL_API_KEY: string
      NEXT_PUBLIC_SUPABASE_URL: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    }
  }
}

export {}
