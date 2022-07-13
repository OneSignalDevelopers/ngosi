import { useAuth } from '@components/Hooks/useAuth'
import { useEffect, useState } from 'react'
import { useClient } from 'react-supabase'

const Account: React.FC = (props) => {
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)
  const { session, user } = useAuth()
  const client = useClient()

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true)

        let { data, error, status } = await client
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
  }, [client, user])

  async function updateProfile({ username, website, avatar_url }: any) {
    try {
      setLoading(true)
      const user = client.auth.user()
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
    <div className="mt-16">
      <div className="flex flex-col">
        <label className="mt-1" htmlFor="email">
          Email
        </label>
        <input
          className="h-10 w-80 p-3"
          id="email"
          type="text"
          value={session?.user?.email}
          disabled
        />
      </div>
      <div className="flex flex-col">
        <label className="mt-3" htmlFor="username">
          Name
        </label>
        <input
          className="h-10 w-80 p-3"
          placeholder="Enter Name"
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <label className="mt-3" htmlFor="website">
          Website
        </label>
        <input
          className="h-10 w-80 p-3"
          placeholder="Enter Website"
          id="website"
          type="website"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <button
          className="h-10 bg-black text-white font-bold text-xl mt-5 w-80"
          onClick={() => updateProfile({ username, website, avatar_url })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <button
          className="h-10 bg-black text-white font-bold text-xl mt-5 w-80"
          onClick={() => client.auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default Account
