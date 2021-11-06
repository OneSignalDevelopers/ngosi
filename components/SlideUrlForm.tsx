import { Field, Form, Formik, FormikErrors, FormikHelpers } from "formik";
import { NextRouter, useRouter } from "next/router";
import React from "react";
import { AddPresentationForm } from "../@types/forms";

interface SlideUrlForm {
  slides?: string;
}

const onValidate = (values: AddPresentationForm) => {
  let errors: FormikErrors<AddPresentationForm> = {};

  if (!values.url) {
    errors.url = "Required";
  }

  return errors;
};

const createSubmitHandler =
  (router: NextRouter, formikHelpers?: FormikHelpers<AddPresentationForm>) =>
  async (values: AddPresentationForm) => {
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

const SlideUrlForm: React.FC<{}> = () => {
  const router = useRouter();
  const onSubmit = createSubmitHandler(router);
  const initialValues: AddPresentationForm = { url: "" };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={onValidate}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col space-y-5">
          <div className="flex flex-col space-y-1">
            <label className="font-bold text-sm" htmlFor="slides">
              Link to slides
            </label>
            <Field
              type="url"
              name="slides"
              className="h-10 w-full border border-black capitalize px-2"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 bg-black text-white font-bold text-xl"
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};
export default SlideUrlForm;
