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
import { useRecoilState } from "recoil";

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
  console.log("test");
  const response = await fetch("/api/preso", {
    method: "POST",
    body: JSON.stringify(values),
  });

  console.log(response);
};

const PresoForm: React.FC = () => {
  const [url, setUrl] = useRecoilState(presentationUrl);

  return (
    <Formik initialValues={{ url }} onSubmit={onSubmit} validate={onValidate}>
      {({ isSubmitting }) => (
        <Form className="flex flex-col space-y-5">
          <div className="flex flex-col space-y-1">
            <label
              className="font-semibold text-sm text-gray-900"
              htmlFor="url"
            >
              Enter link to your presentation
            </label>
            <Field name="url">
              {({ field }: FieldProps) => (
                <input
                  {...field}
                  type="url"
                  onChange={e => setUrl(e.target.value)}
                  value={url}
                  className="h-12 w-full border border-black text-lg px-2 "
                  placeholder="https://ngosi.io"
                />
              )}
            </Field>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
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
