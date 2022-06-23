import { useAuth } from '@components/Hooks/useAuth'
import { Preso } from '@types'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useClient } from 'react-supabase'

const Presos: NextPage = () => {
  const router = useRouter()
  const [presos, setPresos] = useState<Preso[]>([])
  const { user } = useAuth()
  const client = useClient()

  useEffect(() => {
    const loadPresos = async () => {
      const { error, data } = await client
        .from<Preso>('Preso')
        .select()
        .eq('userId', user?.id)
        .order('createdAt', { ascending: false })

      if (error) {
        console.error(error)
        return
      }

      setPresos(data || [])
    }

    loadPresos()
  }, [client, user?.id])

  return (
    <>
      <h1 className="text-3xl bg-black py-2 px-6 text-white">Your Presos</h1>
      <div className="pt-4 px-6">
        <div className="mt-6">
          <ul>
            {presos.length ? (
              presos.map((p) => (
                <li key={p.id}>
                  <a href={`/preso/${p.shortCode}`}>{p.eventName}</a>
                </li>
              ))
            ) : (
              <p>You have no presentations at the time.</p>
            )}
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
