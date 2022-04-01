import { useSupabase } from '@common/supabaseProvider'
import FooterBar from '@components/FooterBar'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
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
  const router = useRouter();
  const [attendees, setAttendees] = useState<AttendeeView[]>([])
  const { authState, session, client: supabaseClient } = useSupabase()

  useEffect(() => {
    if (authState !== 'authenticated') {
      router.replace('/signin')
    }
  }, [authState, router])

  useEffect(() => {
    const loadPresos = async () => {
      const { error, data: attendees } = await supabaseClient
        .from('attendees_view')
        .select()
        .eq('presenter', session?.user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error(error)
      } else if (attendees) {
        setAttendees(attendees)
      }
    }

    loadPresos()
  }, [supabaseClient, session])

  return (
    <>
      <h1 className="text-3xl bg-black py-2 px-6 text-white">Your Audience</h1>
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
    </>
  )
}

export default Groupies
