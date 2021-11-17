import { PresoForm as PresoForm } from "@types";
import { Field, FieldProps, Form, Formik, FormikErrors } from "formik";
import React from "react";

interface Props {
  readonly onSubmit: (values: PresoForm) => Promise<void>;
}

const onValidate = (values: PresoForm) => {
  let errors: FormikErrors<PresoForm> = {};

  if (!values.url) {
    errors.url = "Required";
  }

  return errors;
};

const PresoForm: React.FC<Props> = props => {
  return (
    <Formik
      initialValues={{ url: "" }}
      onSubmit={props.onSubmit}
      validate={onValidate}
    >
      {formikProps => (
        <Form className="flex flex-col space-y-5">
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
  );
};
export default PresoForm;
