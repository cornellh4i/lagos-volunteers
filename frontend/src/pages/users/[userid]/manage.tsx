import React from "react";
import { useRouter } from "next/router";
import ManageUserProfile from "@/components/organisms/ManageUserProfile";
import DefaultTemplate from "@/components/templates/DefaultTemplate";

/** A Manage User Profile page */
const ManageUserProfilePage = () => {
  const router = useRouter();
  const { userid } = router.query;
  return (
    <DefaultTemplate>
      <ManageUserProfile userid={userid as string} />
    </DefaultTemplate>
  );
};

export default ManageUserProfilePage;
