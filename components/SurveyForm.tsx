import type { Writeable } from '@common/utils'
import ToggleSwitch from '@components/ToggleSwitch'
import { Field, Form, Formik, FormikErrors, FormikProps } from 'formik'
import React, { useState } from 'react'
import { SurveyForm, SurveyFormResponse } from 'types'

const InnerForm = (props: FormikProps<SurveyFormResponse>) => {
  const { touched, errors, isSubmitting, initialValues } = props
  const [notificationWhenVideoPublished, setNotificationWhenVideoPublished] =
    useState(initialValues.notifyWhenVideoPublished)
  const [rateMyPresentation, setRateMyPresentation] = useState(
    initialValues.sendPresoFeedback
  )
  const [notificationOfOtherTalks, setNotificationOfOtherTalks] = useState(
    initialValues.notifyOfOtherTalks
  )

  return (
    <Form className="flex flex-col space-y-5">
      <div className="flex flex-col space-y-1">
        <label className="font-bold text-sm" htmlFor="fullName">
          Full name
        </label>
        <Field
          type="text"
          name="fullName"
          className="h-10 w-full border border-black capitalize px-2"
        />
        {touched.fullName && errors.fullName && <div>{errors.fullName}</div>}
      </div>

      <div className="flex flex-col space-y-1">
        <label className="font-bold text-sm" htmlFor="email">
          Email
        </label>
        <Field
          type="email"
          name="email"
          className="h-10 w-full border border-black capitalize px-2"
        />
        {touched.email && errors.email && <div>{errors.email}</div>}
      </div>

      <ToggleSwitch
        label="Get notified when this talk is published?"
        description="Get notified when this talk is published"
        enabled={notificationWhenVideoPublished}
        onSwitch={() =>
          setNotificationWhenVideoPublished(!notificationWhenVideoPublished)
        }
      />

      <ToggleSwitch
        label="Get notified when I publish other talks?"
        description="Get notified when I publish other talks"
        enabled={notificationOfOtherTalks}
        onSwitch={() => setNotificationOfOtherTalks(!notificationOfOtherTalks)}
      />

      <ToggleSwitch
        label="Are you willing to provide feedback?"
        description="Help me improve by grading my performance"
        enabled={rateMyPresentation}
        onSwitch={() => setRateMyPresentation(!rateMyPresentation)}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 bg-black text-white font-bold text-xl"
      >
        Submit
      </button>
    </Form>
  )
}

interface Props {
  readonly onSubmit: (values: SurveyForm) => Promise<void>
}

const SurveyForm: React.FC<Props> = (props) => {
  return (
    <Formik
      initialValues={
        {
          fullName: '',
          email: '',
          notifyOfOtherTalks: true,
          notifyWhenVideoPublished: true,
          sendPresoFeedback: true
        } as SurveyFormResponse
      }
      onSubmit={props.onSubmit}
      validate={onValidate}
    >
      {(formikProps) => InnerForm(formikProps)}
    </Formik>
  )
}

const onValidate = (values: SurveyFormResponse) => {
  let errors: FormikErrors<Writeable<SurveyFormResponse>> = {}

  if (!values.fullName) {
    errors.fullName = 'Required'
  }

  if (!values.email) {
    errors.email = 'Required'
  }

  return errors
}

export default SurveyForm
