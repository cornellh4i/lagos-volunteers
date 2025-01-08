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
import {
  useSignInWithEmailAndPassword,
  useSendEmailVerification,
} from "react-firebase-hooks/auth";
import Snackbar from "../atoms/Snackbar";
import { api } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
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
  const [sendEmailVerification, sending, emailError] =
    useSendEmailVerification(auth);

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
      const { firstName, lastName, email, phoneNumber, password } = data;
      const emailLowerCase = email.toLowerCase();
      const post = {
        email: emailLowerCase,
        profile: {
          firstName,
          lastName,
          phoneNumber,
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
    const res = await mutateAsync(data);

    // Log in
    const { email, password } = data;
    if (res.ok) {
      const signedInUser = await signInWithEmailAndPassword(email, password);
      if (signedInUser?.user) {
        await sendEmailVerification();
      }
    }
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
        <div className="text-sm">
          Passwords should meet the following requirements:
          <ul className="m-0 px-4">
            <li>At least 6 characters in length</li>
            <li>Contain a mix of uppercase and lowercase letters</li>
            <li>Include at least one number and one special character</li>
          </ul>
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
        <div className="grid sm:space-x-4 grid-cols-1 sm:grid-cols-2 ">
          <div className="pb-4 sm:pb-0">
            <TextField
              error={errors.firstName?.message}
              label="First name"
              {...register("firstName", {
                required: { value: true, message: "Required" },
              })}
            />
          </div>
          <div>
            <TextField
              error={errors.lastName?.message}
              label="Last name"
              {...register("lastName", {
                required: { value: true, message: "Required" },
              })}
            />
          </div>
        </div>
        <TextField
          error={errors.lastName?.message}
          label="Phone number"
          {...register("phoneNumber", {
            required: { value: true, message: "Required" },
            pattern: {
              value:
                /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
              message: "Invalid phone number",
            },
          })}
        />
        <div>
          <TextField
            error={errors.password?.message}
            type="password"
            label="Password"
            {...register("password", {
              required: { value: true, message: "Required" },
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
              validate: {
                hasUpper: (value) =>
                  /.*[A-Z].*/.test(value) ||
                  "Password must contain at least one uppercase letter",
                hasLower: (value) =>
                  /.*[a-z].*/.test(value) ||
                  "Password must contain at least one lowercase letter",
                hasNumber: (value) =>
                  /.*[0-9].*/.test(value) ||
                  "Password must contain at least one number",
                hasSpecialChar: (value) =>
                  /.*[\W_].*/.test(value) ||
                  "Password must contain at least one special character",
              },
            })}
          />
        </div>
        <div>
          <TextField
            type="password"
            error={errors.confirmPassword?.message}
            label="Confirm password"
            {...register("confirmPassword", {
              required: { value: true, message: "Required" },
              validate: {
                matchPassword: (value) =>
                  value === watch("password") || "Passwords do not match",
              },
            })}
          />
        </div>
        <div className="pt-2">
          <Button loading={isPending} disabled={isPending} type="submit">
            Sign up
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
