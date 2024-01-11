import React, { useState } from "react";
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
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleErrors = (errors: any) => {
    // possibly needs some extra verification for common error patterns
    const userAlreadyExistsPrisma = /Unique constraint failed/;
    const passwordLengthError =
      /The password must be a string with at least 6 characters./;
    const invalidEmailError = /The email address is badly formatted./;
    const EmailAlreadyExists = /A user with that email already exists/;

    switch (true) {
      case userAlreadyExistsPrisma.test(errors):
        return "A user with that email already exists.";
      case passwordLengthError.test(errors):
        return "Password should be at least 6 characters.";
      case invalidEmailError.test(errors):
        return "Invalid email address format.";
      case EmailAlreadyExists.test(errors):
        return "A user with that email already exists.";
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
        onClose={() => setNotifOpen(false)}>
        Error: {handleErrors(errorMessage)}
      </Snackbar>
    ) : null;
  };

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
      // Using fetch directly here because no auth headers need to be passed.
      const response = fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });
      if (!(await response).ok) {
        const errorData = await (await response).json();
        throw new Error(errorData.error);
      }
      return response;
    },
    retry: false,
  });

  const handleSubmitUser: SubmitHandler<FormValues> = async (data, event) => {
    try {
      await mutateAsync(data);
      const { email, password } = data;
      const signedInUser = await signInWithEmailAndPassword(email, password);
      if (signedInUser?.user) {
        router.push("/events/view");
      }
    } catch (error: any) {
      setNotifOpen(true);
      setErrorMessage(error);
    }
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
          className="text-primary hover:underline no-underline">
          Log in
        </Link>
      </div>
    </form>
  );
};

export default SignupForm;
