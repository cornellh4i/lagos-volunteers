import React from "react";
import ManageUserProfile from "@/components/organisms/ManageUserProfile";
import ManageUserProfileNew from "@/components/organisms/ManageUserProfileNew";
import DefaultTemplate from "@/components/templates/DefaultTemplate";

/** A Manage User Profile page */
const ManageUserProfilePage = () => {
  return (
    <DefaultTemplate>
      <ManageUserProfileNew />
    </DefaultTemplate>
  );
};

export default ManageUserProfilePage;
