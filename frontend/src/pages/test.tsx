import React from "react";
import UserProfile from "@/components/organisms/UserProfile";

const Test = () => {
  return (
    <UserProfile
      name="Julia Papp"
      role="Volunteer"
      email="jpapp@gmail.com"
      joinDate={new Date()}
    />
  );
};

export default Test;
