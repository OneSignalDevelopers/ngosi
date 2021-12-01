import { Profile } from '@types'
import { NextApiRequest, NextApiResponse } from 'next'
import { db } from './common/database'

type Data =
  | {
      message: string
    }
  | {
      error: string
    }

// PUT
export default async function asynchandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'POST':
      updateProfile(req, res)
      break
    case 'PUT':
      console.log('Put stuff.')
      completeOnboarding(req, res)
      break
  }
}

const updateProfile = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  try {
    const { id, username, avatar_url } = JSON.parse(req.body) as Profile

    await db.profiles.upsert({
      where: {
        id: id
      },
      update: {
        avatar_url: avatar_url || ''
      },
      create: {
        id: id, // We don't create this ID because we get it from supabase auth.
        avatar_url: avatar_url || '',
        username: username
      }
    })

    res.status(200).json({ message: 'ok' })
  } catch (error) {
    const { message } = error as Error
    res.status(500).json({ error: message })
  }
}

const completeOnboarding = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {}
