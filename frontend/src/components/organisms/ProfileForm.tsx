import React, { useEffect, useState } from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import Checkbox from "../atoms/Checkbox";
import { auth } from "@/utils/firebase";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import { BASE_URL } from "@/utils/constants";
import { useUpdatePassword } from "react-firebase-hooks/auth";
import Alert from "../atoms/Alert";
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

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
  const router = useRouter();
  const [updatePassword, updating, error] = useUpdatePassword(auth);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const handleErrors = (errors: any) => {
    const errorParsed = errors?.split("/")[1].slice(0, -2);
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
        return "Something went wrong.";
    }
  };

  const ProfileErrorComponent = (): JSX.Element | null => {
    return error ? (
      <Alert severity="error">Error: {handleErrors(error?.message)}</Alert>
    ) : null;
  };

  const ProfileReauthenticationErrorComponent = (): JSX.Element | null => {
    return errorMessage.length > 0 ? (
      <Alert severity="error">Error: {handleErrors(errorMessage)}</Alert>
    ) : null;
  };

  const ProfileSuccessComponent = (): JSX.Element | null => {
    return !error && !(errorMessage.length > 0) && success ? (
      <Alert severity="success">
        Success: Profile update was successful. Please refresh the page to see
        your changes!
      </Alert>
    ) : null;
  };

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

  // Handle checkbox
  const [checked, setChecked] = useState(false);
  const handleCheckbox = () => {
    setChecked((checked) => !checked);
  };

  const handleChanges: SubmitHandler<FormValues> = async (data) => {
    const {
      email,
      firstName,
      lastName,
      preferredName,
      oldPassword,
      newPassword,
      confirmNewPassword,
    } = data;

    try {
      setIsLoading(true);
      // Update profile in DB
      const url = BASE_URL as string;
      const userid = userDetails.id;
      const fetchUrl = `${url}/users/` + userid + `/profile`;
      const currentUser = auth.currentUser;
      const userToken = await currentUser?.getIdToken();
      const body = {
        firstName: firstName,
        lastName: lastName,
        nickname: preferredName,
      };
      const response = await fetch(fetchUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      // Update password in Firebase
      if (newPassword !== "" && currentUser != null) {
        // first re-authenticate the user to check if the old password is correct

        const credentials = EmailAuthProvider.credential(email, oldPassword);
        reauthenticateWithCredential(currentUser, credentials)
          .then(() => {
            updatePassword(newPassword).then(() => {
              setSuccess(true);
              setIsLoading(false);
            });
          })
          .catch((error) => {
            setErrorMessage(error.message);
            setIsLoading(false);
          });
      }
      setErrorMessage("");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleChanges)} className="space-y-4">
      <ProfileErrorComponent />
      <ProfileSuccessComponent />
      <ProfileReauthenticationErrorComponent />
      <div>
        <TextField
          label="Email"
          disabled={true}
          error={errors.email ? "Required" : undefined}
          {...register("email", {
            required: "true",
          })}
        />
      </div>
      <div>
        <TextField
          label="First name"
          error={errors.firstName ? "Required" : undefined}
          {...register("firstName", {
            required: "true",
          })}
        />
      </div>
      <div>
        <TextField
          label="Last name"
          error={errors.lastName ? "Required" : undefined}
          {...register("lastName", {
            required: "true",
          })}
        />
      </div>
      <div>
        <TextField
          label="Preferred name"
          error={errors.preferredName ? "Required" : undefined}
          {...register("preferredName", {
            required: "true",
          })}
        />
      </div>
      <div>
        <TextField
          type="password"
          label="Old password"
          error={errors.oldPassword ? "Required" : undefined}
          {...register("oldPassword", {
            required: "false",
          })}
        />
      </div>
      <div>
        <TextField
          type="password"
          label="New password "
          {...register("newPassword", {
            required: "false",
          })}
        />
      </div>
      <div>
        <TextField
          type="password"
          label="Confirm new password"
          error={
            watch("newPassword") === watch("confirmNewPassword")
              ? undefined
              : "Passwords must match"
          }
          {...register("confirmNewPassword", {
            required: "false",
          })}
        />
      </div>
      <div>
        <Checkbox
          checked={checked}
          onChange={handleCheckbox}
          label="Email notifications"
        />
      </div>
      <div className="sm:space-x-4 grid grid-cols-1 sm:grid-cols-2">
        <div className="pb-4 sm:pb-0">
          <Button loading={isLoading} disabled={isLoading} type="submit">
            Save Changes
          </Button>
        </div>
        <div>
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
      </div>
    </form>
  );
};

export default ProfileForm;
