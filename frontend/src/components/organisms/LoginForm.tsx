import React, { useState } from "react";
import Divider from "@mui/material/Divider";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "@/utils/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import { auth } from "@/utils/firebase";
import Alert from "../atoms/Alert";
import GoogleIcon from "@mui/icons-material/Google";

import {
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import Snackbar from "../atoms/Snackbar";

export type FormValues = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const router = useRouter();
  const [
    signInWithEmailAndPassword,
    signedInUser,
    signInLoading,
    signInErrors,
  ] = useSignInWithEmailAndPassword(auth);

  // Sign in With Google
  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const handleErrors = (errors: any) => {
    switch (errors) {
      case "auth/invalid-email":
        return "Invalid email address format.";
      case "auth/user-disabled":
        return "User with this email has been disabled.";
      case "auth/user-not-found":
        return "There is no user with this email address.";
      case "auth/wrong-password":
        return "Invalid email or password.";
      case "auth/too-many-requests":
        return "You have made too many requests to login. Please try again later.";
      default:
        return "Something went wrong.";
    }
  };

  // State variables for the notification popups
  const [notifOpen, setNotifOpen] = useState(false);

  const LoginErrorComponent = (): JSX.Element | null => {
    return signInErrors ? (
      <Snackbar
        variety="error"
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
      >
        Error: {handleErrors(signInErrors.code)}
      </Snackbar>
    ) : null;
  };

  const handleLogin: SubmitHandler<FormValues> = async (data) => {
    const { email, password } = data;
    try {
      await signInWithEmailAndPassword(email, password);
      if (signedInUser) {
        router.push("/events/view");
      }
    } catch (err) { }
    setNotifOpen(true);
  };
  return (
    <div className="space-y-4 ">
      <LoginErrorComponent />
      <img src="/lfbi_logo.png" className="w-24" />
      <form onSubmit={handleSubmit(handleLogin)} className="space-y-4 ">
        <div className="font-bold text-3xl"> Log In </div>
        <TextField
          error={errors.email ? "Required" : undefined}
          label="Email"
          type="email"
          {...register("email", { required: true })}
        />
        <TextField
          error={errors.password ? "Required" : undefined}
          label="Password"
          type="password"
          {...register("password", { required: true })}
        />
        <div className="text-center">
          <Link
            href="/password/forgot"
            className="text-primary hover:underline no-underline"
          >
            Forgot password?
          </Link>
        </div>
        <Button loading={signInLoading} disabled={signInLoading} type="submit">
          Log in
        </Button>
        <div>
          <Divider>or</Divider>
        </div>
      </form>
      <Link href="/signup">
        <Button type="submit" variety="secondary">
          Sign up with email
        </Button>
      </Link>
      <Button
        loading={googleLoading}
        disabled={googleLoading}
        variety="secondary"
        icon={<GoogleIcon />}
        // We are paused on this feature for now...
        // onClick={() => handleGoogleLogin()}
        type="submit"
      >
        Continue with Google
      </Button>
    </div>
  );
};

export default LoginForm;
