import React from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";

type FormValues = {
  password: string;
  confirmPassword: string;
};

/** A ResetPassword page */
const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const handleSubmitForm: SubmitHandler<FormValues> = async (data) => {
    const { password, confirmPassword } = data;
    console.log(password, confirmPassword);
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
          required={true}
          name="password"
          type="password"
          register={register}
          requiredMessage={errors.password ? "Required" : undefined}
        />
      </div>
      <div>
        <TextField
          label="Confirm Password*"
          required={true}
          name="confirmPassword"
          type="password"
          register={register}
          requiredMessage={
            watch("password") === watch("confirmPassword")
              ? undefined
              : "Passwords must match"
          }
        />
      </div>
      <div>
        <Button>Reset Password</Button>
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
