import React from "react";
import ProfileTemplate from "../components/templates/ProfileTemplate";
import ProfileForm from "@/components/molecules/ProfileForm";

/** A Profile page */
const Profile = () => {
  const date: Date = new Date();
  return (
    <ProfileTemplate
      name="Jason Zheng"
      start_date={date}
      hour={20}
      form={<ProfileForm />}
    />
  );
};

export default Profile;
