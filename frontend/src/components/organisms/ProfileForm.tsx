import React, { useState } from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import Checkbox from "../atoms/Checkbox";
import { useForm, SubmitHandler } from "react-hook-form";
import Snackbar from "../atoms/Snackbar";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "@/components/molecules/Modal";
import { useAuth } from "@/utils/AuthContext"; // - ndavid
import { Controller } from "react-hook-form";

type FormValues = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  // preferredName: string;
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
  phoneNumber: string;
  nickname: string;
  role?: string;
  status?: string;
  createdAt?: string;
  verified?: boolean;
  disciplinaryNotices?: number;
  imageUrl?: string;
  sendEmailNotification: boolean;
};

interface ProfileFormProps {
  userDetails: formData;
}

interface ModalBodyProps {
  userDetails: formData;
  handleClose: () => void;
  setErrorNotificationOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/** Confirmation modal to delete an account */
const ModalBody = ({
  userDetails,
  handleClose,
  setErrorNotificationOpen,
}: ModalBodyProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DeleteAccountFormValues>();

  // deleteUserProfile handles deleting user from prisma and firebase
  const {
    mutateAsync: deleteUserProfile,
    error: deleteUserProfileError,
    isPending,
  } = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`/users/${userDetails.id}`);
      return data;
    },
    retry: false,
    onSuccess: () => {},
  });

  // Variables for signing out user
  const { error, signOutUser } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Signs out user and redirects them to login page
  const handleSignOut = async () => {
    try {
      await signOutUser();
      queryClient.clear(); // Clear cache for react query
      router.replace("/login");
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * When delete form is submitted, we will delete user, end their session,
   * and redirect them to login page
   */
  const handleDeleteAccount = async () => {
    try {
      await deleteUserProfile();
      await handleSignOut();
    } catch (error) {
      console.log(error);
      setErrorNotificationOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="font-bold text-2xl text-center">Delete Account</div>
      <div className="mb-12">
        <p>
          Are you sure you want to delete your account? This change is{" "}
          <b>permanent</b> and there is{" "}
          <b>no ability to restore your account</b>.
        </p>
        {userDetails.role === "VOLUNTEER" && (
          <p>
            As a volunteer,{" "}
            <b>your account details and volunteer history will be deleted</b>.
            There is no way to recover this data.
          </p>
        )}
        {userDetails.role === "SUPERVISOR" && (
          <p>
            As a supervisor, your account details and volunteer history will be
            deleted. However, <b>events you have created</b> will still remain
            and can still be managed by other supervisors.
          </p>
        )}
        {userDetails.role === "ADMIN" && (
          <p>
            As an admin, make sure that{" "}
            <b>you have assigned the admin role to at least one other user</b>.
            Only admins can change the roles of other users. All of your created
            events will still remain.
          </p>
        )}
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
            <Button loading={isPending} variety="mainError" type="submit">
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

  /** State variables for the notification popups for profile update */
  const [successNotificationOpen, setSuccessNotificationOpen] = useState(false);
  const [errorNotificationOpen, setErrorNotificationOpen] = useState(false);

  /** Handles form errors */
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const handleErrors = (errors: any) => {
    const errorParsed = errors?.split("/")[1]?.slice(0, -2);
    switch (errorParsed) {
      default:
        return "Something went wrong. Please try again.";
    }
  };
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  /** React hook form */
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      email: userDetails.email,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      phoneNumber: userDetails.phoneNumber,
      // preferredName: userDetails.nickname,
      emailNotifications: userDetails.sendEmailNotification,
    },
  });

  /** Tanstack query mutation to update the user profile */
  const updateProfileInDB = useMutation({
    mutationFn: async (data: any) => {
      return api.put(`/users/${userDetails.id}/profile`, {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        // nickname: data.preferredName,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    retry: false,
  });

  /** Tanstack query mutation to update the user profile */
  const updatePreferencesInDB = useMutation({
    mutationFn: async (emailNotifications: boolean) => {
      return api.put(`/users/${userDetails.id}/preferences`, {
        sendEmailNotification: emailNotifications,
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
      await updateProfileInDB.mutateAsync(data);
      await updatePreferencesInDB.mutateAsync(data.emailNotifications);
      setSuccessNotificationOpen(true);
    } catch (error: any) {
      setErrorNotificationOpen(true);
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <Modal
        open={open}
        handleClose={handleClose}
        children={
          <ModalBody
            userDetails={userDetails}
            handleClose={handleClose}
            setErrorNotificationOpen={setErrorNotificationOpen}
          />
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
        <TextField
          error={errors.email?.message}
          disabled
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
          error={errors.phoneNumber?.message}
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
        {/* <TextField
          label="Preferred name"
          error={errors.preferredName?.message}
          {...register("preferredName", {
            required: { value: true, message: "Required" },
          })}
        /> */}
        <Controller
          name="emailNotifications"
          control={control}
          render={({ field }) => (
            <Checkbox
              {...field}
              label="Email notifications"
              checked={field.value}
            />
          )}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="order-1 sm:order-3">
            <Button type="submit">Save changes</Button>
          </div>
          <div className="order-2 sm:order-2">
            <Button variety="error" type="button" onClick={handleOpen}>
              Delete account
            </Button>
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

export default ProfileForm;
