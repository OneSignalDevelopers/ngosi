import { useSupabase } from '@common/supabaseProvider'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const PresoDetails: NextPage = () => {
  const router = useRouter()
  const { client: supabaseClient } = useSupabase()
  const { id: presoId } = router.query

  useEffect(() => {
    // fetch preso details
  }, [])

  return <pre>{JSON.stringify(router.query, null, 2)}</pre>
}

export default PresoDetails
