import { presentationUrl } from "@state";
import { PresoForm as PresoForm } from "@types";
import {
  Field,
  FieldProps,
  Form,
  Formik,
  FormikErrors,
  FormikHelpers,
} from "formik";
import React from "react";

const onValidate = (values: PresoForm) => {
  let errors: FormikErrors<PresoForm> = {};

  if (!values.url) {
    errors.url = "Required";
  }

  return errors;
};

const onSubmit = async (
  values: PresoForm,
  formikHelpers: FormikHelpers<PresoForm>
) => {
  try {
    const response = await fetch("/api/preso", {
      method: "POST",
      body: JSON.stringify(values),
    });

    console.log(response);
  } catch (error) {
    const { message } = error as Error;
    console.error(message);
  }
};

const PresoForm: React.FC = () => {
  const [url, setUrl] = useRecoilState(presentationUrl);

  return (
    <Formik
      initialValues={{ url: "" }}
      onSubmit={onSubmit}
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
            Download QR
          </button>
        </Form>
      )}
    </Formik>
  );
};
export default PresoForm;
