import { Field, Form, Formik, FormikErrors, FormikHelpers } from "formik";
import { NextRouter, useRouter } from "next/router";
import React from "react";
import { useRecoilState } from "recoil";
import { AddPresentationForm } from "../../@types/forms";
import { presentationUrl } from "./state";

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

const AddPresentationForm: React.FC<{}> = () => {
  const router = useRouter();
  const onSubmit = createSubmitHandler(router);
  const initialValues: AddPresentationForm = { url: "" };
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
            <label className="font-bold text-sm" htmlFor="url">
              Link to slides
            </label>
            <Field
              type="url"
              name="url"
              className="h-10 w-full border border-black capitalize px-2"
            />
          </div>

          <input
            type="text"
            onChange={e => {
              e.preventDefault();
              setUrl(e.target.value);
            }}
            value={url}
          />

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
export default AddPresentationForm;
