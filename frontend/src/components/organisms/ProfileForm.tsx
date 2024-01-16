import React, { useState } from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import Checkbox from "../atoms/Checkbox";
import { auth } from "@/utils/firebase";
import { useForm, SubmitHandler } from "react-hook-form";
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import Snackbar from "../atoms/Snackbar";
import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePassword } from "firebase/auth";
import { User } from "firebase/auth";

type FormValues = {
  email: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  emailNotifications: boolean;
};

type formData = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  nickname: string;
  role?: string;
  status?: string;
  createdAt?: string;
  verified?: boolean;
  disciplinaryNotices?: number;
  imageUrl?: string;
};

interface ProfileFormProps {
  userDetails: formData;
}

const ProfileForm = ({ userDetails }: ProfileFormProps) => {
  const queryClient = useQueryClient();

  /** State variables for the notification popups */
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
        return "Old password is incorrect.";
      case "weak-password":
        return "Password must be at least 6 characters.";
      case "invalid-password":
        return "Invalid password.";
      case "requires-recent-login":
        return "Please reauthenticate to change your password.";
      case "too-many-requests":
        return "You have made too many requests to change your password. Please try again later.";
      default:
        return "Something went wrong. Please try again";
    }
  };

  /** React hook form */
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: userDetails.email,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      preferredName: userDetails.nickname,
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      emailNotifications: false,
    },
  });

  /** Handles checkbox */

  // TODO: Implement this
  const [checked, setChecked] = useState(false);
  const handleCheckbox = () => {
    setChecked((checked) => !checked);
  };

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

  /** Tanstack query mutation to update the user profile */
  const updateProfileInDB = useMutation({
    mutationFn: async (data: any) => {
      return api.put(`/users/${userDetails.id}/profile`, {
        firstName: data.firstName,
        lastName: data.lastName,
        nickname: data.preferredName,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    retry: false,
  });

  /** Handles form submit */
  const handleChanges: SubmitHandler<FormValues> = async (data) => {
    try {
      await ReAuthenticateUserSession.mutateAsync(data);
      await updateUserPasswordInFirebase.mutateAsync(data);
      await updateProfileInDB.mutateAsync(data);
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
        Success: Profile update was successful!
      </Snackbar>

      {/* Profile form */}
      <form onSubmit={handleSubmit(handleChanges)} className="space-y-4">
        <TextField
          label="Email"
          disabled={true}
          error={errors.email ? "Required" : undefined}
          {...register("email", { required: true })}
        />
        <TextField
          label="First name"
          error={errors.firstName ? "Required" : undefined}
          {...register("firstName", { required: true })}
        />
        <TextField
          label="Last name"
          error={errors.lastName ? "Required" : undefined}
          {...register("lastName", { required: true })}
        />
        <TextField
          label="Preferred name"
          error={errors.preferredName ? "Required" : undefined}
          {...register("preferredName", { required: true })}
        />
        <TextField
          type="password"
          label="Old password"
          error={errors.oldPassword ? "Required" : undefined}
          {...register("oldPassword", { required: true })}
        />
        <TextField
          type="password"
          label="New password "
          {...register("newPassword", { required: false })}
        />
        <TextField
          type="password"
          label="Confirm new password"
          error={
            watch("newPassword") === watch("confirmNewPassword")
              ? undefined
              : "Passwords must match"
          }
          {...register("confirmNewPassword", { required: false })}
        />
        <Checkbox
          checked={checked}
          onChange={handleCheckbox}
          label="Email notifications"
        />
        <div className="sm:space-x-4 grid grid-cols-1 sm:grid-cols-2">
          <div className="pb-4 sm:pb-0">
            <Button
              type="button"
              variety="secondary"
              onClick={() => {
                reset(userDetails, { keepDefaultValues: true });
              }}
            >
              Cancel
            </Button>
          </div>
          <div>
            <Button type="submit">Save Changes</Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ProfileForm;
