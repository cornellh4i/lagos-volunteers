import React, { useState } from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import Checkbox from "../atoms/Checkbox";
import { auth } from "@/utils/firebase";
import { useForm, SubmitHandler } from "react-hook-form";
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import Snackbar from "../atoms/Snackbar";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePassword } from "firebase/auth";
import { User } from "firebase/auth";
import Modal from "@/components/molecules/Modal";
import { Box, IconButton } from "@mui/material";
import { Grid } from "@mui/material";

import { useAuth } from "@/utils/AuthContext"; // - ndavid

type FormValues = {
  email: string;
  firstName: string;
  lastName: string;
  // preferredName: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  emailNotifications: boolean;
};

type DeleteAccountFormValues = {
  confirmation: string;
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

interface ModalBodyProps {
  userDetails: formData;
  handleClose: () => void;
}

/** Confirmation Modal To Delete An Account */
const ModalBody = ({ userDetails, handleClose }: ModalBodyProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DeleteAccountFormValues>();

  //changeUserStatus handles deleting user from prisma and firebase
  const { mutateAsync: changeUserStatus, error: changeUserStatusError } =
    useMutation({
      mutationFn: async () => {
        const { data } = await api.delete(`/users/${userDetails.id}`);
        return data;
      },
      retry: false,
      onSuccess: () => {
        console.log("DELETED");
      },
    });

  //Variables for signing out user
  const { error, signOutUser } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  //Signs out user and redirects them to login page
  const handleSignOut = async () => {
    try {
      await signOutUser();
      queryClient.clear(); // Clear cache for react query
      router.replace("/login");
    } catch (error) {
      console.log(error);
    }
  };

  /**  When delete form is submitted, we will delete user, end their session,
   * and redirect them to login page
   */
  const handleDeleteAccount = async () => {
    await changeUserStatus();
    await handleSignOut();
  };

  return (
    <div className="space-y-4">
      <div className="font-bold text-2xl text-center">Delete Account</div>
      <div className="mb-12">
        <div>
          Are you sure you want to delete your account? This change is{" "}
          <b>permanent</b> and there is{" "}
          <b>no ability to restore your account once it is deleted</b>.
        </div>
      </div>

      <form onSubmit={handleSubmit(handleDeleteAccount)}>
        <TextField
          error={errors.confirmation?.message}
          label={`Type "${userDetails.email}" to confirm`}
          {...register("confirmation", {
            required: { value: true, message: "Required" },
            validate: {
              matchConfirmation: (value) =>
                value === `${userDetails.email}` ||
                "Confirmation message is incorrect.",
            },
          })}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-10">
          <div className="order-1 sm:order-2">
            <Button variety="bigred" type="submit">
              Delete
            </Button>
          </div>
          <div className="order-2 sm:order-1">
            <Button variety="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

const ProfileForm = ({ userDetails }: ProfileFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userid } = router.query;

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
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      // preferredName: userDetails.nickname,
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
        // nickname: data.preferredName,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    retry: false,
  });

  /** Tanstack query mutation to delete the user profile */

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

  // const { mutateAsync: changeUserStatus } = useMutation({
  //   mutationFn: async () => {
  //     const { data } = await api.delete(`/users/${userid}`);
  //     return data;
  //   },
  //   retry: false,
  //   onSuccess: () => {
  //     console.log("DELETED");
  //   }
  // });

  return (
    <>
      <Modal
        open={open}
        handleClose={handleClose}
        children={
          <ModalBody userDetails={userDetails} handleClose={handleClose} />
        }
      />

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
        <TextField
          error={errors.firstName?.message}
          label="First name"
          {...register("firstName", {
            required: { value: true, message: "Required" },
          })}
        />
        <TextField
          error={errors.lastName?.message}
          label="Last name"
          {...register("lastName", {
            required: { value: true, message: "Required" },
          })}
        />
        {/* <TextField
          label="Preferred name"
          error={errors.preferredName?.message}
          {...register("preferredName", {
            required: { value: true, message: "Required" },
          })}
        /> */}
        <TextField
          type="password"
          label="Old password"
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
        <Checkbox
          checked={checked}
          onChange={handleCheckbox}
          label="Email notifications"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="order-1 sm:order-3">
            <Button type="submit">Save changes</Button>
          </div>
          <div className="order-2 sm:order-2">
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
          <div className="order-2 sm:order-1">
            <Button variety="error" type="button" onClick={handleOpen}>
              Delete account
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ProfileForm;
