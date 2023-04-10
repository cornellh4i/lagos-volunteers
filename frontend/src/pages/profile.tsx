import React from "react";
import ProfileTemplate from "../components/templates/ProfileTemplate"

/** A Profile page */
const Profile = () => {
  const date: Date = new Date();
  return <ProfileTemplate name="Jason Zheng" start_date={date} hour={20}/>
};

export default Profile;
