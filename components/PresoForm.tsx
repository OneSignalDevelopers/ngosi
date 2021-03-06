import { PresoForm as PresoForm } from '@types'
import { Field, FieldProps, Form, Formik, FormikErrors } from 'formik'
import React from 'react'
import type { Writeable } from '@common/utils'

interface Props {
  readonly onSubmit: (values: PresoForm) => Promise<void>
}

const onValidate = (values: PresoForm) => {
  let errors: FormikErrors<Writeable<PresoForm>> = {}

  if (!values.title) {
    errors.title = 'A presentation title is required.'
  }

  if (!values.url) {
    errors.url = 'The link to your slides is required.'
  }

  if (!values.eventName) {
    errors.eventName = 'A name for the event is required.'
  }

  return errors
}

const PresoForm: React.FC<Props> = (props) => {
  return (
    <Formik
      initialValues={
        { url: '', eventName: '', title: '', eventLocation: '' } as PresoForm
      }
      onSubmit={props.onSubmit}
      validate={onValidate}
    >
      {(formikProps) => (
        <Form className="flex flex-col space-y-5 w-80">
          <div className="flex flex-col space-y-1">
            <label
              className="font-semibold text-sm text-gray-900"
              htmlFor="url"
            >
              Enter link to your presentation
            </label>
            <Field name="url">
              {({ field, form, ...props }: FieldProps<PresoForm>) => (
                <>
                  <input
                    {...field}
                    type="url"
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    value={formikProps.values.url}
                    className="h-12 w-full border border-black text-lg px-2 "
                    placeholder="https://ngosi.io"
                  />
                  {form.touched.url && form.errors.url && (
                    <div>{form.errors.url}</div>
                  )}
                </>
              )}
            </Field>
          </div>

          <div className="flex flex-col space-y-1">
            <label
              className="font-semibold text-sm text-gray-900"
              htmlFor="url"
            >
              Title
            </label>
            <Field
              name="title"
              type="text"
              className="h-12 w-full border border-black text-lg px-2"
              placeholder="Yahoo!"
            ></Field>
          </div>

          <div className="flex flex-col space-y-1">
            <label
              className="font-semibold text-sm text-gray-900"
              htmlFor="url"
            >
              Event Name
            </label>
            <Field
              name="eventName"
              type="text"
              className="h-12 w-full border border-black text-lg px-2"
              placeholder="Yahoo! Conf"
            ></Field>
          </div>

          <div className="flex flex-col space-y-1">
            <label
              className="font-semibold text-sm text-gray-900"
              htmlFor="url"
            >
              Event location
            </label>

            <Field
              name="location"
              type="text"
              className="h-12 w-full border border-black text-lg px-2"
              placeholder="Houston, TX"
            ></Field>
          </div>

          <button
            type="submit"
            disabled={formikProps.isSubmitting}
            className="w-full h-14 bg-black text-white font-bold text-xl"
          >
            Generate QR Code
          </button>
        </Form>
      )}
    </Formik>
  )
}
export default PresoForm
