import { presentationUrl } from "@state";
import { AddPresentationForm as PresentationForm } from "@types";
import {
  Field,
  FieldProps,
  Form,
  Formik,
  FormikErrors,
  FormikHelpers,
} from "formik";
import { NextRouter, useRouter } from "next/router";
import React from "react";
import { useRecoilState } from "recoil";

const onValidate = (values: PresentationForm) => {
  let errors: FormikErrors<PresentationForm> = {};

  if (!values.url) {
    errors.url = "Required";
  }

  return errors;
};

const createSubmitHandler =
  (router: NextRouter, formikHelpers?: FormikHelpers<PresentationForm>) =>
  async (values: PresentationForm) => {
    const response = await fetch("/api/generate-qr", {
      method: "POST",
      body: JSON.stringify(values),
    });

    const body = await response.json();
    const { qrCodeData } = body;
    if (qrCodeData) {
      router.replace(`/qr?qrcd=${qrCodeData}`);
    }
  };

const PresentationForm: React.FC<{}> = () => {
  const router = useRouter();
  const onSubmit = createSubmitHandler(router);
  const initialValues: PresentationForm = { url: "" };
  const [url, setUrl] = useRecoilState(presentationUrl);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={onValidate}
    >
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
                  onChange={e => {
                    e.preventDefault();
                    setUrl(e.target.value);
                  }}
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
export default PresentationForm;
