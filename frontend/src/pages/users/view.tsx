import ManageUsers from "@/components/organisms/ManageUsers";
import DefaultTemplate from "@/components/templates/DefaultTemplate";
import React from "react";

/** A Manage Users page */
const ManageUsersPage = () => {
  return (
    <DefaultTemplate>
      <ManageUsers />
    </DefaultTemplate>
  );
};

export default ManageUsersPage;
