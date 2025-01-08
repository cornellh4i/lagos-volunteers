import React, { useState } from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import { useForm, SubmitHandler } from "react-hook-form";
import Snackbar from "../atoms/Snackbar";
import { useAuth } from "@/utils/AuthContext";
import {
  updatePassword,
  reauthenticateWithPopup,
  GoogleAuthProvider,
  reload,
} from "firebase/auth";

type FormValues = {
  password: string;
  confirmPassword: string;
};

const LinkEmailPasswordForm = ({
  setSuccessNotificationOpen,
}: {
  setSuccessNotificationOpen: any;
}) => {
  /** State variables for the notification popups */
  const [errorNotificationOpen, setErrorNotificationOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string>("");
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

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
      case "provider-already-linked":
        return "Your provider has already been linked.";
      case "user-mismatch":
        return "The user email you signed in with does not match the user email here. Please sign in with the correct account.";
      default:
        return "Something went wrong. Please try again";
    }
  };

  const handleSubmitForm: SubmitHandler<FormValues> = async (data) => {
    const { password, confirmPassword } = data;
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      } else if (user) {
        // Reauthenticate with Google and set password, then refresh page
        const provider = new GoogleAuthProvider();
        const result = await reauthenticateWithPopup(user, provider);
        updatePassword(user, password);

        reload(user);
        setSuccessNotificationOpen(true);
      }
    } catch (error: any) {
      setErrorMessage(handleErrors(error.message));
      setErrorNotificationOpen(true);
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
        Error: {errorMessage}
      </Snackbar>

      <h3 className="mt-0 mb-4 font-normal">Set up a password</h3>
      <div className="text-sm mb-4">
        Passwords should meet the following requirements:
        <ul className="m-0 px-4">
          <li>At least 6 characters in length</li>
          <li>Contain a mix of uppercase and lowercase letters</li>
          <li>Include at least one number and one special character</li>
        </ul>
      </div>
      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
        <div>
          <TextField
            error={errors.password?.message}
            type="password"
            label="New password"
            {...register("password", {
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
        </div>
        <div>
          <TextField
            type="password"
            error={errors.confirmPassword?.message}
            label="Confirm password"
            {...register("confirmPassword", {
              required: { value: true, message: "Required" },
              validate: {
                matchPassword: (value) =>
                  value === watch("password") || "Passwords do not match",
              },
            })}
          />
        </div>
        <div>
          <Button type="submit">Create password</Button>
        </div>
      </form>
    </>
  );
};
export default LinkEmailPasswordForm;
