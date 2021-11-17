import { PresenterSignupForm } from '@types'
import { Field, Form, Formik, FormikErrors, FormikProps } from 'formik'
import React from 'react'

interface Props {
  onSubmit: (values: PresenterSignupForm) => Promise<void>
}

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

const onValidate = (values: PresenterSignupForm) => {
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

const SignUpForm: React.FC<Props> = (props) => {
  return (
    <Formik
      initialValues={
        {
          firstName: '',
          lastName: '',
          email: '',
          profileImage: ''
        } as PresenterSignupForm
      }
      onSubmit={props.onSubmit}
      validate={onValidate}
    >
      {(formikProps) => InnerForm(formikProps)}
    </Formik>
  )
}

export default SignUpForm
