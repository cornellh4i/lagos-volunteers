import React, { useState, useEffect } from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { useUpdatePassword } from "react-firebase-hooks/auth";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { Router, useRouter } from "next/router";
import Snackbar from "../atoms/Snackbar";
import { useMutation } from "@tanstack/react-query";

//commit message
type FormValues = {
  password: string;
  confirmPassword: string;
};
/** A ResetPassword page */
const ResetPassword = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false); // State to control Snackbar visibility
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const { oobCode } = router.query as unknown as { oobCode: string };

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
      default:
        return "Something went wrong. Please try again";
    }
  };

  const { mutateAsync, isPending, isError } = useMutation({
    mutationFn: async (data: FormValues) => {
      const { password, confirmPassword } = data;
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      await confirmPasswordReset(auth, oobCode, password);
    },
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      setErrorMessage(handleErrors(error.message));
      setOpenSnackbar(true);
    },
    retry: false,
  });

  const handleSubmitForm: SubmitHandler<FormValues> = async (data) => {
    const { password, confirmPassword } = data;
    try {
      await verifyPasswordResetCode(auth, oobCode);
      await mutateAsync({ password, confirmPassword });
    } catch (error: any) {
      setErrorMessage(handleErrors(error.message));
      setOpenSnackbar(true);
    }
  };
  return (
    <>
      <Snackbar
        variety="error"
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}>
        Error : {errorMessage}
      </Snackbar>
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
          <Button type="submit" loading={isPending}>
            Reset Password
          </Button>
        </div>
        <div className="justify-center flex flex-row text-sm">
          <Link href="/" className="text-black">
            {" "}
            Didn't request to reset password?
          </Link>
        </div>
      </form>
    </>
  );
};
export default ResetPassword;
