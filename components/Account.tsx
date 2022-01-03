import { useSupabase } from '@common/supabaseProvider'
import type { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

interface Props {
  session: Session
}

const Account: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)
  const { supabaseClient } = useSupabase()

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true)
        const user = supabaseClient.auth.user()

        let { data, error, status } = await supabaseClient
          .from('profiles')
          .select(`username, website, avatar_url`)
          .eq('id', user!.id)
          .single()

        if (error && status !== 406) {
          throw error
        }

        if (data) {
          setUsername(data.username)
          setWebsite(data.website)
          setAvatarUrl(data.avatar_url)
        }
      } catch (error) {
        alert((error as any).message)
      } finally {
        setLoading(false)
      }
    }
    getProfile()
  }, [supabaseClient])

  async function updateProfile({ username, website, avatar_url }: any) {
    try {
      setLoading(true)
      const user = supabaseClient.auth.user()
      const updates = {
        id: user!.id,
        username,
        website,
        avatar_url,
        updated_at: new Date()
      }

      const response = await fetch('/api/profile', {
        method: 'POST',
        body: JSON.stringify(updates)
      })
      const json = await response.json()
      const { message, error } = json

      if (error) {
        throw error
      }
    } catch (error) {
      alert((error as any).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-widget">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          value={props.session.user?.email}
          disabled
        />
      </div>
      <div>
        <label htmlFor="username">Name</label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="website"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button block primary"
          onClick={() => updateProfile({ username, website, avatar_url })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <button
          className="button block"
          onClick={() => supabaseClient.auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default Account
