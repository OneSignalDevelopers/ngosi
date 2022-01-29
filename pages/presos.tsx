import { useSupabase } from '@common/supabaseProvider'
import { Preso } from '@types'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Presos: NextPage = () => {
  const router = useRouter()
  const [presos, setPresos] = useState<Preso[]>([])
  const { authState, session, client: supabaseClient } = useSupabase()

  useEffect(() => {
    const loadPresos = async () => {
      if (authState !== 'authenticated') {
        return
      }

      const { error, data } = await supabaseClient
        .from<Preso>('Preso')
        .select()
        .eq('userId', session?.user?.id)
        .order('createdAt', { ascending: false })

      if (error) {
        console.error(error)
        return
      }

      setPresos(data || [])
    }

    loadPresos()
  }, [supabaseClient, session, authState])

  return (
    <>
        <h1 className="text-3xl bg-black py-2 px-6 text-white">Your Presos</h1>
        <div className="pt-4 px-6">
          <div className="mt-6">
            <ul>
              {presos.map((p) => (
                <li key={p.id}>
                  <a href={`/preso/${p.shortCode}`}>{p.eventName}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          className="w-full h-14 bg-black text-white font-bold text-xl mt-5"
          type="button"
          onClick={() => {
            router.push('preso')
          }}
        >
          Add New Preso
        </button>
    </>
  )
}

export default Presos
