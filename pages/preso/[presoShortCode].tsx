import Details from '@components/PresoDetails'
import { Preso, PresoDetails } from '@types'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useClient } from 'react-supabase'

const PresoDetail: NextPage = () => {
  const router = useRouter()
  const client = useClient()
  const { presoShortCode } = router.query
  const [preso, setPreso] = useState<Preso | null>(null)

  const onSubmit = async (values: PresoDetails) => {
    try {
      await fetch('/api/preso', {
        method: 'PUT',
        body: JSON.stringify({
          ...values,
          id: preso?.id
        } as PresoDetails)
      })
    } catch (error) {
      const { message } = error as Error
      console.error(message)
    }
  }

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
        onSubmit={onSubmit}
        onViewSurvey={(presoId) => {
          router.push(`/response/${presoId}`)
        }}
      />
    </div>
  ) : (
    <div></div>
  )
}

export default PresoDetail
