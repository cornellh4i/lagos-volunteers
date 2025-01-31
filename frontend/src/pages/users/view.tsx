import ManageUsers from "@/components/organisms/ManageUsers";
import DefaultTemplate from "@/components/templates/DefaultTemplate";
import Head from "next/head";
import React from "react";

/** A Manage Users page */
const ManageUsersPage = () => {
  return (
    <>
      <Head>
        <title>Manage Members - LFBI Volunteer Platform</title>
      </Head>
      <DefaultTemplate>
        <ManageUsers />
      </DefaultTemplate>
    </>
  );
};

export default ManageUsersPage;
