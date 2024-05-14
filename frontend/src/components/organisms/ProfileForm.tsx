import React, { useState } from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import Checkbox from "../atoms/Checkbox";
import { useForm, SubmitHandler } from "react-hook-form";
import Snackbar from "../atoms/Snackbar";
import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type FormValues = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  // preferredName: string;
  emailNotifications: boolean;
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
};

interface ProfileFormProps {
  userDetails: formData;
}

const ProfileForm = ({ userDetails }: ProfileFormProps) => {
  const queryClient = useQueryClient();

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
      phoneNumber: userDetails.phoneNumber,
      // preferredName: userDetails.nickname,
      emailNotifications: false,
    },
  });

  /** Handles checkbox */

  // TODO: Implement this
  const [checked, setChecked] = useState(false);
  const handleCheckbox = () => {
    setChecked((checked) => !checked);
  };

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

  /** Handles form submit for profile changes */
  const handleChanges: SubmitHandler<FormValues> = async (data) => {
    try {
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
        <Checkbox
          checked={checked}
          onChange={handleCheckbox}
          label="Email notifications"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="order-1 sm:order-2">
            <Button type="submit">Save changes</Button>
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
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ProfileForm;
