import { useSupabase } from '@common/useSupabase'
import Footer from '@components/Footer'
import { SupabaseClient } from '@supabase/supabase-js'
import { Attendee, Preso, Survey } from '@types'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Groupies: NextPage = () => {
  const router = useRouter()
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const { authState, session, supabaseClient } = useSupabase()

  useEffect(() => {
    const loadPresos = async () => {
      if (!session) {
        return
      }

      const { error: presoErr, data: presoIds } = await supabaseClient
        .from<Preso>('Preso')
        .select('id')
        .eq('userId', session?.user?.id)
        .order('createdAt', { ascending: false })

      if (presoErr) {
        console.error(presoErr)
        return
      }

      if (!presoIds) {
        return
      }

      const { data: surveys, error: surveyErr } = await supabaseClient
        .from<Survey>('Survey')
        .select('attendeeId')
        .in(
          'presoId',
          presoIds.map((x) => x.id)
        )

      if (!surveys) {
        return
      }

      const { data: attendees, error: attendeeErr } = await supabaseClient
        .from<Attendee>('Attendee')
        .select()
        .in(
          'id',
          surveys.map((x) => x.attendeeId)
        )

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
                <li key={a.id}>{a.fullName}</li>
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
