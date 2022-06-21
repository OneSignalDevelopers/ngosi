import { useSupabase } from '@common/supabaseProvider'
import { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [yupError, setyupError] = useState('')
  const { client: supabaseClient } = useSupabase()

  const sendMagicLinkSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is Required')
  })

  const handleLogin = async (email: string) => {
    try {
      setLoading(true)
      const { error } = await supabaseClient.auth.signIn({ email })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      const e = error as any
      setyupError(e.error_description || e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Formik
      initialValues={{
        email: ''
      }}
      validationSchema={sendMagicLinkSchema}
    >
      {({ errors, touched }) => (
        <Form className="flex flex-col">
          <h1 className="text-4xl text-center">Ngosi</h1>
          <p className=" mt-5">Sign in via magic link with your email below</p>

          <Field
            className="h-9 border border-black text-lg px-2 mt-1 w-80"
            name="email"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {(errors.email && touched.email) || yupError ? (
            <div className="text-red-500 text-sm w-80 mt-1">
              {yupError || errors.email}
            </div>
          ) : null}

          <button
            onClick={(e) => {
              e.preventDefault()
              handleLogin(email)
            }}
            className="h-14 bg-accent-primary text-black font-bold text-xl mt-5 w-80 shadow-xl rounded-lg"
            disabled={loading}
          >
            <span>{loading ? 'Loading' : 'Send magic link'}</span>
          </button>
        </Form>
      )}
    </Formik>
  )
}
