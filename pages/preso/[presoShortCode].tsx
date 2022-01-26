import { useSupabase } from '@common/supabaseProvider'
import Details from '@components/PresoDetails'
import { Preso } from '@types'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const PresoDetails: NextPage = () => {
  const router = useRouter()
  const { client } = useSupabase()
  const { presoShortCode } = router.query
  const [preso, setPreso] = useState<Preso | null>(null)

  useEffect(() => {
    async function getPresoDetails() {
      if (typeof presoShortCode !== 'string') {
        return
      }

      const { data, error } = await client
        .from<Preso>('Preso')
        .select()
        .eq('shortCode', presoShortCode)
        .single()

      if (error) {
        console.error(error)
      }

      if (data) {
        setPreso(data)
      }
    }

    getPresoDetails()
  }, [client, presoShortCode])

  return preso ? (
    <div>
      <Details
        preso={preso}
        onSubmit={async () =>
          Promise.resolve(console.log('Save button clicked'))
        }
        onViewSurvey={(presoId) => {
          router.push(`/response/${presoId}`)
        }}
      />
    </div>
  ) : (
    <div></div>
  )
}

export default PresoDetails
