import React from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { useUpdatePassword } from "react-firebase-hooks/auth";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { Router, useRouter } from "next/router";

//commit message
type FormValues = {
  password: string;
  confirmPassword: string;
};
/** A ResetPassword page */
const ResetPassword = () => {
  const router = useRouter();
  const getParameterByName = (
    name: string,
    url: string = window.location.href
  ): string | null => {
    name = name.replace(/[[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  };
  const actionCode = getParameterByName("oobCode") as string;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();
  const handleSubmitForm: SubmitHandler<FormValues> = async (data) => {
    const { password, confirmPassword } = data;
    if (password != confirmPassword) {
      return;
    }
    verifyPasswordResetCode(auth, actionCode)
      .then(() => {
        const newPassword = password;
        // Save the new password.
        confirmPasswordReset(auth, actionCode, newPassword)
          .then((resp) => {
            // Password reset has been confirmed and new password updated.
            router.push("/login");
          })
          .catch((error) => {
            // Error occurred during confirmation. The code might have expired or the
            // password is too weak.
          });
      })
      .catch((error) => {
        // Invalid or expired action code. Ask user to try to reset the password
        // again.
      });
  };
  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
      <div className="font-bold text-3xl">Reset Password</div>
      <div className="text-sm">
        Password should meet the following requirements:
        <ul className="m-0 px-4">
          <li>At least 8 characters in length</li>
          <li>Contains a mix of uppercase and lowercase letters</li>
          <li>Includes at least one number and one special character</li>
        </ul>
      </div>
      <div>
        <TextField
          label="Password*"
          type="password"
          error={errors.password ? "Required" : undefined}
          {...register("password", { required: "true" })}
        />
      </div>
      <div>
        <TextField
          label="Confirm Password*"
          type="password"
          error={
            watch("password") === watch("confirmPassword")
              ? undefined
              : "Passwords must match"
          }
          {...register("confirmPassword", { required: "true" })}
        />
      </div>
      <div>
        <Button type="submit">Reset Password</Button>
      </div>
      <div className="justify-center flex flex-row text-sm">
        <Link href="/" className="text-black">
          {" "}
          Didn't request to reset password?
        </Link>
      </div>
    </form>
  );
};
export default ResetPassword;
