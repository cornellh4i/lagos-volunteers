import React, { useState, useEffect } from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import Link from "next/link";
import { useAuth } from "@/utils/AuthContext";
import { auth } from "@/utils/firebase";
import { BASE_URL } from "@/utils/constants";
import { useForm, SubmitHandler } from "react-hook-form";
import Alert from "../atoms/Alert";
import { useRouter } from "next/router";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import Snackbar from "../atoms/Snackbar";
import { api } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignupForm = () => {
  const router = useRouter();

  /** Firebase hooks */
  const [
    signInWithEmailAndPassword,
    signedInUser,
    signInLoading,
    signInErrors,
  ] = useSignInWithEmailAndPassword(auth);

  /** React hook form */
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  /** State variables for the notification popups */
  const [notifOpen, setNotifOpen] = useState(false);

  /** Tanstack query mutation to create a new user */
  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: async (data: FormValues) => {
      const { firstName, lastName, email, password } = data;
      const emailLowerCase = email.toLowerCase();
      const post = {
        email: emailLowerCase,
        profile: {
          firstName,
          lastName,
        },
        password,
      };
      const { response } = await api.post("/users", post, false);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      return response;
    },
    retry: false,
  });

  /** Handles submit */
  const handleUserSignUp: SubmitHandler<FormValues> = async (data, event) => {
    // Create a new user
    await mutateAsync(data);

    // Log in
    const { email, password } = data;
    await signInWithEmailAndPassword(email, password);
  };

  /** Handles signup success */
  useEffect(() => {
    if (signedInUser) {
      router.push("/events/view");
    }
  }, [signedInUser]);

  /** Handles signup API errors */
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (isError) {
      const userAlreadyExistsPrisma = /Unique constraint failed/;
      const passwordLengthError =
        /The password must be a string with at least 6 characters./;
      const invalidEmailError = /The email address is badly formatted./;
      const EmailAlreadyExists = /A user with that email already exists/;

      // TODO: add more common error pattern

      switch (true) {
        case userAlreadyExistsPrisma.test(error.message):
          setErrorMessage("A user with that email already exists.");
          break;
        case passwordLengthError.test(error.message):
          setErrorMessage("Password should be at least 6 characters.");
          break;
        case invalidEmailError.test(error.message):
          setErrorMessage("Invalid email address format.");
          break;
        case EmailAlreadyExists.test(error.message):
          setErrorMessage("A user with that email already exists.");
          break;
        default:
          setErrorMessage(
            "Something went wrong trying to create your account. Please try again."
          );
          break;
      }
      setNotifOpen(true);
    }
  }, [isError]);

  return (
    <>
      {/* Sign up error component */}
      <Snackbar
        variety="error"
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
      >
        Error: {errorMessage}
      </Snackbar>

      {/* Sign up form */}
      <form onSubmit={handleSubmit(handleUserSignUp)} className="space-y-4">
        <img src="/lfbi_logo.png" className="w-24" />
        <div className="font-bold text-3xl">Sign Up</div>
        <div>
          <TextField
            error={errors.email ? "Required" : undefined}
            type="email"
            label="Email"
            {...register("email", { required: true })}
          />
        </div>
        <div className="grid sm:space-x-4 grid-cols-1 sm:grid-cols-2 ">
          <div className="pb-4 sm:pb-0">
            <TextField
              error={errors.firstName ? "Required" : undefined}
              label="First Name"
              {...register("firstName", { required: true })}
            />
          </div>
          <div>
            <TextField
              error={errors.lastName ? "Required" : undefined}
              label="Last Name"
              {...register("lastName", { required: true })}
            />
          </div>
        </div>
        <div>
          <TextField
            error={errors.password ? "Required" : undefined}
            type="password"
            label="Password"
            {...register("password", { required: true })}
          />
        </div>
        <div>
          <TextField
            type="password"
            error={
              errors.confirmPassword
                ? "Required"
                : watch("password") != watch("confirmPassword")
                ? "Passwords do not match"
                : undefined
            }
            label="Confirm Password"
            {...register("confirmPassword", { required: true })}
          />
        </div>
        <div>
          <Button loading={isPending} disabled={isPending} type="submit">
            Continue
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

export default SignupForm;
