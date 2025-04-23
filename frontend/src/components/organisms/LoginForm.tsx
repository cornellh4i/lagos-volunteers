import React, { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import { auth } from "@/utils/firebase";
import {
  useDeleteUser,
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import Snackbar from "../atoms/Snackbar";
import { GoogleAuthProvider, User, signInWithPopup } from "firebase/auth";
import { api } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import Loading from "../molecules/Loading";

export type FormValues = {
  email: string;
  password: string;
};

/** Google icon using code from Google branding guidelines */
const GoogleIcon = () => {
  return (
    <div className="w-5 h-5">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        style={{ display: "block" }}
      >
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
        ></path>
        <path
          fill="#4285F4"
          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
        ></path>
        <path
          fill="#FBBC05"
          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
        ></path>
        <path
          fill="#34A853"
          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
        ></path>
        <path fill="none" d="M0 0h48v48H0z"></path>
      </svg>
    </div>
  );
};

const LoginForm = () => {
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

  /** Handles login */
  const handleLogin: SubmitHandler<FormValues> = async (data) => {
    const { email, password } = data;
    await signInWithEmailAndPassword(email, password);
  };

  /** Handles login errors */
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (signInErrors) {
      switch (signInErrors.code) {
        case "auth/invalid-credential":
          setErrorMessage("Invalid email or password.");
          break;
        case "auth/invalid-email":
          setErrorMessage("Invalid email address format.");
          break;
        case "auth/user-disabled":
          setErrorMessage("User with this email has been disabled.");
          break;
        case "auth/user-not-found":
          setErrorMessage("There is no user with this email address.");
          break;
        case "auth/wrong-password":
          setErrorMessage("Invalid email or password.");
          break;
        case "auth/too-many-requests":
          setErrorMessage(
            "You made too many login requests. Please try again later."
          );
          break;
        default:
          setErrorMessage("Something went wrong.");
          break;
      }
      setNotifOpen(true);
    }
  }, [signInErrors]);

  /** Tanstack query mutation to create a new user */
  const { mutateAsync: createLocalUserFromGoogle, isPending: googleLoading } =
    useMutation({
      mutationFn: async (data: {
        userid: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
      }) => {
        const { userid, firstName, lastName, email } = data;
        const emailLowerCase = email.toLowerCase();
        const post = {
          id: userid,
          email: emailLowerCase,
          profile: {
            firstName,
            lastName,
          },
        };
        const { response } = await api.post("/users/google", post, false);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }

        return response;
      },
      retry: false,
    });

  // Firebase hook for deleting a user
  const [deleteUser, deleteLoading, deleteError] = useDeleteUser(auth);

  /** Sign in with Google */
  const handleGoogleLogin = async () => {
    try {
      // Firebase login
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Proceed only if Firebase login succeeds
      if (user) {
        const email = user?.email as string;
        const userid = user?.uid as string;
        const phoneNumber = user?.phoneNumber as string;
        const [firstName, lastName] = user?.displayName
          ? user?.displayName?.split(" ")
          : ["", ""];

        // Check if user exists in local database
        try {
          await api.get(`/users/${userid}`);
        } catch (error: any) {
          // If user doesn't exist in local database (404 error returned), try to
          // create it. If the local db account creation fails for whatever reason,
          // delete the Firebase user.
          if (error.status === 404) {
            try {
              const backendUser = await createLocalUserFromGoogle({
                userid,
                firstName,
                lastName,
                email,
                phoneNumber,
              });
            } catch (e: any) {
              // Delete Firebase user and throw error again
              await deleteUser();
              throw e;
            }
          }
        }
      }
    } catch (e: any) {
      setNotifOpen(true);
      setErrorMessage(
        "Your account could not be created. Please try again later."
      );
    }
  };

  // For successful password reset notifications
  const [passwordResetNotif, setPasswordResetNotif] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("passwordReset")) {
      setPasswordResetNotif(true);
      localStorage.removeItem("passwordReset");
    }
  }, []);

  if (googleLoading) return <Loading />;

  return (
    <>
      {/* Password reset success component */}
      <Snackbar
        variety="success"
        open={passwordResetNotif}
        onClose={() => setPasswordResetNotif(false)}
      >
        Success: Your password has been reset!
      </Snackbar>

      {/* Login error component */}
      <Snackbar
        variety="error"
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
      >
        Error: {errorMessage}
      </Snackbar>

      {/* Login form */}
      <div className="space-y-4">
        <img src="/lfbi_logo.png" className="w-24" />
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <div className="font-bold text-3xl"> Log In </div>
          <TextField
            error={errors.email?.message}
            label="Email"
            {...register("email", {
              required: { value: true, message: "Required " },
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                message: "Invalid email address",
              },
            })}
          />
          <TextField
            error={errors.password?.message}
            label="Password"
            type="password"
            {...register("password", {
              required: { value: true, message: "Required" },
            })}
          />
          <div className="text-center">
            <Link
              href="/password/forgot"
              className="text-primary-200 hover:underline no-underline"
            >
              Forgot password?
            </Link>
          </div>
          <Button
            loading={signInLoading}
            disabled={signInLoading}
            type="submit"
          >
            Log in
          </Button>
        </form>
        <div>
          <Divider>or</Divider>
        </div>
        <div>
          <Link href="/signup">
            <Button type="submit" variety="secondary">
              Sign up with email
            </Button>
          </Link>
        </div>
        <Button
          variety="secondary"
          icon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          type="submit"
        >
          Continue with Google
        </Button>
      </div>
    </>
  );
};

export default LoginForm;
