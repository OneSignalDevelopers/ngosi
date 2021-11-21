import { Presenter } from '.prisma/client'
import type { Writeable } from '@common/utils'
import { PresenterSignupForm } from '@types'
import cuid from 'cuid'
import { NextApiRequest, NextApiResponse } from 'next'
import { db } from './common/database'

type Data =
  | {
      presenterId: string
    }
  | {
      error: string
    }

export default async function asynchandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const formData = JSON.parse(req.body) as PresenterSignupForm
    const errors = validate(formData)
    if (!Object.keys(errors)) {
      res.status(500).json({ error: JSON.stringify(errors) })
      return
    }

    const presenter = await db.presenter.create({
      data: {
        id: cuid(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        profileImage: formData.profileImage
      }
    })

    res.status(200).json({ presenterId: presenter.id })
  } catch (error) {
    const { message } = error as Error
    res.status(500).json({ error: message })
  }
}

function validate(formData: PresenterSignupForm) {
  let errors: Partial<Writeable<PresenterSignupForm>> = {}

  if (!formData.firstName) {
    errors.firstName = 'First name is required.'
  }

  if (!formData.lastName) {
    errors.lastName = 'Last name is required.'
  }

  if (!formData.email) {
    errors.email = 'An email is Required.'
  }

  // Check if the profileImage is a URL

  return errors
}
