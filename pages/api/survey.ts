import { Preso } from '@types'
import { getInMemDb } from 'utils/db'
import { NextApiRequest, NextApiResponse } from 'next'

type Data =
  | {
      preso: Preso
    }
  | {
      error: string
    }

export default async function asynchandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const inMemDb = getInMemDb()
  console.log('Get from db', inMemDb.get('72fe95c'))

  try {
    const { pid } = req.body
    const preso = inMemDb.get(pid as string)
    console.log('Preso', preso)
    if (!preso) {
      res.status(500).json({ error: `Preso with ID ${pid} couldn't be found.` })
      return
    }

    res.status(200).json({ preso })
  } catch (error) {
    const { message } = error as Error
    res.status(500).json({ error: message })
  }
}
