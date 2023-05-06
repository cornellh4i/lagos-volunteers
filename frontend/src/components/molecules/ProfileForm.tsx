import React, { useEffect, useState } from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import CustomCheckbox from "../atoms/Checkbox";
import { auth } from "@/utils/firebase";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "@/utils/AuthContext";
import { useRouter } from "next/router";
import { BASE_URL } from "@/utils/constants";

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

interface Props {
  userDetails: formData;
}

const ProfileForm = ({ userDetails }: Props) => {
  const router = useRouter();

  // Future testing: What if user doesn't have a nickname, does the code break?

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

  const handleChanges: SubmitHandler<FormValues> = async (data) => {
    const { email, firstName, lastName, preferredName } = data;

    try {
      const url = BASE_URL as string;
      const userid = userDetails.id;
      const fetchUrl = `${url}/users/` + userid + `/profile`;
      const userToken = await auth.currentUser?.getIdToken();
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
      // Refresh page to see changes.
      router.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleChanges)} className="space-y-4">
      <div>
        <TextField
          label="Email *"
          disabled={true}
          required={true}
          name="email"
          register={register}
          requiredMessage={errors.email ? "Required" : undefined}
        />
      </div>
      <div>
        <TextField
          label="First name *"
          required={true}
          name="firstName"
          register={register}
          requiredMessage={errors.firstName ? "Required" : undefined}
        />
      </div>
      <div>
        <TextField
          label="Last name *"
          required={true}
          name="lastName"
          register={register}
          requiredMessage={errors.lastName ? "Required" : undefined}
        />
      </div>
      <div>
        <TextField
          label="Preferred name *"
          required={true}
          name="preferredName"
          register={register}
          requiredMessage={errors.preferredName ? "Required" : undefined}
        />
      </div>
      <div>
        <TextField
          type="password"
          label="Old password *"
          required={false}
          name="oldPassword"
          register={register}
          requiredMessage={errors.oldPassword ? "Required" : undefined}
        />
      </div>
      <div>
        <TextField
          type="password"
          label="New password "
          required={false}
          name="newPassword"
          register={register}
        />
      </div>
      <div>
        <TextField
          type="password"
          label="Confirm new password"
          required={false}
          name="confirmNewPassword"
          register={register}
          requiredMessage={
            watch("newPassword") === watch("confirmNewPassword")
              ? undefined
              : "Passwords must match"
          }
        />
      </div>
      <div>
        <CustomCheckbox label="Email notifications" />
      </div>
      <div className="md:space-x-4 grid sm:grid-cols-1 md:grid-cols-2">
        <div className="sm:pb-4 md:pb-0">
          <Button
            type="submit"
            buttonText="Save Changes"
            buttonTextColor="#000000"
            buttonColor="#D3D3D3"
          />
        </div>
        <div>
          <Button
            type="button"
            buttonText="Cancel"
            buttonTextColor="#000000"
            buttonColor="#808080"
            onClick={() => {
              reset(userDetails, { keepDefaultValues: true });
            }}
          />
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;
