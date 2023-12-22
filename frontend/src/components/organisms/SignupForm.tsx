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

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignupForm = () => {
  const [
    signInWithEmailAndPassword,
    signedInUser,
    signInLoading,
    signInErrors,
  ] = useSignInWithEmailAndPassword(auth);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleErrors = (errors: any) => {
    const userAlreadyExistsPrisma = /Unique constraint failed/;

    if (userAlreadyExistsPrisma.test(errors)) {
      return "A user with that email already exists.";
    } else if (errors == "Passwords do not match") {
      return "Passwords do not match";
    }

    // Firebase errors
    switch (errors) {
      case "auth/email-already-exists":
        return "A user with that email already exists.";
      case "auth/invalid-email":
        return "Invalid email address format.";
      case "auth/invalid-password":
        return "Password should be at least 6 characters.";
      default:
        return "Something went wrong trying to create your account. Please try again.";
    }
  };

  // State variables for the notification popups
  const [notifOpen, setNotifOpen] = useState(false);

  const SignUpErrorComponent = (): JSX.Element | null => {
    setNotifOpen(true);
    return errorMessage ? (
      <Snackbar
        variety="error"
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
      >
        Error: {handleErrors(errorMessage)}
      </Snackbar>
    ) : null;
  };

  const handleSubmitUser: SubmitHandler<FormValues> = async (data, event) => {
    setIsLoading(true);

    event?.preventDefault();
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

    try {
      if (password != data.confirmPassword) {
        setIsLoading(false);
        setErrorMessage("Passwords do not match");
        return;
      }
      const response = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });
      const r = await response.json();
      if (response.ok) {
        const signIn = await signInWithEmailAndPassword(email, password);
        if (signIn?.user) {
          router.replace("/events/view");
        }
        setIsLoading(false);
      } else {
        console.log(r);
        setErrorMessage(r.error);
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitUser)} className="space-y-4">
      <SignUpErrorComponent />
      <img src="/lfbi_logo.png" className="w-24" />
      <div className="font-bold text-3xl">Sign Up</div>
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
      <div className="grid sm:space-x-4 grid-cols-1 sm:grid-cols-2 ">
        <div className="pb-4 sm:pb-0">
          <TextField
            error={errors.firstName ? "Required" : undefined}
            label="First Name"
            {...register("firstName", {
              required: "true",
            })}
          />
        </div>
        <div>
          <TextField
            error={errors.lastName ? "Required" : undefined}
            label="Last Name"
            {...register("lastName", {
              required: "true",
            })}
          />
        </div>
      </div>
      <div>
        <TextField
          error={errors.password ? "Required" : undefined}
          type="password"
          label="Password"
          {...register("password", {
            required: "true",
          })}
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
          {...register("confirmPassword", {
            required: "true",
          })}
        />
      </div>
      <div>
        <Button loading={isLoading} type="submit">
          Continue
        </Button>
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

export default SignupForm;
