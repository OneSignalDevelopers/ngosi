import { PresenterSignupForm } from '@types'
import { FormikErrors, FormikProps, withFormik, Form, Field } from 'formik'
import React from 'react'

const InnerForm = (props: FormikProps<PresenterSignupForm>) => {
  const { touched, errors, isSubmitting, initialValues } = props
  return (
    <Form className="flex flex-col space-y-5 max-w-xl">
      <div className="flex flex-col space-y-1">
        <label className="font-bold text-sm" htmlFor="firstName">
          First name
        </label>
        <Field
          type="text"
          name="firstName"
          className="h-10 w-full border border-black capitalize px-2"
        />
        {touched.firstName && errors.firstName && <div>{errors.firstName}</div>}
      </div>

      <div className="flex flex-col space-y-1">
        <label className="font-bold text-sm" htmlFor="lastName">
          Last name
        </label>
        <Field
          type="text"
          name="lastName"
          className="h-10 w-full border border-black capitalize px-2"
        />
        {touched.lastName && errors.lastName && <div>{errors.lastName}</div>}
      </div>

      <div className="flex flex-col space-y-1">
        <label className="font-bold text-sm" htmlFor="email">
          Email
        </label>
        <Field
          type="text"
          name="email"
          className="h-10 w-full border border-black capitalize px-2"
        />
        {touched.email && errors.email && <div>{errors.email}</div>}
      </div>

      <div className="flex flex-col space-y-1">
        <label className="font-bold text-sm" htmlFor="profileImage">
          Profile picture
        </label>
        <Field
          type="url"
          name="profileImage"
          className="h-10 w-full border border-black capitalize px-2"
        />
        {touched.profileImage && errors.profileImage && (
          <div>{errors.profileImage}</div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 bg-black text-white font-bold text-xl"
      >
        Sign Up
      </button>

      <button
        type="button"
        className="w-full h-14 bg-black text-white font-bold text-xl"
      >
        Cancel
      </button>
    </Form>
  )
}

const validate = (values: PresenterSignupForm) => {
  let errors: FormikErrors<PresenterSignupForm> = {}

  if (!values.firstName) {
    errors.firstName = 'First name is required.'
  }

  if (!values.lastName) {
    errors.lastName = 'Last name is required.'
  }

  if (!values.email) {
    errors.email = 'An email is Required.'
  }

  return errors
}

const handleSubmit = async (values: PresenterSignupForm) => {
  const response = await fetch('/api/signup', {
    method: 'POST',
    body: JSON.stringify(values)
  })

  console.log('SignupFormSubmit', response)
}

type InitProps = Partial<PresenterSignupForm>

const SignUpForm = withFormik<InitProps, PresenterSignupForm>({
  mapPropsToValues: (props) => ({
    firstName: props.firstName || '',
    lastName: props.lastName || '',
    email: props.email || '',
    profileImage: props.profileImage || ''
  }),
  validate,
  handleSubmit
})(InnerForm)

export default SignUpForm
