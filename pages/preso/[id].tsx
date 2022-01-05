import { useSupabase } from '@common/supabaseProvider'
import { Preso } from '@types'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const PresoDetails: NextPage = () => {
  const router = useRouter()
  const { client } = useSupabase()
  const { id: shortCode } = router.query
  const [preso, setPreso] = useState<Preso | null>(null)

  useEffect(() => {
    async function getPresoDetails() {
      if (typeof shortCode !== 'string') {
        return
      }

      const { data, error } = await client
        .from<Preso>('Preso')
        .select()
        .eq('shortCode', shortCode)
        .single()

      if (error) {
        console.error(error)
        return
      }

      if (data) {
        console.log(data)
        setPreso(data)
      }
    }

    getPresoDetails()
  }, [client, shortCode])

  return <pre>{JSON.stringify(preso, null, 2)}</pre>
}

export default PresoDetails
