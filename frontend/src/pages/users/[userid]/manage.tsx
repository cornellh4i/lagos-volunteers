import React from "react";
import ManageUserProfile from "@/components/organisms/ManageUserProfile";
import DefaultTemplate from "@/components/templates/DefaultTemplate";

/** A Manage User Profile page */
const ManageUserProfilePage = () => {
  return (
    <DefaultTemplate>
      <ManageUserProfile />
    </DefaultTemplate>
  );
};

export default ManageUserProfilePage;
