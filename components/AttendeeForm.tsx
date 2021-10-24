import React, { useState } from "react";
import * as Yup from "yup";
import { withFormik, FormikProps, FormikErrors, Form, Field } from "formik";
import ToggleSwitch from "./ToggleSwitch";

interface FormValues {
  fullname: string;
  email: string;
  notificationWhenVideoPublished: boolean;
  rateMyPresentation: boolean;
  notificationOfOtherTalks: boolean;
}

interface AttendeeFormProps {
  initialName?: string;
  initialEmail?: string;
  initialNotificationWhenVideoPublished?: boolean;
  initialRateMyPresentation?: boolean;
  initialNotificationOfOtherTalks?: boolean;
}

const InnerForm = (props: FormikProps<FormValues>) => {
  const { touched, errors, isSubmitting, initialValues } = props;
  const [notificationWhenVideoPublished, setNotificationWhenVideoPublished] =
    useState(initialValues.notificationWhenVideoPublished);
  const [rateMyPresentation, setRateMyPresentation] = useState(
    initialValues.rateMyPresentation
  );
  const [notificationOfOtherTalks, setNotificationOfOtherTalks] = useState(
    initialValues.notificationOfOtherTalks
  );

  return (
    <Form className="flex flex-col space-y-5">
      <div className="flex flex-col space-y-1">
        <label className="font-bold text-sm" htmlFor="fullname">
          Full name
        </label>
        <Field
          type="text"
          name="fullname"
          className="h-10 w-full border border-black capitalize px-2"
        />
        {/* {touched.fullname && errors.fullname && <div>{errors.fullname}</div>} */}
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
  );
};

const validate = (values: FormValues) => {
  let errors: FormikErrors<FormValues> = {};

  if (!values.fullname) {
    errors.fullname = "Required";
  }

  if (!values.email) {
    errors.email = "Required";
  }

  return errors;
};

const handleSubmit = (values: FormValues) => {};

const AttendeeForm = withFormik<AttendeeFormProps, FormValues>({
  mapPropsToValues: props => ({
    email: props.initialEmail || "",
    fullname: props.initialName || "",
    notificationWhenVideoPublished: false,
    rateMyPresentation: true,
    notificationOfOtherTalks: false,
  }),
  validate,
  handleSubmit,
})(InnerForm);

export default AttendeeForm;
