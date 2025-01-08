import React, { useState } from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import { auth } from "@/utils/firebase";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateEmail,
} from "firebase/auth";
import Snackbar from "../atoms/Snackbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "firebase/auth";
import { api } from "@/utils/api";

type FormValues = {
  email: string;
  oldPassword: string;
  newEmail: string;
};

type formData = {
  id: string;
  email: string;
  role?: string;
  status?: string;
  createdAt?: string;
  verified?: boolean;
  disciplinaryNotices?: number;
  imageUrl?: string;
};

interface ChangeEmailFormProps {
  userDetails: formData;
}

const ChangeEmailForm = ({ userDetails }: ChangeEmailFormProps) => {
  const queryClient = useQueryClient();

  /** State variables for the notification popups for profile update */
  const [successNotificationOpen, setSuccessNotificationOpen] = useState(false);
  const [errorNotificationOpen, setErrorNotificationOpen] = useState(false);

  /** Handles form errors */
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const handleErrors = (errors: any) => {
    const errorParsed = errors?.split("/")[1]?.slice(0, -2);
    console.log(errorParsed);
    switch (errorParsed) {
      case "invalid-email":
        return "Invalid email address format.";
      case "user-disabled":
        return "User with this email has been disabled.";
      case "user-not-found":
        return "There is no user with this email address.";
      case "wrong-password":
        return "Current password is incorrect.";
      case "weak-password":
        return "Password must be at least 6 characters.";
      case "invalid-password":
        return "Invalid password.";
      case "requires-recent-login":
        return "Please reauthenticate to change your email.";
      case "too-many-requests":
        return "You have made too many requests to change your email. Please try again later.";
      case "email-already-in-use":
        return "The email you entered is already registered. Please enter a different email.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  /** React hook form */
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      email: userDetails.email,
      oldPassword: "",
      newEmail: "",
    },
  });

  /** Tanstack query mutation to reauthenticate the user session */
  const ReAuthenticateUserSession = useMutation({
    mutationFn: async (data: any) => {
      const currentUser = auth.currentUser;
      if (currentUser != null) {
        const credentials = EmailAuthProvider.credential(
          data.email,
          data.oldPassword
        );
        return reauthenticateWithCredential(currentUser, credentials);
      }
    },
    retry: false,
  });

  /** Tanstack query mutation to update user password in Firebase */
  const updateUserEmail = useMutation({
    mutationFn: async (data: any) => {
      const user = auth.currentUser as User;
      await ReAuthenticateUserSession.mutateAsync(data);
      await updateEmail(user, data.newEmail);
      return api.put(`/users/${userDetails.id}`, {
        email: data.newEmail,
      });
    },
    retry: false,
  });

  /** Handles form submit for profile changes */
  const handleChanges: SubmitHandler<FormValues> = async (data) => {
    try {
      await updateUserEmail.mutateAsync(data);
      setSuccessNotificationOpen(true);
    } catch (error: any) {
      setErrorNotificationOpen(true);
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      {/* Profile update error snackbar */}
      <Snackbar
        variety="error"
        open={errorNotificationOpen}
        onClose={() => setErrorNotificationOpen(false)}
      >
        Error: {handleErrors(errorMessage)}
      </Snackbar>

      {/* Profile update success snackbar */}
      <Snackbar
        variety="success"
        open={successNotificationOpen}
        onClose={() => setSuccessNotificationOpen(false)}
      >
        Success: Email update was successful!
      </Snackbar>

      {/* Profile form */}
      <h3 className="mt-0 mb-4 font-normal">Change your email</h3>
      <form onSubmit={handleSubmit(handleChanges)} className="space-y-4">
        <TextField
          type="password"
          label="Current password"
          error={errors.oldPassword?.message}
          {...register("oldPassword", {
            required: { value: true, message: "Required" },
          })}
        />
        <TextField
          type="text"
          label="New email"
          error={errors.newEmail?.message}
          {...register("newEmail", {
            required: { value: true, message: "Required" },
            pattern: {
              value:
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
              message: "Invalid email address",
            },
          })}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
          <div className="order-1 sm:order-2">
            <Button type="submit">Change email</Button>
          </div>
          <div className="order-2 sm:order-1">
            <Button
              type="button"
              variety="secondary"
              onClick={() => {
                reset();
              }}
              disabled={!isDirty}
            >
              Reset changes
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ChangeEmailForm;
