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
import CancelIcon from "@mui/icons-material/Cancel";

//commit message
type FormValues = {
  password: string;
  confirmPassword: string;
};
/** A ResetPassword page */
const ResetPassword = () => {
  const [showPage, setShowPage] = useState(false);
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
      localStorage.setItem("passwordReset", "true");
      router.push("/login");
    },
    onError: (error) => {
      setErrorMessage(handleErrors(error.message));
      setOpenSnackbar(true);
    },
    retry: false,
  });

  /**
   * Custom route protection: verify oobcode in URL is correct on page load.
   * If not, show error
   */
  useEffect(() => {
    const routeProtection = async () => {
      try {
        await verifyPasswordResetCode(auth, oobCode);
        setShowPage(true);
      } catch (error) {
        setShowPage(false);
      }
    };
    routeProtection();
  }, []);

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
      {showPage ? (
        <>
          <Snackbar
            variety="error"
            open={openSnackbar}
            onClose={() => setOpenSnackbar(false)}
          >
            Error : {errorMessage}
          </Snackbar>
          <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
            <div className="font-bold text-3xl">Reset Password</div>
            <div className="text-sm">
              Passwords should meet the following requirements:
              <ul className="m-0 px-4">
                <li>At least 6 characters in length</li>
                <li>Contain a mix of uppercase and lowercase letters</li>
                <li>Include at least one number and one special character</li>
              </ul>
            </div>
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
              <Button type="submit" loading={isPending}>
                Reset Password
              </Button>
            </div>
            {/* <div className="justify-center flex flex-row text-sm">
          <Link href="/" className="text-black">
            {" "}
            Didn't request to reset password?
          </Link>
        </div> */}
          </form>
        </>
      ) : (
        <div className="max-w-lg mx-auto border border-gray-300 rounded-lg p-6 text-center">
          <div>
            <div>
              <CancelIcon sx={{ fontSize: 100, color: "red" }} />
            </div>

            <p className="text-gray-700 mb-4">
              Your link may be expired or invalid. Please try again.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
export default ResetPassword;
