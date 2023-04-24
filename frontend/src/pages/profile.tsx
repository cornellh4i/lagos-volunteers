import React from "react";
import ProfileForm from "@/components/molecules/ProfileForm";
import ProfileTemplate from "@/components/templates/ProfileTemplate";

/** A Profile page */
const Profile = () => {
  const date = new Date();
  return (
    <ProfileTemplate
      name="Jason Zheng"
      hour={20}
      start_date={date}
      Form={ProfileForm}
    />
  );
};

export default Profile;
