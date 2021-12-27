import { useSupabase } from '@common/useSupabase'
import Footer from '@components/Footer'
import { SupabaseClient } from '@supabase/supabase-js'
import { Attendee, Preso, Survey } from '@types'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface AttendeeView {
  presenter: string
  preso: string
  attendee: string
  email: string
  name: string
  created_at: string
}

const Groupies: NextPage = () => {
  const router = useRouter()
  const [attendees, setAttendees] = useState<AttendeeView[]>([])
  const { authState, session, supabaseClient } = useSupabase()

  useEffect(() => {
    const loadPresos = async () => {
      if (!session) {
        return
      }

      const { error, data: attendees } = await supabaseClient
        .from('attendees_view')
        .select()
        .eq('presenter', session?.user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error(error)
        return
      }

      if (attendees) {
        setAttendees(attendees)
      }
    }

    loadPresos()
  }, [supabaseClient, session])

  return (
    <div className="flex flex-col min-h-screen min-w-full">
      <Head>
        <title>Ngosi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col flex-1">
        <h1 className="text-3xl bg-black py-2 px-6 text-white">
          Your Groupies
        </h1>
        <div className="pt-4 px-6">
          <div className="mt-6">
            <ul>
              {attendees.map((a) => (
                <li key={a.attendee}>
                  {a.name} {a.email}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Groupies
