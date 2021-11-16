import { NextApiRequest, NextApiResponse } from 'next'
import checksum from 'checksum'
import { getInMemDb } from 'utils/db'

type Data =
  | {
      presoUid: string
    }
  | {
      error: string
    }

export default async function asynchandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const inMemDb = getInMemDb()

  try {
    const { url } = JSON.parse(req.body)
    if (!url) {
      res.status(500).json({ error: 'No url given.' })
    }

    // process the URL
    const hash = checksum(url)
    const pid = hash.substr(0, 7)

    inMemDb.set(pid, {
      id: pid,
      eventName: 'Testing Ngosi',
      presenter: 'William Shepherd',
      title: 'Does it matter?',
      location: 'Houston'
    })

    console.log('inMemDb', JSON.stringify(inMemDb.get(pid)))

    res.status(200).json({ presoUid: pid })
  } catch (error) {
    const { message } = error as Error
    res.status(500).json({ error: message })
  }
}
