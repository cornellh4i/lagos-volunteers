import React, { useState, useEffect } from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import Link from "next/link";
import { useAuth } from "@/utils/AuthContext";
import { auth } from "@/utils/firebase";
import { BASE_URL } from "@/utils/constants";
import { useForm, SubmitHandler } from "react-hook-form";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignupForm = () => {
  const { createFirebaseUser } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const handleSubmitUser: SubmitHandler<FormValues> = async (data) => {
    const { firstName, lastName, email, password } = data;
    const post = {
      email,
      profile: {
        firstName,
        lastName,
      },
    };
    try {
      const fbUser = await createFirebaseUser(email, password);
      const dbUser = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });
      Promise.all([fbUser, dbUser]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitUser)} className="space-y-4">
      <div className="font-bold text-3xl">Sign Up</div>
      <div>
        <TextField
          requiredMessage={errors.email ? "Required" : undefined}
          name="email"
          type="email"
          register={register}
          label="Email *"
          required={true}
        />
      </div>
      <div className="grid md:space-x-4 sm:grid-cols-1 md:grid-cols-2 ">
        <div className="sm:pb-4 md:pb-0">
          <TextField
            requiredMessage={errors.firstName ? "Required" : undefined}
            name="firstName"
            register={register}
            label="First Name *"
            required={true}
          />
        </div>
        <div>
          <TextField
            requiredMessage={errors.lastName ? "Required" : undefined}
            name="lastName"
            register={register}
            label="Last Name *"
            required={true}
          />
        </div>
      </div>
      <div>
        <TextField
          requiredMessage={errors.password ? "Required" : undefined}
          type="password"
          name="password"
          register={register}
          label="Password *"
          required={true}
        />
      </div>
      <div>
        <TextField
          type="password"
          requiredMessage={
            errors.confirmPassword
              ? "Required"
              : watch("password") != watch("confirmPassword")
              ? "Passwords do not match"
              : undefined
          }
          name="confirmPassword"
          register={register}
          label="Confirm Password *"
          required={true}
        />
      </div>
      <div>
        <Button text="Continue" color="dark-gray" type="submit" />
      </div>
      <div>
        <Button text="Continue with Google" type="submit" color="gray" />
      </div>
      <div className="justify-center flex flex-row">
        <div className="">Have an account?&nbsp;</div>
        <Link href="/login" className="text-black">
          {" "}
          Log in
        </Link>
      </div>
    </form>
  );
};

export default SignupForm;
