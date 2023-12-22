import React from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { auth } from "@/utils/firebase";
import Alert from "../atoms/Alert";
import { BASE_URL_CLIENT } from "@/utils/constants";

type FormValues = {
  email: string;
};

/** A ForgotPasswordForm page */
const ForgotPasswordForm = () => {
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [success, setSuccess] = React.useState<boolean>(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const handleErrors = (errors: any) => {
    // Firebase reset password email error codes are weird. Need to parse it
    const parsedError = errors.split("/")[1].slice(0, -2);
    switch (parsedError) {
      case "invalid-email":
        return "Invalid email address format.";
      case "user-disabled":
        return "User with this email has been disabled.";
      case "user-not-found":
        return "There is no user with this email address.";
      default:
        return "Something went wrong.";
    }
  };

  const ForgotPasswordErrorComponent = (): JSX.Element | null => {
    return error ? (
      <Alert severity="error">Error: {handleErrors(error.message)}</Alert>
    ) : null;
  };

  const ForgotPasswordSuccessComponent = (): JSX.Element | null => {
    return success ? (
      <Alert severity="success">
        Success: Password reset email sent. Please check your inbox.
      </Alert>
    ) : null;
  };

  const handleForgotPassword: SubmitHandler<FormValues> = async (data) => {
    const { email } = data;
    const actionCodeSettings = {
      url: `${BASE_URL_CLIENT}/login`,
    };

    const resetPassword = await sendPasswordResetEmail(
      email,
      actionCodeSettings
    );
    if (resetPassword) {
      setSuccess(true);
    }
    if (error) {
      console.log(error.message);
    }
    console.log(email);
  };

  return (
    <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-4">
      <ForgotPasswordErrorComponent />
      <ForgotPasswordSuccessComponent />
      <img src="/lfbi_logo.png" className="w-24" />
      <div className="font-bold text-3xl">Forgot Password</div>
      <div className="text-sm">
        After verifying your email, you will receive instructions on how to
        reset your password. If you continue to experience issues, please
        contact our support team for assistance.
      </div>
      <div>
        <TextField
          error={errors.email ? "Required" : undefined}
          type="email"
          label="Email"
          {...register("email", {
            required: "true",
          })}
        />
      </div>
      <div>
        <Button type="submit">Email me a link</Button>
      </div>
      <div className="justify-center flex flex-row">
        <div>Have an account?&nbsp;</div>
        <Link
          href="/login"
          className="text-primary hover:underline no-underline"
        >
          Log in
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
