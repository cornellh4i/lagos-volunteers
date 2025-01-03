import React, { useEffect } from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { auth } from "@/utils/firebase";
import Snackbar from "../atoms/Snackbar";
import { BASE_URL_CLIENT } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";

type FormValues = {
  email: string;
};

/** A ForgotPasswordForm page */
const ForgotPasswordForm = () => {
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [success, setSuccess] = React.useState<boolean>(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] =
    React.useState<boolean>(false);
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
      <Snackbar
        variety="error"
        open={errorSnackbarOpen}
        onClose={() => setErrorSnackbarOpen(false)}
      >
        Error: {handleErrors(error.message)}
      </Snackbar>
    ) : null;
  };

  const ForgotPasswordSuccessComponent = (): JSX.Element | null => {
    return success ? (
      <Snackbar
        variety="success"
        open={success}
        onClose={() => setSuccess(false)}
      >
        Success: Password reset email sent. Please check your inbox.
      </Snackbar>
    ) : null;
  };

  const handleForgotPassword: SubmitHandler<FormValues> = async (data) => {
    const { email } = data;

    const resetPassword = await sendPasswordResetEmail(email);
    if (resetPassword) {
      setSuccess(true);
    }
  };

  useEffect(() => {
    if (error) {
      setErrorSnackbarOpen(true);
    }
  }, [error]);

  return (
    <>
      <ForgotPasswordErrorComponent />
      <ForgotPasswordSuccessComponent />
      <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-4">
        <img src="/lfbi_logo.png" className="w-24" />
        <div className="font-bold text-3xl">Forgot Password</div>
        <div className="text-sm">
          After verifying your email, you will receive instructions on how to
          reset your password. If you continue to experience issues, please
          contact our support team for assistance.
        </div>
        <div>
          <TextField
            error={errors.email?.message}
            label="Email"
            {...register("email", {
              required: { value: true, message: "Required" },
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                message: "Invalid email address",
              },
            })}
          />
        </div>
        <div className="pt-2">
          <Button loading={sending} type="submit">
            Email me a link
          </Button>
        </div>
        <div className="justify-center flex flex-row">
          <div>Have an account?&nbsp;</div>
          <Link
            href="/login"
            className="text-primary-200 hover:underline no-underline"
          >
            Log in
          </Link>
        </div>
      </form>
    </>
  );
};

export default ForgotPasswordForm;
