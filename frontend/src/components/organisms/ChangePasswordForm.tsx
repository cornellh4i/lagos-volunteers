import React, { useState } from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import { auth } from "@/utils/firebase";
import { useForm, SubmitHandler } from "react-hook-form";
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import Snackbar from "../atoms/Snackbar";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "firebase/auth";
import { User } from "firebase/auth";

type FormValues = {
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
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

interface ChangePasswordFormProps {
  userDetails: formData;
}

const ChangePasswordForm = ({ userDetails }: ChangePasswordFormProps) => {
  /** State variables for the notification popups for profile update */
  const [successNotificationOpen, setSuccessNotificationOpen] = useState(false);
  const [errorNotificationOpen, setErrorNotificationOpen] = useState(false);

  /** Handles form errors */
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const handleErrors = (errors: any) => {
    const errorParsed = errors?.split("/")[1]?.slice(0, -2);
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
        return "Please reauthenticate to change your password.";
      case "too-many-requests":
        return "You have made too many requests to change your password. Please try again later.";
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
      newPassword: "",
      confirmNewPassword: "",
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
  const updateUserPasswordInFirebase = useMutation({
    mutationFn: async (data: any) => {
      const user = auth.currentUser as User;
      return updatePassword(user, data.newPassword);
    },
    retry: false,
  });

  /** Handles form submit for profile changes */
  const handleChanges: SubmitHandler<FormValues> = async (data) => {
    try {
      await ReAuthenticateUserSession.mutateAsync(data);
      await updateUserPasswordInFirebase.mutateAsync(data);
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
        Success: Password update was successful!
      </Snackbar>

      {/* Profile form */}
      <h3 className="mt-0 mb-4 font-normal">Change your password</h3>
      <div className="text-sm mb-4">
        Passwords should meet the following requirements:
        <ul className="m-0 px-4">
          <li>At least 6 characters in length</li>
          <li>Contain a mix of uppercase and lowercase letters</li>
          <li>Include at least one number and one special character</li>
        </ul>
      </div>
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
          type="password"
          label="New password "
          error={errors.newPassword?.message}
          {...register("newPassword", {
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
        <TextField
          type="password"
          error={errors.confirmNewPassword?.message}
          label="Confirm password"
          {...register("confirmNewPassword", {
            required: { value: true, message: "Required" },
            validate: {
              matchPassword: (value) =>
                value === watch("newPassword") || "Passwords do not match",
            },
          })}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
          <div className="order-1 sm:order-2">
            <Button type="submit">Change password</Button>
          </div>
          <div className="order-2 sm:order-1">
            <Button
              type="button"
              variety="secondary"
              onClick={() => {
                reset(undefined, { keepDefaultValues: true });
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

export default ChangePasswordForm;
