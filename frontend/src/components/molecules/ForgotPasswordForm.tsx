import React from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";

type FormValues = {
  email: string;
};

/** A ForgotPasswordForm page */
const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const handleForgotPassword: SubmitHandler<FormValues> = async (data) => {
    const { email } = data;
    console.log(email);
  };

  return (
    <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-4">
      <div className="font-bold text-3xl">Forgot Password</div>
      <div className="text-sm">
        After verifying your email, you will receive instructions on how to
        reset your password. If you continue to experience issues, please
        contact our support team for assistance.
      </div>
      <div>
        <TextField
          requiredMessage={errors.email ? "Required" : undefined}
          name="email"
          type="email"
          register={register}
          label="Email *"
          required={true}
        />
      </div>
      <div>
        <Button type="submit" text="Send Email" color="dark-gray" />
      </div>
      <div className="justify-center flex flex-row text-sm">
        <Link href="/" className="text-black">
          {" "}
          Reach out to support team
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
